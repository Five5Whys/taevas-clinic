-- Change config column from jsonb to text for Hibernate compatibility
ALTER TABLE countries ALTER COLUMN config TYPE TEXT;
