-- ============================================================
-- V3__seed_data.sql - Seed data matching entity models
-- ============================================================

-- 1. Super Admin User
INSERT INTO users (id, phone, email, first_name, last_name, password_hash, active, created_by)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    '9876543210',
    'admin@taevas.health',
    'Taevas',
    'Admin',
    '$2a$10$oTwmY0oHgs4n70CgBWEj3OMzZPhX/N.Q5Df05NhXmqU.FZPLcecRG',
    true,
    'SYSTEM'
);

INSERT INTO user_roles (id, user_id, role)
VALUES ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'SUPERADMIN');

-- 2. Countries
INSERT INTO countries (id, code, name, flag_emoji, status, currency_code, currency_symbol, tax_type, tax_rate, date_format, primary_language, secondary_language, regulatory_body)
VALUES
    ('c0000000-0000-0000-0000-000000000001', 'IN', 'India',    '🇮🇳', 'ACTIVE', 'INR', '₹',  'GST', 18.00, 'dd/MM/yyyy', 'English',  'Hindi',   'NMC'),
    ('c0000000-0000-0000-0000-000000000002', 'TH', 'Thailand', '🇹🇭', 'ACTIVE', 'THB', '฿',  'VAT',  7.00, 'dd/MM/yyyy', 'Thai',     'English', 'MOPH'),
    ('c0000000-0000-0000-0000-000000000003', 'MV', 'Maldives', '🇲🇻', 'PILOT',  'MVR', 'Rf', 'GST',  8.00, 'dd/MM/yyyy', 'Dhivehi',  'English', 'MOH');

-- 3. Clinics (12 total)
INSERT INTO clinics (id, name, country_id, city, status, tenant_id)
VALUES
    ('d0000000-0000-0000-0000-000000000001', 'ENT Care Center',       'c0000000-0000-0000-0000-000000000001', 'Pune',       'ACTIVE', 'e0000000-0000-0000-0000-000000000001'),
    ('d0000000-0000-0000-0000-000000000002', 'Sai ENT Hospital',      'c0000000-0000-0000-0000-000000000001', 'Mumbai',     'ACTIVE', 'e0000000-0000-0000-0000-000000000002'),
    ('d0000000-0000-0000-0000-000000000003', 'Devi ENT Clinic',       'c0000000-0000-0000-0000-000000000001', 'Hyderabad',  'ACTIVE', 'e0000000-0000-0000-0000-000000000003'),
    ('d0000000-0000-0000-0000-000000000004', 'Apollo ENT',            'c0000000-0000-0000-0000-000000000001', 'Delhi',      'ACTIVE', 'e0000000-0000-0000-0000-000000000004'),
    ('d0000000-0000-0000-0000-000000000005', 'Bangkok ENT Center',    'c0000000-0000-0000-0000-000000000002', 'Bangkok',    'ACTIVE', 'e0000000-0000-0000-0000-000000000005'),
    ('d0000000-0000-0000-0000-000000000006', 'Siam Hearing Clinic',   'c0000000-0000-0000-0000-000000000002', 'Chiang Mai', 'ACTIVE', 'e0000000-0000-0000-0000-000000000006'),
    ('d0000000-0000-0000-0000-000000000007', 'Thai ENT Specialists',  'c0000000-0000-0000-0000-000000000002', 'Phuket',     'ACTIVE', 'e0000000-0000-0000-0000-000000000007'),
    ('d0000000-0000-0000-0000-000000000008', 'Pattaya Hearing Center','c0000000-0000-0000-0000-000000000002', 'Pattaya',    'PILOT',  'e0000000-0000-0000-0000-000000000008'),
    ('d0000000-0000-0000-0000-000000000009', 'Male ENT Clinic',       'c0000000-0000-0000-0000-000000000003', 'Male',       'ACTIVE', 'e0000000-0000-0000-0000-000000000009'),
    ('d0000000-0000-0000-0000-000000000010', 'Addu Health Center',    'c0000000-0000-0000-0000-000000000003', 'Addu City',  'PILOT',  'e0000000-0000-0000-0000-000000000010'),
    ('d0000000-0000-0000-0000-000000000011', 'Hulhumale Clinic',      'c0000000-0000-0000-0000-000000000003', 'Hulhumale',  'PILOT',  'e0000000-0000-0000-0000-000000000011'),
    ('d0000000-0000-0000-0000-000000000012', 'Thinadhoo Medical',     'c0000000-0000-0000-0000-000000000003', 'Thinadhoo',  'PILOT',  'e0000000-0000-0000-0000-000000000012');

