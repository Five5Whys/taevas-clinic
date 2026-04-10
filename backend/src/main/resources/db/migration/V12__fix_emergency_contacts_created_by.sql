-- V12: Fix created_by column type (UUID -> VARCHAR to match BaseEntity)
ALTER TABLE emergency_contacts ALTER COLUMN created_by TYPE VARCHAR(255) USING created_by::TEXT;
