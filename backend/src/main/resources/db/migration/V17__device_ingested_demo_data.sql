-- Demo data: convert existing doctor-created records to device-ingested (EQUIDOR_INGESTED)
-- with device name stored in source_ref_id, and attach dummy PDF/video media.
-- Safe on fresh installs (UPDATE on 0 rows is a no-op; media INSERT is guarded by report existence).

-- Blood Test -> EquiCOG (PDF)
UPDATE patient_reports
SET source = 'EQUIDOR_INGESTED', source_ref_id = 'EquiCOG', updated_at = NOW()
WHERE id = '16355a70-71fc-438c-8524-f2b797b5399c' AND source = 'DOCTOR_CREATED';

INSERT INTO patient_report_media (report_id, file_name, file_path, content_type, file_size, created_by)
SELECT id, 'blood-test-results.pdf', 'health-records/demo/blood-test-results.pdf', 'application/pdf', 40, 'SYSTEM'
FROM patient_reports
WHERE id = '16355a70-71fc-438c-8524-f2b797b5399c'
  AND source = 'EQUIDOR_INGESTED'
  AND NOT EXISTS (SELECT 1 FROM patient_report_media WHERE report_id = patient_reports.id);

-- Annual Physical -> EquiCOG (PDF)
UPDATE patient_reports
SET source = 'EQUIDOR_INGESTED', source_ref_id = 'EquiCOG', updated_at = NOW()
WHERE id = '6f45c27e-4eb3-4e69-ab25-2c1c90390208' AND source = 'DOCTOR_CREATED';

INSERT INTO patient_report_media (report_id, file_name, file_path, content_type, file_size, created_by)
SELECT id, 'annual-physical.pdf', 'health-records/demo/annual-physical.pdf', 'application/pdf', 40, 'SYSTEM'
FROM patient_reports
WHERE id = '6f45c27e-4eb3-4e69-ab25-2c1c90390208'
  AND source = 'EQUIDOR_INGESTED'
  AND NOT EXISTS (SELECT 1 FROM patient_report_media WHERE report_id = patient_reports.id);

-- Chest X-Ray -> Endoscope (video)
UPDATE patient_reports
SET source = 'EQUIDOR_INGESTED', source_ref_id = 'Endoscope', updated_at = NOW()
WHERE id = 'e2e5aaef-9347-435e-b883-b5273b53e624' AND source = 'DOCTOR_CREATED';

INSERT INTO patient_report_media (report_id, file_name, file_path, content_type, file_size, created_by)
SELECT id, 'chest-xray-scan.mp4', 'health-records/demo/chest-xray-scan.mp4', 'video/mp4', 48, 'SYSTEM'
FROM patient_reports
WHERE id = 'e2e5aaef-9347-435e-b883-b5273b53e624'
  AND source = 'EQUIDOR_INGESTED'
  AND NOT EXISTS (SELECT 1 FROM patient_report_media WHERE report_id = patient_reports.id);
