BEGIN TRANSACTION;

-- Running upgrade 0002 -> 0003

CREATE TABLE device_readings (
    device_id UNIQUEIDENTIFIER NOT NULL, 
    parameter NVARCHAR(40) NOT NULL, 
    observed_at DATETIMEOFFSET NOT NULL, 
    observed_on DATETIME NOT NULL, 
    value FLOAT NOT NULL, 
    unit NVARCHAR(20) NOT NULL, 
    source NVARCHAR(40) NOT NULL, 
    id UNIQUEIDENTIFIER NOT NULL, 
    created_at DATETIMEOFFSET NOT NULL, 
    org_id UNIQUEIDENTIFIER NOT NULL, 
    created_by UNIQUEIDENTIFIER NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(created_by) REFERENCES users (id), 
    FOREIGN KEY(device_id) REFERENCES devices (id), 
    FOREIGN KEY(org_id) REFERENCES organizations (id), 
    UNIQUE (device_id, parameter, observed_at)
);

GO

CREATE INDEX ix_device_readings_device_id ON device_readings (device_id);

GO

CREATE INDEX ix_device_readings_observed_on ON device_readings (observed_on);

GO

CREATE INDEX ix_device_readings_org_id ON device_readings (org_id);

GO

CREATE INDEX ix_device_readings_parameter ON device_readings (parameter);

GO

UPDATE alembic_version SET version_num='0003' WHERE alembic_version.version_num = '0002';

GO

COMMIT;

GO

