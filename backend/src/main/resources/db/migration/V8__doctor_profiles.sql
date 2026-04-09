-- ============================================================
-- V8__doctor_profiles.sql
-- Doctor professional profile table
-- ============================================================

CREATE TABLE doctor_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    qualifications TEXT,
    specializations TEXT,
    experience_years INTEGER,
    medical_license_number VARCHAR(100),
    license_issued_country VARCHAR(100),
    license_issued_state VARCHAR(100),
    license_certificate_url VARCHAR(500),
    pan_card_number VARCHAR(20),
    pan_card_attachment_url VARCHAR(500),
    signature_url VARCHAR(500),
    home_address TEXT,
    state VARCHAR(100),
    city VARCHAR(100),
    zip_code VARCHAR(20),
    remarks TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255)
);

CREATE INDEX idx_dprof_user ON doctor_profiles(user_id);
CREATE INDEX idx_dprof_status ON doctor_profiles(status);
