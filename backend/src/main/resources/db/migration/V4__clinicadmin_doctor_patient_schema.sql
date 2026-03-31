-- ============================================================
-- V4__clinicadmin_doctor_patient_schema.sql
-- Tables for Clinic Admin, Doctor, Patient roles
-- ============================================================

-- 1. Clinic Staff
CREATE TABLE clinic_staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    name VARCHAR(200) NOT NULL,
    role VARCHAR(50) NOT NULL,
    specialization VARCHAR(200),
    phone VARCHAR(20),
    email VARCHAR(255),
    registration_no VARCHAR(100),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255)
);
CREATE INDEX idx_staff_clinic ON clinic_staff(clinic_id);
CREATE INDEX idx_staff_status ON clinic_staff(status);
CREATE INDEX idx_staff_user ON clinic_staff(user_id);

-- 2. Doctor Schedules
CREATE TABLE doctor_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID NOT NULL REFERENCES clinic_staff(id) ON DELETE CASCADE,
    clinic_id UUID NOT NULL REFERENCES clinics(id),
    day_of_week INTEGER NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    slot_duration INTEGER DEFAULT 15,
    max_patients INTEGER DEFAULT 20,
    buffer_minutes INTEGER DEFAULT 5,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255)
);
CREATE INDEX idx_schedule_staff ON doctor_schedules(staff_id);
CREATE INDEX idx_schedule_clinic ON doctor_schedules(clinic_id);

-- 3. Clinic Schedule Config
CREATE TABLE clinic_schedule_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL UNIQUE REFERENCES clinics(id),
    default_slot_duration INTEGER DEFAULT 15,
    max_patients_per_slot INTEGER DEFAULT 20,
    buffer_between_slots INTEGER DEFAULT 5,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255)
);

-- 4. Clinic Patients
CREATE TABLE clinic_patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id),
    user_id UUID REFERENCES users(id),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(255),
    gender VARCHAR(20),
    blood_group VARCHAR(10),
    date_of_birth DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    last_visit DATE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255)
);
CREATE INDEX idx_cpatient_clinic ON clinic_patients(clinic_id);
CREATE INDEX idx_cpatient_status ON clinic_patients(status);
CREATE INDEX idx_cpatient_user ON clinic_patients(user_id);

-- 5. Appointments
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id),
    patient_id UUID NOT NULL REFERENCES clinic_patients(id),
    doctor_id UUID NOT NULL REFERENCES clinic_staff(id),
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME,
    type VARCHAR(30) NOT NULL DEFAULT 'CONSULTATION',
    status VARCHAR(30) NOT NULL DEFAULT 'SCHEDULED',
    notes TEXT,
    token_number INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255)
);
CREATE INDEX idx_appt_clinic ON appointments(clinic_id);
CREATE INDEX idx_appt_patient ON appointments(patient_id);
CREATE INDEX idx_appt_doctor ON appointments(doctor_id);
CREATE INDEX idx_appt_date ON appointments(appointment_date);
CREATE INDEX idx_appt_status ON appointments(status);

-- 6. Encounters
CREATE TABLE encounters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id),
    appointment_id UUID REFERENCES appointments(id),
    patient_id UUID NOT NULL REFERENCES clinic_patients(id),
    doctor_id UUID NOT NULL REFERENCES clinic_staff(id),
    chief_complaint TEXT,
    hpi TEXT,
    examination TEXT,
    diagnosis TEXT,
    icd10_code VARCHAR(20),
    treatment_plan TEXT,
    follow_up_date DATE,
    status VARCHAR(30) NOT NULL DEFAULT 'IN_PROGRESS',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255)
);
CREATE INDEX idx_enc_clinic ON encounters(clinic_id);
CREATE INDEX idx_enc_appt ON encounters(appointment_id);
CREATE INDEX idx_enc_doctor ON encounters(doctor_id);

-- 7. Prescriptions
CREATE TABLE prescriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id),
    encounter_id UUID REFERENCES encounters(id),
    patient_id UUID NOT NULL REFERENCES clinic_patients(id),
    doctor_id UUID NOT NULL REFERENCES clinic_staff(id),
    diagnosis TEXT,
    notes TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255)
);
CREATE INDEX idx_rx_clinic ON prescriptions(clinic_id);
CREATE INDEX idx_rx_encounter ON prescriptions(encounter_id);
CREATE INDEX idx_rx_patient ON prescriptions(patient_id);

