CREATE TABLE IF NOT EXISTS patient_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL,
    patient_id UUID NOT NULL REFERENCES clinic_patients(id),
    doctor_id UUID NOT NULL,
    report_type VARCHAR(50),
    title VARCHAR(255) NOT NULL,
    notes TEXT,
    status VARCHAR(30) DEFAULT 'COMPLETED',
    report_date DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by VARCHAR(255)
);
CREATE INDEX idx_patient_reports_clinic_patient ON patient_reports(clinic_id, patient_id);
CREATE INDEX idx_patient_reports_clinic_doctor ON patient_reports(clinic_id, doctor_id);
