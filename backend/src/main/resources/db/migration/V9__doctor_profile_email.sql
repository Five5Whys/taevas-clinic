-- V9: Add email column to doctor_profiles (optional field)
ALTER TABLE doctor_profiles ADD COLUMN IF NOT EXISTS email VARCHAR(255);