-- 8. Prescription Items
CREATE TABLE prescription_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prescription_id UUID NOT NULL REFERENCES prescriptions(id) ON DELETE CASCADE,
    medicine_name VARCHAR(200) NOT NULL,
    dosage VARCHAR(100),
    frequency VARCHAR(100),
    duration VARCHAR(100),
    instructions TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255)
);
CREATE INDEX idx_rxitem_rx ON prescription_items(prescription_id);

-- 9. Invoices
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id),
    patient_id UUID NOT NULL REFERENCES clinic_patients(id),
    encounter_id UUID REFERENCES encounters(id),
    invoice_number VARCHAR(50) UNIQUE,
    subtotal NUMERIC(10,2) DEFAULT 0,
    tax_amount NUMERIC(10,2) DEFAULT 0,
    discount NUMERIC(10,2) DEFAULT 0,
    total NUMERIC(10,2) DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    payment_method VARCHAR(30),
    paid_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255)
);
CREATE INDEX idx_inv_clinic ON invoices(clinic_id);
CREATE INDEX idx_inv_patient ON invoices(patient_id);
CREATE INDEX idx_inv_status ON invoices(status);

-- 10. Invoice Items
CREATE TABLE invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    description VARCHAR(500) NOT NULL,
    quantity INTEGER DEFAULT 1,
    unit_price NUMERIC(10,2) NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255)
);
CREATE INDEX idx_invitem_inv ON invoice_items(invoice_id);

-- 11. Data Import Sessions
CREATE TABLE data_import_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id),
    import_type VARCHAR(50) NOT NULL,
    file_name VARCHAR(500),
    total_records INTEGER DEFAULT 0,
    success_count INTEGER DEFAULT 0,
    fail_count INTEGER DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    error_log TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255)
);
CREATE INDEX idx_import_clinic ON data_import_sessions(clinic_id);

-- 12. Clinic Templates
CREATE TABLE clinic_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id),
    template_type VARCHAR(50) NOT NULL,
    config_json TEXT,
    file_path VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255),
    UNIQUE(clinic_id, template_type)
);
CREATE INDEX idx_tpl_clinic ON clinic_templates(clinic_id);

-- 13. Clinic Billing Config
CREATE TABLE clinic_billing_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL UNIQUE REFERENCES clinics(id),
    consultation_fee NUMERIC(10,2) DEFAULT 0,
    follow_up_fee NUMERIC(10,2) DEFAULT 0,
    tax_enabled BOOLEAN DEFAULT true,
    tax_rate NUMERIC(5,2) DEFAULT 0,
    invoice_prefix VARCHAR(50),
    payment_modes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255)
);

-- 14. Clinic Custom Fields
CREATE TABLE clinic_custom_fields (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id),
    section VARCHAR(50) NOT NULL,
    field_key VARCHAR(100) NOT NULL,
    label VARCHAR(200) NOT NULL,
    field_type VARCHAR(30) NOT NULL,
    required BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255),
    UNIQUE(clinic_id, section, field_key)
);
CREATE INDEX idx_cfield_clinic ON clinic_custom_fields(clinic_id);

-- 15. Device Reports
CREATE TABLE device_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id),
    patient_id UUID REFERENCES clinic_patients(id),
    doctor_id UUID REFERENCES clinic_staff(id),
    device_name VARCHAR(200),
    report_type VARCHAR(100),
    file_url VARCHAR(500),
    findings TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    reported_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255)
);
CREATE INDEX idx_devreport_clinic ON device_reports(clinic_id);
CREATE INDEX idx_devreport_doctor ON device_reports(doctor_id);

-- 16. Family Groups
CREATE TABLE family_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id),
    name VARCHAR(200) NOT NULL,
    primary_patient_id UUID REFERENCES clinic_patients(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255)
);
CREATE INDEX idx_famgroup_clinic ON family_groups(clinic_id);

-- 17. Family Members
CREATE TABLE family_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_group_id UUID NOT NULL REFERENCES family_groups(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES clinic_patients(id),
    relationship VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255)
);
CREATE INDEX idx_fammember_group ON family_members(family_group_id);

