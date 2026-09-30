from __future__ import annotations

import uuid
from datetime import datetime

from fastapi import APIRouter, Depends
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser, current_user, require
from app.core.config import get_settings
from app.core.db import get_db, utcnow
from app.core.errors import Conflict, Unauthorized, ValidationFailed
from app.core.permissions import ROLE_DESCRIPTIONS, ROLE_LABELS, ROLES, P, permissions_for
from app.core.security import (
    DUMMY_HASH, create_token, decode_token, hash_password, new_totp_secret, totp_uri, verify_password, verify_totp,
)
from app.core.tenancy import audit, get_owned, scoped
from app.modules.identity.models import AuditEntry, Organization, User

router = APIRouter(tags=["Identity"])


# ------------------------------------------------------------------ schemas
class LoginIn(BaseModel):
    email: EmailStr
    password: str


class MfaIn(BaseModel):
    challenge: str
    code: str = Field(min_length=6, max_length=8)


class ChallengeIn(BaseModel):
    challenge: str


class SessionOut(BaseModel):
    status: str  # "ok" | "mfa_required" | "mfa_setup_required"
    access_token: str | None = None
    challenge: str | None = None
    user: dict | None = None


class UserOut(BaseModel):
    id: str
    email: str
    full_name: str
    phone: str | None
    role: str
    role_label: str
    language: str
    is_active: bool
    mfa_enabled: bool
    scope: dict
    last_login_at: datetime | None


class UserIn(BaseModel):
    email: EmailStr
    full_name: str = Field(min_length=2, max_length=200)
    role: str
    password: str = Field(min_length=10, max_length=200)
    phone: str | None = None
    language: str = "en"
    scope: dict = Field(default_factory=dict)


class UserPatch(BaseModel):
    full_name: str | None = None
    role: str | None = None
    phone: str | None = None
    language: str | None = None
    is_active: bool | None = None
    scope: dict | None = None


def _user_out(u: User) -> UserOut:
    return UserOut(
        id=str(u.id), email=u.email, full_name=u.full_name, phone=u.phone, role=u.role,
        role_label=ROLE_LABELS.get(u.role, u.role), language=u.language, is_active=u.is_active,
        mfa_enabled=u.mfa_enabled, scope=u.scope or {}, last_login_at=u.last_login_at,
    )


def _profile(u: User, org: Organization) -> dict:
    return {
        **_user_out(u).model_dump(mode="json"),
        "permissions": sorted(p.value for p in permissions_for(u.role)),
        "organization": {"id": str(org.id), "name": org.name, "slug": org.slug},
    }


def _issue(db: Session, u: User) -> SessionOut:
    u.last_login_at = utcnow()
    org = db.get(Organization, u.org_id)
    return SessionOut(status="ok", access_token=create_token(str(u.id)), user=_profile(u, org))


# ------------------------------------------------------------------ auth
@router.post("/auth/login", response_model=SessionOut)
def login(body: LoginIn, db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(func.lower(User.email) == body.email.lower()))
    ok = verify_password(body.password, user.password_hash if user else DUMMY_HASH)
    if not user or not ok or not user.is_active:
        raise Unauthorized("Email or password is incorrect.", code="INVALID_CREDENTIALS")

    s = get_settings()
    needs_mfa = user.mfa_enabled or (s.mfa_enforced and user.role in s.mfa_required_roles)
    if needs_mfa:
        challenge = create_token(str(user.id), scope="mfa", minutes=5)
        return SessionOut(status="mfa_required" if user.mfa_enabled else "mfa_setup_required", challenge=challenge)
    return _issue(db, user)


@router.post("/auth/mfa/verify", response_model=SessionOut)
def mfa_verify(body: MfaIn, db: Session = Depends(get_db)):
    payload = decode_token(body.challenge, scope="mfa")
    user = db.get(User, uuid.UUID(payload["sub"]))
    if not user or not user.totp_secret or not verify_totp(user.totp_secret, body.code):
        raise Unauthorized("That code didn't work. Check your authenticator app and try again.", code="MFA_INVALID")
    user.mfa_enabled = True
    return _issue(db, user)


