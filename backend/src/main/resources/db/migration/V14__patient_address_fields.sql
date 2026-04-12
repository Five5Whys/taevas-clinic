ALTER TABLE clinic_patients ADD COLUMN complete_address VARCHAR(500);
ALTER TABLE clinic_patients ADD COLUMN postal_code VARCHAR(20);
ALTER TABLE clinic_patients ADD COLUMN country VARCHAR(100);
ALTER TABLE clinic_patients ADD COLUMN state VARCHAR(100);
ALTER TABLE clinic_patients ADD COLUMN city VARCHAR(100);
ALTER TABLE clinic_patients ADD COLUMN sms_notifications BOOLEAN DEFAULT false;
ALTER TABLE clinic_patients ADD COLUMN remarks TEXT;
