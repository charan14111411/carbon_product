BEGIN TRANSACTION;

-- Running upgrade 0001 -> 0002

ALTER TABLE devices ADD latest_readings NVARCHAR(max) NULL;

GO

ALTER TABLE farms ADD postal_code NVARCHAR(20) NULL;

GO

ALTER TABLE farms ADD notes NVARCHAR(max) NOT NULL DEFAULT '';

GO

CREATE UNIQUE INDEX uq_farms_org_external_farm_id ON farms (org_id, external_farm_id) WHERE external_farm_id IS NOT NULL;

GO

UPDATE alembic_version SET version_num='0002' WHERE alembic_version.version_num = '0001';

GO

COMMIT;

GO

