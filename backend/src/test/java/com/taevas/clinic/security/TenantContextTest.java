package com.taevas.clinic.security;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class TenantContextTest {

    @AfterEach
    void tearDown() {
        TenantContext.clear();
    }

    @Test
    void getCurrentTenant_returnsNullByDefault() {
        assertNull(TenantContext.getCurrentTenant());
    }

    @Test
    void setCurrentTenant_andGetCurrentTenant_workCorrectly() {
        String tenantId = "tenant-123";

        TenantContext.setCurrentTenant(tenantId);

        assertEquals(tenantId, TenantContext.getCurrentTenant());
    }

    @Test
    void clear_removesTenant() {
        TenantContext.setCurrentTenant("tenant-123");

        TenantContext.clear();

        assertNull(TenantContext.getCurrentTenant());
    }

    @Test
    void setCurrentTenant_overwritesPreviousValue() {
        TenantContext.setCurrentTenant("tenant-1");
        TenantContext.setCurrentTenant("tenant-2");

        assertEquals("tenant-2", TenantContext.getCurrentTenant());
    }
}
