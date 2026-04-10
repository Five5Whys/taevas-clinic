CREATE TABLE IF NOT EXISTS emergency_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES clinic_patients(id),
    relationship VARCHAR(50),
    full_name VARCHAR(255) NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by VARCHAR(255)
);
CREATE INDEX idx_emergency_contacts_patient ON emergency_contacts(patient_id);
