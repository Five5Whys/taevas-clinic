package com.taevas.clinic.controller.clinicadmin;

import com.taevas.clinic.controller.BaseController;
import com.taevas.clinic.dto.ApiResponse;
import com.taevas.clinic.dto.clinicadmin.*;
import com.taevas.clinic.service.clinicadmin.ClinicAdminConfigService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController @RequestMapping("/api/clinicadmin/config") @PreAuthorize("hasRole('CLINIC_ADMIN')")
@Tag(name = "Clinic Admin - Config") @RequiredArgsConstructor
public class ClinicAdminConfigController extends BaseController {
    private final ClinicAdminConfigService service;

    @GetMapping public ResponseEntity<ApiResponse<ClinicConfigDto>> getConfig() {
        return ResponseEntity.ok(ApiResponse.success(service.getClinicConfig(getClinicId())));
    }
    @GetMapping("/schedule") public ResponseEntity<ApiResponse<ScheduleConfigDto>> getSchedule() {
        return ResponseEntity.ok(ApiResponse.success(service.getScheduleConfig(getClinicId())));
    }
    @PutMapping("/schedule") public ResponseEntity<ApiResponse<ScheduleConfigDto>> updateSchedule(@RequestBody ScheduleConfigDto dto) {
        return ResponseEntity.ok(ApiResponse.success(service.updateScheduleConfig(getClinicId(), dto)));
    }
    @GetMapping("/schedule/doctors") public ResponseEntity<ApiResponse<List<DayScheduleDto>>> getDoctorSchedules() {
        return ResponseEntity.ok(ApiResponse.success(service.getDoctorSchedules(getClinicId())));
    }
    @PutMapping("/schedule/doctors/{id}") public ResponseEntity<ApiResponse<DayScheduleDto>> updateDoctorSchedule(@PathVariable UUID id, @RequestBody DayScheduleDto dto) {
        return ResponseEntity.ok(ApiResponse.success(service.updateDoctorSchedule(getClinicId(), id, dto)));
    }
    @GetMapping("/billing") public ResponseEntity<ApiResponse<BillingFeesDto>> getBilling() {
        return ResponseEntity.ok(ApiResponse.success(service.getBillingConfig(getClinicId())));
    }
    @PutMapping("/billing") public ResponseEntity<ApiResponse<BillingFeesDto>> updateBilling(@RequestBody BillingFeesDto dto) {
        return ResponseEntity.ok(ApiResponse.success(service.updateBillingConfig(getClinicId(), dto)));
    }
    @GetMapping("/id-config") public ResponseEntity<ApiResponse<List<IdConfigDto>>> getIdConfig() {
        return ResponseEntity.ok(ApiResponse.success(service.getIdConfig(getClinicId())));
    }
    @PutMapping("/id-config") public ResponseEntity<ApiResponse<List<IdConfigDto>>> updateIdConfig(@RequestBody List<IdConfigDto> dtos) {
        return ResponseEntity.ok(ApiResponse.success(service.updateIdConfig(getClinicId(), dtos)));
    }
}
