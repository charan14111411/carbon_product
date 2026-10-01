BEGIN TRANSACTION;

CREATE TABLE alembic_version (
    version_num NVARCHAR(32) NOT NULL, 
    CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num)
);

GO

-- Running upgrade  -> 0001

CREATE TABLE organizations (
    name NVARCHAR(200) NOT NULL, 
    slug NVARCHAR(80) NOT NULL, 
    country NVARCHAR(80) NOT NULL, 
    default_language NVARCHAR(10) NOT NULL, 
    is_active BIT NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    PRIMARY KEY (id)
);

GO

CREATE UNIQUE INDEX ix_organizations_slug ON organizations (slug);

GO

CREATE TABLE users (
    org_id UNIQUEIDENTIFIER NOT NULL, 
    email NVARCHAR(200) NOT NULL, 
    full_name NVARCHAR(200) NOT NULL, 
    phone NVARCHAR(30) NULL, 
    role NVARCHAR(40) NOT NULL, 
    password_hash NVARCHAR(200) NOT NULL, 
    totp_secret NVARCHAR(64) NULL, 
    mfa_enabled BIT NOT NULL, 
    language NVARCHAR(10) NOT NULL, 
    is_active BIT NOT NULL, 
    scope NVARCHAR(max) NOT NULL, 
    last_login_at DATETIMEOFFSET NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id)
);

GO

CREATE UNIQUE INDEX ix_users_email ON users (email);

GO

CREATE INDEX ix_users_org_id ON users (org_id);

GO

CREATE TABLE api_keys (
    name NVARCHAR(120) NOT NULL, 
    prefix NVARCHAR(12) NOT NULL, 
    key_sha256 NVARCHAR(64) NOT NULL, 
    scopes NVARCHAR(max) NOT NULL, 
    is_active BIT NOT NULL, 
    last_used_at DATETIMEOFFSET NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    UNIQUE (key_sha256)
);

GO

CREATE INDEX ix_api_keys_org_id ON api_keys (org_id);

GO

CREATE INDEX ix_api_keys_prefix ON api_keys (prefix);

GO

CREATE TABLE audit_log (
    action NVARCHAR(80) NOT NULL, 
    entity_type NVARCHAR(80) NOT NULL, 
    entity_id NVARCHAR(64) NOT NULL, 
    before NVARCHAR(max) NULL, 
    after NVARCHAR(max) NULL, 
    reason NVARCHAR(max) NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id)
);

GO

CREATE INDEX ix_audit_log_action ON audit_log (action);

GO

CREATE INDEX ix_audit_log_entity_id ON audit_log (entity_id);

GO

CREATE INDEX ix_audit_log_entity_type ON audit_log (entity_type);

GO

CREATE INDEX ix_audit_log_org_id ON audit_log (org_id);

GO

CREATE TABLE buyers (
    name NVARCHAR(200) NOT NULL, 
    kind NVARCHAR(20) NOT NULL, 
    country NVARCHAR(80) NOT NULL, 
    contact_name NVARCHAR(200) NULL, 
    contact_email NVARCHAR(200) NULL, 
    requirements NVARCHAR(max) NOT NULL, 
    user_id UNIQUEIDENTIFIER NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(user_id) REFERENCES users (id)
);

GO

CREATE INDEX ix_buyers_org_id ON buyers (org_id);

GO

CREATE TABLE crops (
    code NVARCHAR(40) NOT NULL, 
    name NVARCHAR(120) NOT NULL, 
    local_name NVARCHAR(120) NULL, 
    category NVARCHAR(40) NOT NULL, 
    attributes NVARCHAR(max) NOT NULL, 
    is_active BIT NOT NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    UNIQUE (org_id, code)
);

GO

CREATE INDEX ix_crops_org_id ON crops (org_id);

GO

CREATE TABLE domain_events (
    event NVARCHAR(60) NOT NULL, 
    entity_type NVARCHAR(40) NOT NULL, 
    entity_id NVARCHAR(64) NOT NULL, 
    payload NVARCHAR(max) NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id)
);

GO

CREATE INDEX ix_domain_events_event ON domain_events (event);

GO

CREATE INDEX ix_domain_events_org_id ON domain_events (org_id);

GO

CREATE TABLE evidence_files (
    sha256 NVARCHAR(64) NOT NULL, 
    kind NVARCHAR(40) NOT NULL, 
    filename NVARCHAR(255) NOT NULL, 
    mime_type NVARCHAR(100) NOT NULL, 
    size_bytes BIGINT NOT NULL, 
    storage_key NVARCHAR(300) NOT NULL, 
    entity_type NVARCHAR(60) NULL, 
    entity_id NVARCHAR(64) NULL, 
    latitude FLOAT NULL, 
    longitude FLOAT NULL, 
    meta NVARCHAR(max) NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id)
);

GO

CREATE INDEX ix_evidence_files_entity_id ON evidence_files (entity_id);

GO

CREATE INDEX ix_evidence_files_entity_type ON evidence_files (entity_type);

GO

CREATE INDEX ix_evidence_files_kind ON evidence_files (kind);

GO

CREATE INDEX ix_evidence_files_org_id ON evidence_files (org_id);

GO

CREATE INDEX ix_evidence_files_sha256 ON evidence_files (sha256);

GO

CREATE TABLE feature_sets (
    name NVARCHAR(80) NOT NULL, 
    version INTEGER NOT NULL, 
    definition NVARCHAR(max) NOT NULL, 
    columns NVARCHAR(max) NOT NULL, 
    status NVARCHAR(20) NOT NULL, 
    description NVARCHAR(max) NOT NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    UNIQUE (org_id, name, version)
);

GO

CREATE INDEX ix_feature_sets_org_id ON feature_sets (org_id);

GO

CREATE TABLE fpos (
    name NVARCHAR(200) NOT NULL, 
    registration_no NVARCHAR(80) NULL, 
    district NVARCHAR(120) NOT NULL, 
    state NVARCHAR(120) NOT NULL, 
    contact_name NVARCHAR(200) NULL, 
    contact_phone NVARCHAR(30) NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id)
);

GO

CREATE INDEX ix_fpos_org_id ON fpos (org_id);

GO

CREATE TABLE model_versions (
    name NVARCHAR(80) NOT NULL, 
    version NVARCHAR(20) NOT NULL, 
    kind NVARCHAR(20) NOT NULL, 
    algorithm NVARCHAR(60) NOT NULL, 
    features NVARCHAR(max) NOT NULL, 
    training_summary NVARCHAR(max) NOT NULL, 
    metrics NVARCHAR(max) NOT NULL, 
    validation NVARCHAR(40) NOT NULL, 
    status NVARCHAR(20) NOT NULL, 
    approved_by UNIQUEIDENTIFIER NULL, 
    approved_at DATETIMEOFFSET NULL, 
    params NVARCHAR(max) NOT NULL, 
    notes NVARCHAR(max) NOT NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(approved_by) REFERENCES users (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    UNIQUE (org_id, name, version)
);

GO

CREATE INDEX ix_model_versions_org_id ON model_versions (org_id);

GO

CREATE TABLE notification_templates (
    code NVARCHAR(60) NOT NULL, 
    channel NVARCHAR(12) NOT NULL, 
    language NVARCHAR(10) NOT NULL, 
    version INTEGER NOT NULL, 
    subject NVARCHAR(200) NULL, 
    body NVARCHAR(max) NOT NULL, 
    placeholders NVARCHAR(max) NOT NULL, 
    status NVARCHAR(12) NOT NULL, 
    approved_by UNIQUEIDENTIFIER NULL, 
    approved_at DATETIMEOFFSET NULL, 
    is_default BIT NOT NULL, 
    notes NVARCHAR(max) NOT NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(approved_by) REFERENCES users (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    UNIQUE (org_id, code, channel, language, version)
);

GO

CREATE INDEX ix_notification_templates_code ON notification_templates (code);

GO

CREATE INDEX ix_notification_templates_org_id ON notification_templates (org_id);

GO

CREATE TABLE practice_types (
    code NVARCHAR(40) NOT NULL, 
    name NVARCHAR(120) NOT NULL, 
    category NVARCHAR(40) NOT NULL, 
    description NVARCHAR(max) NOT NULL, 
    crop_codes NVARCHAR(max) NOT NULL, 
    unit NVARCHAR(20) NULL, 
    requires_quantity BIT NOT NULL, 
    required_evidence NVARCHAR(max) NOT NULL, 
    fields NVARCHAR(max) NOT NULL, 
    emission_factor_keys NVARCHAR(max) NOT NULL, 
    is_active BIT NOT NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    UNIQUE (org_id, code)
);

GO

CREATE INDEX ix_practice_types_org_id ON practice_types (org_id);

GO

CREATE TABLE programmes (
    code NVARCHAR(40) NOT NULL, 
    name NVARCHAR(200) NOT NULL, 
    description NVARCHAR(max) NULL, 
    region NVARCHAR(200) NOT NULL, 
    boundary NVARCHAR(max) NULL, 
    eligible_crops NVARCHAR(max) NOT NULL, 
    start_date DATETIME NULL, 
    end_date DATETIME NULL, 
    status NVARCHAR(20) NOT NULL, 
    commercial_terms NVARCHAR(max) NOT NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    UNIQUE (org_id, code)
);

GO

CREATE INDEX ix_programmes_org_id ON programmes (org_id);

GO

CREATE TABLE retention_policies (
    kind NVARCHAR(20) NOT NULL, 
    [rule] NVARCHAR(30) NOT NULL, 
    years INTEGER NOT NULL, 
    source NVARCHAR(300) NOT NULL, 
    status NVARCHAR(12) NOT NULL, 
    notes NVARCHAR(max) NOT NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id)
);

GO

CREATE INDEX ix_retention_policies_kind ON retention_policies (kind);

GO

CREATE INDEX ix_retention_policies_org_id ON retention_policies (org_id);

GO

CREATE TABLE spectral_calibrations (
    code NVARCHAR(40) NOT NULL, 
    analyte NVARCHAR(30) NOT NULL, 
    reference_method NVARCHAR(60) NOT NULL, 
    n_samples INTEGER NOT NULL, 
    rmse FLOAT NOT NULL, 
    r2 FLOAT NOT NULL, 
    bias FLOAT NOT NULL, 
    valid_range NVARCHAR(max) NOT NULL, 
    status NVARCHAR(20) NOT NULL, 
    approved_by UNIQUEIDENTIFIER NULL, 
    notes NVARCHAR(max) NOT NULL, 
    rpiq FLOAT NULL, 
    lin_ccc FLOAT NULL, 
    split_method NVARCHAR(120) NULL, 
    n_peer_reviewed_refs INTEGER NULL, 
    spectral_range NVARCHAR(120) NULL, 
    instrument NVARCHAR(200) NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(approved_by) REFERENCES users (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id)
);

GO

CREATE INDEX ix_spectral_calibrations_org_id ON spectral_calibrations (org_id);

GO

CREATE TABLE webhooks (
    url NVARCHAR(500) NOT NULL, 
    events NVARCHAR(max) NOT NULL, 
    secret NVARCHAR(80) NOT NULL, 
    is_active BIT NOT NULL, 
    description NVARCHAR(max) NOT NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id)
);

GO

CREATE INDEX ix_webhooks_org_id ON webhooks (org_id);

GO

CREATE TABLE agreement_templates (
    programme_id UNIQUEIDENTIFIER NULL, 
    code NVARCHAR(40) NOT NULL, 
    version INTEGER NOT NULL, 
    title NVARCHAR(200) NOT NULL, 
    body NVARCHAR(max) NOT NULL, 
    purposes NVARCHAR(max) NOT NULL, 
    status NVARCHAR(20) NOT NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(programme_id) REFERENCES programmes (id), 
    UNIQUE (org_id, code, version)
);

GO

CREATE INDEX ix_agreement_templates_org_id ON agreement_templates (org_id);

GO