-- 4. Feature Flags (8) with locked=false default
INSERT INTO feature_flags (id, flag_key, name, description, locked)
VALUES
    ('f0000000-0000-0000-0000-000000000001', 'voice_ai',       'Voice AI',       'AI-powered voice dictation for clinical notes', false),
    ('f0000000-0000-0000-0000-000000000002', 'ai_rx',          'AI Rx',          'AI-assisted prescription generation',           false),
    ('f0000000-0000-0000-0000-000000000003', 'abdm',           'ABDM',           'Ayushman Bharat Digital Mission integration',   false),
    ('f0000000-0000-0000-0000-000000000004', 'nhso',           'NHSO',           'National Health Security Office integration',   false),
    ('f0000000-0000-0000-0000-000000000005', 'moh_registry',   'MOH Registry',   'Ministry of Health registry integration',       false),
    ('f0000000-0000-0000-0000-000000000006', 'device_capture', 'Device Capture', 'Medical device data capture',                   false),
    ('f0000000-0000-0000-0000-000000000007', 'whatsapp',       'WhatsApp Bot',   'WhatsApp-based patient communication bot',      false),
    ('f0000000-0000-0000-0000-000000000008', 'family_ehr',     'Family EHR',     'Family-linked electronic health records',       false);

-- Feature Flag per-country toggles
INSERT INTO feature_flag_countries (feature_flag_id, country_id, enabled)
VALUES
    -- India: voice_ai=ON, ai_rx=ON, abdm=ON, nhso=OFF, moh=OFF, device=ON, whatsapp=ON, family=ON
    ('f0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', true),
    ('f0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', true),
    ('f0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000001', true),
    ('f0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000001', false),
    ('f0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000001', false),
    ('f0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000001', true),
    ('f0000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000001', true),
    ('f0000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000001', true),
    -- Thailand: voice_ai=ON, ai_rx=OFF, abdm=OFF, nhso=ON, moh=OFF, device=ON, whatsapp=ON, family=OFF
    ('f0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002', true),
    ('f0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', false),
    ('f0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000002', false),
    ('f0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000002', true),
    ('f0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000002', false),
    ('f0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000002', true),
    ('f0000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000002', true),
    ('f0000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000002', false),
    -- Maldives: voice_ai=OFF, ai_rx=OFF, abdm=OFF, nhso=OFF, moh=ON, device=OFF, whatsapp=ON, family=ON
    ('f0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000003', false),
    ('f0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000003', false),
    ('f0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000003', false),
    ('f0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000003', false),
    ('f0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000003', true),
    ('f0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000003', false),
    ('f0000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000003', true),
    ('f0000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000003', true);

-- 5. Compliance Modules (enabled boolean + sort_order)
INSERT INTO compliance_modules (country_id, module_key, module_name, description, enabled, sort_order)
VALUES
    -- India
    ('c0000000-0000-0000-0000-000000000001', 'abha_id',        'ABHA ID Management',  'Ayushman Bharat Health Account identification', true, 1),
    ('c0000000-0000-0000-0000-000000000001', 'fhir_r4',        'FHIR R4',             'HL7 FHIR R4 standard compliance',               true, 2),
    ('c0000000-0000-0000-0000-000000000001', 'nmc_compliance',  'NMC Compliance',      'National Medical Commission compliance',         true, 3),
    ('c0000000-0000-0000-0000-000000000001', 'data_encryption', 'Data Encryption',     'End-to-end AES-256 + TLS 1.3 encryption',       true, 4),
    -- Thailand
    ('c0000000-0000-0000-0000-000000000002', 'nhso_claims',     'NHSO Claims',         'National Health Security Office claims',         true, 1),
    ('c0000000-0000-0000-0000-000000000002', 'pdpa_compliance', 'PDPA Compliance',     'Personal Data Protection Act compliance',        true, 2),
    ('c0000000-0000-0000-0000-000000000002', 'moph_standards',  'MOPH Standards',      'Ministry of Public Health reporting',            true, 3),
    -- Maldives
    ('c0000000-0000-0000-0000-000000000003', 'moh_registry',    'MOH Registry',        'Ministry of Health registry compliance',         true, 1),
    ('c0000000-0000-0000-0000-000000000003', 'data_encryption', 'Data Encryption',     'End-to-end encryption compliance',               false, 2);

-- 6. Billing Configs (tax_split, claim_code, toggles)
INSERT INTO billing_configs (country_id, currency_symbol, currency_code, tax_rate, tax_split, claim_code, invoice_prefix, invoice_format, toggles)
VALUES
    ('c0000000-0000-0000-0000-000000000001', '₹',  'INR', 18.00, 'CGST 9% + SGST 9%', NULL,     'TC-IN-', 'GST Tax Invoice',  '{"abdmDhis":true,"upiQr":true}'),
    ('c0000000-0000-0000-0000-000000000002', '฿',  'THB',  7.00, NULL,                 'CLM-TH', 'TC-TH-', 'NHSO Standard',    '{"nhsoAutoSubmit":true,"promptPayQr":true}'),
    ('c0000000-0000-0000-0000-000000000003', 'Rf', 'MVR',  0.00, NULL,                 NULL,     'TC-MV-', 'Standard Invoice',  '{"localPaymentGateway":true}');

