package com.taevas.clinic.controller.patient;

import com.taevas.clinic.dto.ApiResponse;
import com.taevas.clinic.dto.clinicadmin.*;
import com.taevas.clinic.service.patient.PatientPortalService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController @RequestMapping("/api/patient") @PreAuthorize("hasAnyRole('PATIENT','DOCTOR','CLINIC_ADMIN')")
@Tag(name = "Patient Portal") @RequiredArgsConstructor
public class PatientPortalController {
    private final PatientPortalService service;
    private UUID getClinicId() { return UUID.fromString("d0000000-0000-0000-0000-000000000001"); }
    private UUID getPatientId() { return UUID.fromString("b1000000-0000-0000-0000-000000000001"); }

    @GetMapping("/dashboard") public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboard() {
        return ResponseEntity.ok(ApiResponse.success(service.getDashboard(getClinicId(), getPatientId())));
    }
    @GetMapping("/appointments") public ResponseEntity<ApiResponse<Page<AppointmentDto>>> getAppointments(
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(service.getAppointments(getClinicId(), getPatientId(), PageRequest.of(page, size))));
    }
    @GetMapping("/prescriptions") public ResponseEntity<ApiResponse<Page<PrescriptionDto>>> getPrescriptions(
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(service.getPrescriptions(getClinicId(), getPatientId(), PageRequest.of(page, size))));
    }
    @GetMapping("/family") public ResponseEntity<ApiResponse<List<FamilyDto>>> getFamily() {
        return ResponseEntity.ok(ApiResponse.success(service.getFamily(getPatientId())));
    }
    @GetMapping("/health-records") public ResponseEntity<ApiResponse<List<Object>>> getHealthRecords() {
        return ResponseEntity.ok(ApiResponse.success(List.of()));
    }
}
