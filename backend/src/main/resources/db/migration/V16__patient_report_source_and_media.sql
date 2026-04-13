ALTER TABLE patient_reports
    ADD COLUMN IF NOT EXISTS source VARCHAR(30) NOT NULL DEFAULT 'DOCTOR_CREATED',
    ADD COLUMN IF NOT EXISTS source_ref_id VARCHAR(255);

ALTER TABLE patient_reports ALTER COLUMN doctor_id DROP NOT NULL;

CREATE INDEX IF NOT EXISTS idx_patient_reports_source ON patient_reports(source);

CREATE TABLE IF NOT EXISTS patient_report_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID NOT NULL REFERENCES patient_reports(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    content_type VARCHAR(100),
    file_size BIGINT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by VARCHAR(255)
);
CREATE INDEX IF NOT EXISTS idx_patient_report_media_report ON patient_report_media(report_id);
