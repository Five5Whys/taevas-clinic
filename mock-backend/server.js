const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 8080;
const JWT_SECRET = 'taevas-clinic-dev-secret-key-2026';

app.use(cors({ origin: '*' }));
app.use(express.json());

// ─── Helper ────────────────────────────────────────────────────────────────────
const wrap = (data) => ({ success: true, message: 'OK', data, timestamp: new Date().toISOString() });
const uuid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
  const r = Math.random() * 16 | 0;
  return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
});

// ─── Auth Middleware ────────────────────────────────────────────────────────────
function authGuard(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Unauthorized' });
  try {
    req.user = jwt.verify(header.slice(7), JWT_SECRET);
    next();
  } catch { return res.status(401).json({ success: false, message: 'Invalid token' }); }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  SEED DATA
// ═══════════════════════════════════════════════════════════════════════════════

const USERS = {
  'admin@taevas.health': { id: 'a0000000-0000-0000-0000-000000000001', phone: '9876543210', email: 'admin@taevas.health', firstName: 'Taevas', lastName: 'Admin', role: 'SUPERADMIN', profilePicture: null },
  '9876543210':          { id: 'a0000000-0000-0000-0000-000000000001', phone: '9876543210', email: 'admin@taevas.health', firstName: 'Taevas', lastName: 'Admin', role: 'SUPERADMIN', profilePicture: null },
};

const COUNTRIES = [
  { id: 'c0000000-0000-0000-0000-000000000001', code: 'IN', name: 'India',    flagEmoji: '\u{1F1EE}\u{1F1F3}', status: 'ACTIVE', currencyCode: 'INR', currencySymbol: '\u20B9', taxType: 'GST', taxRate: 18.00, dateFormat: 'dd/MM/yyyy', primaryLanguage: 'English', secondaryLanguage: 'Hindi',   regulatoryBodies: ['NMC', 'ABDM', 'FHIR R4'],  clinicCount: 4, doctorCount: 31 },
  { id: 'c0000000-0000-0000-0000-000000000002', code: 'TH', name: 'Thailand', flagEmoji: '\u{1F1F9}\u{1F1ED}', status: 'ACTIVE', currencyCode: 'THB', currencySymbol: '\u0E3F', taxType: 'VAT', taxRate: 7.00,  dateFormat: 'dd/MM/yyyy', primaryLanguage: 'Thai',    secondaryLanguage: 'English', regulatoryBodies: ['MOPH', 'NHSO', 'PDPA'], clinicCount: 4, doctorCount: 11 },
  { id: 'c0000000-0000-0000-0000-000000000003', code: 'MV', name: 'Maldives', flagEmoji: '\u{1F1F2}\u{1F1FB}', status: 'PILOT',  currencyCode: 'MVR', currencySymbol: 'Rf',     taxType: 'GST', taxRate: 8.00,  dateFormat: 'dd/MM/yyyy', primaryLanguage: 'Dhivehi', secondaryLanguage: 'English', regulatoryBodies: ['MOH'],  clinicCount: 4, doctorCount: 5 },
];

const CLINICS = [
  { id: 'd0000000-0000-0000-0000-000000000001', countryId: 'c0000000-0000-0000-0000-000000000001', tenantId: 'e0000000-0000-0000-0000-000000000001', name: 'ENT Care Center',       city: 'Pune',       state: 'Maharashtra', address: '12 MG Road', pincode: '411001', phone: '+919876000001', email: 'pune@taevas.health',      registrationNumber: 'MH-CL-001', licenseNumber: 'MH-ENT-2024-001', licenseValidUntil: '2027-03-31', logoUrl: null, status: 'ACTIVE', countryName: 'India',    countryFlag: 'IN', complianceTags: ['ABDM', 'FHIR R4', 'NMC'] },
  { id: 'd0000000-0000-0000-0000-000000000002', countryId: 'c0000000-0000-0000-0000-000000000001', tenantId: 'e0000000-0000-0000-0000-000000000002', name: 'Sai ENT Hospital',      city: 'Mumbai',     state: 'Maharashtra', address: '45 Linking Road', pincode: '400050', phone: '+919876000002', email: 'mumbai@taevas.health',   registrationNumber: 'MH-CL-002', licenseNumber: 'MH-ENT-2024-002', licenseValidUntil: '2027-06-30', logoUrl: null, status: 'ACTIVE', countryName: 'India',    countryFlag: 'IN', complianceTags: ['ABDM', 'NMC'] },
  { id: 'd0000000-0000-0000-0000-000000000003', countryId: 'c0000000-0000-0000-0000-000000000001', tenantId: 'e0000000-0000-0000-0000-000000000003', name: 'Devi ENT Clinic',       city: 'Hyderabad',  state: 'Telangana',   address: '8 Jubilee Hills', pincode: '500033', phone: '+919876000003', email: 'hyd@taevas.health',      registrationNumber: 'TS-CL-001', licenseNumber: 'TS-ENT-2024-001', licenseValidUntil: '2027-01-15', logoUrl: null, status: 'ACTIVE', countryName: 'India',    countryFlag: 'IN', complianceTags: ['ABDM'] },
  { id: 'd0000000-0000-0000-0000-000000000004', countryId: 'c0000000-0000-0000-0000-000000000001', tenantId: 'e0000000-0000-0000-0000-000000000004', name: 'Apollo ENT',            city: 'Delhi',      state: 'Delhi',       address: '1 Connaught Place', pincode: '110001', phone: '+919876000004', email: 'delhi@taevas.health',   registrationNumber: 'DL-CL-001', licenseNumber: 'DL-ENT-2024-001', licenseValidUntil: '2027-09-30', logoUrl: null, status: 'ACTIVE', countryName: 'India',    countryFlag: 'IN', complianceTags: ['ABDM', 'FHIR R4', 'NMC'] },
  { id: 'd0000000-0000-0000-0000-000000000005', countryId: 'c0000000-0000-0000-0000-000000000002', tenantId: 'e0000000-0000-0000-0000-000000000005', name: 'Bangkok ENT Center',    city: 'Bangkok',    state: null, address: '99 Sukhumvit', pincode: '10110', phone: '+66890000001', email: 'bkk@taevas.health',       registrationNumber: 'TH-CL-001', licenseNumber: 'TH-ENT-2024-001', licenseValidUntil: '2027-12-31', logoUrl: null, status: 'ACTIVE', countryName: 'Thailand', countryFlag: 'TH', complianceTags: ['NHSO', 'PDPA'] },
  { id: 'd0000000-0000-0000-0000-000000000006', countryId: 'c0000000-0000-0000-0000-000000000002', tenantId: 'e0000000-0000-0000-0000-000000000006', name: 'Siam Hearing Clinic',   city: 'Chiang Mai', state: null, address: '22 Nimmanhaemin', pincode: '50200', phone: '+66890000002', email: 'cm@taevas.health',       registrationNumber: 'TH-CL-002', licenseNumber: 'TH-ENT-2024-002', licenseValidUntil: '2027-06-30', logoUrl: null, status: 'ACTIVE', countryName: 'Thailand', countryFlag: 'TH', complianceTags: ['NHSO'] },
  { id: 'd0000000-0000-0000-0000-000000000007', countryId: 'c0000000-0000-0000-0000-000000000002', tenantId: 'e0000000-0000-0000-0000-000000000007', name: 'Thai ENT Specialists',  city: 'Phuket',     state: null, address: '5 Patong Beach', pincode: '83150', phone: '+66890000003', email: 'phuket@taevas.health',    registrationNumber: 'TH-CL-003', licenseNumber: 'TH-ENT-2024-003', licenseValidUntil: '2027-03-31', logoUrl: null, status: 'ACTIVE', countryName: 'Thailand', countryFlag: 'TH', complianceTags: ['NHSO', 'MOPH'] },
  { id: 'd0000000-0000-0000-0000-000000000008', countryId: 'c0000000-0000-0000-0000-000000000002', tenantId: 'e0000000-0000-0000-0000-000000000008', name: 'Pattaya Hearing Center',city: 'Pattaya',    state: null, address: '12 Walking Street', pincode: '20150', phone: '+66890000004', email: 'pattaya@taevas.health', registrationNumber: 'TH-CL-004', licenseNumber: 'TH-ENT-2024-004', licenseValidUntil: '2027-09-30', logoUrl: null, status: 'PILOT',  countryName: 'Thailand', countryFlag: 'TH', complianceTags: [] },
  { id: 'd0000000-0000-0000-0000-000000000009', countryId: 'c0000000-0000-0000-0000-000000000003', tenantId: 'e0000000-0000-0000-0000-000000000009', name: 'Male ENT Clinic',       city: 'Male',       state: null, address: '1 Majeedhee Magu', pincode: '20001', phone: '+9607000001', email: 'male@taevas.health',      registrationNumber: 'MV-CL-001', licenseNumber: 'MV-ENT-2024-001', licenseValidUntil: '2027-12-31', logoUrl: null, status: 'ACTIVE', countryName: 'Maldives', countryFlag: 'MV', complianceTags: ['MOH'] },
  { id: 'd0000000-0000-0000-0000-000000000010', countryId: 'c0000000-0000-0000-0000-000000000003', tenantId: 'e0000000-0000-0000-0000-000000000010', name: 'Addu Health Center',    city: 'Addu City',  state: null, address: '5 Hithadhoo', pincode: '19060', phone: '+9607000002', email: 'addu@taevas.health',       registrationNumber: 'MV-CL-002', licenseNumber: 'MV-ENT-2024-002', licenseValidUntil: '2027-06-30', logoUrl: null, status: 'PILOT',  countryName: 'Maldives', countryFlag: 'MV', complianceTags: [] },
  { id: 'd0000000-0000-0000-0000-000000000011', countryId: 'c0000000-0000-0000-0000-000000000003', tenantId: 'e0000000-0000-0000-0000-000000000011', name: 'Hulhumale Clinic',      city: 'Hulhumale',  state: null, address: '3 Central Park', pincode: '23000', phone: '+9607000003', email: 'hulhu@taevas.health',     registrationNumber: 'MV-CL-003', licenseNumber: 'MV-ENT-2024-003', licenseValidUntil: '2027-03-31', logoUrl: null, status: 'PILOT',  countryName: 'Maldives', countryFlag: 'MV', complianceTags: [] },
  { id: 'd0000000-0000-0000-0000-000000000012', countryId: 'c0000000-0000-0000-0000-000000000003', tenantId: 'e0000000-0000-0000-0000-000000000012', name: 'Thinadhoo Medical',     city: 'Thinadhoo',  state: null, address: '8 Main Road', pincode: '17000', phone: '+9607000004', email: 'thina@taevas.health',      registrationNumber: 'MV-CL-004', licenseNumber: 'MV-ENT-2024-004', licenseValidUntil: '2027-09-30', logoUrl: null, status: 'PILOT',  countryName: 'Maldives', countryFlag: 'MV', complianceTags: [] },
];

const FEATURE_FLAGS = [
  { id: 'f0000000-0000-0000-0000-000000000001', key: 'voice_ai',       name: 'Voice AI',       description: 'AI-powered voice dictation for clinical notes', locked: false, countries: { 'c0000000-0000-0000-0000-000000000001': true,  'c0000000-0000-0000-0000-000000000002': true,  'c0000000-0000-0000-0000-000000000003': false } },
  { id: 'f0000000-0000-0000-0000-000000000002', key: 'ai_rx',          name: 'AI Rx',          description: 'AI-assisted prescription generation',           locked: false, countries: { 'c0000000-0000-0000-0000-000000000001': true,  'c0000000-0000-0000-0000-000000000002': false, 'c0000000-0000-0000-0000-000000000003': false } },
  { id: 'f0000000-0000-0000-0000-000000000003', key: 'abdm',           name: 'ABDM',           description: 'Ayushman Bharat Digital Mission integration',   locked: false, countries: { 'c0000000-0000-0000-0000-000000000001': true,  'c0000000-0000-0000-0000-000000000002': false, 'c0000000-0000-0000-0000-000000000003': false } },
  { id: 'f0000000-0000-0000-0000-000000000004', key: 'nhso',           name: 'NHSO',           description: 'National Health Security Office integration',   locked: false, countries: { 'c0000000-0000-0000-0000-000000000001': false, 'c0000000-0000-0000-0000-000000000002': true,  'c0000000-0000-0000-0000-000000000003': false } },
  { id: 'f0000000-0000-0000-0000-000000000005', key: 'moh_registry',   name: 'MOH Registry',   description: 'Ministry of Health registry integration',       locked: false, countries: { 'c0000000-0000-0000-0000-000000000001': false, 'c0000000-0000-0000-0000-000000000002': false, 'c0000000-0000-0000-0000-000000000003': true } },
  { id: 'f0000000-0000-0000-0000-000000000006', key: 'device_capture', name: 'Device Capture', description: 'Medical device data capture',                   locked: false, countries: { 'c0000000-0000-0000-0000-000000000001': true,  'c0000000-0000-0000-0000-000000000002': true,  'c0000000-0000-0000-0000-000000000003': false } },
  { id: 'f0000000-0000-0000-0000-000000000007', key: 'whatsapp',       name: 'WhatsApp Bot',   description: 'WhatsApp-based patient communication bot',      locked: false, countries: { 'c0000000-0000-0000-0000-000000000001': true,  'c0000000-0000-0000-0000-000000000002': true,  'c0000000-0000-0000-0000-000000000003': true } },
  { id: 'f0000000-0000-0000-0000-000000000008', key: 'family_ehr',     name: 'Family EHR',     description: 'Family-linked electronic health records',       locked: false, countries: { 'c0000000-0000-0000-0000-000000000001': true,  'c0000000-0000-0000-0000-000000000002': false, 'c0000000-0000-0000-0000-000000000003': true } },
];

const COMPLIANCE_MODULES = {
  'c0000000-0000-0000-0000-000000000001': [
    { id: uuid(), countryId: 'c0000000-0000-0000-0000-000000000001', moduleKey: 'abha_id',        moduleName: 'ABHA ID Management', description: 'Ayushman Bharat Health Account identification', enabled: true,  sortOrder: 1 },
    { id: uuid(), countryId: 'c0000000-0000-0000-0000-000000000001', moduleKey: 'fhir_r4',        moduleName: 'FHIR R4',            description: 'HL7 FHIR R4 standard compliance',               enabled: true,  sortOrder: 2 },
    { id: uuid(), countryId: 'c0000000-0000-0000-0000-000000000001', moduleKey: 'nmc_compliance',  moduleName: 'NMC Compliance',     description: 'National Medical Commission compliance',         enabled: true,  sortOrder: 3 },
    { id: uuid(), countryId: 'c0000000-0000-0000-0000-000000000001', moduleKey: 'data_encryption', moduleName: 'Data Encryption',    description: 'End-to-end AES-256 + TLS 1.3 encryption',       enabled: true,  sortOrder: 4 },
  ],
  'c0000000-0000-0000-0000-000000000002': [
    { id: uuid(), countryId: 'c0000000-0000-0000-0000-000000000002', moduleKey: 'nhso_claims',     moduleName: 'NHSO Claims',        description: 'National Health Security Office claims',         enabled: true,  sortOrder: 1 },
    { id: uuid(), countryId: 'c0000000-0000-0000-0000-000000000002', moduleKey: 'pdpa_compliance', moduleName: 'PDPA Compliance',    description: 'Personal Data Protection Act compliance',        enabled: true,  sortOrder: 2 },
    { id: uuid(), countryId: 'c0000000-0000-0000-0000-000000000002', moduleKey: 'moph_standards',  moduleName: 'MOPH Standards',     description: 'Ministry of Public Health reporting',            enabled: true,  sortOrder: 3 },
  ],
  'c0000000-0000-0000-0000-000000000003': [
    { id: uuid(), countryId: 'c0000000-0000-0000-0000-000000000003', moduleKey: 'moh_registry',    moduleName: 'MOH Registry',       description: 'Ministry of Health registry compliance',         enabled: true,  sortOrder: 1 },
    { id: uuid(), countryId: 'c0000000-0000-0000-0000-000000000003', moduleKey: 'data_encryption', moduleName: 'Data Encryption',    description: 'End-to-end encryption compliance',               enabled: false, sortOrder: 2 },
  ],
};

const BILLING_CONFIGS = {
  'c0000000-0000-0000-0000-000000000001': { id: uuid(), countryId: 'c0000000-0000-0000-0000-000000000001', currencySymbol: '\u20B9', currencyCode: 'INR', taxRate: 18.00, taxSplit: 'CGST 9% + SGST 9%', claimCode: null, invoicePrefix: 'TC-IN-', invoiceFormat: 'GST Tax Invoice', toggles: { abdmDhis: true, upiQr: true } },
  'c0000000-0000-0000-0000-000000000002': { id: uuid(), countryId: 'c0000000-0000-0000-0000-000000000002', currencySymbol: '\u0E3F', currencyCode: 'THB', taxRate: 7.00, taxSplit: null, claimCode: 'CLM-TH', invoicePrefix: 'TC-TH-', invoiceFormat: 'NHSO Standard', toggles: { nhsoAutoSubmit: true, promptPayQr: true } },
  'c0000000-0000-0000-0000-000000000003': { id: uuid(), countryId: 'c0000000-0000-0000-0000-000000000003', currencySymbol: 'Rf', currencyCode: 'MVR', taxRate: 0.00, taxSplit: null, claimCode: null, invoicePrefix: 'TC-MV-', invoiceFormat: 'Standard Invoice', toggles: { localPaymentGateway: true } },
};

const LOCALE_SETTINGS = {
  'c0000000-0000-0000-0000-000000000001': { id: uuid(), countryId: 'c0000000-0000-0000-0000-000000000001', primaryLanguage: 'English', secondaryLanguage: 'Hindi',   dateFormat: 'DD/MM/YYYY', weightUnit: 'kg', heightUnit: 'cm', timezone: 'Asia/Kolkata' },
  'c0000000-0000-0000-0000-000000000002': { id: uuid(), countryId: 'c0000000-0000-0000-0000-000000000002', primaryLanguage: 'Thai',    secondaryLanguage: 'English', dateFormat: 'DD/MM/YYYY', weightUnit: 'kg', heightUnit: 'cm', timezone: 'Asia/Bangkok' },
  'c0000000-0000-0000-0000-000000000003': { id: uuid(), countryId: 'c0000000-0000-0000-0000-000000000003', primaryLanguage: 'Dhivehi', secondaryLanguage: 'English', dateFormat: 'DD/MM/YYYY', weightUnit: 'kg', heightUnit: 'cm', timezone: 'Indian/Maldives' },
};

const ID_FORMATS = {
  'c0000000-0000-0000-0000-000000000001': [
    { id: uuid(), countryId: 'c0000000-0000-0000-0000-000000000001', entityType: 'Patient',   prefix: 'PT', entityCode: 'IN', separator: '-', padding: 5, startsAt: 1, locked: false, preview: 'PT-IN-00001' },
    { id: uuid(), countryId: 'c0000000-0000-0000-0000-000000000001', entityType: 'Doctor',    prefix: 'DR', entityCode: 'IN', separator: '-', padding: 5, startsAt: 1, locked: false, preview: 'DR-IN-00001' },
    { id: uuid(), countryId: 'c0000000-0000-0000-0000-000000000001', entityType: 'Encounter', prefix: 'EN', entityCode: 'IN', separator: '-', padding: 5, startsAt: 1, locked: false, preview: 'EN-IN-00001' },
    { id: uuid(), countryId: 'c0000000-0000-0000-0000-000000000001', entityType: 'Clinic',    prefix: 'CL', entityCode: 'IN', separator: '-', padding: 5, startsAt: 1, locked: true,  preview: 'CL-IN-00001' },
  ],
  'c0000000-0000-0000-0000-000000000002': [
    { id: uuid(), countryId: 'c0000000-0000-0000-0000-000000000002', entityType: 'Patient',   prefix: 'PT', entityCode: 'TH', separator: '-', padding: 5, startsAt: 1, locked: false, preview: 'PT-TH-00001' },
    { id: uuid(), countryId: 'c0000000-0000-0000-0000-000000000002', entityType: 'Doctor',    prefix: 'DR', entityCode: 'TH', separator: '-', padding: 5, startsAt: 1, locked: false, preview: 'DR-TH-00001' },
    { id: uuid(), countryId: 'c0000000-0000-0000-0000-000000000002', entityType: 'Encounter', prefix: 'EN', entityCode: 'TH', separator: '-', padding: 5, startsAt: 1, locked: false, preview: 'EN-TH-00001' },
    { id: uuid(), countryId: 'c0000000-0000-0000-0000-000000000002', entityType: 'Clinic',    prefix: 'CL', entityCode: 'TH', separator: '-', padding: 5, startsAt: 1, locked: true,  preview: 'CL-TH-00001' },
  ],
  'c0000000-0000-0000-0000-000000000003': [
    { id: uuid(), countryId: 'c0000000-0000-0000-0000-000000000003', entityType: 'Patient',   prefix: 'PT', entityCode: 'MV', separator: '-', padding: 5, startsAt: 1, locked: false, preview: 'PT-MV-00001' },
    { id: uuid(), countryId: 'c0000000-0000-0000-0000-000000000003', entityType: 'Doctor',    prefix: 'DR', entityCode: 'MV', separator: '-', padding: 5, startsAt: 1, locked: false, preview: 'DR-MV-00001' },
    { id: uuid(), countryId: 'c0000000-0000-0000-0000-000000000003', entityType: 'Encounter', prefix: 'EN', entityCode: 'MV', separator: '-', padding: 5, startsAt: 1, locked: false, preview: 'EN-MV-00001' },
    { id: uuid(), countryId: 'c0000000-0000-0000-0000-000000000003', entityType: 'Clinic',    prefix: 'CL', entityCode: 'MV', separator: '-', padding: 5, startsAt: 1, locked: true,  preview: 'CL-MV-00001' },
  ],
};

const FIELD_DEFINITIONS = [
  { id: uuid(), scope: 'GLOBAL',  countryId: null,                                   section: 'registration', fieldKey: 'full_name',     label: 'Full Name',     fieldType: 'text',     locked: true,  required: true,  removable: false, sortOrder: 1 },
  { id: uuid(), scope: 'GLOBAL',  countryId: null,                                   section: 'registration', fieldKey: 'date_of_birth', label: 'Date of Birth', fieldType: 'date',     locked: true,  required: true,  removable: false, sortOrder: 2 },
  { id: uuid(), scope: 'GLOBAL',  countryId: null,                                   section: 'registration', fieldKey: 'gender',        label: 'Gender',        fieldType: 'select',   locked: true,  required: true,  removable: false, sortOrder: 3 },
  { id: uuid(), scope: 'GLOBAL',  countryId: null,                                   section: 'registration', fieldKey: 'phone',         label: 'Phone',         fieldType: 'tel',      locked: true,  required: true,  removable: false, sortOrder: 4 },
  { id: uuid(), scope: 'COUNTRY', countryId: 'c0000000-0000-0000-0000-000000000001', section: 'registration', fieldKey: 'abha_id',       label: 'ABHA ID',       fieldType: 'text',     locked: false, required: false, removable: false, sortOrder: 10 },
  { id: uuid(), scope: 'COUNTRY', countryId: 'c0000000-0000-0000-0000-000000000002', section: 'registration', fieldKey: 'nhso_id',       label: 'NHSO ID',       fieldType: 'text',     locked: false, required: false, removable: false, sortOrder: 10 },
  { id: uuid(), scope: 'COUNTRY', countryId: 'c0000000-0000-0000-0000-000000000003', section: 'registration', fieldKey: 'moh_id',        label: 'MOH ID',        fieldType: 'text',     locked: false, required: false, removable: false, sortOrder: 10 },
  { id: uuid(), scope: 'GLOBAL',  countryId: null,                                   section: 'registration', fieldKey: 'blood_group',   label: 'Blood Group',   fieldType: 'select',   locked: false, required: false, removable: true,  sortOrder: 20 },
  { id: uuid(), scope: 'GLOBAL',  countryId: null,                                   section: 'registration', fieldKey: 'referred_by',   label: 'Referred By',   fieldType: 'text',     locked: false, required: false, removable: true,  sortOrder: 21 },
  { id: uuid(), scope: 'GLOBAL',  countryId: null,                                   section: 'soap',         fieldKey: 'chief_complaint', label: 'Chief Complaint', fieldType: 'textarea', locked: true, required: true, removable: false, sortOrder: 1 },
  { id: uuid(), scope: 'GLOBAL',  countryId: null,                                   section: 'soap',         fieldKey: 'hpi',           label: 'HPI',           fieldType: 'textarea', locked: true,  required: true,  removable: false, sortOrder: 2 },
  { id: uuid(), scope: 'GLOBAL',  countryId: null,                                   section: 'soap',         fieldKey: 'ent_exam',      label: 'ENT Exam',      fieldType: 'textarea', locked: true,  required: true,  removable: false, sortOrder: 3 },
  { id: uuid(), scope: 'GLOBAL',  countryId: null,                                   section: 'soap',         fieldKey: 'abha_verification', label: 'ABHA Verification', fieldType: 'text', locked: false, required: false, removable: false, sortOrder: 4 },
  { id: uuid(), scope: 'GLOBAL',  countryId: null,                                   section: 'soap',         fieldKey: 'icd10_code',    label: 'ICD-10 Code',   fieldType: 'text',     locked: false, required: false, removable: false, sortOrder: 5 },
];

const DOCTORS = [
  { id: uuid(), firstName: 'Rajesh',   lastName: 'Sharma',    email: 'rajesh@taevas.health',   phone: '+919876100001', systemId: 'DR-IN-00001', roles: ['DOCTOR'],               speciality: 'ENT',          clinic: 'ENT Care Center',      registration: 'MH-DR-2024-001', country: 'India',    countryFlag: 'IN' },
  { id: uuid(), firstName: 'Priya',    lastName: 'Patel',     email: 'priya@taevas.health',    phone: '+919876100002', systemId: 'DR-IN-00002', roles: ['DOCTOR','CLINIC_ADMIN'], speciality: 'Audiology',    clinic: 'Sai ENT Hospital',     registration: 'MH-DR-2024-002', country: 'India',    countryFlag: 'IN' },
  { id: uuid(), firstName: 'Amit',     lastName: 'Kumar',     email: 'amit@taevas.health',     phone: '+919876100003', systemId: 'DR-IN-00003', roles: ['DOCTOR'],               speciality: 'ENT Surgery',  clinic: 'Devi ENT Clinic',      registration: 'TS-DR-2024-001', country: 'India',    countryFlag: 'IN' },
  { id: uuid(), firstName: 'Somchai',  lastName: 'Srisuk',    email: 'somchai@taevas.health',  phone: '+66891000001',  systemId: 'DR-TH-00001', roles: ['DOCTOR','CLINIC_ADMIN'], speciality: 'ENT',          clinic: 'Bangkok ENT Center',   registration: 'TH-DR-2024-001', country: 'Thailand', countryFlag: 'TH' },
  { id: uuid(), firstName: 'Nattaya',  lastName: 'Wongsiri',  email: 'nattaya@taevas.health',  phone: '+66891000002',  systemId: 'DR-TH-00002', roles: ['DOCTOR'],               speciality: 'Audiology',    clinic: 'Siam Hearing Clinic',  registration: 'TH-DR-2024-002', country: 'Thailand', countryFlag: 'TH' },
  { id: uuid(), firstName: 'Ahmed',    lastName: 'Rasheed',   email: 'ahmed@taevas.health',    phone: '+9607100001',   systemId: 'DR-MV-00001', roles: ['DOCTOR','CLINIC_ADMIN'], speciality: 'ENT',          clinic: 'Male ENT Clinic',      registration: 'MV-DR-2024-001', country: 'Maldives', countryFlag: 'MV' },
  { id: uuid(), firstName: 'Fathima',  lastName: 'Hassan',    email: 'fathima@taevas.health',  phone: '+9607100002',   systemId: 'DR-MV-00002', roles: ['DOCTOR'],               speciality: 'Audiology',    clinic: 'Male ENT Clinic',      registration: 'MV-DR-2024-002', country: 'Maldives', countryFlag: 'MV' },
  { id: uuid(), firstName: 'Deepak',   lastName: 'Verma',     email: 'deepak@taevas.health',   phone: '+919876100004', systemId: 'DR-IN-00004', roles: ['DOCTOR'],               speciality: 'Rhinology',    clinic: 'Apollo ENT',           registration: 'DL-DR-2024-001', country: 'India',    countryFlag: 'IN' },
];

const EQUIDOR_SESSIONS = [
  {
    id: uuid(), cid: 'CID-2026-0328-001', ingestionDate: '2026-03-28', status: 'COMPLETE', totalDevices: 2, totalFiles: 6,
    devices: [
      { deviceId: 'DEV-AUD-001', deviceName: 'Audiometer Pro X1', clinics: [
        { clinicId: 'd0000000-0000-0000-0000-000000000001', clinicName: 'ENT Care Center', patients: [
          { patientId: uuid(), patientName: 'Ramesh K.', files: [
            { id: uuid(), fileName: 'audiogram_left.pdf',  fileType: 'application/pdf', fileSize: 245000, status: 'COMPLETE', failReason: null, receivedAt: '2026-03-28T09:30:00Z' },
            { id: uuid(), fileName: 'audiogram_right.pdf', fileType: 'application/pdf', fileSize: 238000, status: 'COMPLETE', failReason: null, receivedAt: '2026-03-28T09:30:05Z' },
          ]},
        ]},
      ]},
      { deviceId: 'DEV-TYM-002', deviceName: 'Tympanometer T200', clinics: [
        { clinicId: 'd0000000-0000-0000-0000-000000000001', clinicName: 'ENT Care Center', patients: [
          { patientId: uuid(), patientName: 'Sita M.', files: [
            { id: uuid(), fileName: 'tympanogram.pdf',  fileType: 'application/pdf', fileSize: 156000, status: 'COMPLETE', failReason: null, receivedAt: '2026-03-28T10:15:00Z' },
            { id: uuid(), fileName: 'reflex_test.pdf',  fileType: 'application/pdf', fileSize: 89000,  status: 'COMPLETE', failReason: null, receivedAt: '2026-03-28T10:15:10Z' },
          ]},
          { patientId: uuid(), patientName: 'Arun P.', files: [
            { id: uuid(), fileName: 'tympanogram.pdf',  fileType: 'application/pdf', fileSize: 162000, status: 'COMPLETE', failReason: null, receivedAt: '2026-03-28T10:45:00Z' },
            { id: uuid(), fileName: 'oae_result.pdf',   fileType: 'application/pdf', fileSize: 201000, status: 'COMPLETE', failReason: null, receivedAt: '2026-03-28T10:45:05Z' },
          ]},
        ]},
      ]},
    ],
  },
  {
    id: uuid(), cid: 'CID-2026-0327-003', ingestionDate: '2026-03-27', status: 'FAILED', totalDevices: 1, totalFiles: 2,
    devices: [
      { deviceId: 'DEV-AUD-003', deviceName: 'Audiometer BK-500', clinics: [
        { clinicId: 'd0000000-0000-0000-0000-000000000005', clinicName: 'Bangkok ENT Center', patients: [
          { patientId: uuid(), patientName: 'Somchai T.', files: [
            { id: uuid(), fileName: 'audiogram.pdf',    fileType: 'application/pdf', fileSize: 198000, status: 'FAILED', failReason: 'Corrupt file header', receivedAt: '2026-03-27T14:00:00Z' },
            { id: uuid(), fileName: 'speech_test.pdf',  fileType: 'application/pdf', fileSize: 0,      status: 'FAILED', failReason: 'Empty file',          receivedAt: '2026-03-27T14:00:05Z' },
          ]},
        ]},
      ]},
    ],
  },
];

const AUDIT_LOG = [
  { id: uuid(), userId: 'a0000000-0000-0000-0000-000000000001', action: 'UPDATE', entityType: 'FeatureFlag', entityId: 'f0000000-0000-0000-0000-000000000001', oldValue: null, newValue: '{"enabled":true}', ipAddress: '192.168.1.10', createdAt: '2026-03-28T09:00:00Z' },
  { id: uuid(), userId: 'a0000000-0000-0000-0000-000000000001', action: 'CREATE', entityType: 'Clinic',      entityId: 'd0000000-0000-0000-0000-000000000012', oldValue: null, newValue: '{"name":"Thinadhoo Medical"}', ipAddress: '192.168.1.10', createdAt: '2026-03-27T15:30:00Z' },
  { id: uuid(), userId: 'a0000000-0000-0000-0000-000000000001', action: 'UPDATE', entityType: 'Country',     entityId: 'c0000000-0000-0000-0000-000000000003', oldValue: '{"status":"ONBOARDING"}', newValue: '{"status":"PILOT"}', ipAddress: '192.168.1.10', createdAt: '2026-03-27T10:15:00Z' },
  { id: uuid(), userId: 'a0000000-0000-0000-0000-000000000001', action: 'UPDATE', entityType: 'BillingConfig', entityId: 'c0000000-0000-0000-0000-000000000001', oldValue: '{"taxRate":15}', newValue: '{"taxRate":18}', ipAddress: '192.168.1.10', createdAt: '2026-03-26T16:45:00Z' },
  { id: uuid(), userId: 'a0000000-0000-0000-0000-000000000001', action: 'CREATE', entityType: 'User',        entityId: uuid(), oldValue: null, newValue: '{"role":"DOCTOR"}', ipAddress: '192.168.1.10', createdAt: '2026-03-26T11:00:00Z' },
];


// ═══════════════════════════════════════════════════════════════════════════════
//  AUTH ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════════

app.post('/api/auth/login', (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) return res.status(400).json(wrap('Identifier and password are required'));

  const user = USERS[identifier];
  if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

  // Accept any password in dev mode
  const token = jwt.sign({ sub: user.id, role: user.role, tenantId: null }, JWT_SECRET, { expiresIn: '24h' });
  const refreshToken = jwt.sign({ sub: user.id, type: 'refresh' }, JWT_SECRET, { expiresIn: '7d' });

  res.json(wrap({ token, refreshToken, user }));
});

