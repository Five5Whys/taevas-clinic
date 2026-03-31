package com.taevas.clinic.controller.doctor;

import com.taevas.clinic.dto.ApiResponse;
import com.taevas.clinic.dto.clinicadmin.AppointmentDto;
import com.taevas.clinic.service.doctor.DoctorAppointmentService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController @RequestMapping("/api/doctor/appointments") @PreAuthorize("hasAnyRole('DOCTOR','CLINIC_ADMIN')")
@Tag(name = "Doctor - Appointments") @RequiredArgsConstructor
public class DoctorAppointmentController {
    private final DoctorAppointmentService service;
    private UUID getClinicId() { return UUID.fromString("d0000000-0000-0000-0000-000000000001"); }
    private UUID getStaffId() { return UUID.fromString("a1000000-0000-0000-0000-000000000001"); }

    @GetMapping public ResponseEntity<ApiResponse<Page<AppointmentDto>>> getAll(
            @RequestParam(required = false) String date, @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(service.getAppointments(getClinicId(), getStaffId(), date, status, PageRequest.of(page, size))));
    }
    @GetMapping("/{id}") public ResponseEntity<ApiResponse<AppointmentDto>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(service.getById(id)));
    }
    @PutMapping("/{id}/status") public ResponseEntity<ApiResponse<AppointmentDto>> updateStatus(@PathVariable UUID id, @RequestParam String status) {
        return ResponseEntity.ok(ApiResponse.success(service.updateStatus(id, status)));
    }
}
