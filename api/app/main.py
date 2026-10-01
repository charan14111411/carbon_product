"""Application entry point. Modules under ``app/modules`` are discovered automatically:
each may provide ``models.py`` (tables) and ``router.py`` (a FastAPI ``router``)."""

from __future__ import annotations

import asyncio
import importlib
import logging
import pkgutil
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError

import app.modules as modules_pkg
from app.core import db as dbmod
from app.core.config import get_settings
from app.core.errors import AppError

log = logging.getLogger("vcarbon")


def module_names() -> list[str]:
    return sorted(m.name for m in pkgutil.iter_modules(modules_pkg.__path__) if m.ispkg)


def load_models() -> None:
    for name in module_names():
        try:
            importlib.import_module(f"app.modules.{name}.models")
        except ModuleNotFoundError as exc:
            if exc.name != f"app.modules.{name}.models":
                raise


def _routers():
    for name in module_names():
        try:
            mod = importlib.import_module(f"app.modules.{name}.router")
        except ModuleNotFoundError as exc:
            if exc.name != f"app.modules.{name}.router":
                raise
            continue
        yield mod.router


@asynccontextmanager
async def lifespan(_: FastAPI):
    load_models()
    if get_settings().auto_create_schema:
        dbmod.Base.metadata.create_all(dbmod.engine())
    # Varsapradaya devices: read every member farm on a timer and keep each reading (off unless
    # VC_DEVICE_PROVIDER=farmfuture; interval VARSAPRADAYA_POLL_MINUTES).
    from app.modules.farmfuture import poller

    task = asyncio.create_task(poller.run_forever())
    try:
        yield
    finally:
        task.cancel()


def create_app() -> FastAPI:
    s = get_settings()
    load_models()
    app = FastAPI(title=f"{s.app_name} API", version=s.engine_version, lifespan=lifespan)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=list(s.cors_origins),
        allow_credentials=False,
        allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
        allow_headers=["Authorization", "Content-Type", "Idempotency-Key", "X-Verifier-Token", "X-API-Key"],
        expose_headers=["X-Content-SHA256"],
    )

    @app.middleware("http")
    async def _no_store(request: Request, call_next):
        response = await call_next(request)
        if request.url.path.startswith("/api/"):
            response.headers.setdefault("Cache-Control", "no-store")
        return response

    @app.exception_handler(AppError)
    async def _app_error(_: Request, exc: AppError):
        return JSONResponse({"code": exc.code, "message": exc.message, "details": exc.details}, status_code=exc.status)

    @app.exception_handler(RequestValidationError)
    async def _validation(_: Request, exc: RequestValidationError):
        fields = [
            {"field": ".".join(str(p) for p in e["loc"] if p != "body"), "message": e["msg"]} for e in exc.errors()
        ]
        return JSONResponse(
            {"code": "VALIDATION_ERROR", "message": "Some fields need attention.", "details": {"fields": fields}},
            status_code=422,
        )

    @app.exception_handler(IntegrityError)
    async def _integrity(_: Request, exc: IntegrityError):
        log.warning("Integrity error: %s", exc.orig)
        return JSONResponse(
            {"code": "CONFLICT", "message": "This conflicts with an existing record.", "details": {}}, status_code=409
        )

    @app.get("/health", tags=["Health"])
    def health():
        with dbmod.engine().connect() as c:
            c.execute(text("SELECT 1"))
        return {"status": "ok", "version": s.engine_version}

    for r in _routers():
        app.include_router(r, prefix="/api")
    return app


app = create_app()
