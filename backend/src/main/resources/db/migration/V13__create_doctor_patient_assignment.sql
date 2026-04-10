CREATE TABLE doctor_patient_assignments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    doctor_id UUID NOT NULL REFERENCES users(id),
    patient_id UUID NOT NULL REFERENCES clinic_patients(id),
    remarks VARCHAR(500),
    assigned_at TIMESTAMP DEFAULT NOW(),
    created_by VARCHAR(255),
    UNIQUE(doctor_id, patient_id)
);
CREATE INDEX idx_dpa_doctor ON doctor_patient_assignments(doctor_id);
CREATE INDEX idx_dpa_patient ON doctor_patient_assignments(patient_id);
