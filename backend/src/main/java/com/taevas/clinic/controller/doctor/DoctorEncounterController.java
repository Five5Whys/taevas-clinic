package com.taevas.clinic.controller.doctor;

import com.taevas.clinic.controller.BaseController;
import com.taevas.clinic.dto.ApiResponse;
import com.taevas.clinic.dto.clinicadmin.*;
import com.taevas.clinic.service.doctor.DoctorEncounterService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController @RequestMapping("/api/doctor/encounters") @PreAuthorize("hasAnyRole('DOCTOR','CLINIC_ADMIN')")
@Tag(name = "Doctor - Encounters") @RequiredArgsConstructor
public class DoctorEncounterController extends BaseController {
    private final DoctorEncounterService service;

    @GetMapping("/appointment/{appointmentId}") public ResponseEntity<ApiResponse<EncounterDto>> getByAppointment(@PathVariable UUID appointmentId) {
        return ResponseEntity.ok(ApiResponse.success(service.getByAppointment(appointmentId)));
    }
    @PostMapping public ResponseEntity<ApiResponse<EncounterDto>> create(@Valid @RequestBody EncounterRequest r) {
        return ResponseEntity.ok(ApiResponse.success(service.create(getClinicId(), getStaffId(), r)));
    }
    @PutMapping("/{id}") public ResponseEntity<ApiResponse<EncounterDto>> update(@PathVariable UUID id, @Valid @RequestBody EncounterRequest r) {
        return ResponseEntity.ok(ApiResponse.success(service.update(id, r)));
    }
}
