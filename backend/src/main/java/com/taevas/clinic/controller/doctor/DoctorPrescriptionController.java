package com.taevas.clinic.controller.doctor;

import com.taevas.clinic.controller.BaseController;
import com.taevas.clinic.dto.ApiResponse;
import com.taevas.clinic.dto.clinicadmin.*;
import com.taevas.clinic.service.doctor.DoctorPrescriptionService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController @RequestMapping("/api/doctor/prescriptions") @PreAuthorize("hasAnyRole('DOCTOR','CLINIC_ADMIN')")
@Tag(name = "Doctor - Prescriptions") @RequiredArgsConstructor
public class DoctorPrescriptionController extends BaseController {
    private final DoctorPrescriptionService service;

    @GetMapping("/encounter/{encounterId}") public ResponseEntity<ApiResponse<List<PrescriptionDto>>> getByEncounter(@PathVariable UUID encounterId) {
        return ResponseEntity.ok(ApiResponse.success(service.getByEncounter(encounterId)));
    }
    @GetMapping("/patient/{patientId}") public ResponseEntity<ApiResponse<Page<PrescriptionDto>>> getByPatient(@PathVariable UUID patientId,
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(service.getByPatient(patientId, PageRequest.of(page, size))));
    }
    @PostMapping public ResponseEntity<ApiResponse<PrescriptionDto>> create(@Valid @RequestBody PrescriptionRequest r) {
        return ResponseEntity.ok(ApiResponse.success(service.create(getClinicId(), getStaffId(), r)));
    }
}
