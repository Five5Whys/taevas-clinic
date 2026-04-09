package com.taevas.clinic.controller;

import com.taevas.clinic.model.Clinic;
import com.taevas.clinic.repository.ClinicRepository;
import com.taevas.clinic.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.UUID;

/**
 * Extracts authenticated user context from JWT instead of hardcoded UUIDs.
 */
public abstract class BaseController {

    @Autowired private ClinicRepository clinicRepository;

    protected UserPrincipal getPrincipal() {
        return (UserPrincipal) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
    }

    /** Resolves clinic ID from the user's tenant — looks up clinics by tenantId, falls back to direct UUID */
    protected UUID getClinicId() {
        UUID tenantId = UUID.fromString(getPrincipal().getTenantId());
        List<Clinic> clinics = clinicRepository.findByTenantId(tenantId);
        if (!clinics.isEmpty()) return clinics.get(0).getId();
        return tenantId; // fallback
    }

    /** The authenticated user's own ID (staff or patient) */
    protected UUID getUserId() {
        return UUID.fromString(getPrincipal().getId());
    }

    /** Alias for getUserId() — Doctor/Nurse controllers */
    protected UUID getStaffId() {
        return getUserId();
    }

    /** Alias for getUserId() — Patient controllers */
    protected UUID getPatientId() {
        return getUserId();
    }
}