app.post('/api/auth/send-otp', (req, res) => {
  console.log(`[OTP] Sent to ${req.body.phone}: 123456`);
  res.json(wrap('OTP sent'));
});

app.post('/api/auth/verify-otp', (req, res) => {
  const { phone, otp } = req.body;
  if (otp !== '123456') return res.status(400).json({ success: false, message: 'Invalid OTP' });
  const user = USERS[phone] || { id: uuid(), phone, role: 'PATIENT', firstName: 'New', lastName: 'User' };
  const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
  const refreshToken = jwt.sign({ sub: user.id, type: 'refresh' }, JWT_SECRET, { expiresIn: '7d' });
  res.json(wrap({ token, refreshToken, user }));
});

app.post('/api/auth/refresh-token', (req, res) => {
  try {
    const decoded = jwt.verify(req.body.refreshToken, JWT_SECRET);
    const token = jwt.sign({ sub: decoded.sub, role: 'SUPERADMIN' }, JWT_SECRET, { expiresIn: '24h' });
    const refreshToken = jwt.sign({ sub: decoded.sub, type: 'refresh' }, JWT_SECRET, { expiresIn: '7d' });
    const user = USERS['admin@taevas.health'];
    res.json(wrap({ token, refreshToken, user }));
  } catch { res.status(401).json({ success: false, message: 'Invalid refresh token' }); }
});