-- 7. Locale Settings
INSERT INTO locale_settings (country_id, primary_language, secondary_language, date_format, weight_unit, height_unit, timezone)
VALUES
    ('c0000000-0000-0000-0000-000000000001', 'English',  'Hindi',   'DD/MM/YYYY', 'kg', 'cm', 'Asia/Kolkata'),
    ('c0000000-0000-0000-0000-000000000002', 'Thai',     'English', 'DD/MM/YYYY', 'kg', 'cm', 'Asia/Bangkok'),
    ('c0000000-0000-0000-0000-000000000003', 'Dhivehi',  'English', 'DD/MM/YYYY', 'kg', 'cm', 'Indian/Maldives');

-- 8. ID Format Templates (entity_code, separator, padding, starts_at, locked)
INSERT INTO id_format_templates (country_id, entity_type, prefix, entity_code, separator, padding, starts_at, locked)
VALUES
    -- India
    ('c0000000-0000-0000-0000-000000000001', 'Patient',   'PT', 'IN', '-', 5, 1, false),
    ('c0000000-0000-0000-0000-000000000001', 'Doctor',    'DR', 'IN', '-', 5, 1, false),
    ('c0000000-0000-0000-0000-000000000001', 'Encounter', 'EN', 'IN', '-', 5, 1, false),
    ('c0000000-0000-0000-0000-000000000001', 'Clinic',    'CL', 'IN', '-', 5, 1, true),
    -- Thailand
    ('c0000000-0000-0000-0000-000000000002', 'Patient',   'PT', 'TH', '-', 5, 1, false),
    ('c0000000-0000-0000-0000-000000000002', 'Doctor',    'DR', 'TH', '-', 5, 1, false),
    ('c0000000-0000-0000-0000-000000000002', 'Encounter', 'EN', 'TH', '-', 5, 1, false),
    ('c0000000-0000-0000-0000-000000000002', 'Clinic',    'CL', 'TH', '-', 5, 1, true),
    -- Maldives
    ('c0000000-0000-0000-0000-000000000003', 'Patient',   'PT', 'MV', '-', 5, 1, false),
    ('c0000000-0000-0000-0000-000000000003', 'Doctor',    'DR', 'MV', '-', 5, 1, false),
    ('c0000000-0000-0000-0000-000000000003', 'Encounter', 'EN', 'MV', '-', 5, 1, false),
    ('c0000000-0000-0000-0000-000000000003', 'Clinic',    'CL', 'MV', '-', 5, 1, true);

-- 9. Field Definitions (sort_order, no options column in model)
-- Global locked fields (Registration)
INSERT INTO field_definitions (scope, country_id, section, field_key, label, field_type, required, locked, removable, sort_order)
VALUES
    ('GLOBAL', NULL, 'registration', 'full_name',     'Full Name',     'text',   true,  true,  false, 1),
    ('GLOBAL', NULL, 'registration', 'date_of_birth', 'Date of Birth', 'date',   true,  true,  false, 2),
    ('GLOBAL', NULL, 'registration', 'gender',        'Gender',        'select', true,  true,  false, 3),
    ('GLOBAL', NULL, 'registration', 'phone',         'Phone',         'tel',    true,  true,  false, 4);

-- Country-specific fields
INSERT INTO field_definitions (scope, country_id, section, field_key, label, field_type, required, locked, removable, sort_order)
VALUES
    ('COUNTRY', 'c0000000-0000-0000-0000-000000000001', 'registration', 'abha_id', 'ABHA ID', 'text', false, false, false, 10),
    ('COUNTRY', 'c0000000-0000-0000-0000-000000000002', 'registration', 'nhso_id', 'NHSO ID', 'text', false, false, false, 10),
    ('COUNTRY', 'c0000000-0000-0000-0000-000000000003', 'registration', 'moh_id',  'MOH ID',  'text', false, false, false, 10);

-- Optional removable fields
INSERT INTO field_definitions (scope, country_id, section, field_key, label, field_type, required, locked, removable, sort_order)
VALUES
    ('GLOBAL', NULL, 'registration', 'blood_group', 'Blood Group', 'select', false, false, true, 20),
    ('GLOBAL', NULL, 'registration', 'referred_by', 'Referred By', 'text',   false, false, true, 21);

-- SOAP fields (global)
INSERT INTO field_definitions (scope, country_id, section, field_key, label, field_type, required, locked, removable, sort_order)
VALUES
    ('GLOBAL', NULL, 'soap', 'chief_complaint',   'Chief Complaint',   'textarea', true,  true,  false, 1),
    ('GLOBAL', NULL, 'soap', 'hpi',               'HPI',               'textarea', true,  true,  false, 2),
    ('GLOBAL', NULL, 'soap', 'ent_exam',          'ENT Exam',          'textarea', true,  true,  false, 3),
    ('GLOBAL', NULL, 'soap', 'abha_verification', 'ABHA Verification', 'text',     false, false, false, 4),
    ('GLOBAL', NULL, 'soap', 'icd10_code',        'ICD-10 Code',       'text',     false, false, false, 5);