CREATE TABLE benefit_rules (
    programme_id UNIQUEIDENTIFIER NOT NULL, 
    version INTEGER NOT NULL, 
    farmer_share_pct NUMERIC(5, 2) NOT NULL, 
    weights NVARCHAR(max) NOT NULL, 
    deductions NVARCHAR(max) NOT NULL, 
    min_payout NUMERIC(14, 2) NOT NULL, 
    status NVARCHAR(12) NOT NULL, 
    approved_by UNIQUEIDENTIFIER NULL, 
    approved_at DATETIMEOFFSET NULL, 
    notes NVARCHAR(max) NOT NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(approved_by) REFERENCES users (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(programme_id) REFERENCES programmes (id), 
    UNIQUE (org_id, programme_id, version)
);

GO

CREATE INDEX ix_benefit_rules_org_id ON benefit_rules (org_id);

GO

CREATE INDEX ix_benefit_rules_programme_id ON benefit_rules (programme_id);

GO

CREATE TABLE drift_reports (
    model_id UNIQUEIDENTIFIER NOT NULL, 
    status NVARCHAR(12) NOT NULL, 
    n_new INTEGER NOT NULL, 
    metrics NVARCHAR(max) NOT NULL, 
    baseline NVARCHAR(max) NOT NULL, 
    thresholds NVARCHAR(max) NOT NULL, 
    reasons NVARCHAR(max) NOT NULL, 
    rows NVARCHAR(max) NOT NULL, 
    action NVARCHAR(20) NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(model_id) REFERENCES model_versions (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id)
);

GO

CREATE INDEX ix_drift_reports_model_id ON drift_reports (model_id);

GO

CREATE INDEX ix_drift_reports_org_id ON drift_reports (org_id);

GO

CREATE TABLE farmers (
    code NVARCHAR(40) NOT NULL, 
    full_name NVARCHAR(200) NOT NULL, 
    phone NVARCHAR(20) NOT NULL, 
    village NVARCHAR(120) NOT NULL, 
    district NVARCHAR(120) NOT NULL, 
    state NVARCHAR(120) NOT NULL, 
    language NVARCHAR(10) NOT NULL, 
    fpo_id UNIQUEIDENTIFIER NULL, 
    member_id NVARCHAR(80) NULL, 
    status NVARCHAR(20) NOT NULL, 
    user_id UNIQUEIDENTIFIER NULL, 
    kyc_status NVARCHAR(20) NOT NULL, 
    meta NVARCHAR(max) NOT NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(fpo_id) REFERENCES fpos (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(user_id) REFERENCES users (id), 
    UNIQUE (org_id, code), 
    UNIQUE (org_id, phone)
);

GO

CREATE INDEX ix_farmers_code ON farmers (code);

GO

CREATE INDEX ix_farmers_fpo_id ON farmers (fpo_id);

GO

CREATE INDEX ix_farmers_member_id ON farmers (member_id);

GO

CREATE INDEX ix_farmers_org_id ON farmers (org_id);

GO

CREATE TABLE labs (
    code NVARCHAR(40) NOT NULL, 
    name NVARCHAR(200) NOT NULL, 
    accreditation NVARCHAR(120) NULL, 
    accreditation_valid_until DATETIME NULL, 
    city NVARCHAR(120) NOT NULL, 
    contact_email NVARCHAR(200) NULL, 
    iso17025 BIT NULL, 
    proficiency_program NVARCHAR(20) NULL, 
    analytical_error_report_id UNIQUEIDENTIFIER NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(analytical_error_report_id) REFERENCES evidence_files (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    UNIQUE (org_id, code)
);

GO

CREATE INDEX ix_labs_org_id ON labs (org_id);

GO

CREATE TABLE processed_events (
    consumer NVARCHAR(40) NOT NULL, 
    event_id UNIQUEIDENTIFIER NOT NULL, 
    outcome NVARCHAR(max) NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(event_id) REFERENCES domain_events (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    UNIQUE (consumer, event_id)
);

GO

CREATE INDEX ix_processed_events_event_id ON processed_events (event_id);

GO

CREATE INDEX ix_processed_events_org_id ON processed_events (org_id);

GO

CREATE TABLE qa1_models (
    name NVARCHAR(120) NOT NULL, 
    version NVARCHAR(40) NOT NULL, 
    revision INTEGER NOT NULL, 
    public_source NVARCHAR(max) NOT NULL, 
    source_accessed_on DATETIME NULL, 
    publicly_available BIT NOT NULL, 
    documentation_ref NVARCHAR(max) NOT NULL, 
    peer_review_refs NVARCHAR(max) NOT NULL, 
    parameter_set NVARCHAR(max) NOT NULL, 
    parameter_sources NVARCHAR(max) NOT NULL, 
    parameter_fingerprint NVARCHAR(64) NOT NULL, 
    validation_report_evidence_id UNIQUEIDENTIFIER NULL, 
    ime_report_evidence_id UNIQUEIDENTIFIER NULL, 
    validation_domain NVARCHAR(max) NOT NULL, 
    pools NVARCHAR(max) NOT NULL, 
    validation_metrics NVARCHAR(max) NOT NULL, 
    trueup_ids NVARCHAR(max) NOT NULL, 
    notes NVARCHAR(max) NOT NULL, 
    status NVARCHAR(12) NOT NULL, 
    editors NVARCHAR(max) NOT NULL, 
    approved_by UNIQUEIDENTIFIER NULL, 
    approved_at DATETIMEOFFSET NULL, 
    supersedes_id UNIQUEIDENTIFIER NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(approved_by) REFERENCES users (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(ime_report_evidence_id) REFERENCES evidence_files (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(supersedes_id) REFERENCES qa1_models (id), 
    FOREIGN KEY(validation_report_evidence_id) REFERENCES evidence_files (id), 
    UNIQUE (org_id, name, version, revision)
);

GO

CREATE INDEX ix_qa1_models_org_id ON qa1_models (org_id);

GO

CREATE TABLE rule_packs (
    methodology_code NVARCHAR(40) NOT NULL, 
    methodology_version NVARCHAR(20) NOT NULL, 
    revision INTEGER NOT NULL, 
    title NVARCHAR(200) NOT NULL, 
    source_url NVARCHAR(500) NULL, 
    source_document_id UNIQUEIDENTIFIER NULL, 
    status NVARCHAR(20) NOT NULL, 
    approved_by UNIQUEIDENTIFIER NULL, 
    approved_at DATETIMEOFFSET NULL, 
    based_on_id UNIQUEIDENTIFIER NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(approved_by) REFERENCES users (id), 
    FOREIGN KEY(based_on_id) REFERENCES rule_packs (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(source_document_id) REFERENCES evidence_files (id), 
    UNIQUE (org_id, methodology_code, methodology_version, revision)
);

GO

CREATE INDEX ix_rule_packs_org_id ON rule_packs (org_id);

GO

CREATE TABLE webhook_deliveries (
    webhook_id UNIQUEIDENTIFIER NOT NULL, 
    event_id UNIQUEIDENTIFIER NOT NULL, 
    status_code INTEGER NULL, 
    ok BIT NOT NULL, 
    attempt INTEGER NOT NULL, 
    error NVARCHAR(max) NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(event_id) REFERENCES domain_events (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(webhook_id) REFERENCES webhooks (id)
);

GO

CREATE INDEX ix_webhook_deliveries_event_id ON webhook_deliveries (event_id);

GO

CREATE INDEX ix_webhook_deliveries_org_id ON webhook_deliveries (org_id);

GO

CREATE INDEX ix_webhook_deliveries_webhook_id ON webhook_deliveries (webhook_id);

GO

CREATE TABLE agreements (
    farmer_id UNIQUEIDENTIFIER NOT NULL, 
    template_id UNIQUEIDENTIFIER NOT NULL, 
    template_version INTEGER NOT NULL, 
    language NVARCHAR(10) NOT NULL, 
    signed_at DATETIMEOFFSET NOT NULL, 
    method NVARCHAR(20) NOT NULL, 
    signed_text_sha256 NVARCHAR(64) NOT NULL, 
    witness_user_id UNIQUEIDENTIFIER NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(farmer_id) REFERENCES farmers (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(template_id) REFERENCES agreement_templates (id), 
    FOREIGN KEY(witness_user_id) REFERENCES users (id)
);

GO

CREATE INDEX ix_agreements_farmer_id ON agreements (farmer_id);

GO

CREATE INDEX ix_agreements_org_id ON agreements (org_id);

GO

CREATE TABLE farms (
    farmer_id UNIQUEIDENTIFIER NOT NULL, 
    name NVARCHAR(200) NOT NULL, 
    village NVARCHAR(120) NOT NULL, 
    district NVARCHAR(120) NOT NULL, 
    state NVARCHAR(120) NOT NULL, 
    external_farm_id NVARCHAR(80) NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(farmer_id) REFERENCES farmers (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id)
);

GO

CREATE INDEX ix_farms_farmer_id ON farms (farmer_id);

GO

CREATE INDEX ix_farms_org_id ON farms (org_id);

GO

CREATE TABLE grievances (
    code NVARCHAR(40) NOT NULL, 
    farmer_id UNIQUEIDENTIFIER NULL, 
    category NVARCHAR(30) NOT NULL, 
    subject NVARCHAR(200) NOT NULL, 
    description NVARCHAR(max) NOT NULL, 
    channel NVARCHAR(20) NOT NULL, 
    priority NVARCHAR(10) NOT NULL, 
    status NVARCHAR(20) NOT NULL, 
    assigned_to UNIQUEIDENTIFIER NULL, 
    due_on DATETIME NOT NULL, 
    resolution NVARCHAR(max) NULL, 
    resolved_at DATETIMEOFFSET NULL, 
    history NVARCHAR(max) NOT NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(assigned_to) REFERENCES users (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(farmer_id) REFERENCES farmers (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id)
);

GO

CREATE INDEX ix_grievances_code ON grievances (code);

GO

CREATE INDEX ix_grievances_farmer_id ON grievances (farmer_id);

GO

CREATE INDEX ix_grievances_org_id ON grievances (org_id);

GO

CREATE TABLE households (
    code NVARCHAR(40) NOT NULL, 
    name NVARCHAR(200) NOT NULL, 
    head_farmer_id UNIQUEIDENTIFIER NOT NULL, 
    village NVARCHAR(120) NOT NULL, 
    district NVARCHAR(120) NOT NULL, 
    state NVARCHAR(120) NOT NULL, 
    status NVARCHAR(12) NOT NULL, 
    notes NVARCHAR(max) NOT NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(head_farmer_id) REFERENCES farmers (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    UNIQUE (org_id, code)
);

GO

CREATE INDEX ix_households_head_farmer_id ON households (head_farmer_id);

GO

CREATE INDEX ix_households_org_id ON households (org_id);

GO

CREATE TABLE notifications (
    farmer_id UNIQUEIDENTIFIER NULL, 
    user_id UNIQUEIDENTIFIER NULL, 
    channel NVARCHAR(12) NOT NULL, 
    address NVARCHAR(200) NULL, 
    language NVARCHAR(10) NULL, 
    template_id UNIQUEIDENTIFIER NULL, 
    template_code NVARCHAR(60) NULL, 
    template_version INTEGER NULL, 
    [trigger] NVARCHAR(60) NOT NULL, 
    event_id UNIQUEIDENTIFIER NULL, 
    subject NVARCHAR(200) NULL, 
    body NVARCHAR(max) NOT NULL, 
    context NVARCHAR(max) NOT NULL, 
    status NVARCHAR(12) NOT NULL, 
    skip_reason NVARCHAR(40) NULL, 
    provider NVARCHAR(40) NULL, 
    provider_ref NVARCHAR(120) NULL, 
    attempts INTEGER NOT NULL, 
    last_error NVARCHAR(max) NULL, 
    sent_at DATETIMEOFFSET NULL, 
    delivered_at DATETIMEOFFSET NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(event_id) REFERENCES domain_events (id), 
    FOREIGN KEY(farmer_id) REFERENCES farmers (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(template_id) REFERENCES notification_templates (id), 
    FOREIGN KEY(user_id) REFERENCES users (id)
);

GO

CREATE INDEX ix_notifications_event_id ON notifications (event_id);

GO

CREATE INDEX ix_notifications_farmer_id ON notifications (farmer_id);

GO

CREATE INDEX ix_notifications_org_id ON notifications (org_id);

GO

CREATE INDEX ix_notifications_template_code ON notifications (template_code);

GO

CREATE INDEX ix_notifications_user_id ON notifications (user_id);

GO

CREATE TABLE payment_profiles (
    farmer_id UNIQUEIDENTIFIER NOT NULL, 
    method NVARCHAR(10) NOT NULL, 
    upi_id NVARCHAR(100) NULL, 
    account_masked NVARCHAR(30) NULL, 
    ifsc NVARCHAR(15) NULL, 
    account_name NVARCHAR(200) NOT NULL, 
    provider_token NVARCHAR(200) NULL, 
    verified BIT NOT NULL, 
    verified_on DATETIME NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(farmer_id) REFERENCES farmers (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    UNIQUE (farmer_id)
);

GO

CREATE INDEX ix_payment_profiles_org_id ON payment_profiles (org_id);

GO

CREATE TABLE projects (
    programme_id UNIQUEIDENTIFIER NOT NULL, 
    code NVARCHAR(40) NOT NULL, 
    name NVARCHAR(200) NOT NULL, 
    methodology_code NVARCHAR(40) NOT NULL, 
    methodology_version NVARCHAR(20) NOT NULL, 
    rule_pack_id UNIQUEIDENTIFIER NULL, 
    baseline_start DATETIME NULL, 
    crediting_start DATETIME NULL, 
    crediting_end DATETIME NULL, 
    status NVARCHAR(20) NOT NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(programme_id) REFERENCES programmes (id), 
    FOREIGN KEY(rule_pack_id) REFERENCES rule_packs (id), 
    UNIQUE (org_id, code)
);

GO

CREATE INDEX ix_projects_org_id ON projects (org_id);

GO

CREATE INDEX ix_projects_programme_id ON projects (programme_id);

GO

CREATE TABLE rules (
    pack_id UNIQUEIDENTIFIER NOT NULL, 
    [key] NVARCHAR(80) NOT NULL, 
    value NVARCHAR(max) NOT NULL, 
    source_document NVARCHAR(300) NOT NULL, 
    source_section NVARCHAR(120) NULL, 
    source_page NVARCHAR(40) NULL, 
    notes NVARCHAR(max) NOT NULL, 
    last_modified_by UNIQUEIDENTIFIER NULL, 
    editors NVARCHAR(max) NOT NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(last_modified_by) REFERENCES users (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(pack_id) REFERENCES rule_packs (id), 
    UNIQUE (pack_id, [key])
);

GO

CREATE INDEX ix_rules_org_id ON rules (org_id);

GO

CREATE INDEX ix_rules_pack_id ON rules (pack_id);

GO

CREATE TABLE additionality_assessments (
    project_id UNIQUEIDENTIFIER NOT NULL, 
    version INTEGER NOT NULL, 
    status NVARCHAR(12) NOT NULL, 
    regulatory_surplus NVARCHAR(max) NOT NULL, 
    barriers NVARCHAR(max) NOT NULL, 
    common_practice NVARCHAR(max) NOT NULL, 
    result NVARCHAR(max) NOT NULL, 
    submitted_by UNIQUEIDENTIFIER NULL, 
    submitted_at DATETIMEOFFSET NULL, 
    approved_by UNIQUEIDENTIFIER NULL, 
    approved_at DATETIMEOFFSET NULL, 
    review_note NVARCHAR(max) NOT NULL, 
    supersedes_id UNIQUEIDENTIFIER NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(approved_by) REFERENCES users (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(project_id) REFERENCES projects (id), 
    FOREIGN KEY(submitted_by) REFERENCES users (id), 
    FOREIGN KEY(supersedes_id) REFERENCES additionality_assessments (id), 
    UNIQUE (project_id, version)
);

GO

CREATE INDEX ix_additionality_assessments_org_id ON additionality_assessments (org_id);

GO

CREATE INDEX ix_additionality_assessments_project_id ON additionality_assessments (project_id);

GO

CREATE TABLE allometric_models (
    project_id UNIQUEIDENTIFIER NOT NULL, 
    species NVARCHAR(200) NOT NULL, 
    form NVARCHAR(20) NOT NULL, 
    params NVARCHAR(max) NOT NULL, 
    output_unit NVARCHAR(4) NOT NULL, 
    dbh_min_cm FLOAT NOT NULL, 
    dbh_max_cm FLOAT NOT NULL, 
    root_shoot_ratio FLOAT NULL, 
    source NVARCHAR(max) NOT NULL, 
    evidence_ids NVARCHAR(max) NOT NULL, 
    status NVARCHAR(12) NOT NULL, 
    approved_by UNIQUEIDENTIFIER NULL, 
    approved_at DATETIMEOFFSET NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(approved_by) REFERENCES users (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(project_id) REFERENCES projects (id)
);

GO

CREATE INDEX ix_allometric_models_org_id ON allometric_models (org_id);

GO

CREATE INDEX ix_allometric_models_project_id ON allometric_models (project_id);

GO

CREATE TABLE biomass_campaigns (
    project_id UNIQUEIDENTIFIER NOT NULL, 
    code NVARCHAR(40) NOT NULL, 
    measured_on DATETIME NOT NULL, 
    note NVARCHAR(max) NOT NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(project_id) REFERENCES projects (id)
);

GO

CREATE INDEX ix_biomass_campaigns_org_id ON biomass_campaigns (org_id);

GO

CREATE INDEX ix_biomass_campaigns_project_id ON biomass_campaigns (project_id);

GO

CREATE TABLE campaigns (
    project_id UNIQUEIDENTIFIER NOT NULL, 
    code NVARCHAR(40) NOT NULL, 
    name NVARCHAR(200) NOT NULL, 
    kind NVARCHAR(12) NOT NULL, 
    design NVARCHAR(12) NOT NULL, 
    revisits_campaign_id UNIQUEIDENTIFIER NULL, 
    planned_start DATETIME NOT NULL, 
    planned_end DATETIME NOT NULL, 
    depth_from_cm FLOAT NOT NULL, 
    depth_to_cm FLOAT NOT NULL, 
    placement_seed INTEGER NOT NULL, 
    status NVARCHAR(20) NOT NULL, 
    season NVARCHAR(60) NULL, 
    season_override_reason NVARCHAR(max) NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(project_id) REFERENCES projects (id), 
    FOREIGN KEY(revisits_campaign_id) REFERENCES campaigns (id), 
    UNIQUE (org_id, code)
);

GO

CREATE INDEX ix_campaigns_org_id ON campaigns (org_id);

GO

CREATE INDEX ix_campaigns_project_id ON campaigns (project_id);

GO

CREATE TABLE consent_events (
    farmer_id UNIQUEIDENTIFIER NOT NULL, 
    purpose NVARCHAR(40) NOT NULL, 
    granted BIT NOT NULL, 
    effective_on DATETIME NOT NULL, 
    agreement_id UNIQUEIDENTIFIER NULL, 
    channel NVARCHAR(20) NOT NULL, 
    notes NVARCHAR(max) NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(agreement_id) REFERENCES agreements (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(farmer_id) REFERENCES farmers (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id)
);

GO

CREATE INDEX ix_consent_events_farmer_id ON consent_events (farmer_id);

GO

CREATE INDEX ix_consent_events_org_id ON consent_events (org_id);

GO

CREATE INDEX ix_consent_events_purpose ON consent_events (purpose);

GO

CREATE TABLE documents (
    code NVARCHAR(60) NOT NULL, 
    title NVARCHAR(300) NOT NULL, 
    kind NVARCHAR(20) NOT NULL, 
    classification NVARCHAR(20) NOT NULL, 
    entity_type NVARCHAR(60) NULL, 
    entity_id NVARCHAR(64) NULL, 
    project_id UNIQUEIDENTIFIER NULL, 
    retention_policy_id UNIQUEIDENTIFIER NULL, 
    status NVARCHAR(12) NOT NULL, 
    description NVARCHAR(max) NOT NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(project_id) REFERENCES projects (id), 
    FOREIGN KEY(retention_policy_id) REFERENCES retention_policies (id), 
    UNIQUE (org_id, code)
);

GO

CREATE INDEX ix_documents_entity_id ON documents (entity_id);

GO

CREATE INDEX ix_documents_entity_type ON documents (entity_type);

GO

CREATE INDEX ix_documents_org_id ON documents (org_id);

GO

CREATE INDEX ix_documents_project_id ON documents (project_id);

GO

CREATE TABLE fields (
    farm_id UNIQUEIDENTIFIER NOT NULL, 
    code NVARCHAR(40) NOT NULL, 
    name NVARCHAR(200) NOT NULL, 
    boundary NVARCHAR(max) NOT NULL, 
    area_ha FLOAT NOT NULL, 
    centroid_lat FLOAT NOT NULL, 
    centroid_lon FLOAT NOT NULL, 
    min_lat FLOAT NOT NULL, 
    max_lat FLOAT NOT NULL, 
    min_lon FLOAT NOT NULL, 
    max_lon FLOAT NOT NULL, 
    crop_code NVARCHAR(40) NULL, 
    crop_attributes NVARCHAR(max) NOT NULL, 
    soil_type NVARCHAR(80) NULL, 
    elevation_m FLOAT NULL, 
    slope_pct FLOAT NULL, 
    aspect_deg FLOAT NULL, 
    soil_texture_class NVARCHAR(40) NULL, 
    wrb_soil_group NVARCHAR(60) NULL, 
    ecoregion NVARCHAR(120) NULL, 
    climate_zone NVARCHAR(60) NULL, 
    mean_annual_precip_mm FLOAT NULL, 
    land_cover NVARCHAR(20) NOT NULL, 
    version INTEGER NOT NULL, 
    status NVARCHAR(20) NOT NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(farm_id) REFERENCES farms (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    UNIQUE (org_id, code)
);

GO

CREATE INDEX ix_fields_farm_id ON fields (farm_id);

GO

CREATE INDEX ix_fields_min_lat ON fields (min_lat);

GO

CREATE INDEX ix_fields_min_lon ON fields (min_lon);

GO

CREATE INDEX ix_fields_org_id ON fields (org_id);

GO

CREATE TABLE household_members (
    household_id UNIQUEIDENTIFIER NOT NULL, 
    farmer_id UNIQUEIDENTIFIER NULL, 
    name NVARCHAR(200) NULL, 
    relation NVARCHAR(30) NOT NULL, 
    is_active BIT NOT NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(farmer_id) REFERENCES farmers (id), 
    FOREIGN KEY(household_id) REFERENCES households (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id)
);

GO

CREATE INDEX ix_household_members_farmer_id ON household_members (farmer_id);

GO

CREATE INDEX ix_household_members_household_id ON household_members (household_id);

GO

CREATE INDEX ix_household_members_org_id ON household_members (org_id);

GO

CREATE TABLE inbound_messages (
    channel NVARCHAR(12) NOT NULL, 
    phone NVARCHAR(30) NOT NULL, 
    farmer_id UNIQUEIDENTIFIER NULL, 
    text NVARCHAR(max) NOT NULL, 
    command NVARCHAR(20) NULL, 
    parsed NVARCHAR(max) NOT NULL, 
    status NVARCHAR(20) NOT NULL, 
    error NVARCHAR(max) NULL, 
    grievance_id UNIQUEIDENTIFIER NULL, 
    practice_record_id UNIQUEIDENTIFIER NULL, 
    reviewed_by UNIQUEIDENTIFIER NULL, 
    reviewed_at DATETIMEOFFSET NULL, 
    review_note NVARCHAR(max) NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(farmer_id) REFERENCES farmers (id), 
    FOREIGN KEY(grievance_id) REFERENCES grievances (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(reviewed_by) REFERENCES users (id)
);

GO

CREATE INDEX ix_inbound_messages_farmer_id ON inbound_messages (farmer_id);

GO

CREATE INDEX ix_inbound_messages_org_id ON inbound_messages (org_id);

GO

CREATE TABLE lab_changes (
    project_id UNIQUEIDENTIFIER NOT NULL, 
    from_lab_id UNIQUEIDENTIFIER NOT NULL, 
    to_lab_id UNIQUEIDENTIFIER NOT NULL, 
    justification NVARCHAR(max) NOT NULL, 
    sop_consistency_statement NVARCHAR(max) NOT NULL, 
    evidence_ids NVARCHAR(max) NOT NULL, 
    effective_from DATETIME NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(from_lab_id) REFERENCES labs (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(project_id) REFERENCES projects (id), 
    FOREIGN KEY(to_lab_id) REFERENCES labs (id)
);

GO

CREATE INDEX ix_lab_changes_org_id ON lab_changes (org_id);

GO

CREATE INDEX ix_lab_changes_project_id ON lab_changes (project_id);

GO

CREATE TABLE leakage_displacement_records (
    record_id UNIQUEIDENTIFIER NOT NULL, 
    version INTEGER NOT NULL, 
    status NVARCHAR(10) NOT NULL, 
    project_id UNIQUEIDENTIFIER NOT NULL, 
    year INTEGER NOT NULL, 
    mode NVARCHAR(12) NOT NULL, 
    commodities NVARCHAR(max) NOT NULL, 
    livestock NVARCHAR(max) NOT NULL, 
    ef_t_co2e_per_ha FLOAT NULL, 
    ef_source NVARCHAR(max) NOT NULL, 
    statement NVARCHAR(max) NOT NULL, 
    evidence_ids NVARCHAR(max) NOT NULL, 
    note NVARCHAR(max) NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(project_id) REFERENCES projects (id)
);

GO

CREATE INDEX ix_leakage_displacement_records_org_id ON leakage_displacement_records (org_id);

GO

CREATE INDEX ix_leakage_displacement_records_project_id ON leakage_displacement_records (project_id);

GO

CREATE INDEX ix_leakage_displacement_records_record_id ON leakage_displacement_records (record_id);

GO

CREATE TABLE leakage_residue_diversions (
    record_id UNIQUEIDENTIFIER NOT NULL, 
    version INTEGER NOT NULL, 
    status NVARCHAR(10) NOT NULL, 
    project_id UNIQUEIDENTIFIER NOT NULL, 
    period_label NVARCHAR(40) NOT NULL, 
    residue_type NVARCHAR(120) NOT NULL, 
    baseline_energy_use NVARCHAR(max) NOT NULL, 
    quantity_t_dry FLOAT NOT NULL, 
    ncv_gj_per_t_dry FLOAT NULL, 
    ef_co2_t_per_gj FLOAT NULL, 
    factor_source NVARCHAR(max) NOT NULL, 
    leakage_ruled_out BIT NOT NULL, 
    ruled_out_reason NVARCHAR(max) NOT NULL, 
    evidence_ids NVARCHAR(max) NOT NULL, 
    note NVARCHAR(max) NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(project_id) REFERENCES projects (id)
);

GO

CREATE INDEX ix_leakage_residue_diversions_org_id ON leakage_residue_diversions (org_id);

GO

CREATE INDEX ix_leakage_residue_diversions_project_id ON leakage_residue_diversions (project_id);

GO

CREATE INDEX ix_leakage_residue_diversions_record_id ON leakage_residue_diversions (record_id);

GO

CREATE TABLE monitoring_obligations (
    project_id UNIQUEIDENTIFIER NOT NULL, 
    kind NVARCHAR(30) NOT NULL, 
    title NVARCHAR(200) NOT NULL, 
    due_on DATETIME NOT NULL, 
    basis NVARCHAR(max) NOT NULL, 
    rule_ref NVARCHAR(max) NOT NULL, 
    anchor_date DATETIME NULL, 
    generated BIT NOT NULL, 
    responsible_user_id UNIQUEIDENTIFIER NULL, 
    status NVARCHAR(12) NOT NULL, 
    done_on DATETIME NULL, 
    evidence_ids NVARCHAR(max) NOT NULL, 
    notes NVARCHAR(max) NOT NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(project_id) REFERENCES projects (id), 
    FOREIGN KEY(responsible_user_id) REFERENCES users (id)
);

GO

CREATE INDEX ix_monitoring_obligations_org_id ON monitoring_obligations (org_id);

GO

CREATE INDEX ix_monitoring_obligations_project_id ON monitoring_obligations (project_id);

GO

CREATE TABLE notification_attempts (
    notification_id UNIQUEIDENTIFIER NOT NULL, 
    attempt INTEGER NOT NULL, 
    provider NVARCHAR(40) NOT NULL, 
    ok BIT NOT NULL, 
    status NVARCHAR(12) NOT NULL, 
    provider_ref NVARCHAR(120) NULL, 
    error NVARCHAR(max) NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(notification_id) REFERENCES notifications (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id)
);

GO

CREATE INDEX ix_notification_attempts_notification_id ON notification_attempts (notification_id);

GO

CREATE INDEX ix_notification_attempts_org_id ON notification_attempts (org_id);

GO

CREATE TABLE qa1_analyses (
    project_id UNIQUEIDENTIFIER NOT NULL, 
    period_label NVARCHAR(40) NOT NULL, 
    period_start DATETIME NOT NULL, 
    period_end DATETIME NOT NULL, 
    model_id UNIQUEIDENTIFIER NOT NULL, 
    import_ids NVARCHAR(max) NOT NULL, 
    method NVARCHAR(20) NOT NULL, 
    seed INTEGER NULL, 
    rule_pack_id UNIQUEIDENTIFIER NOT NULL, 
    rules_used NVARCHAR(max) NOT NULL, 
    results NVARCHAR(max) NOT NULL, 
    trueup NVARCHAR(max) NOT NULL, 
    sha256 NVARCHAR(64) NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(model_id) REFERENCES qa1_models (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(project_id) REFERENCES projects (id), 
    FOREIGN KEY(rule_pack_id) REFERENCES rule_packs (id)
);

GO

CREATE INDEX ix_qa1_analyses_org_id ON qa1_analyses (org_id);

GO

CREATE INDEX ix_qa1_analyses_project_id ON qa1_analyses (project_id);

GO

CREATE TABLE qa_findings (
    project_id UNIQUEIDENTIFIER NULL, 
    entity_type NVARCHAR(40) NOT NULL, 
    entity_id NVARCHAR(64) NOT NULL, 
    rule_code NVARCHAR(60) NOT NULL, 
    severity NVARCHAR(10) NOT NULL, 
    message NVARCHAR(max) NOT NULL, 
    details NVARCHAR(max) NOT NULL, 
    status NVARCHAR(12) NOT NULL, 
    resolution_note NVARCHAR(max) NULL, 
    resolved_by UNIQUEIDENTIFIER NULL, 
    resolved_at DATETIMEOFFSET NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(project_id) REFERENCES projects (id), 
    FOREIGN KEY(resolved_by) REFERENCES users (id)
);

GO

CREATE INDEX ix_qa_findings_entity_id ON qa_findings (entity_id);

GO

CREATE INDEX ix_qa_findings_entity_type ON qa_findings (entity_type);

GO

CREATE INDEX ix_qa_findings_org_id ON qa_findings (org_id);

GO

CREATE INDEX ix_qa_findings_project_id ON qa_findings (project_id);

GO

CREATE INDEX ix_qa_findings_rule_code ON qa_findings (rule_code);

GO

CREATE TABLE risk_profiles (
    project_id UNIQUEIDENTIFIER NOT NULL, 
    version INTEGER NOT NULL, 
    tool_version NVARCHAR(80) NOT NULL, 
    inputs NVARCHAR(max) NOT NULL, 
    computed NVARCHAR(max) NOT NULL, 
    computed_rating_pct FLOAT NULL, 
    final_npr_pct FLOAT NULL, 
    justification NVARCHAR(max) NOT NULL, 
    status NVARCHAR(12) NOT NULL, 
    submitted_by UNIQUEIDENTIFIER NULL, 
    submitted_at DATETIMEOFFSET NULL, 
    approved_by UNIQUEIDENTIFIER NULL, 
    approved_at DATETIMEOFFSET NULL, 
    notes NVARCHAR(max) NOT NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(approved_by) REFERENCES users (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(project_id) REFERENCES projects (id), 
    FOREIGN KEY(submitted_by) REFERENCES users (id)
);

GO

CREATE INDEX ix_risk_profiles_org_id ON risk_profiles (org_id);

GO

CREATE INDEX ix_risk_profiles_project_id ON risk_profiles (project_id);

GO

CREATE TABLE soc_maps (
    project_id UNIQUEIDENTIFIER NOT NULL, 
    model_id UNIQUEIDENTIFIER NOT NULL, 
    generated_on DATETIME NOT NULL, 
    cells NVARCHAR(max) NOT NULL, 
    summary NVARCHAR(max) NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(model_id) REFERENCES model_versions (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(project_id) REFERENCES projects (id)
);

GO

CREATE INDEX ix_soc_maps_org_id ON soc_maps (org_id);

GO

CREATE INDEX ix_soc_maps_project_id ON soc_maps (project_id);

GO

CREATE TABLE strata (
    project_id UNIQUEIDENTIFIER NOT NULL, 
    code NVARCHAR(40) NOT NULL, 
    name NVARCHAR(200) NOT NULL, 
    quantification_unit NVARCHAR(40) NULL, 
    role NVARCHAR(10) NOT NULL, 
    control_for_code NVARCHAR(40) NULL, 
    criteria NVARCHAR(max) NOT NULL, 
    field_ids NVARCHAR(max) NOT NULL, 
    area_ha FLOAT NOT NULL, 
    version INTEGER NOT NULL, 
    effective_from DATETIME NOT NULL, 
    effective_to DATETIME NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(project_id) REFERENCES projects (id)
);

GO

CREATE INDEX ix_strata_org_id ON strata (org_id);

GO

CREATE INDEX ix_strata_project_id ON strata (project_id);

GO

CREATE TABLE term_estimates (
    project_id UNIQUEIDENTIFIER NOT NULL, 
    period_label NVARCHAR(40) NOT NULL, 
    term NVARCHAR(30) NOT NULL, 
    value_t_co2e FLOAT NOT NULL, 
    variance FLOAT NOT NULL, 
    df FLOAT NULL, 
    source NVARCHAR(max) NOT NULL, 
    version INTEGER NOT NULL, 
    status NVARCHAR(12) NOT NULL, 
    approved_by UNIQUEIDENTIFIER NULL, 
    approved_at DATETIMEOFFSET NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(approved_by) REFERENCES users (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(project_id) REFERENCES projects (id)
);

GO

CREATE INDEX ix_term_estimates_org_id ON term_estimates (org_id);

GO

CREATE INDEX ix_term_estimates_project_id ON term_estimates (project_id);

GO

CREATE TABLE activity_records (
    record_id UNIQUEIDENTIFIER NOT NULL, 
    version INTEGER NOT NULL, 
    project_id UNIQUEIDENTIFIER NOT NULL, 
    field_id UNIQUEIDENTIFIER NOT NULL, 
    scenario NVARCHAR(10) NOT NULL, 
    year INTEGER NOT NULL, 
    category NVARCHAR(30) NOT NULL, 
    attributes NVARCHAR(max) NOT NULL, 
    data_tier INTEGER NOT NULL, 
    source_note NVARCHAR(max) NOT NULL, 
    census_release_interval_years FLOAT NULL, 
    evidence_ids NVARCHAR(max) NOT NULL, 
    attestation_id UNIQUEIDENTIFIER NULL, 
    status NVARCHAR(10) NOT NULL, 
    reason NVARCHAR(max) NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(attestation_id) REFERENCES evidence_files (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(field_id) REFERENCES fields (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(project_id) REFERENCES projects (id), 
    UNIQUE (record_id, version)
);

GO

CREATE INDEX ix_activity_records_category ON activity_records (category);

GO

CREATE INDEX ix_activity_records_field_id ON activity_records (field_id);

GO

CREATE INDEX ix_activity_records_org_id ON activity_records (org_id);

GO

CREATE INDEX ix_activity_records_project_id ON activity_records (project_id);

GO

CREATE INDEX ix_activity_records_record_id ON activity_records (record_id);

GO

CREATE INDEX ix_activity_records_year ON activity_records (year);

GO

CREATE TABLE baseline_attestations (
    project_id UNIQUEIDENTIFIER NOT NULL, 
    field_id UNIQUEIDENTIFIER NOT NULL, 
    farmer_id UNIQUEIDENTIFIER NOT NULL, 
    evidence_id UNIQUEIDENTIFIER NOT NULL, 
    years NVARCHAR(max) NOT NULL, 
    statement_lang NVARCHAR(10) NOT NULL, 
    method NVARCHAR(10) NOT NULL, 
    witness_user_id UNIQUEIDENTIFIER NULL, 
    records NVARCHAR(max) NOT NULL, 
    declarations NVARCHAR(max) NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(evidence_id) REFERENCES evidence_files (id), 
    FOREIGN KEY(farmer_id) REFERENCES farmers (id), 
    FOREIGN KEY(field_id) REFERENCES fields (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(project_id) REFERENCES projects (id), 
    FOREIGN KEY(witness_user_id) REFERENCES users (id), 
    UNIQUE (evidence_id)
);

GO

CREATE INDEX ix_baseline_attestations_farmer_id ON baseline_attestations (farmer_id);

GO

CREATE INDEX ix_baseline_attestations_field_id ON baseline_attestations (field_id);

GO

CREATE INDEX ix_baseline_attestations_org_id ON baseline_attestations (org_id);

GO

CREATE INDEX ix_baseline_attestations_project_id ON baseline_attestations (project_id);

GO

CREATE TABLE biomass_plots (
    project_id UNIQUEIDENTIFIER NOT NULL, 
    stratum_id UNIQUEIDENTIFIER NOT NULL, 
    field_id UNIQUEIDENTIFIER NULL, 
    code NVARCHAR(40) NOT NULL, 
    scenario NVARCHAR(10) NOT NULL, 
    area_m2 FLOAT NOT NULL, 
    latitude FLOAT NULL, 
    longitude FLOAT NULL, 
    status NVARCHAR(10) NOT NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(field_id) REFERENCES fields (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(project_id) REFERENCES projects (id), 
    FOREIGN KEY(stratum_id) REFERENCES strata (id)
);

GO

CREATE INDEX ix_biomass_plots_org_id ON biomass_plots (org_id);

GO

CREATE INDEX ix_biomass_plots_project_id ON biomass_plots (project_id);

GO

CREATE INDEX ix_biomass_plots_stratum_id ON biomass_plots (stratum_id);

GO

CREATE TABLE calculation_runs (
    project_id UNIQUEIDENTIFIER NOT NULL, 
    period_label NVARCHAR(40) NOT NULL, 
    period_start DATETIME NOT NULL, 
    period_end DATETIME NOT NULL, 
    baseline_campaign_id UNIQUEIDENTIFIER NOT NULL, 
    monitoring_campaign_id UNIQUEIDENTIFIER NOT NULL, 
    rule_pack_id UNIQUEIDENTIFIER NOT NULL, 
    engine_version NVARCHAR(20) NOT NULL, 
    inputs_snapshot NVARCHAR(max) NOT NULL, 
    rules_snapshot NVARCHAR(max) NOT NULL, 
    results NVARCHAR(max) NOT NULL, 
    gross_t_co2e FLOAT NOT NULL, 
    uncertainty_deduction_t_co2e FLOAT NOT NULL, 
    buffer_t_co2e FLOAT NOT NULL, 
    net_t_co2e FLOAT NOT NULL, 
    reductions_t_co2e FLOAT NOT NULL, 
    removals_t_co2e FLOAT NOT NULL, 
    supersedes_run_id UNIQUEIDENTIFIER NULL, 
    snapshot_sha256 NVARCHAR(64) NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(baseline_campaign_id) REFERENCES campaigns (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(monitoring_campaign_id) REFERENCES campaigns (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(project_id) REFERENCES projects (id), 
    FOREIGN KEY(rule_pack_id) REFERENCES rule_packs (id), 
    FOREIGN KEY(supersedes_run_id) REFERENCES calculation_runs (id)
);

GO

CREATE INDEX ix_calculation_runs_org_id ON calculation_runs (org_id);

GO

CREATE INDEX ix_calculation_runs_project_id ON calculation_runs (project_id);

GO

CREATE TABLE control_site_links (
    project_id UNIQUEIDENTIFIER NOT NULL, 
    control_stratum_id UNIQUEIDENTIFIER NOT NULL, 
    project_stratum_id UNIQUEIDENTIFIER NULL, 
    qu_code NVARCHAR(40) NULL, 
    managed_by NVARCHAR(200) NOT NULL, 
    management_plan_evidence_id UNIQUEIDENTIFIER NULL, 
    fixed_lat FLOAT NOT NULL, 
    fixed_lon FLOAT NOT NULL, 
    status NVARCHAR(10) NOT NULL, 
    notes NVARCHAR(max) NOT NULL, 
    crop_group_justification NVARCHAR(max) NOT NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(control_stratum_id) REFERENCES strata (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(management_plan_evidence_id) REFERENCES evidence_files (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(project_id) REFERENCES projects (id), 
    FOREIGN KEY(project_stratum_id) REFERENCES strata (id)
);

GO

CREATE INDEX ix_control_site_links_control_stratum_id ON control_site_links (control_stratum_id);

GO

CREATE INDEX ix_control_site_links_org_id ON control_site_links (org_id);

GO

CREATE INDEX ix_control_site_links_project_id ON control_site_links (project_id);

GO

CREATE TABLE devices (
    kind NVARCHAR(20) NOT NULL, 
    external_id NVARCHAR(80) NOT NULL, 
    name NVARCHAR(200) NOT NULL, 
    farm_id UNIQUEIDENTIFIER NULL, 
    field_id UNIQUEIDENTIFIER NULL, 
    latitude FLOAT NOT NULL, 
    longitude FLOAT NOT NULL, 
    elevation_m FLOAT NULL, 
    parameters NVARCHAR(max) NOT NULL, 
    status NVARCHAR(20) NOT NULL, 
    last_seen_at DATETIMEOFFSET NULL, 
    calibrated_on DATETIME NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(farm_id) REFERENCES farms (id), 
    FOREIGN KEY(field_id) REFERENCES fields (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    UNIQUE (org_id, external_id)
);

GO

CREATE INDEX ix_devices_farm_id ON devices (farm_id);

GO

CREATE INDEX ix_devices_field_id ON devices (field_id);

GO

CREATE INDEX ix_devices_org_id ON devices (org_id);

GO

CREATE TABLE document_versions (
    document_id UNIQUEIDENTIFIER NOT NULL, 
    version INTEGER NOT NULL, 
    evidence_id UNIQUEIDENTIFIER NOT NULL, 
    sha256 NVARCHAR(64) NOT NULL, 
    change_note NVARCHAR(max) NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(document_id) REFERENCES documents (id), 
    FOREIGN KEY(evidence_id) REFERENCES evidence_files (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    UNIQUE (document_id, version)
);

GO

CREATE INDEX ix_document_versions_document_id ON document_versions (document_id);

GO

CREATE INDEX ix_document_versions_org_id ON document_versions (org_id);

GO

CREATE TABLE enrolments (
    project_id UNIQUEIDENTIFIER NOT NULL, 
    field_id UNIQUEIDENTIFIER NOT NULL, 
    farmer_id UNIQUEIDENTIFIER NOT NULL, 
    status NVARCHAR(20) NOT NULL, 
    eligibility NVARCHAR(max) NOT NULL, 
    enrolled_on DATETIME NULL, 
    withdrawn_on DATETIME NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(farmer_id) REFERENCES farmers (id), 
    FOREIGN KEY(field_id) REFERENCES fields (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(project_id) REFERENCES projects (id), 
    UNIQUE (project_id, field_id)
);

GO

CREATE INDEX ix_enrolments_farmer_id ON enrolments (farmer_id);

GO

CREATE INDEX ix_enrolments_field_id ON enrolments (field_id);

GO

CREATE INDEX ix_enrolments_org_id ON enrolments (org_id);

GO

CREATE INDEX ix_enrolments_project_id ON enrolments (project_id);

GO

CREATE TABLE field_boundary_versions (
    field_id UNIQUEIDENTIFIER NOT NULL, 
    version INTEGER NOT NULL, 
    boundary NVARCHAR(max) NOT NULL, 
    area_ha FLOAT NOT NULL, 
    reason NVARCHAR(max) NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(field_id) REFERENCES fields (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id)
);

GO

CREATE INDEX ix_field_boundary_versions_field_id ON field_boundary_versions (field_id);

GO

CREATE INDEX ix_field_boundary_versions_org_id ON field_boundary_versions (org_id);

GO

CREATE TABLE field_features (
    field_id UNIQUEIDENTIFIER NOT NULL, 
    feature_set_id UNIQUEIDENTIFIER NOT NULL, 
    project_id UNIQUEIDENTIFIER NULL, 
    as_of_date DATETIME NOT NULL, 
    [values] NVARCHAR(max) NOT NULL, 
    details NVARCHAR(max) NOT NULL, 
    data_classes NVARCHAR(max) NOT NULL, 
    input_fingerprint NVARCHAR(64) NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(feature_set_id) REFERENCES feature_sets (id), 
    FOREIGN KEY(field_id) REFERENCES fields (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(project_id) REFERENCES projects (id)
);

GO

CREATE INDEX ix_field_features_as_of_date ON field_features (as_of_date);

GO

CREATE INDEX ix_field_features_feature_set_id ON field_features (feature_set_id);

GO

CREATE INDEX ix_field_features_field_id ON field_features (field_id);

GO

CREATE INDEX ix_field_features_input_fingerprint ON field_features (input_fingerprint);

GO

CREATE INDEX ix_field_features_org_id ON field_features (org_id);

GO

CREATE TABLE lab_batches (
    lab_id UNIQUEIDENTIFIER NOT NULL, 
    campaign_id UNIQUEIDENTIFIER NOT NULL, 
    code NVARCHAR(40) NOT NULL, 
    layer_ids NVARCHAR(max) NOT NULL, 
    status NVARCHAR(20) NOT NULL, 
    dispatched_on DATETIME NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(campaign_id) REFERENCES campaigns (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(lab_id) REFERENCES labs (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    UNIQUE (org_id, code)
);

GO

CREATE INDEX ix_lab_batches_campaign_id ON lab_batches (campaign_id);

GO

CREATE INDEX ix_lab_batches_lab_id ON lab_batches (lab_id);

GO

CREATE INDEX ix_lab_batches_org_id ON lab_batches (org_id);

GO

CREATE TABLE land_tenures (
    field_id UNIQUEIDENTIFIER NOT NULL, 
    holder_farmer_id UNIQUEIDENTIFIER NOT NULL, 
    kind NVARCHAR(20) NOT NULL, 
    document_evidence_ids NVARCHAR(max) NOT NULL, 
    valid_from DATETIME NOT NULL, 
    valid_to DATETIME NULL, 
    notes NVARCHAR(max) NOT NULL, 
    status NVARCHAR(10) NOT NULL, 
    verified_by UNIQUEIDENTIFIER NULL, 
    verified_at DATETIMEOFFSET NULL, 
    review_note NVARCHAR(max) NOT NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(field_id) REFERENCES fields (id), 
    FOREIGN KEY(holder_farmer_id) REFERENCES farmers (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(verified_by) REFERENCES users (id)
);

GO

CREATE INDEX ix_land_tenures_field_id ON land_tenures (field_id);

GO

CREATE INDEX ix_land_tenures_holder_farmer_id ON land_tenures (holder_farmer_id);

GO

CREATE INDEX ix_land_tenures_org_id ON land_tenures (org_id);

GO

CREATE TABLE land_use_records (
    field_id UNIQUEIDENTIFIER NOT NULL, 
    from_year INTEGER NOT NULL, 
    to_year INTEGER NOT NULL, 
    land_use NVARCHAR(40) NOT NULL, 
    evidence_id UNIQUEIDENTIFIER NULL, 
    source NVARCHAR(120) NOT NULL, 
    notes NVARCHAR(max) NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(evidence_id) REFERENCES evidence_files (id), 
    FOREIGN KEY(field_id) REFERENCES fields (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id)
);

GO

CREATE INDEX ix_land_use_records_field_id ON land_use_records (field_id);

GO

CREATE INDEX ix_land_use_records_org_id ON land_use_records (org_id);

GO

CREATE TABLE observations (
    field_id UNIQUEIDENTIFIER NOT NULL, 
    parameter NVARCHAR(40) NOT NULL, 
    observed_on DATETIME NOT NULL, 
    value FLOAT NULL, 
    unit NVARCHAR(20) NOT NULL, 
    tier INTEGER NOT NULL, 
    provider NVARCHAR(40) NOT NULL, 
    source_ref NVARCHAR(120) NOT NULL, 
    distance_km FLOAT NULL, 
    quality FLOAT NOT NULL, 
    data_class NVARCHAR(12) NOT NULL, 
    bias_corrected BIT NOT NULL, 
    note NVARCHAR(max) NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(field_id) REFERENCES fields (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    UNIQUE (field_id, parameter, observed_on, provider)
);

GO

CREATE INDEX ix_observations_field_id ON observations (field_id);

GO

CREATE INDEX ix_observations_observed_on ON observations (observed_on);

GO

CREATE INDEX ix_observations_org_id ON observations (org_id);

GO

CREATE INDEX ix_observations_parameter ON observations (parameter);

GO

CREATE TABLE practice_detections (
    field_id UNIQUEIDENTIFIER NOT NULL, 
    practice_record_id UNIQUEIDENTIFIER NULL, 
    practice_code NVARCHAR(40) NOT NULL, 
    season NVARCHAR(20) NOT NULL, 
    detected BIT NOT NULL, 
    confidence FLOAT NOT NULL, 
    outcome NVARCHAR(12) NOT NULL, 
    evidence NVARCHAR(max) NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(field_id) REFERENCES fields (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id)
);

GO

CREATE INDEX ix_practice_detections_field_id ON practice_detections (field_id);

GO

CREATE INDEX ix_practice_detections_org_id ON practice_detections (org_id);

GO

CREATE INDEX ix_practice_detections_practice_record_id ON practice_detections (practice_record_id);

GO

CREATE TABLE practice_records (
    record_id UNIQUEIDENTIFIER NOT NULL, 
    version INTEGER NOT NULL, 
    field_id UNIQUEIDENTIFIER NOT NULL, 
    practice_code NVARCHAR(40) NOT NULL, 
    scenario NVARCHAR(10) NOT NULL, 
    performed_on DATETIME NOT NULL, 
    ended_on DATETIME NULL, 
    quantity FLOAT NULL, 
    unit NVARCHAR(20) NULL, 
    area_ha FLOAT NULL, 
    details NVARCHAR(max) NOT NULL, 
    evidence_ids NVARCHAR(max) NOT NULL, 
    source NVARCHAR(20) NOT NULL, 
    status NVARCHAR(10) NOT NULL, 
    reason NVARCHAR(max) NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(field_id) REFERENCES fields (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    UNIQUE (record_id, version)
);

GO

CREATE INDEX ix_practice_records_field_id ON practice_records (field_id);

GO

CREATE INDEX ix_practice_records_org_id ON practice_records (org_id);

GO

CREATE INDEX ix_practice_records_practice_code ON practice_records (practice_code);

GO

CREATE INDEX ix_practice_records_record_id ON practice_records (record_id);

GO

CREATE TABLE qa1_publications (
    analysis_id UNIQUEIDENTIFIER NOT NULL, 
    term_ids NVARCHAR(max) NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(analysis_id) REFERENCES qa1_analyses (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id)
);

GO

CREATE INDEX ix_qa1_publications_analysis_id ON qa1_publications (analysis_id);

GO

CREATE INDEX ix_qa1_publications_org_id ON qa1_publications (org_id);

GO

CREATE TABLE qa1_run_imports (
    project_id UNIQUEIDENTIFIER NOT NULL, 
    model_id UNIQUEIDENTIFIER NOT NULL, 
    model_fingerprint NVARCHAR(64) NOT NULL, 
    label NVARCHAR(120) NOT NULL, 
    source_format NVARCHAR(10) NOT NULL, 
    sha256 NVARCHAR(64) NOT NULL, 
    evidence_id UNIQUEIDENTIFIER NOT NULL, 
    initial_campaign_id UNIQUEIDENTIFIER NULL, 
    initial_measurement_date DATETIME NULL, 
    t0_year INTEGER NOT NULL, 
    row_count INTEGER NOT NULL, 
    site_codes NVARCHAR(max) NOT NULL, 
    first_year INTEGER NOT NULL, 
    last_year INTEGER NOT NULL, 
    pools NVARCHAR(max) NOT NULL, 
    mc_draws INTEGER NOT NULL, 
    inputs NVARCHAR(max) NOT NULL, 
    warnings NVARCHAR(max) NOT NULL, 
    spectroscopy_used BIT NOT NULL, 
    spectroscopy_de_minimis_evidence_id UNIQUEIDENTIFIER NULL, 
    data_class NVARCHAR(12) NOT NULL, 
    supersedes_id UNIQUEIDENTIFIER NULL, 
    notes NVARCHAR(max) NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(evidence_id) REFERENCES evidence_files (id), 
    FOREIGN KEY(initial_campaign_id) REFERENCES campaigns (id), 
    FOREIGN KEY(model_id) REFERENCES qa1_models (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(project_id) REFERENCES projects (id), 
    FOREIGN KEY(spectroscopy_de_minimis_evidence_id) REFERENCES evidence_files (id), 
    FOREIGN KEY(supersedes_id) REFERENCES qa1_run_imports (id)
);

GO

CREATE INDEX ix_qa1_run_imports_model_id ON qa1_run_imports (model_id);

GO

CREATE INDEX ix_qa1_run_imports_org_id ON qa1_run_imports (org_id);

GO

CREATE INDEX ix_qa1_run_imports_project_id ON qa1_run_imports (project_id);

GO

CREATE INDEX ix_qa1_run_imports_sha256 ON qa1_run_imports (sha256);

GO

CREATE TABLE risk_events (
    project_id UNIQUEIDENTIFIER NOT NULL, 
    field_id UNIQUEIDENTIFIER NULL, 
    kind NVARCHAR(30) NOT NULL, 
    occurred_on DATETIME NOT NULL, 
    description NVARCHAR(max) NOT NULL, 
    severity NVARCHAR(10) NOT NULL, 
    estimated_impact_t FLOAT NULL, 
    status NVARCHAR(20) NOT NULL, 
    resolution NVARCHAR(max) NULL, 
    evidence_ids NVARCHAR(max) NOT NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(field_id) REFERENCES fields (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(project_id) REFERENCES projects (id)
);

GO

CREATE INDEX ix_risk_events_org_id ON risk_events (org_id);

GO

CREATE INDEX ix_risk_events_project_id ON risk_events (project_id);

GO

CREATE TABLE sample_plans (
    campaign_id UNIQUEIDENTIFIER NOT NULL, 
    stratum_id UNIQUEIDENTIFIER NOT NULL, 
    n_required INTEGER NOT NULL, 
    method NVARCHAR(40) NOT NULL, 
    inputs NVARCHAR(max) NOT NULL, 
    justification NVARCHAR(max) NOT NULL, 
    status NVARCHAR(20) NOT NULL, 
    approved_by UNIQUEIDENTIFIER NULL, 
    approved_at DATETIMEOFFSET NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(approved_by) REFERENCES users (id), 
    FOREIGN KEY(campaign_id) REFERENCES campaigns (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(stratum_id) REFERENCES strata (id), 
    UNIQUE (campaign_id, stratum_id)
);

GO

CREATE INDEX ix_sample_plans_campaign_id ON sample_plans (campaign_id);

GO

CREATE INDEX ix_sample_plans_org_id ON sample_plans (org_id);

GO

CREATE TABLE sampling_designs (
    project_id UNIQUEIDENTIFIER NOT NULL, 
    campaign_id UNIQUEIDENTIFIER NOT NULL, 
    stage1_unit NVARCHAR(12) NOT NULL, 
    stage1_selection NVARCHAR(12) NOT NULL, 
    stage2_selection NVARCHAR(12) NULL, 
    population_area_ha FLOAT NOT NULL, 
    population_unit_count INTEGER NOT NULL, 
    justification NVARCHAR(max) NOT NULL, 
    version INTEGER NOT NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(campaign_id) REFERENCES campaigns (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(project_id) REFERENCES projects (id), 
    UNIQUE (campaign_id)
);

GO

CREATE INDEX ix_sampling_designs_campaign_id ON sampling_designs (campaign_id);

GO

CREATE INDEX ix_sampling_designs_org_id ON sampling_designs (org_id);

GO

CREATE INDEX ix_sampling_designs_project_id ON sampling_designs (project_id);

GO

CREATE TABLE satellite_indices (
    field_id UNIQUEIDENTIFIER NOT NULL, 
    index_name NVARCHAR(20) NOT NULL, 
    observed_on DATETIME NOT NULL, 
    value FLOAT NOT NULL, 
    cloud_pct FLOAT NOT NULL, 
    source NVARCHAR(40) NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(field_id) REFERENCES fields (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    UNIQUE (field_id, index_name, observed_on, source)
);

GO

CREATE INDEX ix_satellite_indices_field_id ON satellite_indices (field_id);

GO

CREATE INDEX ix_satellite_indices_observed_on ON satellite_indices (observed_on);

GO

CREATE INDEX ix_satellite_indices_org_id ON satellite_indices (org_id);

GO

CREATE TABLE sites (
    project_id UNIQUEIDENTIFIER NOT NULL, 
    field_id UNIQUEIDENTIFIER NOT NULL, 
    stratum_id UNIQUEIDENTIFIER NOT NULL, 
    code NVARCHAR(40) NOT NULL, 
    latitude FLOAT NOT NULL, 
    longitude FLOAT NOT NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(field_id) REFERENCES fields (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(project_id) REFERENCES projects (id), 
    FOREIGN KEY(stratum_id) REFERENCES strata (id), 
    UNIQUE (org_id, code)
);

GO

CREATE INDEX ix_sites_field_id ON sites (field_id);

GO

CREATE INDEX ix_sites_org_id ON sites (org_id);

GO

CREATE INDEX ix_sites_project_id ON sites (project_id);

GO

CREATE INDEX ix_sites_stratum_id ON sites (stratum_id);

GO

CREATE TABLE soil_property_suggestions (
    field_id UNIQUEIDENTIFIER NOT NULL, 
    provider NVARCHAR(40) NOT NULL, 
    source_ref NVARCHAR(120) NOT NULL, 
    properties NVARCHAR(max) NOT NULL, 
    soil_texture_class NVARCHAR(40) NULL, 
    wrb_soil_group NVARCHAR(60) NULL, 
    wrb_probability FLOAT NULL, 
    data_class NVARCHAR(12) NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(field_id) REFERENCES fields (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id)
);

GO

CREATE INDEX ix_soil_property_suggestions_field_id ON soil_property_suggestions (field_id);

GO

CREATE INDEX ix_soil_property_suggestions_org_id ON soil_property_suggestions (org_id);

GO

CREATE TABLE sync_runs (
    field_id UNIQUEIDENTIFIER NOT NULL, 
    window_start DATETIME NOT NULL, 
    window_end DATETIME NOT NULL, 
    summary NVARCHAR(max) NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(field_id) REFERENCES fields (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id)
);

GO

CREATE INDEX ix_sync_runs_field_id ON sync_runs (field_id);

GO

CREATE INDEX ix_sync_runs_org_id ON sync_runs (org_id);

GO

CREATE TABLE term_computations (
    project_id UNIQUEIDENTIFIER NOT NULL, 
    term NVARCHAR(30) NOT NULL, 
    period_label NVARCHAR(40) NOT NULL, 
    method NVARCHAR(200) NOT NULL, 
    inputs NVARCHAR(max) NOT NULL, 
    results NVARCHAR(max) NOT NULL, 
    rule_pack_id UNIQUEIDENTIFIER NULL, 
    term_estimate_id UNIQUEIDENTIFIER NOT NULL, 
    snapshot_sha256 NVARCHAR(64) NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(project_id) REFERENCES projects (id), 
    FOREIGN KEY(rule_pack_id) REFERENCES rule_packs (id), 
    FOREIGN KEY(term_estimate_id) REFERENCES term_estimates (id)
);

GO

CREATE INDEX ix_term_computations_org_id ON term_computations (org_id);

GO

CREATE INDEX ix_term_computations_project_id ON term_computations (project_id);

GO

CREATE INDEX ix_term_computations_term_estimate_id ON term_computations (term_estimate_id);

GO

CREATE TABLE terrain_summaries (
    field_id UNIQUEIDENTIFIER NOT NULL, 
    provider NVARCHAR(40) NOT NULL, 
    source_ref NVARCHAR(120) NOT NULL, 
    cell_size_m FLOAT NOT NULL, 
    n_cells INTEGER NOT NULL, 
    elevation_mean_m FLOAT NOT NULL, 
    slope_mean_pct FLOAT NOT NULL, 
    aspect_deg FLOAT NULL, 
    dominant_slope_class NVARCHAR(30) NOT NULL, 
    histogram NVARCHAR(max) NOT NULL, 
    stats NVARCHAR(max) NOT NULL, 
    applied NVARCHAR(max) NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(field_id) REFERENCES fields (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id)
);

GO

CREATE INDEX ix_terrain_summaries_field_id ON terrain_summaries (field_id);

GO

CREATE INDEX ix_terrain_summaries_org_id ON terrain_summaries (org_id);

GO

CREATE TABLE biomass_plot_measurements (
    record_id UNIQUEIDENTIFIER NOT NULL, 
    version INTEGER NOT NULL, 
    status NVARCHAR(10) NOT NULL, 
    project_id UNIQUEIDENTIFIER NOT NULL, 
    campaign_id UNIQUEIDENTIFIER NOT NULL, 
    plot_id UNIQUEIDENTIFIER NOT NULL, 
    trees NVARCHAR(max) NOT NULL, 
    shrub NVARCHAR(max) NULL, 
    harvested BIT NOT NULL, 
    evidence_ids NVARCHAR(max) NOT NULL, 
    note NVARCHAR(max) NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(campaign_id) REFERENCES biomass_campaigns (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(plot_id) REFERENCES biomass_plots (id), 
    FOREIGN KEY(project_id) REFERENCES projects (id)
);

GO

CREATE INDEX ix_biomass_plot_measurements_campaign_id ON biomass_plot_measurements (campaign_id);

GO

CREATE INDEX ix_biomass_plot_measurements_org_id ON biomass_plot_measurements (org_id);

GO

CREATE INDEX ix_biomass_plot_measurements_plot_id ON biomass_plot_measurements (plot_id);

GO

CREATE INDEX ix_biomass_plot_measurements_project_id ON biomass_plot_measurements (project_id);

GO

CREATE INDEX ix_biomass_plot_measurements_record_id ON biomass_plot_measurements (record_id);

GO

CREATE TABLE claims (
    field_id UNIQUEIDENTIFIER NOT NULL, 
    pool NVARCHAR(20) NOT NULL, 
    period_start DATETIME NOT NULL, 
    period_end DATETIME NOT NULL, 
    run_id UNIQUEIDENTIFIER NOT NULL, 
    released_by_run_id UNIQUEIDENTIFIER NULL, 
    meta NVARCHAR(max) NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(field_id) REFERENCES fields (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(run_id) REFERENCES calculation_runs (id)
);

GO

CREATE INDEX ix_claims_field_id ON claims (field_id);

GO

CREATE INDEX ix_claims_org_id ON claims (org_id);

GO

CREATE INDEX ix_claims_run_id ON claims (run_id);

GO

CREATE TABLE control_site_assessments (
    project_id UNIQUEIDENTIFIER NOT NULL, 
    run_id UNIQUEIDENTIFIER NOT NULL, 
    scope NVARCHAR(10) NOT NULL, 
    link_id UNIQUEIDENTIFIER NULL, 
    overall NVARCHAR(10) NOT NULL, 
    criteria NVARCHAR(max) NOT NULL, 
    summary NVARCHAR(max) NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(link_id) REFERENCES control_site_links (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(project_id) REFERENCES projects (id)
);

GO

CREATE INDEX ix_control_site_assessments_org_id ON control_site_assessments (org_id);

GO

CREATE INDEX ix_control_site_assessments_project_id ON control_site_assessments (project_id);

GO

CREATE INDEX ix_control_site_assessments_run_id ON control_site_assessments (run_id);

GO

CREATE TABLE credit_batches (
    project_id UNIQUEIDENTIFIER NOT NULL, 
    run_id UNIQUEIDENTIFIER NOT NULL, 
    code NVARCHAR(40) NOT NULL, 
    vintage INTEGER NOT NULL, 
    reductions_t FLOAT NOT NULL, 
    removals_t FLOAT NOT NULL, 
    status NVARCHAR(20) NOT NULL, 
    registry_name NVARCHAR(40) NULL, 
    registry_project_ref NVARCHAR(80) NULL, 
    serial_start NVARCHAR(120) NULL, 
    serial_end NVARCHAR(120) NULL, 
    issued_on DATETIME NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(project_id) REFERENCES projects (id), 
    FOREIGN KEY(run_id) REFERENCES calculation_runs (id), 
    UNIQUE (run_id)
);

GO

CREATE INDEX ix_credit_batches_org_id ON credit_batches (org_id);

GO

CREATE INDEX ix_credit_batches_project_id ON credit_batches (project_id);

GO

CREATE TABLE document_approvals (
    version_id UNIQUEIDENTIFIER NOT NULL, 
    decision NVARCHAR(10) NOT NULL, 
    note NVARCHAR(max) NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(version_id) REFERENCES document_versions (id), 
    UNIQUE (version_id)
);

GO

CREATE INDEX ix_document_approvals_org_id ON document_approvals (org_id);

GO

CREATE INDEX ix_document_approvals_version_id ON document_approvals (version_id);

GO

CREATE TABLE intervention_plans (
    plan_id UNIQUEIDENTIFIER NOT NULL, 
    version INTEGER NOT NULL, 
    code NVARCHAR(40) NOT NULL, 
    project_id UNIQUEIDENTIFIER NOT NULL, 
    enrolment_id UNIQUEIDENTIFIER NOT NULL, 
    field_id UNIQUEIDENTIFIER NOT NULL, 
    farmer_id UNIQUEIDENTIFIER NOT NULL, 
    status NVARCHAR(20) NOT NULL, 
    supersedes_id UNIQUEIDENTIFIER NULL, 
    change_reason NVARCHAR(max) NOT NULL, 
    notes NVARCHAR(max) NOT NULL, 
    agreed_at DATETIMEOFFSET NULL, 
    agreed_method NVARCHAR(20) NULL, 
    agreed_text_sha256 NVARCHAR(64) NULL, 
    witness_user_id UNIQUEIDENTIFIER NULL, 
    activated_by UNIQUEIDENTIFIER NULL, 
    activated_at DATETIMEOFFSET NULL, 
    closed_on DATETIME NULL, 
    close_reason NVARCHAR(max) NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(activated_by) REFERENCES users (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(enrolment_id) REFERENCES enrolments (id), 
    FOREIGN KEY(farmer_id) REFERENCES farmers (id), 
    FOREIGN KEY(field_id) REFERENCES fields (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(project_id) REFERENCES projects (id), 
    FOREIGN KEY(supersedes_id) REFERENCES intervention_plans (id), 
    FOREIGN KEY(witness_user_id) REFERENCES users (id), 
    UNIQUE (plan_id, version)
);

GO

CREATE INDEX ix_intervention_plans_code ON intervention_plans (code);

GO

CREATE INDEX ix_intervention_plans_enrolment_id ON intervention_plans (enrolment_id);

GO

CREATE INDEX ix_intervention_plans_farmer_id ON intervention_plans (farmer_id);

GO

CREATE INDEX ix_intervention_plans_field_id ON intervention_plans (field_id);

GO

CREATE INDEX ix_intervention_plans_org_id ON intervention_plans (org_id);

GO

CREATE INDEX ix_intervention_plans_plan_id ON intervention_plans (plan_id);

GO

CREATE INDEX ix_intervention_plans_project_id ON intervention_plans (project_id);

GO

CREATE TABLE qa1_run_rows (
    import_id UNIQUEIDENTIFIER NOT NULL, 
    site_id UNIQUEIDENTIFIER NOT NULL, 
    site_code NVARCHAR(40) NOT NULL, 
    scenario NVARCHAR(10) NOT NULL, 
    year INTEGER NOT NULL, 
    draw INTEGER NOT NULL, 
    soc_t_c_ha FLOAT NULL, 
    ch4_t_ch4_ha FLOAT NULL, 
    n2o_t_n2o_ha FLOAT NULL, 
    practice_category NVARCHAR(40) NOT NULL, 
    crop_functional_group NVARCHAR(60) NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(import_id) REFERENCES qa1_run_imports (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(site_id) REFERENCES sites (id)
);

GO

CREATE INDEX ix_qa1_run_rows_import_id ON qa1_run_rows (import_id);

GO

CREATE INDEX ix_qa1_run_rows_org_id ON qa1_run_rows (org_id);

GO

CREATE INDEX ix_qa1_run_rows_site_id ON qa1_run_rows (site_id);

GO

CREATE TABLE qa1_trueups (
    project_id UNIQUEIDENTIFIER NOT NULL, 
    model_id UNIQUEIDENTIFIER NOT NULL, 
    import_id UNIQUEIDENTIFIER NOT NULL, 
    campaign_id UNIQUEIDENTIFIER NOT NULL, 
    measured_on DATETIME NOT NULL, 
    points NVARCHAR(max) NOT NULL, 
    stats NVARCHAR(max) NOT NULL, 
    evidence_ids NVARCHAR(max) NOT NULL, 
    notes NVARCHAR(max) NOT NULL, 
    status NVARCHAR(12) NOT NULL, 
    approved_by UNIQUEIDENTIFIER NULL, 
    approved_at DATETIMEOFFSET NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(approved_by) REFERENCES users (id), 
    FOREIGN KEY(campaign_id) REFERENCES campaigns (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(import_id) REFERENCES qa1_run_imports (id), 
    FOREIGN KEY(model_id) REFERENCES qa1_models (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(project_id) REFERENCES projects (id)
);

GO

CREATE INDEX ix_qa1_trueups_org_id ON qa1_trueups (org_id);

GO

CREATE INDEX ix_qa1_trueups_project_id ON qa1_trueups (project_id);

GO

CREATE TABLE remediation_actions (
    risk_event_id UNIQUEIDENTIFIER NOT NULL, 
    title NVARCHAR(200) NOT NULL, 
    description NVARCHAR(max) NOT NULL, 
    owner_user_id UNIQUEIDENTIFIER NULL, 
    due_on DATETIME NOT NULL, 
    status NVARCHAR(12) NOT NULL, 
    completed_on DATETIME NULL, 
    evidence_ids NVARCHAR(max) NOT NULL, 
    history NVARCHAR(max) NOT NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(owner_user_id) REFERENCES users (id), 
    FOREIGN KEY(risk_event_id) REFERENCES risk_events (id)
);

GO

CREATE INDEX ix_remediation_actions_org_id ON remediation_actions (org_id);

GO

CREATE INDEX ix_remediation_actions_risk_event_id ON remediation_actions (risk_event_id);

GO

CREATE TABLE run_status_events (
    run_id UNIQUEIDENTIFIER NOT NULL, 
    status NVARCHAR(20) NOT NULL, 
    note NVARCHAR(max) NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(run_id) REFERENCES calculation_runs (id)
);

GO

CREATE INDEX ix_run_status_events_org_id ON run_status_events (org_id);

GO

CREATE INDEX ix_run_status_events_run_id ON run_status_events (run_id);

GO

CREATE TABLE sampling_design_units (
    design_id UNIQUEIDENTIFIER NOT NULL, 
    stage INTEGER NOT NULL, 
    ref NVARCHAR(40) NOT NULL, 
    parent_ref NVARCHAR(40) NULL, 
    label NVARCHAR(200) NOT NULL, 
    draws INTEGER NOT NULL, 
    area_ha FLOAT NOT NULL, 
    population_count INTEGER NULL, 
    selection_probability FLOAT NOT NULL, 
    inclusion_probability FLOAT NOT NULL, 
    stratum_areas NVARCHAR(max) NOT NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(design_id) REFERENCES sampling_designs (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id)
);

GO

CREATE INDEX ix_sampling_design_units_design_id ON sampling_design_units (design_id);

GO

CREATE INDEX ix_sampling_design_units_org_id ON sampling_design_units (org_id);

GO

CREATE TABLE sampling_points (
    campaign_id UNIQUEIDENTIFIER NOT NULL, 
    site_id UNIQUEIDENTIFIER NOT NULL, 
    assigned_to UNIQUEIDENTIFIER NULL, 
    sequence INTEGER NOT NULL, 
    status NVARCHAR(20) NOT NULL, 
    skip_reason NVARCHAR(max) NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(assigned_to) REFERENCES users (id), 
    FOREIGN KEY(campaign_id) REFERENCES campaigns (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(site_id) REFERENCES sites (id), 
    UNIQUE (campaign_id, site_id)
);

GO

CREATE INDEX ix_sampling_points_assigned_to ON sampling_points (assigned_to);

GO

CREATE INDEX ix_sampling_points_campaign_id ON sampling_points (campaign_id);

GO

CREATE INDEX ix_sampling_points_org_id ON sampling_points (org_id);

GO

CREATE INDEX ix_sampling_points_site_id ON sampling_points (site_id);

GO

CREATE TABLE soil_property_applications (
    suggestion_id UNIQUEIDENTIFIER NOT NULL, 
    field_id UNIQUEIDENTIFIER NOT NULL, 
    changes NVARCHAR(max) NOT NULL, 
    note NVARCHAR(max) NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(field_id) REFERENCES fields (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(suggestion_id) REFERENCES soil_property_suggestions (id)
);

GO

CREATE INDEX ix_soil_property_applications_field_id ON soil_property_applications (field_id);

GO

CREATE INDEX ix_soil_property_applications_org_id ON soil_property_applications (org_id);

GO

CREATE INDEX ix_soil_property_applications_suggestion_id ON soil_property_applications (suggestion_id);

GO

CREATE TABLE verification_packages (
    run_id UNIQUEIDENTIFIER NOT NULL, 
    project_id UNIQUEIDENTIFIER NOT NULL, 
    version INTEGER NOT NULL, 
    sha256 NVARCHAR(64) NOT NULL, 
    json_file_id UNIQUEIDENTIFIER NOT NULL, 
    pdf_file_id UNIQUEIDENTIFIER NULL, 
    summary NVARCHAR(max) NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(json_file_id) REFERENCES evidence_files (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(pdf_file_id) REFERENCES evidence_files (id), 
    FOREIGN KEY(project_id) REFERENCES projects (id), 
    FOREIGN KEY(run_id) REFERENCES calculation_runs (id)
);

GO

CREATE INDEX ix_verification_packages_org_id ON verification_packages (org_id);

GO

CREATE INDEX ix_verification_packages_project_id ON verification_packages (project_id);

GO

CREATE INDEX ix_verification_packages_run_id ON verification_packages (run_id);

GO

CREATE TABLE intervention_commitments (
    plan_row_id UNIQUEIDENTIFIER NOT NULL, 
    practice_code NVARCHAR(40) NOT NULL, 
    start_year INTEGER NOT NULL, 
    start_season NVARCHAR(30) NULL, 
    end_year INTEGER NULL, 
    end_season NVARCHAR(30) NULL, 
    times_per_year INTEGER NOT NULL, 
    expected_quantity FLOAT NULL, 
    unit NVARCHAR(20) NULL, 
    notes NVARCHAR(max) NOT NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(plan_row_id) REFERENCES intervention_plans (id)
);

GO

CREATE INDEX ix_intervention_commitments_org_id ON intervention_commitments (org_id);

GO

CREATE INDEX ix_intervention_commitments_plan_row_id ON intervention_commitments (plan_row_id);

GO

CREATE TABLE offers (
    code NVARCHAR(40) NOT NULL, 
    seller_name NVARCHAR(200) NOT NULL, 
    buyer_id UNIQUEIDENTIFIER NOT NULL, 
    batch_id UNIQUEIDENTIFIER NOT NULL, 
    credit_type NVARCHAR(12) NOT NULL, 
    quantity FLOAT NOT NULL, 
    unit_price NUMERIC(14, 2) NOT NULL, 
    currency NVARCHAR(3) NOT NULL, 
    valid_until DATETIME NOT NULL, 
    terms NVARCHAR(max) NOT NULL, 
    status NVARCHAR(12) NOT NULL, 
    sent_at DATETIMEOFFSET NULL, 
    responded_at DATETIMEOFFSET NULL, 
    responded_by UNIQUEIDENTIFIER NULL, 
    response_note NVARCHAR(max) NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(batch_id) REFERENCES credit_batches (id), 
    FOREIGN KEY(buyer_id) REFERENCES buyers (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(responded_by) REFERENCES users (id), 
    UNIQUE (org_id, code)
);

GO

CREATE INDEX ix_offers_batch_id ON offers (batch_id);

GO

CREATE INDEX ix_offers_buyer_id ON offers (buyer_id);

GO

CREATE INDEX ix_offers_org_id ON offers (org_id);

GO

CREATE TABLE sales (
    code NVARCHAR(40) NOT NULL, 
    buyer_id UNIQUEIDENTIFIER NOT NULL, 
    batch_id UNIQUEIDENTIFIER NOT NULL, 
    credit_type NVARCHAR(12) NOT NULL, 
    quantity FLOAT NOT NULL, 
    unit_price NUMERIC(14, 2) NOT NULL, 
    currency NVARCHAR(3) NOT NULL, 
    status NVARCHAR(20) NOT NULL, 
    contract_ref NVARCHAR(120) NULL, 
    retirement_beneficiary NVARCHAR(200) NULL, 
    trade_date DATETIME NULL, 
    notes NVARCHAR(max) NOT NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(batch_id) REFERENCES credit_batches (id), 
    FOREIGN KEY(buyer_id) REFERENCES buyers (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    UNIQUE (org_id, code)
);

GO

CREATE INDEX ix_sales_batch_id ON sales (batch_id);

GO

CREATE INDEX ix_sales_buyer_id ON sales (buyer_id);

GO

CREATE INDEX ix_sales_org_id ON sales (org_id);

GO

CREATE TABLE samples (
    point_id UNIQUEIDENTIFIER NOT NULL, 
    campaign_id UNIQUEIDENTIFIER NOT NULL, 
    site_id UNIQUEIDENTIFIER NOT NULL, 
    code NVARCHAR(60) NOT NULL, 
    collected_at DATETIMEOFFSET NOT NULL, 
    latitude FLOAT NOT NULL, 
    longitude FLOAT NOT NULL, 
    gps_accuracy_m FLOAT NULL, 
    distance_from_site_m FLOAT NOT NULL, 
    depth_reached_cm FLOAT NOT NULL, 
    probe_diameter_mm FLOAT NULL, 
    cores_composited INTEGER NULL, 
    photo_ids NVARCHAR(max) NOT NULL, 
    deviation_reason NVARCHAR(max) NULL, 
    depth_limit NVARCHAR(20) NULL, 
    device_id NVARCHAR(80) NULL, 
    client_ref NVARCHAR(80) NOT NULL, 
    context NVARCHAR(max) NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(campaign_id) REFERENCES campaigns (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(point_id) REFERENCES sampling_points (id), 
    FOREIGN KEY(site_id) REFERENCES sites (id), 
    UNIQUE (org_id, client_ref), 
    UNIQUE (org_id, code), 
    UNIQUE (point_id)
);

GO

CREATE INDEX ix_samples_campaign_id ON samples (campaign_id);

GO

CREATE INDEX ix_samples_client_ref ON samples (client_ref);

GO

CREATE INDEX ix_samples_code ON samples (code);

GO

CREATE INDEX ix_samples_org_id ON samples (org_id);

GO

CREATE INDEX ix_samples_site_id ON samples (site_id);

GO

CREATE TABLE verifier_access (
    package_id UNIQUEIDENTIFIER NOT NULL, 
    verifier_name NVARCHAR(200) NOT NULL, 
    verifier_email NVARCHAR(200) NOT NULL, 
    organisation NVARCHAR(200) NOT NULL, 
    token_sha256 NVARCHAR(64) NOT NULL, 
    expires_at DATETIMEOFFSET NOT NULL, 
    revoked_at DATETIMEOFFSET NULL, 
    last_opened_at DATETIMEOFFSET NULL, 
    status NVARCHAR(20) NOT NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(package_id) REFERENCES verification_packages (id), 
    UNIQUE (token_sha256)
);

GO

CREATE INDEX ix_verifier_access_org_id ON verifier_access (org_id);

GO

CREATE INDEX ix_verifier_access_package_id ON verifier_access (package_id);

GO

CREATE TABLE benefit_pools (
    sale_id UNIQUEIDENTIFIER NOT NULL, 
    rule_id UNIQUEIDENTIFIER NOT NULL, 
    gross_amount NUMERIC(14, 2) NOT NULL, 
    deductions_amount NUMERIC(14, 2) NOT NULL, 
    farmer_pool_amount NUMERIC(14, 2) NOT NULL, 
    currency NVARCHAR(3) NOT NULL, 
    status NVARCHAR(20) NOT NULL, 
    breakdown NVARCHAR(max) NOT NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(rule_id) REFERENCES benefit_rules (id), 
    FOREIGN KEY(sale_id) REFERENCES sales (id), 
    UNIQUE (sale_id)
);

GO

CREATE INDEX ix_benefit_pools_org_id ON benefit_pools (org_id);

GO

CREATE TABLE custody_events (
    sample_id UNIQUEIDENTIFIER NOT NULL, 
    event NVARCHAR(30) NOT NULL, 
    occurred_at DATETIMEOFFSET NOT NULL, 
    location NVARCHAR(200) NOT NULL, 
    seal_intact BIT NULL, 
    count_matches BIT NULL, 
    notes NVARCHAR(max) NOT NULL, 
    storage_condition NVARCHAR(20) NULL, 
    corrects_event_id UNIQUEIDENTIFIER NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(corrects_event_id) REFERENCES custody_events (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(sample_id) REFERENCES samples (id)
);

GO

CREATE INDEX ix_custody_events_org_id ON custody_events (org_id);

GO

CREATE INDEX ix_custody_events_sample_id ON custody_events (sample_id);

GO

CREATE TABLE intervention_deviations (
    plan_id UNIQUEIDENTIFIER NOT NULL, 
    plan_row_id UNIQUEIDENTIFIER NOT NULL, 
    commitment_id UNIQUEIDENTIFIER NULL, 
    year INTEGER NULL, 
    source NVARCHAR(10) NOT NULL, 
    kind NVARCHAR(20) NOT NULL, 
    reason NVARCHAR(max) NOT NULL, 
    corrective_action NVARCHAR(max) NOT NULL, 
    impact NVARCHAR(12) NOT NULL, 
    status NVARCHAR(12) NOT NULL, 
    detail NVARCHAR(max) NOT NULL, 
    history NVARCHAR(max) NOT NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(commitment_id) REFERENCES intervention_commitments (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(plan_row_id) REFERENCES intervention_plans (id)
);

GO

CREATE INDEX ix_intervention_deviations_commitment_id ON intervention_deviations (commitment_id);

GO

CREATE INDEX ix_intervention_deviations_org_id ON intervention_deviations (org_id);

GO

CREATE INDEX ix_intervention_deviations_plan_id ON intervention_deviations (plan_id);

GO

CREATE INDEX ix_intervention_deviations_plan_row_id ON intervention_deviations (plan_row_id);

GO

CREATE TABLE inventory_moves (
    batch_id UNIQUEIDENTIFIER NOT NULL, 
    credit_type NVARCHAR(12) NOT NULL, 
    from_state NVARCHAR(12) NOT NULL, 
    to_state NVARCHAR(12) NOT NULL, 
    quantity FLOAT NOT NULL, 
    sale_id UNIQUEIDENTIFIER NULL, 
    reason NVARCHAR(max) NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(batch_id) REFERENCES credit_batches (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(sale_id) REFERENCES sales (id)
);

GO

CREATE INDEX ix_inventory_moves_batch_id ON inventory_moves (batch_id);

GO

CREATE INDEX ix_inventory_moves_org_id ON inventory_moves (org_id);

GO

CREATE TABLE offtake_agreements (
    code NVARCHAR(40) NOT NULL, 
    title NVARCHAR(200) NOT NULL, 
    seller_name NVARCHAR(200) NOT NULL, 
    buyer_id UNIQUEIDENTIFIER NOT NULL, 
    offer_id UNIQUEIDENTIFIER NULL, 
    credit_type NVARCHAR(12) NOT NULL, 
    total_volume_t FLOAT NOT NULL, 
    vintages NVARCHAR(max) NOT NULL, 
    price_type NVARCHAR(8) NOT NULL, 
    price NUMERIC(14, 2) NOT NULL, 
    currency NVARCHAR(3) NOT NULL, 
    delivery_schedule NVARCHAR(max) NOT NULL, 
    status NVARCHAR(12) NOT NULL, 
    contract_evidence_id UNIQUEIDENTIFIER NULL, 
    signed_on DATETIME NULL, 
    signed_by UNIQUEIDENTIFIER NULL, 
    effective_from DATETIME NULL, 
    effective_to DATETIME NULL, 
    closed_on DATETIME NULL, 
    close_reason NVARCHAR(max) NULL, 
    notes NVARCHAR(max) NOT NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(buyer_id) REFERENCES buyers (id), 
    FOREIGN KEY(contract_evidence_id) REFERENCES evidence_files (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(offer_id) REFERENCES offers (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(signed_by) REFERENCES users (id), 
    UNIQUE (org_id, code)
);

GO

CREATE INDEX ix_offtake_agreements_buyer_id ON offtake_agreements (buyer_id);

GO

CREATE INDEX ix_offtake_agreements_org_id ON offtake_agreements (org_id);

GO

CREATE TABLE soil_layers (
    sample_id UNIQUEIDENTIFIER NOT NULL, 
    code NVARCHAR(70) NOT NULL, 
    label_qr NVARCHAR(80) NOT NULL, 
    depth_from_cm FLOAT NOT NULL, 
    depth_to_cm FLOAT NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(sample_id) REFERENCES samples (id), 
    UNIQUE (org_id, code), 
    UNIQUE (org_id, label_qr)
);

GO

CREATE INDEX ix_soil_layers_code ON soil_layers (code);

GO

CREATE INDEX ix_soil_layers_label_qr ON soil_layers (label_qr);

GO

CREATE INDEX ix_soil_layers_org_id ON soil_layers (org_id);

GO

CREATE INDEX ix_soil_layers_sample_id ON soil_layers (sample_id);

GO

CREATE TABLE verifier_queries (
    access_id UNIQUEIDENTIFIER NOT NULL, 
    subject_type NVARCHAR(40) NOT NULL, 
    subject_id NVARCHAR(64) NOT NULL, 
    question NVARCHAR(max) NOT NULL, 
    answer NVARCHAR(max) NULL, 
    answered_by UNIQUEIDENTIFIER NULL, 
    answered_at DATETIMEOFFSET NULL, 
    status NVARCHAR(12) NOT NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(access_id) REFERENCES verifier_access (id), 
    FOREIGN KEY(answered_by) REFERENCES users (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id)
);

GO

CREATE INDEX ix_verifier_queries_access_id ON verifier_queries (access_id);

GO

CREATE INDEX ix_verifier_queries_org_id ON verifier_queries (org_id);

GO

CREATE TABLE entitlements (
    pool_id UNIQUEIDENTIFIER NOT NULL, 
    farmer_id UNIQUEIDENTIFIER NOT NULL, 
    amount NUMERIC(14, 2) NOT NULL, 
    inputs NVARCHAR(max) NOT NULL, 
    calc_version INTEGER NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(farmer_id) REFERENCES farmers (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(pool_id) REFERENCES benefit_pools (id)
);

GO

CREATE INDEX ix_entitlements_farmer_id ON entitlements (farmer_id);

GO

CREATE INDEX ix_entitlements_org_id ON entitlements (org_id);

GO

CREATE INDEX ix_entitlements_pool_id ON entitlements (pool_id);

GO

CREATE TABLE lab_results (
    layer_id UNIQUEIDENTIFIER NOT NULL, 
    lab_id UNIQUEIDENTIFIER NOT NULL, 
    analyte NVARCHAR(30) NOT NULL, 
    value FLOAT NOT NULL, 
    unit NVARCHAR(20) NOT NULL, 
    method NVARCHAR(60) NOT NULL, 
    analysed_on DATETIME NOT NULL, 
    uncertainty FLOAT NULL, 
    detection_limit FLOAT NULL, 
    certificate_id UNIQUEIDENTIFIER NULL, 
    status NVARCHAR(12) NOT NULL, 
    version INTEGER NOT NULL, 
    supersedes_id UNIQUEIDENTIFIER NULL, 
    reviewed_by UNIQUEIDENTIFIER NULL, 
    reviewed_at DATETIMEOFFSET NULL, 
    review_note NVARCHAR(max) NOT NULL, 
    calibration_id UNIQUEIDENTIFIER NULL, 
    method_justification NVARCHAR(max) NULL, 
    below_detection_limit BIT NOT NULL, 
    purpose NVARCHAR(20) NOT NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(calibration_id) REFERENCES spectral_calibrations (id), 
    FOREIGN KEY(certificate_id) REFERENCES evidence_files (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(lab_id) REFERENCES labs (id), 
    FOREIGN KEY(layer_id) REFERENCES soil_layers (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(reviewed_by) REFERENCES users (id), 
    FOREIGN KEY(supersedes_id) REFERENCES lab_results (id)
);

GO

CREATE INDEX ix_lab_results_analyte ON lab_results (analyte);

GO

CREATE INDEX ix_lab_results_lab_id ON lab_results (lab_id);

GO

CREATE INDEX ix_lab_results_layer_id ON lab_results (layer_id);

GO

CREATE INDEX ix_lab_results_org_id ON lab_results (org_id);

GO

CREATE TABLE payout_batches (
    code NVARCHAR(40) NOT NULL, 
    pool_id UNIQUEIDENTIFIER NOT NULL, 
    total_amount NUMERIC(14, 2) NOT NULL, 
    status NVARCHAR(20) NOT NULL, 
    approved_by UNIQUEIDENTIFIER NULL, 
    approved_at DATETIMEOFFSET NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(approved_by) REFERENCES users (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(pool_id) REFERENCES benefit_pools (id), 
    UNIQUE (org_id, code)
);

GO

CREATE INDEX ix_payout_batches_org_id ON payout_batches (org_id);

GO

CREATE INDEX ix_payout_batches_pool_id ON payout_batches (pool_id);

GO

CREATE TABLE payouts (
    batch_id UNIQUEIDENTIFIER NOT NULL, 
    entitlement_id UNIQUEIDENTIFIER NOT NULL, 
    farmer_id UNIQUEIDENTIFIER NOT NULL, 
    amount NUMERIC(14, 2) NOT NULL, 
    status NVARCHAR(20) NOT NULL, 
    provider_ref NVARCHAR(120) NULL, 
    failure_reason NVARCHAR(max) NULL, 
    paid_at DATETIMEOFFSET NULL, 
    attempts INTEGER NOT NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(batch_id) REFERENCES payout_batches (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(entitlement_id) REFERENCES entitlements (id), 
    FOREIGN KEY(farmer_id) REFERENCES farmers (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    UNIQUE (batch_id, entitlement_id)
);

GO

CREATE INDEX ix_payouts_batch_id ON payouts (batch_id);

GO

CREATE INDEX ix_payouts_farmer_id ON payouts (farmer_id);

GO

CREATE INDEX ix_payouts_org_id ON payouts (org_id);

GO

CREATE TABLE reconciliation_runs (
    batch_id UNIQUEIDENTIFIER NOT NULL, 
    statement_evidence_id UNIQUEIDENTIFIER NOT NULL, 
    statement_sha256 NVARCHAR(64) NOT NULL, 
    rows INTEGER NOT NULL, 
    status NVARCHAR(20) NOT NULL, 
    counts NVARCHAR(max) NOT NULL, 
    updated_at DATETIMEOFFSET NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(batch_id) REFERENCES payout_batches (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(statement_evidence_id) REFERENCES evidence_files (id)
);

GO

CREATE INDEX ix_reconciliation_runs_batch_id ON reconciliation_runs (batch_id);

GO

CREATE INDEX ix_reconciliation_runs_org_id ON reconciliation_runs (org_id);

GO

CREATE TABLE payment_attempts (
    payout_id UNIQUEIDENTIFIER NOT NULL, 
    batch_id UNIQUEIDENTIFIER NOT NULL, 
    attempt_no INTEGER NOT NULL, 
    provider NVARCHAR(40) NULL, 
    provider_ref NVARCHAR(120) NULL, 
    amount NUMERIC(14, 2) NOT NULL, 
    currency NVARCHAR(3) NOT NULL, 
    status NVARCHAR(12) NOT NULL, 
    error NVARCHAR(max) NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(batch_id) REFERENCES payout_batches (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(payout_id) REFERENCES payouts (id)
);

GO

CREATE INDEX ix_payment_attempts_batch_id ON payment_attempts (batch_id);

GO

CREATE INDEX ix_payment_attempts_org_id ON payment_attempts (org_id);

GO

CREATE INDEX ix_payment_attempts_payout_id ON payment_attempts (payout_id);

GO

CREATE INDEX ix_payment_attempts_provider_ref ON payment_attempts (provider_ref);

GO

CREATE TABLE reconciliation_items (
    run_id UNIQUEIDENTIFIER NOT NULL, 
    batch_id UNIQUEIDENTIFIER NOT NULL, 
    payout_id UNIQUEIDENTIFIER NULL, 
    provider_ref NVARCHAR(120) NULL, 
    row_no INTEGER NULL, 
    expected_amount NUMERIC(14, 2) NULL, 
    statement_amount NUMERIC(14, 2) NULL, 
    statement_status NVARCHAR(30) NULL, 
    outcome NVARCHAR(30) NOT NULL, 
    note NVARCHAR(max) NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(batch_id) REFERENCES payout_batches (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    FOREIGN KEY(payout_id) REFERENCES payouts (id), 
    FOREIGN KEY(run_id) REFERENCES reconciliation_runs (id)
);

GO

CREATE INDEX ix_reconciliation_items_batch_id ON reconciliation_items (batch_id);

GO

CREATE INDEX ix_reconciliation_items_org_id ON reconciliation_items (org_id);

GO

CREATE INDEX ix_reconciliation_items_run_id ON reconciliation_items (run_id);

GO

INSERT INTO alembic_version (version_num) OUTPUT inserted.version_num VALUES ('0001');

GO

COMMIT;

GO

