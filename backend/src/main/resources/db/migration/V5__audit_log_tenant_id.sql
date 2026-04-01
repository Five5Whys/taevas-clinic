-- Add tenant_id to audit_logs for country-level filtering
ALTER TABLE audit_logs ADD COLUMN tenant_id UUID;

CREATE INDEX idx_audit_tenant ON audit_logs(tenant_id);