-- 18. WhatsApp Bot Config
CREATE TABLE whatsapp_bot_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL UNIQUE REFERENCES clinics(id),
    enabled BOOLEAN DEFAULT false,
    phone_number VARCHAR(20),
    api_key VARCHAR(255),
    welcome_message TEXT,
    auto_reply BOOLEAN DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255)
);

-- 19. Marketing Reviews
CREATE TABLE marketing_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id),
    patient_id UUID REFERENCES clinic_patients(id),
    patient_name VARCHAR(200),
    rating INTEGER,
    review_text TEXT,
    source VARCHAR(50) DEFAULT 'GOOGLE',
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255)
);
CREATE INDEX idx_review_clinic ON marketing_reviews(clinic_id);
CREATE INDEX idx_review_status ON marketing_reviews(status);

-- ============================================================
-- SEED DATA
-- ============================================================

-- Clinic Admin user
INSERT INTO users (id, phone, email, first_name, last_name, password_hash, tenant_id, active, created_by)
VALUES ('a0000000-0000-0000-0000-000000000002', '9876543211', 'clinicadmin@taevas.health', 'Clinic', 'Admin',
        '$2a$10$oTwmY0oHgs4n70CgBWEj3OMzZPhX/N.Q5Df05NhXmqU.FZPLcecRG',
        'e0000000-0000-0000-0000-000000000001', true, 'SYSTEM');
INSERT INTO user_roles (id, user_id, role)
VALUES ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 'CLINIC_ADMIN');

-- Doctor user
INSERT INTO users (id, phone, email, first_name, last_name, password_hash, tenant_id, active, created_by)
VALUES ('a0000000-0000-0000-0000-000000000003', '9876543212', 'doctor@taevas.health', 'Dr. Ravi', 'Kumar',
        '$2a$10$oTwmY0oHgs4n70CgBWEj3OMzZPhX/N.Q5Df05NhXmqU.FZPLcecRG',
        'e0000000-0000-0000-0000-000000000001', true, 'SYSTEM');
INSERT INTO user_roles (id, user_id, role)
VALUES ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000003', 'DOCTOR');

-- Patient user
INSERT INTO users (id, phone, email, first_name, last_name, password_hash, tenant_id, active, created_by)
VALUES ('a0000000-0000-0000-0000-000000000004', '9876543213', 'patient@taevas.health', 'Priya', 'Sharma',
        '$2a$10$oTwmY0oHgs4n70CgBWEj3OMzZPhX/N.Q5Df05NhXmqU.FZPLcecRG',
        'e0000000-0000-0000-0000-000000000001', true, 'SYSTEM');
INSERT INTO user_roles (id, user_id, role)
VALUES ('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000004', 'PATIENT');

-- Staff entry for doctor
INSERT INTO clinic_staff (id, clinic_id, user_id, name, role, specialization, phone, email, status)
VALUES ('a1000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000003', 'Dr. Ravi Kumar', 'DOCTOR', 'ENT Specialist',
        '9876543212', 'doctor@taevas.health', 'ACTIVE');

-- Patient entry
INSERT INTO clinic_patients (id, clinic_id, user_id, first_name, last_name, phone, email, gender, status)
VALUES ('b1000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000004', 'Priya', 'Sharma', '9876543213',
        'patient@taevas.health', 'Female', 'ACTIVE');

-- Sample appointment
INSERT INTO appointments (id, clinic_id, patient_id, doctor_id, appointment_date, start_time, type, status, token_number)
VALUES ('c1000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001',
        'b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001',
        CURRENT_DATE, '10:00', 'CONSULTATION', 'SCHEDULED', 1);

-- Clinic billing config
INSERT INTO clinic_billing_config (id, clinic_id, consultation_fee, follow_up_fee, tax_enabled, tax_rate, invoice_prefix)
VALUES ('cb000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001',
        500.00, 300.00, true, 18.00, 'TC-ENT-');

-- Clinic schedule config
INSERT INTO clinic_schedule_config (id, clinic_id, default_slot_duration, max_patients_per_slot, buffer_between_slots)
VALUES ('e1000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 15, 20, 5);
