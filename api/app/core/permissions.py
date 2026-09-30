"""Roles and what each may do. Changing this file needs a code review, not a DB edit."""

from enum import StrEnum


class P(StrEnum):
    # organisation & users
    MANAGE_ORG = "org.manage"
    MANAGE_USERS = "users.manage"
    # programmes, farmers, land
    READ = "data.read"
    MANAGE_PROGRAMMES = "programmes.manage"
    MANAGE_FARMERS = "farmers.manage"
    MANAGE_LAND = "land.manage"
    MANAGE_CATALOGUE = "catalogue.manage"
    RECORD_PRACTICE = "practice.record"
    # methodology
    EDIT_RULES = "rules.edit"
    APPROVE_RULES = "rules.approve"
    # field & lab
    PLAN_SAMPLING = "sampling.plan"
    APPROVE_SAMPLING = "sampling.approve"
    COLLECT_SAMPLE = "sample.collect"
    RECORD_CUSTODY = "custody.record"
    SUBMIT_LAB = "lab.submit"
    REVIEW_LAB = "lab.review"
    # carbon accounting
    RESOLVE_QA = "qa.resolve"
    RUN_CALCULATION = "calc.run"
    APPROVE_CALCULATION = "calc.approve"
    ISSUE_PACKAGE = "package.issue"
    VERIFY = "verify.read"
    # intelligence
    MANAGE_MODELS = "models.manage"
    APPROVE_MODELS = "models.approve"
    SYNC_DATA = "data.sync"
    # credits & money
    MANAGE_CREDITS = "credits.manage"
    MANAGE_SALES = "sales.manage"
    BUYER_READ = "buyer.read"
    PREPARE_PAYOUT = "payout.prepare"
    APPROVE_PAYOUT = "payout.approve"
    MANAGE_RISK = "risk.manage"
    HANDLE_GRIEVANCE = "grievance.handle"
    # farmer self-service
    FARMER_SELF = "farmer.self"
    # partners
    MANAGE_PARTNERS = "partners.manage"


ALL = frozenset(P)

ROLES: dict[str, frozenset[P]] = {
    "platform_admin": ALL,
    "programme_admin": frozenset({
        P.READ, P.MANAGE_PROGRAMMES, P.MANAGE_FARMERS, P.MANAGE_LAND, P.MANAGE_CATALOGUE,
        P.RECORD_PRACTICE, P.PLAN_SAMPLING, P.MANAGE_USERS, P.ISSUE_PACKAGE, P.APPROVE_CALCULATION,
        P.MANAGE_CREDITS, P.MANAGE_SALES, P.MANAGE_RISK, P.HANDLE_GRIEVANCE, P.SYNC_DATA,
        P.MANAGE_PARTNERS,
    }),
    "mrv_analyst": frozenset({P.READ, P.RUN_CALCULATION, P.RESOLVE_QA, P.PLAN_SAMPLING, P.SYNC_DATA}),
    "methodology_owner": frozenset({
        P.READ, P.EDIT_RULES, P.APPROVE_RULES, P.APPROVE_SAMPLING, P.MANAGE_CATALOGUE,
        P.MANAGE_MODELS, P.APPROVE_MODELS,
    }),
    "field_collector": frozenset({P.COLLECT_SAMPLE, P.RECORD_CUSTODY, P.RECORD_PRACTICE, P.MANAGE_LAND}),
    "lab_technician": frozenset({P.SUBMIT_LAB, P.RECORD_CUSTODY}),
    "lab_manager": frozenset({P.READ, P.SUBMIT_LAB, P.REVIEW_LAB, P.RECORD_CUSTODY}),
    "verifier": frozenset({P.VERIFY}),
    "buyer": frozenset({P.BUYER_READ}),
    "finance_maker": frozenset({P.READ, P.PREPARE_PAYOUT}),
    "finance_checker": frozenset({P.READ, P.APPROVE_PAYOUT}),
    "farmer": frozenset({P.FARMER_SELF}),
}

ROLE_LABELS = {
    "platform_admin": "Platform administrator",
    "programme_admin": "Programme manager",
    "mrv_analyst": "Carbon analyst",
    "methodology_owner": "Methodology scientist",
    "field_collector": "Field collector",
    "lab_technician": "Lab technician",
    "lab_manager": "Lab manager",
    "verifier": "Verifier",
    "buyer": "Buyer",
    "finance_maker": "Finance (prepare)",
    "finance_checker": "Finance (approve)",
    "farmer": "Farmer",
}


def permissions_for(role: str) -> frozenset[P]:
    return ROLES.get(role, frozenset())

ROLE_DESCRIPTIONS = {
    "platform_admin": "Full control of the organisation, its users and every area of the platform.",
    "programme_admin": "Runs programmes day to day: farmers, land, sampling plans, approvals of results, credits and sales.",
    "mrv_analyst": "Runs calculations and quality checks and prepares results for review.",
    "methodology_owner": "Enters and approves methodology rules, sample plans and models. Never approves their own work.",
    "field_collector": "Collects soil samples and records farm practices in the field app, offline if needed.",
    "lab_technician": "Enters and imports laboratory results and certificates for their own lab.",
    "lab_manager": "Reviews, accepts or rejects laboratory results.",
    "verifier": "Independent auditor with read-only access to one verification package.",
    "buyer": "Sees the credits their company bought, their serials and retirements.",
    "finance_maker": "Prepares benefit rules, farmer payout pools and payment batches.",
    "finance_checker": "Approves benefit rules, pools and payment batches prepared by someone else.",
    "farmer": "Sees their own fields, consents, payments and complaints.",
}