@router.post("/auth/mfa/setup")
def mfa_setup(body: ChallengeIn, db: Session = Depends(get_db)):
    """Start two-step enrolment using the challenge returned by a sign-in."""
    payload = decode_token(body.challenge, scope="mfa")
    u = db.get(User, uuid.UUID(payload["sub"]))
    if u is None:
        raise Unauthorized("Account not found.")
    if not u.totp_secret:
        u.totp_secret = new_totp_secret()
    return {"secret": u.totp_secret, "otpauth_uri": totp_uri(u.totp_secret, u.email)}


@router.get("/auth/me")
def me(user: CurrentUser = Depends(current_user), db: Session = Depends(get_db)):
    u = db.get(User, user.id)
    return _profile(u, db.get(Organization, u.org_id))


@router.get("/auth/roles")
def roles(_: CurrentUser = Depends(current_user)):
    return [
        {"role": r, "label": ROLE_LABELS[r], "description": ROLE_DESCRIPTIONS.get(r, ""), "permissions": sorted(p.value for p in perms)}
        for r, perms in ROLES.items()
    ]


# ------------------------------------------------------------------ users
@router.get("/users", response_model=list[UserOut])
def list_users(
    role: str | None = None, active: bool | None = None,
    user: CurrentUser = Depends(require(P.MANAGE_USERS, P.READ)), db: Session = Depends(get_db),
):
    q = scoped(User, user).order_by(User.full_name)
    if role:
        q = q.where(User.role == role)
    if active is not None:
        q = q.where(User.is_active == active)
    rows = db.scalars(q).all()
    return [_user_out(u) for u in rows]


@router.post("/users", response_model=UserOut, status_code=201)
def create_user(body: UserIn, user: CurrentUser = Depends(require(P.MANAGE_USERS)), db: Session = Depends(get_db)):
    if body.role not in ROLES:
        raise ValidationFailed("Unknown role.", details={"role": body.role})
    if body.role == "platform_admin" and user.role != "platform_admin":
        raise ValidationFailed("Only a platform administrator can create another administrator.")
    if db.scalar(select(User).where(func.lower(User.email) == body.email.lower())):
        raise Conflict("A user with this email already exists.", code="DUPLICATE_EMAIL")
    u = User(
        org_id=user.org_id, email=body.email.lower(), full_name=body.full_name, role=body.role,
        password_hash=hash_password(body.password), phone=body.phone, language=body.language, scope=body.scope,
    )
    db.add(u)
    audit(db, user, "user.create", u)
    return _user_out(u)


@router.patch("/users/{user_id}", response_model=UserOut)
def update_user(
    user_id: str, body: UserPatch, user: CurrentUser = Depends(require(P.MANAGE_USERS)), db: Session = Depends(get_db)
):
    u = get_owned(db, User, user_id, user, "User")
    if body.role is not None and body.role not in ROLES:
        raise ValidationFailed("Unknown role.")
    if u.id == user.id and body.is_active is False:
        raise ValidationFailed("You can't deactivate your own account.")
    before = {"role": u.role, "is_active": u.is_active}
    for k, v in body.model_dump(exclude_none=True).items():
        setattr(u, k, v)
    audit(db, user, "user.update", u, before=before)
    return _user_out(u)


@router.get("/audit")
def audit_log(
    entity_type: str | None = None, entity_id: str | None = None, limit: int = 100,
    user: CurrentUser = Depends(require(P.READ)), db: Session = Depends(get_db),
):
    q = scoped(AuditEntry, user).order_by(AuditEntry.created_at.desc()).limit(min(limit, 500))
    if entity_type:
        q = q.where(AuditEntry.entity_type == entity_type)
    if entity_id:
        q = q.where(AuditEntry.entity_id == entity_id)
    names = {u.id: u.full_name for u in db.scalars(scoped(User, user)).all()}
    return [
        {
            "id": str(a.id), "action": a.action, "entity_type": a.entity_type, "entity_id": a.entity_id,
            "by": names.get(a.created_by, "System"), "at": a.created_at.isoformat(), "reason": a.reason,
        }
        for a in db.scalars(q).all()
    ]