app.post('/api/auth/logout', (req, res) => res.json(wrap('Logged out')));


// ═══════════════════════════════════════════════════════════════════════════════
//  SUPERADMIN ENDPOINTS (all require auth)
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Dashboard ─────────────────────────────────────────────────────────────────
app.get('/api/superadmin/stats', authGuard, (req, res) => {
  res.json(wrap({ totalCountries: 3, totalClinics: 12, totalDoctors: 47, totalPatients: 8420, countryDelta: 0, clinicDelta: 0, doctorDelta: 0, patientDelta: 12 }));
});

app.get('/api/superadmin/activity', authGuard, (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const size = parseInt(req.query.size) || 10;
  const start = page * size;
  const content = AUDIT_LOG.slice(start, start + size);
  res.json(wrap({ content, totalElements: AUDIT_LOG.length, totalPages: Math.ceil(AUDIT_LOG.length / size), size, number: page, first: page === 0, last: start + size >= AUDIT_LOG.length }));
});

app.get('/api/superadmin/ai-insights', authGuard, (req, res) => {
  res.json(wrap(['Thailand NHSO tokens expire in 14 days', 'Maldives Voice AI model ready', 'India ABDM credits: 4,200 earned this week']));
});

// ─── Countries ─────────────────────────────────────────────────────────────────
app.get('/api/superadmin/countries', authGuard, (req, res) => res.json(wrap(COUNTRIES)));
app.get('/api/superadmin/countries/:id', authGuard, (req, res) => {
  const c = COUNTRIES.find(x => x.id === req.params.id);
  c ? res.json(wrap(c)) : res.status(404).json({ success: false, message: 'Country not found' });
});
app.post('/api/superadmin/countries', authGuard, (req, res) => {
  const c = { id: uuid(), ...req.body, clinicCount: 0, doctorCount: 0 };
  COUNTRIES.push(c);
  res.status(201).json(wrap(c));
});
app.put('/api/superadmin/countries/:id', authGuard, (req, res) => {
  const idx = COUNTRIES.findIndex(x => x.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Not found' });
  COUNTRIES[idx] = { ...COUNTRIES[idx], ...req.body };
  res.json(wrap(COUNTRIES[idx]));
});

// ─── Clinics ───────────────────────────────────────────────────────────────────
app.get('/api/superadmin/clinics', authGuard, (req, res) => {
  let filtered = [...CLINICS];
  if (req.query.country) filtered = filtered.filter(c => c.countryId === req.query.country);
  if (req.query.status) filtered = filtered.filter(c => c.status === req.query.status);
  if (req.query.search) { const s = req.query.search.toLowerCase(); filtered = filtered.filter(c => c.name.toLowerCase().includes(s) || c.city.toLowerCase().includes(s)); }
  const page = parseInt(req.query.page) || 0;
  const size = parseInt(req.query.size) || 10;
  const start = page * size;
  const content = filtered.slice(start, start + size);
  res.json(wrap({ content, totalElements: filtered.length, totalPages: Math.ceil(filtered.length / size), size, number: page, first: page === 0, last: start + size >= filtered.length }));
});
app.get('/api/superadmin/clinics/:id', authGuard, (req, res) => {
  const c = CLINICS.find(x => x.id === req.params.id);
  c ? res.json(wrap(c)) : res.status(404).json({ success: false, message: 'Clinic not found' });
});
app.post('/api/superadmin/clinics', authGuard, (req, res) => {
  const c = { id: uuid(), ...req.body, complianceTags: [] };
  CLINICS.push(c);
  res.status(201).json(wrap(c));
});
app.put('/api/superadmin/clinics/:id', authGuard, (req, res) => {
  const idx = CLINICS.findIndex(x => x.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Not found' });
  CLINICS[idx] = { ...CLINICS[idx], ...req.body };
  res.json(wrap(CLINICS[idx]));
});

// ─── Feature Flags ─────────────────────────────────────────────────────────────
app.get('/api/superadmin/feature-flags', authGuard, (req, res) => res.json(wrap(FEATURE_FLAGS)));
app.put('/api/superadmin/feature-flags/:flagId/countries/:countryId', authGuard, (req, res) => {
  const flag = FEATURE_FLAGS.find(f => f.id === req.params.flagId);
  if (!flag) return res.status(404).json({ success: false, message: 'Flag not found' });
  flag.countries[req.params.countryId] = req.body.enabled;
  res.json(wrap(flag));
});
app.put('/api/superadmin/feature-flags/:flagId/lock', authGuard, (req, res) => {
  const flag = FEATURE_FLAGS.find(f => f.id === req.params.flagId);
  if (!flag) return res.status(404).json({ success: false, message: 'Flag not found' });
  flag.locked = !flag.locked;
  res.json(wrap(flag));
});
app.get('/api/superadmin/feature-flags/:flagId/impact', authGuard, (req, res) => {
  const flag = FEATURE_FLAGS.find(f => f.id === req.params.flagId);
  const enabled = flag ? Object.values(flag.countries).filter(Boolean).length : 0;
  res.json(wrap({ flagId: req.params.flagId, countriesAffected: enabled, clinicsAffected: enabled * 4, doctorsAffected: enabled * 12 }));
});

// ─── Compliance ────────────────────────────────────────────────────────────────
app.get('/api/superadmin/compliance/:countryId', authGuard, (req, res) => {
  res.json(wrap(COMPLIANCE_MODULES[req.params.countryId] || []));
});
app.put('/api/superadmin/compliance/:countryId/:moduleId', authGuard, (req, res) => {
  const modules = COMPLIANCE_MODULES[req.params.countryId];
  if (!modules) return res.status(404).json({ success: false, message: 'Not found' });
  const mod = modules.find(m => m.id === req.params.moduleId);
  if (!mod) return res.status(404).json({ success: false, message: 'Module not found' });
  mod.enabled = !mod.enabled;
  res.json(wrap(mod));
});

// ─── Billing Config ────────────────────────────────────────────────────────────
app.get('/api/superadmin/billing-config/:countryId', authGuard, (req, res) => {
  const cfg = BILLING_CONFIGS[req.params.countryId];
  cfg ? res.json(wrap(cfg)) : res.status(404).json({ success: false, message: 'Not found' });
});
app.put('/api/superadmin/billing-config/:countryId', authGuard, (req, res) => {
  if (!BILLING_CONFIGS[req.params.countryId]) return res.status(404).json({ success: false, message: 'Not found' });
  BILLING_CONFIGS[req.params.countryId] = { ...BILLING_CONFIGS[req.params.countryId], ...req.body };
  res.json(wrap(BILLING_CONFIGS[req.params.countryId]));
});

// ─── Locale Settings ───────────────────────────────────────────────────────────
app.get('/api/superadmin/locale/:countryId', authGuard, (req, res) => {
  const cfg = LOCALE_SETTINGS[req.params.countryId];
  cfg ? res.json(wrap(cfg)) : res.status(404).json({ success: false, message: 'Not found' });
});
app.put('/api/superadmin/locale/:countryId', authGuard, (req, res) => {
  if (!LOCALE_SETTINGS[req.params.countryId]) return res.status(404).json({ success: false, message: 'Not found' });
  LOCALE_SETTINGS[req.params.countryId] = { ...LOCALE_SETTINGS[req.params.countryId], ...req.body };
  res.json(wrap(LOCALE_SETTINGS[req.params.countryId]));
});

// ─── ID Formats ────────────────────────────────────────────────────────────────
app.get('/api/superadmin/id-formats/:countryId', authGuard, (req, res) => {
  res.json(wrap(ID_FORMATS[req.params.countryId] || []));
});
app.put('/api/superadmin/id-formats/:countryId/:entityType', authGuard, (req, res) => {
  const formats = ID_FORMATS[req.params.countryId];
  if (!formats) return res.status(404).json({ success: false, message: 'Not found' });
  const fmt = formats.find(f => f.entityType === req.params.entityType);
  if (!fmt) return res.status(404).json({ success: false, message: 'Format not found' });
  Object.assign(fmt, req.body);
  fmt.preview = `${fmt.prefix}${fmt.separator}${fmt.entityCode}${fmt.separator}${'0'.repeat(fmt.padding - 1)}${fmt.startsAt}`;
  res.json(wrap(fmt));
});
app.put('/api/superadmin/id-formats/:countryId/:entityType/lock', authGuard, (req, res) => {
  const formats = ID_FORMATS[req.params.countryId];
  if (!formats) return res.status(404).json({ success: false, message: 'Not found' });
  const fmt = formats.find(f => f.entityType === req.params.entityType);
  if (!fmt) return res.status(404).json({ success: false, message: 'Format not found' });
  fmt.locked = !fmt.locked;
  res.json(wrap(fmt));
});

// ─── Field Definitions ─────────────────────────────────────────────────────────
app.get('/api/superadmin/fields', authGuard, (req, res) => {
  let filtered = [...FIELD_DEFINITIONS];
  if (req.query.section) filtered = filtered.filter(f => f.section === req.query.section);
  if (req.query.countryId) filtered = filtered.filter(f => f.countryId === null || f.countryId === req.query.countryId);
  filtered.sort((a, b) => a.sortOrder - b.sortOrder);
  res.json(wrap(filtered));
});
app.post('/api/superadmin/fields', authGuard, (req, res) => {
  const field = { id: uuid(), ...req.body, sortOrder: FIELD_DEFINITIONS.length + 1 };
  FIELD_DEFINITIONS.push(field);
  res.status(201).json(wrap(field));
});
app.put('/api/superadmin/fields/:id', authGuard, (req, res) => {
  const idx = FIELD_DEFINITIONS.findIndex(f => f.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Not found' });
  FIELD_DEFINITIONS[idx] = { ...FIELD_DEFINITIONS[idx], ...req.body };
  res.json(wrap(FIELD_DEFINITIONS[idx]));
});
app.delete('/api/superadmin/fields/:id', authGuard, (req, res) => {
  const idx = FIELD_DEFINITIONS.findIndex(f => f.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Not found' });
  // SA can delete any field — no removable guard
  FIELD_DEFINITIONS.splice(idx, 1);
  res.json(wrap('Deleted'));
});
app.put('/api/superadmin/fields/:id/lock', authGuard, (req, res) => {
  const field = FIELD_DEFINITIONS.find(f => f.id === req.params.id);
  if (!field) return res.status(404).json({ success: false, message: 'Not found' });
  field.locked = !field.locked;
  res.json(wrap(field));
});
app.put('/api/superadmin/fields/reorder', authGuard, (req, res) => {
  const { orderedIds } = req.body;
  if (orderedIds) orderedIds.forEach((id, i) => { const f = FIELD_DEFINITIONS.find(x => x.id === id); if (f) f.sortOrder = i + 1; });
  res.json(wrap('Reordered'));
});

// ─── Global Roster ─────────────────────────────────────────────────────────────
app.get('/api/superadmin/doctors', authGuard, (req, res) => {
  let filtered = [...DOCTORS];
  if (req.query.country) filtered = filtered.filter(d => d.country === req.query.country);
  if (req.query.search) { const s = req.query.search.toLowerCase(); filtered = filtered.filter(d => d.firstName.toLowerCase().includes(s) || d.lastName.toLowerCase().includes(s) || d.email.toLowerCase().includes(s)); }
  const page = parseInt(req.query.page) || 0;
  const size = parseInt(req.query.size) || 10;
  const start = page * size;
  const content = filtered.slice(start, start + size);
  res.json(wrap({ content, totalElements: filtered.length, totalPages: Math.ceil(filtered.length / size), size, number: page, first: page === 0, last: start + size >= filtered.length }));
});
app.get('/api/superadmin/doctors/:id', authGuard, (req, res) => {
  const d = DOCTORS.find(x => x.id === req.params.id);
  d ? res.json(wrap(d)) : res.status(404).json({ success: false, message: 'Doctor not found' });
});
app.put('/api/superadmin/doctors/:id/roles', authGuard, (req, res) => {
  const d = DOCTORS.find(x => x.id === req.params.id);
  if (!d) return res.status(404).json({ success: false, message: 'Not found' });
  d.roles = req.body.roles || d.roles;
  res.json(wrap(d));
});
app.delete('/api/superadmin/doctors/:id', authGuard, (req, res) => {
  const idx = DOCTORS.findIndex(x => x.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Not found' });
  DOCTORS.splice(idx, 1);
  res.json(wrap('Deactivated'));
});

// ─── Equidor ───────────────────────────────────────────────────────────────────
app.get('/api/superadmin/equidor/sessions', authGuard, (req, res) => {
  let filtered = [...EQUIDOR_SESSIONS];
  if (req.query.status) filtered = filtered.filter(s => s.status === req.query.status);
  if (req.query.search) { const s = req.query.search.toLowerCase(); filtered = filtered.filter(x => x.cid.toLowerCase().includes(s)); }
  res.json(wrap(filtered));
});
app.get('/api/superadmin/equidor/sessions/:cid', authGuard, (req, res) => {
  const s = EQUIDOR_SESSIONS.find(x => x.cid === req.params.cid);
  s ? res.json(wrap(s)) : res.status(404).json({ success: false, message: 'Session not found' });
});
app.get('/api/superadmin/equidor/files/:fileId', authGuard, (req, res) => {
  for (const session of EQUIDOR_SESSIONS) {
    for (const device of session.devices) {
      for (const clinic of device.clinics) {
        for (const patient of clinic.patients) {
          const file = patient.files.find(f => f.id === req.params.fileId);
          if (file) return res.json(wrap(file));
        }
      }
    }
  }
  res.status(404).json({ success: false, message: 'File not found' });
});
app.post('/api/superadmin/equidor/sessions/:cid/retry', authGuard, (req, res) => {
  const s = EQUIDOR_SESSIONS.find(x => x.cid === req.params.cid);
  if (!s) return res.status(404).json({ success: false, message: 'Not found' });
  s.status = 'PROCESSING';
  res.json(wrap({ message: 'Retry initiated' }));
});


// ═══════════════════════════════════════════════════════════════════════════════
//  START SERVER
// ═══════════════════════════════════════════════════════════════════════════════

app.listen(PORT, () => {
  console.log(`\n  TaevasClinic Mock Backend`);
  console.log(`  ========================`);
  console.log(`  Server running on http://localhost:${PORT}`);
  console.log(`  Auth:   POST /api/auth/login  { identifier, password }`);
  console.log(`  Admin:  admin@taevas.health / any password`);
  console.log(`  Phone:  9876543210 / any password`);
  console.log(`  Swagger: All 11 SA screens covered\n`);
});
