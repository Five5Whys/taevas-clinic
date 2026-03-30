-- ============================================================
-- V2__superadmin_schema.sql - Matches Java entity models exactly
-- ============================================================

-- 1. Countries (matches Country.java)
CREATE TABLE countries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(2) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    flag_emoji VARCHAR(10),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    currency_code VARCHAR(3),
    currency_symbol VARCHAR(10),
    tax_type VARCHAR(20),
    tax_rate NUMERIC(5,2),
    date_format VARCHAR(20),
    primary_language VARCHAR(50),
    secondary_language VARCHAR(50),
    regulatory_body VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255)
);

CREATE INDEX idx_countries_status ON countries(status);
CREATE INDEX idx_countries_code ON countries(code);

-- 2. Clinics (matches Clinic.java)
CREATE TABLE clinics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country_id UUID REFERENCES countries(id) ON DELETE RESTRICT,
    tenant_id UUID,
    name VARCHAR(200) NOT NULL,
    city VARCHAR(100),
    state VARCHAR(100),
    address VARCHAR(500),
    pincode VARCHAR(20),
    phone VARCHAR(20),
    email VARCHAR(255),
    registration_number VARCHAR(100),
    license_number VARCHAR(100),
    license_valid_until DATE,
    logo_url VARCHAR(500),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255)
);

CREATE INDEX idx_clinics_country ON clinics(country_id);
CREATE INDEX idx_clinics_status ON clinics(status);
CREATE INDEX idx_clinics_tenant ON clinics(tenant_id);
CREATE INDEX idx_clinics_name ON clinics(name);

-- 3. Feature Flags (matches FeatureFlag.java)
CREATE TABLE feature_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    flag_key VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    description VARCHAR(500),
    locked BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255)
);

-- 4. Feature Flag Countries (matches FeatureFlagCountry.java)
CREATE TABLE feature_flag_countries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feature_flag_id UUID NOT NULL REFERENCES feature_flags(id) ON DELETE CASCADE,
    country_id UUID NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
    enabled BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255),
    UNIQUE(feature_flag_id, country_id)
);

CREATE INDEX idx_ffc_feature ON feature_flag_countries(feature_flag_id);
CREATE INDEX idx_ffc_country ON feature_flag_countries(country_id);

-- 5. Compliance Modules (matches ComplianceModule.java)
CREATE TABLE compliance_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country_id UUID NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
    module_key VARCHAR(100) NOT NULL,
    module_name VARCHAR(200) NOT NULL,
    description VARCHAR(500),
    enabled BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255),
    UNIQUE(country_id, module_key)
);

CREATE INDEX idx_compliance_country ON compliance_modules(country_id);

-- 6. Billing Configs (matches BillingConfig.java)
CREATE TABLE billing_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country_id UUID NOT NULL UNIQUE REFERENCES countries(id) ON DELETE CASCADE,
    currency_symbol VARCHAR(10),
    currency_code VARCHAR(10),
    tax_rate NUMERIC(5,2),
    tax_split VARCHAR(500),
    claim_code VARCHAR(50),
    invoice_prefix VARCHAR(50),
    invoice_format VARCHAR(100),
    toggles TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255)
);

CREATE INDEX idx_billing_country ON billing_configs(country_id);

-- 7. Locale Settings (matches LocaleSettings.java)
CREATE TABLE locale_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country_id UUID NOT NULL UNIQUE REFERENCES countries(id) ON DELETE CASCADE,
    primary_language VARCHAR(50),
    secondary_language VARCHAR(50),
    date_format VARCHAR(30),
    weight_unit VARCHAR(10) DEFAULT 'kg',
    height_unit VARCHAR(10) DEFAULT 'cm',
    timezone VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255)
);

CREATE INDEX idx_locale_country ON locale_settings(country_id);

-- 8. ID Format Templates (matches IdFormatTemplate.java)
CREATE TABLE id_format_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country_id UUID NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
    entity_type VARCHAR(50) NOT NULL,
    prefix VARCHAR(30),
    entity_code VARCHAR(30),
    separator VARCHAR(5),
    padding INTEGER NOT NULL DEFAULT 5,
    starts_at INTEGER NOT NULL DEFAULT 1,
    locked BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255),
    UNIQUE(country_id, entity_type)
);

CREATE INDEX idx_idformat_country ON id_format_templates(country_id);
CREATE INDEX idx_idformat_entity ON id_format_templates(entity_type);

-- 9. Field Definitions (matches FieldDefinition.java)
CREATE TABLE field_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scope VARCHAR(30) NOT NULL DEFAULT 'GLOBAL',
    country_id UUID REFERENCES countries(id) ON DELETE CASCADE,
    section VARCHAR(50) NOT NULL,
    field_key VARCHAR(100) NOT NULL,
    label VARCHAR(200) NOT NULL,
    field_type VARCHAR(30) NOT NULL,
    locked BOOLEAN NOT NULL DEFAULT false,
    required BOOLEAN NOT NULL DEFAULT false,
    removable BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255)
);

CREATE INDEX idx_field_country ON field_definitions(country_id);
CREATE INDEX idx_field_scope ON field_definitions(scope);
CREATE INDEX idx_field_section ON field_definitions(section);

-- 10. Config Overrides (matches ConfigOverride.java)
CREATE TABLE config_overrides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    config_type VARCHAR(50) NOT NULL,
    scope_type VARCHAR(30) NOT NULL,
    scope_id UUID NOT NULL,
    config_key VARCHAR(100) NOT NULL,
    config_value TEXT,
    locked BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255)
);

CREATE INDEX idx_config_type ON config_overrides(config_type);
CREATE INDEX idx_config_scope ON config_overrides(scope_type, scope_id);

-- 11. Equidor Ingestion Sessions (matches EquidorIngestionSession.java)
CREATE TABLE equidor_ingestion_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cid VARCHAR(100) NOT NULL UNIQUE,
    ingestion_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(30) NOT NULL DEFAULT 'QUEUED',
    total_devices INTEGER NOT NULL DEFAULT 0,
    total_files INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255)
);

CREATE INDEX idx_equidor_session_status ON equidor_ingestion_sessions(status);
CREATE INDEX idx_equidor_session_date ON equidor_ingestion_sessions(ingestion_date);

-- 12. Equidor Device Data (matches EquidorDeviceData.java)
CREATE TABLE equidor_device_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES equidor_ingestion_sessions(id) ON DELETE CASCADE,
    device_id VARCHAR(100) NOT NULL,
    device_name VARCHAR(200),
    clinic_id UUID,
    patient_id UUID,
    file_name VARCHAR(500) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size BIGINT NOT NULL DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'QUEUED',
    fail_reason VARCHAR(500),
    received_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255)
);

CREATE INDEX idx_equidor_data_session ON equidor_device_data(session_id);
CREATE INDEX idx_equidor_data_status ON equidor_device_data(status);
CREATE INDEX idx_equidor_data_device ON equidor_device_data(device_id);

-- 13. Superadmin Invitations (matches SuperAdminInvitation.java)
CREATE TABLE superadmin_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255),
    phone VARCHAR(20),
    invited_by UUID NOT NULL REFERENCES users(id),
    token VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255)
);

CREATE INDEX idx_invitation_status ON superadmin_invitations(status);
CREATE INDEX idx_invitation_token ON superadmin_invitations(token);
