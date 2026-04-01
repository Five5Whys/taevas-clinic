-- Add dial_code and config columns to countries
ALTER TABLE countries ADD COLUMN IF NOT EXISTS dial_code VARCHAR(10);
ALTER TABLE countries ADD COLUMN IF NOT EXISTS config JSONB DEFAULT '{}';

-- Set dial codes for existing countries
UPDATE countries SET dial_code = '+91' WHERE code = 'IN';
UPDATE countries SET dial_code = '+66' WHERE code = 'TH';
UPDATE countries SET dial_code = '+960' WHERE code = 'MV';

-- Add Singapore
INSERT INTO countries (id, code, name, flag_emoji, status, currency_code, currency_symbol, tax_type, tax_rate, date_format, primary_language, secondary_language, regulatory_body, dial_code)
VALUES ('c0000000-0000-0000-0000-000000000004', 'SG', 'Singapore', '🇸🇬', 'INACTIVE', 'SGD', 'S$', 'GST', 9.00, 'dd/MM/yyyy', 'English', '', 'MOH SG', '+65')
ON CONFLICT (code) DO NOTHING;
