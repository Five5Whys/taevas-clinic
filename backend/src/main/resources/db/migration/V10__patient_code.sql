-- V10: Add patient_code to clinic_patients and patient_code_prefix to clinics

-- Add patient_code_prefix to clinics (nullable with default)
ALTER TABLE clinics ADD COLUMN IF NOT EXISTS patient_code_prefix VARCHAR(10) DEFAULT 'PT';

-- Add patient_code column (nullable first for backfill)
ALTER TABLE clinic_patients ADD COLUMN IF NOT EXISTS patient_code VARCHAR(20);

-- Backfill existing patients with generated codes using clinic prefix
UPDATE clinic_patients cp
SET patient_code = sub.generated_code
FROM (
    SELECT
        cp2.id,
        COALESCE(c.patient_code_prefix, 'PT') || '-' || LPAD(
            ROW_NUMBER() OVER (PARTITION BY cp2.clinic_id ORDER BY cp2.created_at, cp2.id)::TEXT,
            4, '0'
        ) AS generated_code
    FROM clinic_patients cp2
    LEFT JOIN clinics c ON c.id = cp2.clinic_id
    WHERE cp2.patient_code IS NULL
) sub
WHERE cp.id = sub.id;

-- Add NOT NULL constraint after backfill
ALTER TABLE clinic_patients ALTER COLUMN patient_code SET NOT NULL;

-- Add unique constraint
ALTER TABLE clinic_patients ADD CONSTRAINT uq_clinic_patients_patient_code UNIQUE (patient_code);
