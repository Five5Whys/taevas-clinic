-- ============================================================
-- H2 seed data (dev profile only, loaded via spring.sql.init)
-- Same data as V3__seed_data.sql but H2-compatible
-- ============================================================

-- 1. Super Admin User
INSERT INTO users (id, phone, email, first_name, last_name, password_hash, active, created_at, updated_at, created_by)
VALUES ('a0000000-0000-0000-0000-000000000001', '9876543210', 'admin@taevas.health', 'Taevas', 'Admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM');

INSERT INTO user_roles (id, user_id, role)
VALUES ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'SUPERADMIN');

-- 2. Countries
INSERT INTO countries (id, code, name, flag_emoji, status, currency_code, currency_symbol, tax_type, tax_rate, date_format, primary_language, secondary_language, regulatory_body, created_at, updated_at)
VALUES
    ('c0000000-0000-0000-0000-000000000001', 'IN', 'India',    '🇮🇳', 'ACTIVE', 'INR', '₹',  'GST', 18.00, 'dd/MM/yyyy', 'English',  'Hindi',   'NMC',  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('c0000000-0000-0000-0000-000000000002', 'TH', 'Thailand', '🇹🇭', 'ACTIVE', 'THB', '฿',  'VAT',  7.00, 'dd/MM/yyyy', 'Thai',     'English', 'MOPH', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('c0000000-0000-0000-0000-000000000003', 'MV', 'Maldives', '🇲🇻', 'PILOT',  'MVR', 'Rf', 'GST',  8.00, 'dd/MM/yyyy', 'Dhivehi',  'English', 'MOH',  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 3. Clinics (12)
INSERT INTO clinics (id, name, country_id, city, status, tenant_id, created_at, updated_at) VALUES
    ('d0000000-0000-0000-0000-000000000001', 'ENT Care Center',       'c0000000-0000-0000-0000-000000000001', 'Pune',       'ACTIVE', 'e0000000-0000-0000-0000-000000000001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('d0000000-0000-0000-0000-000000000002', 'Sai ENT Hospital',      'c0000000-0000-0000-0000-000000000001', 'Mumbai',     'ACTIVE', 'e0000000-0000-0000-0000-000000000002', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('d0000000-0000-0000-0000-000000000003', 'Devi ENT Clinic',       'c0000000-0000-0000-0000-000000000001', 'Hyderabad',  'ACTIVE', 'e0000000-0000-0000-0000-000000000003', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('d0000000-0000-0000-0000-000000000004', 'Apollo ENT',            'c0000000-0000-0000-0000-000000000001', 'Delhi',      'ACTIVE', 'e0000000-0000-0000-0000-000000000004', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('d0000000-0000-0000-0000-000000000005', 'Bangkok ENT Center',    'c0000000-0000-0000-0000-000000000002', 'Bangkok',    'ACTIVE', 'e0000000-0000-0000-0000-000000000005', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('d0000000-0000-0000-0000-000000000006', 'Siam Hearing Clinic',   'c0000000-0000-0000-0000-000000000002', 'Chiang Mai', 'ACTIVE', 'e0000000-0000-0000-0000-000000000006', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('d0000000-0000-0000-0000-000000000007', 'Thai ENT Specialists',  'c0000000-0000-0000-0000-000000000002', 'Phuket',     'ACTIVE', 'e0000000-0000-0000-0000-000000000007', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('d0000000-0000-0000-0000-000000000008', 'Pattaya Hearing Center','c0000000-0000-0000-0000-000000000002', 'Pattaya',    'PILOT',  'e0000000-0000-0000-0000-000000000008', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('d0000000-0000-0000-0000-000000000009', 'Male ENT Clinic',       'c0000000-0000-0000-0000-000000000003', 'Male',       'ACTIVE', 'e0000000-0000-0000-0000-000000000009', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('d0000000-0000-0000-0000-000000000010', 'Addu Health Center',    'c0000000-0000-0000-0000-000000000003', 'Addu City',  'PILOT',  'e0000000-0000-0000-0000-000000000010', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('d0000000-0000-0000-0000-000000000011', 'Hulhumale Clinic',      'c0000000-0000-0000-0000-000000000003', 'Hulhumale',  'PILOT',  'e0000000-0000-0000-0000-000000000011', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('d0000000-0000-0000-0000-000000000012', 'Thinadhoo Medical',     'c0000000-0000-0000-0000-000000000003', 'Thinadhoo',  'PILOT',  'e0000000-0000-0000-0000-000000000012', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 4. Feature Flags
INSERT INTO feature_flags (id, flag_key, name, description, locked, created_at, updated_at) VALUES
    ('f0000000-0000-0000-0000-000000000001', 'voice_ai',       'Voice AI',       'AI-powered voice dictation for clinical notes', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('f0000000-0000-0000-0000-000000000002', 'ai_rx',          'AI Rx',          'AI-assisted prescription generation',           false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('f0000000-0000-0000-0000-000000000003', 'abdm',           'ABDM',           'Ayushman Bharat Digital Mission integration',   false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('f0000000-0000-0000-0000-000000000004', 'nhso',           'NHSO',           'National Health Security Office integration',   false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('f0000000-0000-0000-0000-000000000005', 'moh_registry',   'MOH Registry',   'Ministry of Health registry integration',       false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('f0000000-0000-0000-0000-000000000006', 'device_capture', 'Device Capture', 'Medical device data capture',                   false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('f0000000-0000-0000-0000-000000000007', 'whatsapp',       'WhatsApp Bot',   'WhatsApp-based patient communication bot',      false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('f0000000-0000-0000-0000-000000000008', 'family_ehr',     'Family EHR',     'Family-linked electronic health records',       false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Feature Flag Country Toggles
INSERT INTO feature_flag_countries (id, feature_flag_id, country_id, enabled, created_at, updated_at) VALUES
    (RANDOM_UUID(), 'f0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', true,  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (RANDOM_UUID(), 'f0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', true,  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (RANDOM_UUID(), 'f0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000001', true,  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (RANDOM_UUID(), 'f0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000001', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (RANDOM_UUID(), 'f0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000001', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (RANDOM_UUID(), 'f0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000001', true,  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (RANDOM_UUID(), 'f0000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000001', true,  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (RANDOM_UUID(), 'f0000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000001', true,  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (RANDOM_UUID(), 'f0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002', true,  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (RANDOM_UUID(), 'f0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (RANDOM_UUID(), 'f0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000002', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (RANDOM_UUID(), 'f0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000002', true,  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (RANDOM_UUID(), 'f0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000002', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (RANDOM_UUID(), 'f0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000002', true,  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (RANDOM_UUID(), 'f0000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000002', true,  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (RANDOM_UUID(), 'f0000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000002', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (RANDOM_UUID(), 'f0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000003', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (RANDOM_UUID(), 'f0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000003', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (RANDOM_UUID(), 'f0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000003', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (RANDOM_UUID(), 'f0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000003', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (RANDOM_UUID(), 'f0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000003', true,  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (RANDOM_UUID(), 'f0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000003', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (RANDOM_UUID(), 'f0000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000003', true,  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (RANDOM_UUID(), 'f0000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000003', true,  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 5. Compliance Modules
INSERT INTO compliance_modules (id, country_id, module_key, module_name, description, enabled, sort_order, created_at, updated_at) VALUES
    (RANDOM_UUID(), 'c0000000-0000-0000-0000-000000000001', 'abha_id',        'ABHA ID Management', 'Ayushman Bharat Health Account identification', true,  1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (RANDOM_UUID(), 'c0000000-0000-0000-0000-000000000001', 'fhir_r4',        'FHIR R4',            'HL7 FHIR R4 standard compliance',               true,  2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (RANDOM_UUID(), 'c0000000-0000-0000-0000-000000000001', 'nmc_compliance',  'NMC Compliance',     'National Medical Commission compliance',         true,  3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (RANDOM_UUID(), 'c0000000-0000-0000-0000-000000000001', 'data_encryption', 'Data Encryption',    'End-to-end AES-256 + TLS 1.3 encryption',       true,  4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (RANDOM_UUID(), 'c0000000-0000-0000-0000-000000000002', 'nhso_claims',     'NHSO Claims',        'National Health Security Office claims',         true,  1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (RANDOM_UUID(), 'c0000000-0000-0000-0000-000000000002', 'pdpa_compliance', 'PDPA Compliance',    'Personal Data Protection Act compliance',        true,  2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (RANDOM_UUID(), 'c0000000-0000-0000-0000-000000000002', 'moph_standards',  'MOPH Standards',     'Ministry of Public Health reporting',            true,  3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (RANDOM_UUID(), 'c0000000-0000-0000-0000-000000000003', 'moh_registry',    'MOH Registry',       'Ministry of Health registry compliance',         true,  1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (RANDOM_UUID(), 'c0000000-0000-0000-0000-000000000003', 'data_encryption', 'Data Encryption',    'End-to-end encryption compliance',               false, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 6. Billing Configs
INSERT INTO billing_configs (id, country_id, currency_symbol, currency_code, tax_rate, tax_split, claim_code, invoice_prefix, invoice_format, toggles, created_at, updated_at) VALUES
    (RANDOM_UUID(), 'c0000000-0000-0000-0000-000000000001', '₹',  'INR', 18.00, 'CGST 9% + SGST 9%', NULL,     'TC-IN-', 'GST Tax Invoice',  '{"abdmDhis":true,"upiQr":true}',                CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (RANDOM_UUID(), 'c0000000-0000-0000-0000-000000000002', '฿',  'THB',  7.00, NULL,                 'CLM-TH', 'TC-TH-', 'NHSO Standard',    '{"nhsoAutoSubmit":true,"promptPayQr":true}',     CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (RANDOM_UUID(), 'c0000000-0000-0000-0000-000000000003', 'Rf', 'MVR',  0.00, NULL,                 NULL,     'TC-MV-', 'Standard Invoice',  '{"localPaymentGateway":true}',                   CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 7. Locale Settings
INSERT INTO locale_settings (id, country_id, primary_language, secondary_language, date_format, weight_unit, height_unit, timezone, created_at, updated_at) VALUES
    (RANDOM_UUID(), 'c0000000-0000-0000-0000-000000000001', 'English',  'Hindi',   'DD/MM/YYYY', 'kg', 'cm', 'Asia/Kolkata',   CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (RANDOM_UUID(), 'c0000000-0000-0000-0000-000000000002', 'Thai',     'English', 'DD/MM/YYYY', 'kg', 'cm', 'Asia/Bangkok',   CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (RANDOM_UUID(), 'c0000000-0000-0000-0000-000000000003', 'Dhivehi',  'English', 'DD/MM/YYYY', 'kg', 'cm', 'Indian/Maldives',CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 8. ID Format Templates
INSERT INTO id_format_templates (id, country_id, entity_type, prefix, entity_code, separator, padding, starts_at, locked, created_at, updated_at) VALUES
    (RANDOM_UUID(), 'c0000000-0000-0000-0000-000000000001', 'Patient',   'PT', 'IN', '-', 5, 1, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (RANDOM_UUID(), 'c0000000-0000-0000-0000-000000000001', 'Doctor',    'DR', 'IN', '-', 5, 1, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (RANDOM_UUID(), 'c0000000-0000-0000-0000-000000000001', 'Encounter', 'EN', 'IN', '-', 5, 1, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (RANDOM_UUID(), 'c0000000-0000-0000-0000-000000000001', 'Clinic',    'CL', 'IN', '-', 5, 1, true,  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (RANDOM_UUID(), 'c0000000-0000-0000-0000-000000000002', 'Patient',   'PT', 'TH', '-', 5, 1, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (RANDOM_UUID(), 'c0000000-0000-0000-0000-000000000002', 'Doctor',    'DR', 'TH', '-', 5, 1, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (RANDOM_UUID(), 'c0000000-0000-0000-0000-000000000002', 'Encounter', 'EN', 'TH', '-', 5, 1, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (RANDOM_UUID(), 'c0000000-0000-0000-0000-000000000002', 'Clinic',    'CL', 'TH', '-', 5, 1, true,  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (RANDOM_UUID(), 'c0000000-0000-0000-0000-000000000003', 'Patient',   'PT', 'MV', '-', 5, 1, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (RANDOM_UUID(), 'c0000000-0000-0000-0000-000000000003', 'Doctor',    'DR', 'MV', '-', 5, 1, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (RANDOM_UUID(), 'c0000000-0000-0000-0000-000000000003', 'Encounter', 'EN', 'MV', '-', 5, 1, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (RANDOM_UUID(), 'c0000000-0000-0000-0000-000000000003', 'Clinic',    'CL', 'MV', '-', 5, 1, true,  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 9. Field Definitions
INSERT INTO field_definitions (id, scope, country_id, section, field_key, label, field_type, required, locked, removable, sort_order, created_at, updated_at) VALUES
    (RANDOM_UUID(), 'GLOBAL',  NULL,                                      'registration', 'full_name',     'Full Name',     'text',   true,  true,  false, 1,  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (RANDOM_UUID(), 'GLOBAL',  NULL,                                      'registration', 'date_of_birth', 'Date of Birth', 'date',   true,  true,  false, 2,  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (RANDOM_UUID(), 'GLOBAL',  NULL,                                      'registration', 'gender',        'Gender',        'select', true,  true,  false, 3,  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (RANDOM_UUID(), 'GLOBAL',  NULL,                                      'registration', 'phone',         'Phone',         'tel',    true,  true,  false, 4,  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (RANDOM_UUID(), 'COUNTRY', 'c0000000-0000-0000-0000-000000000001',    'registration', 'abha_id',       'ABHA ID',       'text',   false, false, false, 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (RANDOM_UUID(), 'COUNTRY', 'c0000000-0000-0000-0000-000000000002',    'registration', 'nhso_id',       'NHSO ID',       'text',   false, false, false, 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (RANDOM_UUID(), 'COUNTRY', 'c0000000-0000-0000-0000-000000000003',    'registration', 'moh_id',        'MOH ID',        'text',   false, false, false, 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (RANDOM_UUID(), 'GLOBAL',  NULL,                                      'registration', 'blood_group',   'Blood Group',   'select', false, false, true,  20, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (RANDOM_UUID(), 'GLOBAL',  NULL,                                      'registration', 'referred_by',   'Referred By',   'text',   false, false, true,  21, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (RANDOM_UUID(), 'GLOBAL',  NULL,                                      'soap',         'chief_complaint','Chief Complaint','textarea',true, true,  false, 1,  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (RANDOM_UUID(), 'GLOBAL',  NULL,                                      'soap',         'hpi',           'HPI',            'textarea',true, true,  false, 2,  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (RANDOM_UUID(), 'GLOBAL',  NULL,                                      'soap',         'ent_exam',      'ENT Exam',       'textarea',true, true,  false, 3,  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (RANDOM_UUID(), 'GLOBAL',  NULL,                                      'soap',         'abha_verification','ABHA Verification','text',false,false, false, 4,  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (RANDOM_UUID(), 'GLOBAL',  NULL,                                      'soap',         'icd10_code',    'ICD-10 Code',    'text',   false, false, false, 5,  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
