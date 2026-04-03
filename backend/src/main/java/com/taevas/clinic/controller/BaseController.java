package com.taevas.clinic.controller;

import com.taevas.clinic.security.UserPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.UUID;

/**
 * Extracts authenticated user context from JWT instead of hardcoded UUIDs.
 */
public abstract class BaseController {

    protected UserPrincipal getPrincipal() {
        return (UserPrincipal) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
    }

    /** Clinic / tenant the user belongs to */
    protected UUID getClinicId() {
        return UUID.fromString(getPrincipal().getTenantId());
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
