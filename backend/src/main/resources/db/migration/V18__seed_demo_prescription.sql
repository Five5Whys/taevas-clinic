-- Demo: 1 prescription from Dr. Ravi Kumar to Priya Sharma with 3 drug items.
-- Safe on fresh installs: guarded by WHERE EXISTS on doctor+patient seed IDs.

INSERT INTO prescriptions (id, clinic_id, patient_id, doctor_id, diagnosis, notes, status, created_by)
SELECT
    '7a000000-0000-0000-0000-000000000001',
    cp.clinic_id,
    cp.id,
    cs.id,
    'Acute viral fever with mild throat irritation',
    'Rest for 3 days. Increase fluid intake. Avoid cold drinks. Follow up if fever persists beyond 72 hours or if new symptoms develop.',
    'ACTIVE',
    'SYSTEM'
FROM clinic_patients cp, clinic_staff cs
WHERE cp.user_id = 'a0000000-0000-0000-0000-000000000004'
  AND cs.user_id = 'a0000000-0000-0000-0000-000000000003'
  AND NOT EXISTS (SELECT 1 FROM prescriptions WHERE id = '7a000000-0000-0000-0000-000000000001');

INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, instructions, sort_order, created_by)
SELECT '7a000000-0000-0000-0000-000000000001', v.med, v.dose, v.freq, v.dur, v.instr, v.ord, 'SYSTEM'
FROM (VALUES
    ('Paracetamol 500 mg', '1 tablet', 'Every 6 hours', '3 days', 'Take after food. Do not exceed 4 tablets in 24 hours.', 1),
    ('Azithromycin 500 mg', '1 tablet', 'Once daily', '5 days', 'Take on empty stomach, 1 hour before a meal. Complete the full course even if you feel better.', 2),
    ('Benadryl Syrup', '10 ml', 'Thrice daily', '3 days', 'Use the measuring cap. May cause drowsiness — avoid driving.', 3)
) AS v(med, dose, freq, dur, instr, ord)
WHERE EXISTS (SELECT 1 FROM prescriptions WHERE id = '7a000000-0000-0000-0000-000000000001')
  AND NOT EXISTS (SELECT 1 FROM prescription_items WHERE prescription_id = '7a000000-0000-0000-0000-000000000001');
