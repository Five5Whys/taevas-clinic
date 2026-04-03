package com.taevas.clinic.controller.doctor;

import com.taevas.clinic.controller.BaseController;
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
public class DoctorAppointmentController extends BaseController {
    private final DoctorAppointmentService service;

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
    @PostMapping public ResponseEntity<ApiResponse<AppointmentDto>> create(@RequestBody com.taevas.clinic.dto.clinicadmin.AppointmentRequest request) {
        return ResponseEntity.ok(ApiResponse.success(service.create(getClinicId(), getStaffId(), request)));
    }
}
