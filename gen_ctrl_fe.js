const fs = require('fs');
const path = require('path');
const ROOT = __dirname;
const BE = path.join(ROOT, 'backend/src/main/java/com/taevas/clinic');
const FE = path.join(ROOT, 'frontend/src');
let count = 0;

function w(fp, content) {
  fs.mkdirSync(path.dirname(fp), { recursive: true });
  fs.writeFileSync(fp, content, 'utf8');
  count++;
}

const CLINIC_ID = '"d0000000-0000-0000-0000-000000000001"';
const STAFF_ID = '"s0000000-0000-0000-0000-000000000001"';
const PATIENT_ID = '"p0000000-0000-0000-0000-000000000001"';

// ============================
// CONTROLLERS
// ============================
console.log('=== CONTROLLERS ===');
const CTRL_CA = path.join(BE, 'controller/clinicadmin');

w(path.join(CTRL_CA, 'ClinicAdminDashboardController.java'), `package com.taevas.clinic.controller.clinicadmin;

import com.taevas.clinic.dto.ApiResponse;
import com.taevas.clinic.dto.clinicadmin.ClinicDashboardDto;
import com.taevas.clinic.service.clinicadmin.ClinicAdminDashboardService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController @RequestMapping("/api/clinicadmin/dashboard") @PreAuthorize("hasRole('CLINIC_ADMIN')")
@Tag(name = "Clinic Admin - Dashboard") @RequiredArgsConstructor
public class ClinicAdminDashboardController {
    private final ClinicAdminDashboardService service;
    private UUID getClinicId() { return UUID.fromString(${CLINIC_ID}); }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<ClinicDashboardDto>> getStats() {
        return ResponseEntity.ok(ApiResponse.success(service.getDashboard(getClinicId())));
    }
}
`);

w(path.join(CTRL_CA, 'StaffController.java'), `package com.taevas.clinic.controller.clinicadmin;

import com.taevas.clinic.dto.ApiResponse;
import com.taevas.clinic.dto.clinicadmin.*;
import com.taevas.clinic.service.clinicadmin.StaffService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController @RequestMapping("/api/clinicadmin/staff") @PreAuthorize("hasRole('CLINIC_ADMIN')")
@Tag(name = "Clinic Admin - Staff") @RequiredArgsConstructor
public class StaffController {
    private final StaffService service;
    private UUID getClinicId() { return UUID.fromString(${CLINIC_ID}); }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<StaffDto>>> getAll(
            @RequestParam(required = false) String role, @RequestParam(required = false) String status,
            @RequestParam(required = false) String search, @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(service.getAll(getClinicId(), role, status, search, PageRequest.of(page, size))));
    }

    @GetMapping("/{id}") public ResponseEntity<ApiResponse<StaffDto>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(service.getById(getClinicId(), id)));
    }

    @PostMapping public ResponseEntity<ApiResponse<StaffDto>> create(@Valid @RequestBody StaffRequest r) {
        return ResponseEntity.ok(ApiResponse.success(service.create(getClinicId(), r), "Staff created"));
    }

    @PutMapping("/{id}") public ResponseEntity<ApiResponse<StaffDto>> update(@PathVariable UUID id, @Valid @RequestBody StaffRequest r) {
        return ResponseEntity.ok(ApiResponse.success(service.update(getClinicId(), id, r), "Staff updated"));
    }

    @DeleteMapping("/{id}") public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        service.delete(getClinicId(), id); return ResponseEntity.ok(ApiResponse.success(null, "Staff deleted"));
    }
}
`);

w(path.join(CTRL_CA, 'ClinicAdminPatientController.java'), `package com.taevas.clinic.controller.clinicadmin;

import com.taevas.clinic.dto.ApiResponse;
import com.taevas.clinic.dto.clinicadmin.*;
import com.taevas.clinic.service.clinicadmin.PatientService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController @RequestMapping("/api/clinicadmin/patients") @PreAuthorize("hasRole('CLINIC_ADMIN')")
@Tag(name = "Clinic Admin - Patients") @RequiredArgsConstructor
public class ClinicAdminPatientController {
    private final PatientService service;
    private UUID getClinicId() { return UUID.fromString(${CLINIC_ID}); }

    @GetMapping public ResponseEntity<ApiResponse<Page<PatientDto>>> getAll(
            @RequestParam(required = false) String status, @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(service.getAll(getClinicId(), status, search, PageRequest.of(page, size))));
    }
    @GetMapping("/{id}") public ResponseEntity<ApiResponse<PatientDto>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(service.getById(getClinicId(), id)));
    }
    @PostMapping public ResponseEntity<ApiResponse<PatientDto>> create(@Valid @RequestBody PatientRequest r) {
        return ResponseEntity.ok(ApiResponse.success(service.create(getClinicId(), r), "Patient created"));
    }
    @PutMapping("/{id}") public ResponseEntity<ApiResponse<PatientDto>> update(@PathVariable UUID id, @Valid @RequestBody PatientRequest r) {
        return ResponseEntity.ok(ApiResponse.success(service.update(getClinicId(), id, r), "Patient updated"));
    }
}
`);

w(path.join(CTRL_CA, 'ClinicAdminConfigController.java'), `package com.taevas.clinic.controller.clinicadmin;

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
public class ClinicAdminConfigController {
    private final ClinicAdminConfigService service;
    private UUID getClinicId() { return UUID.fromString(${CLINIC_ID}); }

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
}
`);

w(path.join(CTRL_CA, 'CustomFieldController.java'), `package com.taevas.clinic.controller.clinicadmin;

import com.taevas.clinic.dto.ApiResponse;
import com.taevas.clinic.dto.clinicadmin.*;
import com.taevas.clinic.service.clinicadmin.CustomFieldService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController @RequestMapping("/api/clinicadmin/custom-fields") @PreAuthorize("hasRole('CLINIC_ADMIN')")
@Tag(name = "Clinic Admin - Custom Fields") @RequiredArgsConstructor
public class CustomFieldController {
    private final CustomFieldService service;
    private UUID getClinicId() { return UUID.fromString(${CLINIC_ID}); }

    @GetMapping public ResponseEntity<ApiResponse<List<CustomFieldDto>>> getAll() { return ResponseEntity.ok(ApiResponse.success(service.getAll(getClinicId()))); }
    @PostMapping public ResponseEntity<ApiResponse<CustomFieldDto>> create(@Valid @RequestBody CustomFieldRequest r) { return ResponseEntity.ok(ApiResponse.success(service.create(getClinicId(), r))); }
    @PutMapping("/{id}") public ResponseEntity<ApiResponse<CustomFieldDto>> update(@PathVariable UUID id, @Valid @RequestBody CustomFieldRequest r) { return ResponseEntity.ok(ApiResponse.success(service.update(getClinicId(), id, r))); }
    @DeleteMapping("/{id}") public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) { service.delete(getClinicId(), id); return ResponseEntity.ok(ApiResponse.success(null)); }
}
`);

w(path.join(CTRL_CA, 'TemplateController.java'), `package com.taevas.clinic.controller.clinicadmin;

import com.taevas.clinic.dto.ApiResponse;
import com.taevas.clinic.dto.clinicadmin.TemplateSettingsDto;
import com.taevas.clinic.service.clinicadmin.TemplateService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController @RequestMapping("/api/clinicadmin/templates") @PreAuthorize("hasRole('CLINIC_ADMIN')")
@Tag(name = "Clinic Admin - Templates") @RequiredArgsConstructor
public class TemplateController {
    private final TemplateService service;
    private UUID getClinicId() { return UUID.fromString(${CLINIC_ID}); }

    @GetMapping public ResponseEntity<ApiResponse<List<TemplateSettingsDto>>> getAll() { return ResponseEntity.ok(ApiResponse.success(service.getAll(getClinicId()))); }
    @GetMapping("/{type}") public ResponseEntity<ApiResponse<TemplateSettingsDto>> getByType(@PathVariable String type) { return ResponseEntity.ok(ApiResponse.success(service.getByType(getClinicId(), type))); }
    @PutMapping("/{type}") public ResponseEntity<ApiResponse<TemplateSettingsDto>> update(@PathVariable String type, @RequestBody TemplateSettingsDto dto) { return ResponseEntity.ok(ApiResponse.success(service.update(getClinicId(), type, dto))); }
}
`);

w(path.join(CTRL_CA, 'DataImportController.java'), `package com.taevas.clinic.controller.clinicadmin;

import com.taevas.clinic.dto.ApiResponse;
import com.taevas.clinic.dto.clinicadmin.DataImportDto;
import com.taevas.clinic.service.clinicadmin.DataImportService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController @RequestMapping("/api/clinicadmin/import") @PreAuthorize("hasRole('CLINIC_ADMIN')")
@Tag(name = "Clinic Admin - Import") @RequiredArgsConstructor
public class DataImportController {
    private final DataImportService service;
    private UUID getClinicId() { return UUID.fromString(${CLINIC_ID}); }

    @GetMapping("/history") public ResponseEntity<ApiResponse<Page<DataImportDto>>> getHistory(
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(service.getHistory(getClinicId(), PageRequest.of(page, size))));
    }
    @PostMapping("/{type}") public ResponseEntity<ApiResponse<DataImportDto>> importData(@PathVariable String type) {
        return ResponseEntity.ok(ApiResponse.success(service.importData(getClinicId(), type, null)));
    }
}
`);

w(path.join(CTRL_CA, 'ComplianceStatusController.java'), `package com.taevas.clinic.controller.clinicadmin;

import com.taevas.clinic.dto.ApiResponse;
import com.taevas.clinic.dto.clinicadmin.ComplianceStatusDto;
import com.taevas.clinic.service.clinicadmin.ClinicComplianceService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController @RequestMapping("/api/clinicadmin/compliance") @PreAuthorize("hasRole('CLINIC_ADMIN')")
@Tag(name = "Clinic Admin - Compliance") @RequiredArgsConstructor
public class ComplianceStatusController {
    private final ClinicComplianceService service;
    private UUID getClinicId() { return UUID.fromString(${CLINIC_ID}); }

    @GetMapping("/status") public ResponseEntity<ApiResponse<ComplianceStatusDto>> getStatus() {
        return ResponseEntity.ok(ApiResponse.success(service.getStatus(getClinicId())));
    }
}
`);

w(path.join(CTRL_CA, 'ReportController.java'), `package com.taevas.clinic.controller.clinicadmin;

import com.taevas.clinic.dto.ApiResponse;
import com.taevas.clinic.dto.clinicadmin.ClinicReportDto;
import com.taevas.clinic.service.clinicadmin.ReportService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController @RequestMapping("/api/clinicadmin/reports") @PreAuthorize("hasRole('CLINIC_ADMIN')")
@Tag(name = "Clinic Admin - Reports") @RequiredArgsConstructor
public class ReportController {
    private final ReportService service;
    private UUID getClinicId() { return UUID.fromString(${CLINIC_ID}); }

    @GetMapping public ResponseEntity<ApiResponse<ClinicReportDto>> getReport() {
        return ResponseEntity.ok(ApiResponse.success(service.getReport(getClinicId())));
    }
}
`);

// Doctor Controllers
const CTRL_DOC = path.join(BE, 'controller/doctor');

w(path.join(CTRL_DOC, 'DoctorDashboardController.java'), `package com.taevas.clinic.controller.doctor;

import com.taevas.clinic.dto.ApiResponse;
import com.taevas.clinic.dto.clinicadmin.ClinicDashboardDto;
import com.taevas.clinic.service.doctor.DoctorDashboardService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController @RequestMapping("/api/doctor/dashboard") @PreAuthorize("hasAnyRole('DOCTOR','CLINIC_ADMIN')")
@Tag(name = "Doctor - Dashboard") @RequiredArgsConstructor
public class DoctorDashboardController {
    private final DoctorDashboardService service;
    private UUID getClinicId() { return UUID.fromString(${CLINIC_ID}); }
    private UUID getStaffId() { return UUID.fromString(${STAFF_ID}); }

    @GetMapping("/stats") public ResponseEntity<ApiResponse<ClinicDashboardDto>> getStats() {
        return ResponseEntity.ok(ApiResponse.success(service.getDashboard(getClinicId(), getStaffId())));
    }
}
`);

w(path.join(CTRL_DOC, 'DoctorAppointmentController.java'), `package com.taevas.clinic.controller.doctor;

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
    private UUID getClinicId() { return UUID.fromString(${CLINIC_ID}); }
    private UUID getStaffId() { return UUID.fromString(${STAFF_ID}); }

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
`);

w(path.join(CTRL_DOC, 'DoctorEncounterController.java'), `package com.taevas.clinic.controller.doctor;

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
public class DoctorEncounterController {
    private final DoctorEncounterService service;
    private UUID getClinicId() { return UUID.fromString(${CLINIC_ID}); }
    private UUID getStaffId() { return UUID.fromString(${STAFF_ID}); }

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
`);

w(path.join(CTRL_DOC, 'DoctorPrescriptionController.java'), `package com.taevas.clinic.controller.doctor;

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
public class DoctorPrescriptionController {
    private final DoctorPrescriptionService service;
    private UUID getClinicId() { return UUID.fromString(${CLINIC_ID}); }
    private UUID getStaffId() { return UUID.fromString(${STAFF_ID}); }

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
`);

w(path.join(CTRL_DOC, 'DoctorPatientController.java'), `package com.taevas.clinic.controller.doctor;

import com.taevas.clinic.dto.ApiResponse;
import com.taevas.clinic.dto.clinicadmin.PatientDto;
import com.taevas.clinic.service.clinicadmin.PatientService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController @RequestMapping("/api/doctor/patients") @PreAuthorize("hasAnyRole('DOCTOR','CLINIC_ADMIN')")
@Tag(name = "Doctor - Patients") @RequiredArgsConstructor
public class DoctorPatientController {
    private final PatientService service;
    private UUID getClinicId() { return UUID.fromString(${CLINIC_ID}); }

    @GetMapping public ResponseEntity<ApiResponse<Page<PatientDto>>> getAll(
            @RequestParam(required = false) String search, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(service.getAll(getClinicId(), null, search, PageRequest.of(page, size))));
    }
    @GetMapping("/{id}") public ResponseEntity<ApiResponse<PatientDto>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(service.getById(getClinicId(), id)));
    }
}
`);

w(path.join(CTRL_DOC, 'DoctorBillingController.java'), `package com.taevas.clinic.controller.doctor;

import com.taevas.clinic.dto.ApiResponse;
import com.taevas.clinic.dto.clinicadmin.InvoiceDto;
import com.taevas.clinic.service.doctor.DoctorBillingService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController @RequestMapping("/api/doctor/billing") @PreAuthorize("hasAnyRole('DOCTOR','CLINIC_ADMIN')")
@Tag(name = "Doctor - Billing") @RequiredArgsConstructor
public class DoctorBillingController {
    private final DoctorBillingService service;
    private UUID getClinicId() { return UUID.fromString(${CLINIC_ID}); }

    @GetMapping public ResponseEntity<ApiResponse<Page<InvoiceDto>>> getAll(
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(service.getInvoices(getClinicId(), PageRequest.of(page, size))));
    }
}
`);

w(path.join(CTRL_DOC, 'DoctorDeviceReportController.java'), `package com.taevas.clinic.controller.doctor;

import com.taevas.clinic.dto.ApiResponse;
import com.taevas.clinic.dto.clinicadmin.DeviceReportDto;
import com.taevas.clinic.service.doctor.DoctorDeviceReportService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController @RequestMapping("/api/doctor/device-reports") @PreAuthorize("hasAnyRole('DOCTOR','CLINIC_ADMIN')")
@Tag(name = "Doctor - Device Reports") @RequiredArgsConstructor
public class DoctorDeviceReportController {
    private final DoctorDeviceReportService service;
    private UUID getClinicId() { return UUID.fromString(${CLINIC_ID}); }
    private UUID getStaffId() { return UUID.fromString(${STAFF_ID}); }

    @GetMapping public ResponseEntity<ApiResponse<Page<DeviceReportDto>>> getAll(
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(service.getReports(getClinicId(), getStaffId(), PageRequest.of(page, size))));
    }
}
`);

w(path.join(CTRL_DOC, 'DoctorFamilyController.java'), `package com.taevas.clinic.controller.doctor;

import com.taevas.clinic.dto.ApiResponse;
import com.taevas.clinic.dto.clinicadmin.FamilyDto;
import com.taevas.clinic.service.doctor.DoctorFamilyService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController @RequestMapping("/api/doctor/family") @PreAuthorize("hasAnyRole('DOCTOR','CLINIC_ADMIN')")
@Tag(name = "Doctor - Family") @RequiredArgsConstructor
public class DoctorFamilyController {
    private final DoctorFamilyService service;

    @GetMapping("/patient/{patientId}") public ResponseEntity<ApiResponse<List<FamilyDto>>> getByPatient(@PathVariable UUID patientId) {
        return ResponseEntity.ok(ApiResponse.success(service.getFamilyByPatient(patientId)));
    }
}
`);

w(path.join(CTRL_DOC, 'DoctorWhatsAppController.java'), `package com.taevas.clinic.controller.doctor;

import com.taevas.clinic.dto.ApiResponse;
import com.taevas.clinic.dto.clinicadmin.WhatsAppConfigDto;
import com.taevas.clinic.service.doctor.DoctorWhatsAppService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController @RequestMapping("/api/doctor/whatsapp") @PreAuthorize("hasAnyRole('DOCTOR','CLINIC_ADMIN')")
@Tag(name = "Doctor - WhatsApp") @RequiredArgsConstructor
public class DoctorWhatsAppController {
    private final DoctorWhatsAppService service;
    private UUID getClinicId() { return UUID.fromString(${CLINIC_ID}); }

    @GetMapping("/config") public ResponseEntity<ApiResponse<WhatsAppConfigDto>> getConfig() {
        return ResponseEntity.ok(ApiResponse.success(service.getConfig(getClinicId())));
    }
    @PutMapping("/config") public ResponseEntity<ApiResponse<WhatsAppConfigDto>> updateConfig(@RequestBody WhatsAppConfigDto dto) {
        return ResponseEntity.ok(ApiResponse.success(service.updateConfig(getClinicId(), dto)));
    }
}
`);

w(path.join(CTRL_DOC, 'DoctorMarketingController.java'), `package com.taevas.clinic.controller.doctor;

import com.taevas.clinic.dto.ApiResponse;
import com.taevas.clinic.dto.clinicadmin.ReviewDto;
import com.taevas.clinic.service.doctor.DoctorMarketingService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController @RequestMapping("/api/doctor/marketing") @PreAuthorize("hasAnyRole('DOCTOR','CLINIC_ADMIN')")
@Tag(name = "Doctor - Marketing") @RequiredArgsConstructor
public class DoctorMarketingController {
    private final DoctorMarketingService service;
    private UUID getClinicId() { return UUID.fromString(${CLINIC_ID}); }

    @GetMapping("/reviews") public ResponseEntity<ApiResponse<Page<ReviewDto>>> getReviews(
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(service.getReviews(getClinicId(), PageRequest.of(page, size))));
    }
}
`);

// Patient Controller
const CTRL_PAT = path.join(BE, 'controller/patient');

w(path.join(CTRL_PAT, 'PatientPortalController.java'), `package com.taevas.clinic.controller.patient;

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
    private UUID getClinicId() { return UUID.fromString(${CLINIC_ID}); }
    private UUID getPatientId() { return UUID.fromString(${PATIENT_ID}); }

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
`);

console.log(`Controllers: ${count}`);

// ============================
// FE FILES
// ============================
console.log('\n=== FE FILES ===');

// FE Services - clinicadmin
const feServices = {
  'clinicadmin/dashboardService': `import api from '../api';\nexport const dashboardService = { getStats: async () => { const r = await api.get('/clinicadmin/dashboard/stats'); return r.data.data; } };`,
  'clinicadmin/staffService': `import api from '../api';\nexport interface StaffListParams { role?: string; status?: string; search?: string; page?: number; size?: number; }\nexport const staffService = {\n  getAll: async (params: StaffListParams = {}) => { const r = await api.get('/clinicadmin/staff', { params }); return r.data.data; },\n  getById: async (id: string) => { const r = await api.get(\`/clinicadmin/staff/\${id}\`); return r.data.data; },\n  create: async (data: any) => { const r = await api.post('/clinicadmin/staff', data); return r.data.data; },\n  update: async (id: string, data: any) => { const r = await api.put(\`/clinicadmin/staff/\${id}\`, data); return r.data.data; },\n  delete: async (id: string) => { const r = await api.delete(\`/clinicadmin/staff/\${id}\`); return r.data.data; },\n};`,
  'clinicadmin/patientService': `import api from '../api';\nexport interface PatientListParams { status?: string; search?: string; page?: number; size?: number; }\nexport const patientService = {\n  getAll: async (params: PatientListParams = {}) => { const r = await api.get('/clinicadmin/patients', { params }); return r.data.data; },\n  getById: async (id: string) => { const r = await api.get(\`/clinicadmin/patients/\${id}\`); return r.data.data; },\n  create: async (data: any) => { const r = await api.post('/clinicadmin/patients', data); return r.data.data; },\n  update: async (id: string, data: any) => { const r = await api.put(\`/clinicadmin/patients/\${id}\`, data); return r.data.data; },\n};`,
  'clinicadmin/configService': `import api from '../api';\nexport const configService = {\n  getClinicConfig: async () => { const r = await api.get('/clinicadmin/config'); return r.data.data; },\n  getScheduleConfig: async () => { const r = await api.get('/clinicadmin/config/schedule'); return r.data.data; },\n  updateScheduleConfig: async (data: any) => { const r = await api.put('/clinicadmin/config/schedule', data); return r.data.data; },\n  getDoctorSchedules: async () => { const r = await api.get('/clinicadmin/config/schedule/doctors'); return r.data.data; },\n  updateDoctorSchedule: async (id: string, data: any) => { const r = await api.put(\`/clinicadmin/config/schedule/doctors/\${id}\`, data); return r.data.data; },\n  getBillingConfig: async () => { const r = await api.get('/clinicadmin/config/billing'); return r.data.data; },\n  updateBillingConfig: async (data: any) => { const r = await api.put('/clinicadmin/config/billing', data); return r.data.data; },\n  getIdConfig: async () => { const r = await api.get('/clinicadmin/config/id-config'); return r.data.data; },\n};`,
  'clinicadmin/customFieldService': `import api from '../api';\nexport const customFieldService = {\n  getAll: async () => { const r = await api.get('/clinicadmin/custom-fields'); return r.data.data; },\n  create: async (data: any) => { const r = await api.post('/clinicadmin/custom-fields', data); return r.data.data; },\n  update: async (id: string, data: any) => { const r = await api.put(\`/clinicadmin/custom-fields/\${id}\`, data); return r.data.data; },\n  delete: async (id: string) => { const r = await api.delete(\`/clinicadmin/custom-fields/\${id}\`); return r.data.data; },\n};`,
  'clinicadmin/templateService': `import api from '../api';\nexport const templateService = {\n  getAll: async () => { const r = await api.get('/clinicadmin/templates'); return r.data.data; },\n  getByType: async (type: string) => { const r = await api.get(\`/clinicadmin/templates/\${type}\`); return r.data.data; },\n  update: async (type: string, data: any) => { const r = await api.put(\`/clinicadmin/templates/\${type}\`, data); return r.data.data; },\n};`,
  'clinicadmin/importService': `import api from '../api';\nexport const importService = {\n  getHistory: async (params: any = {}) => { const r = await api.get('/clinicadmin/import/history', { params }); return r.data.data; },\n  importData: async (type: string) => { const r = await api.post(\`/clinicadmin/import/\${type}\`); return r.data.data; },\n};`,
  'clinicadmin/complianceService': `import api from '../api';\nexport const complianceService = { getStatus: async () => { const r = await api.get('/clinicadmin/compliance/status'); return r.data.data; } };`,
  'clinicadmin/reportService': `import api from '../api';\nexport const reportService = { getReport: async () => { const r = await api.get('/clinicadmin/reports'); return r.data.data; } };`,
  'clinicadmin/index': `export { dashboardService } from './dashboardService';\nexport { staffService } from './staffService';\nexport { patientService } from './patientService';\nexport { configService } from './configService';\nexport { customFieldService } from './customFieldService';\nexport { templateService } from './templateService';\nexport { importService } from './importService';\nexport { complianceService } from './complianceService';\nexport { reportService } from './reportService';`,
  'doctor/dashboardService': `import api from '../api';\nexport const doctorDashboardService = { getStats: async () => { const r = await api.get('/doctor/dashboard/stats'); return r.data.data; } };`,
  'doctor/appointmentService': `import api from '../api';\nexport const appointmentService = {\n  getAll: async (params: any = {}) => { const r = await api.get('/doctor/appointments', { params }); return r.data.data; },\n  getById: async (id: string) => { const r = await api.get(\`/doctor/appointments/\${id}\`); return r.data.data; },\n  updateStatus: async (id: string, status: string) => { const r = await api.put(\`/doctor/appointments/\${id}/status\`, null, { params: { status } }); return r.data.data; },\n};`,
  'doctor/encounterService': `import api from '../api';\nexport const encounterService = {\n  getByAppointment: async (id: string) => { const r = await api.get(\`/doctor/encounters/appointment/\${id}\`); return r.data.data; },\n  create: async (data: any) => { const r = await api.post('/doctor/encounters', data); return r.data.data; },\n  update: async (id: string, data: any) => { const r = await api.put(\`/doctor/encounters/\${id}\`, data); return r.data.data; },\n};`,
  'doctor/prescriptionService': `import api from '../api';\nexport const prescriptionService = {\n  getByEncounter: async (id: string) => { const r = await api.get(\`/doctor/prescriptions/encounter/\${id}\`); return r.data.data; },\n  getByPatient: async (id: string, params: any = {}) => { const r = await api.get(\`/doctor/prescriptions/patient/\${id}\`, { params }); return r.data.data; },\n  create: async (data: any) => { const r = await api.post('/doctor/prescriptions', data); return r.data.data; },\n};`,
  'doctor/patientService': `import api from '../api';\nexport const doctorPatientService = {\n  getAll: async (params: any = {}) => { const r = await api.get('/doctor/patients', { params }); return r.data.data; },\n  getById: async (id: string) => { const r = await api.get(\`/doctor/patients/\${id}\`); return r.data.data; },\n};`,
  'doctor/billingService': `import api from '../api';\nexport const doctorBillingService = { getInvoices: async (params: any = {}) => { const r = await api.get('/doctor/billing', { params }); return r.data.data; } };`,
  'doctor/deviceReportService': `import api from '../api';\nexport const deviceReportService = { getAll: async (params: any = {}) => { const r = await api.get('/doctor/device-reports', { params }); return r.data.data; } };`,
  'doctor/familyService': `import api from '../api';\nexport const familyService = { getByPatient: async (id: string) => { const r = await api.get(\`/doctor/family/patient/\${id}\`); return r.data.data; } };`,
  'doctor/whatsappService': `import api from '../api';\nexport const whatsappService = {\n  getConfig: async () => { const r = await api.get('/doctor/whatsapp/config'); return r.data.data; },\n  updateConfig: async (data: any) => { const r = await api.put('/doctor/whatsapp/config', data); return r.data.data; },\n};`,
  'doctor/marketingService': `import api from '../api';\nexport const marketingService = { getReviews: async (params: any = {}) => { const r = await api.get('/doctor/marketing/reviews', { params }); return r.data.data; } };`,
  'doctor/index': `export { doctorDashboardService } from './dashboardService';\nexport { appointmentService } from './appointmentService';\nexport { encounterService } from './encounterService';\nexport { prescriptionService } from './prescriptionService';\nexport { doctorPatientService } from './patientService';\nexport { doctorBillingService } from './billingService';\nexport { deviceReportService } from './deviceReportService';\nexport { familyService } from './familyService';\nexport { whatsappService } from './whatsappService';\nexport { marketingService } from './marketingService';`,
  'patient/portalService': `import api from '../api';\nexport const portalService = {\n  getDashboard: async () => { const r = await api.get('/patient/dashboard'); return r.data.data; },\n  getAppointments: async (params: any = {}) => { const r = await api.get('/patient/appointments', { params }); return r.data.data; },\n  getPrescriptions: async (params: any = {}) => { const r = await api.get('/patient/prescriptions', { params }); return r.data.data; },\n  getHealthRecords: async () => { const r = await api.get('/patient/health-records'); return r.data.data; },\n  getFamily: async () => { const r = await api.get('/patient/family'); return r.data.data; },\n};`,
  'patient/index': `export { portalService } from './portalService';`,
};

for (const [name, content] of Object.entries(feServices)) {
  w(path.join(FE, 'services', `${name}.ts`), content + '\n');
}

// FE Hooks
const hooks = {
  'clinicadmin/useDashboard': `import { useQuery } from '@tanstack/react-query';\nimport { dashboardService } from '../../services/clinicadmin';\nexport const useClinicDashboard = () => useQuery({ queryKey: ['clinicadmin', 'dashboard'], queryFn: () => dashboardService.getStats() });`,
  'clinicadmin/useStaff': `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';\nimport { staffService, StaffListParams } from '../../services/clinicadmin/staffService';\nexport const useStaffList = (params: StaffListParams = {}) => useQuery({ queryKey: ['clinicadmin', 'staff', params], queryFn: () => staffService.getAll(params) });\nexport const useStaff = (id: string) => useQuery({ queryKey: ['clinicadmin', 'staff', id], queryFn: () => staffService.getById(id), enabled: !!id });\nexport const useCreateStaff = () => { const qc = useQueryClient(); return useMutation({ mutationFn: (data: any) => staffService.create(data), onSuccess: () => qc.invalidateQueries({ queryKey: ['clinicadmin', 'staff'] }) }); };\nexport const useUpdateStaff = () => { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, data }: { id: string; data: any }) => staffService.update(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ['clinicadmin', 'staff'] }) }); };\nexport const useDeleteStaff = () => { const qc = useQueryClient(); return useMutation({ mutationFn: (id: string) => staffService.delete(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['clinicadmin', 'staff'] }) }); };`,
  'clinicadmin/usePatients': `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';\nimport { patientService, PatientListParams } from '../../services/clinicadmin/patientService';\nexport const usePatientList = (params: PatientListParams = {}) => useQuery({ queryKey: ['clinicadmin', 'patients', params], queryFn: () => patientService.getAll(params) });\nexport const usePatient = (id: string) => useQuery({ queryKey: ['clinicadmin', 'patients', id], queryFn: () => patientService.getById(id), enabled: !!id });\nexport const useCreatePatient = () => { const qc = useQueryClient(); return useMutation({ mutationFn: (data: any) => patientService.create(data), onSuccess: () => qc.invalidateQueries({ queryKey: ['clinicadmin', 'patients'] }) }); };\nexport const useUpdatePatient = () => { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, data }: { id: string; data: any }) => patientService.update(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ['clinicadmin', 'patients'] }) }); };`,
  'clinicadmin/useConfig': `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';\nimport { configService } from '../../services/clinicadmin';\nexport const useClinicConfig = () => useQuery({ queryKey: ['clinicadmin', 'config'], queryFn: () => configService.getClinicConfig() });\nexport const useScheduleConfig = () => useQuery({ queryKey: ['clinicadmin', 'schedule'], queryFn: () => configService.getScheduleConfig() });\nexport const useUpdateScheduleConfig = () => { const qc = useQueryClient(); return useMutation({ mutationFn: (data: any) => configService.updateScheduleConfig(data), onSuccess: () => qc.invalidateQueries({ queryKey: ['clinicadmin', 'schedule'] }) }); };\nexport const useDoctorSchedules = () => useQuery({ queryKey: ['clinicadmin', 'doctorSchedules'], queryFn: () => configService.getDoctorSchedules() });\nexport const useUpdateDoctorSchedule = () => { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, data }: { id: string; data: any }) => configService.updateDoctorSchedule(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ['clinicadmin', 'doctorSchedules'] }) }); };\nexport const useBillingConfig = () => useQuery({ queryKey: ['clinicadmin', 'billing'], queryFn: () => configService.getBillingConfig() });\nexport const useUpdateBillingConfig = () => { const qc = useQueryClient(); return useMutation({ mutationFn: (data: any) => configService.updateBillingConfig(data), onSuccess: () => qc.invalidateQueries({ queryKey: ['clinicadmin', 'billing'] }) }); };\nexport const useIdConfig = () => useQuery({ queryKey: ['clinicadmin', 'idConfig'], queryFn: () => configService.getIdConfig() });`,
  'clinicadmin/useCustomFields': `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';\nimport { customFieldService } from '../../services/clinicadmin';\nexport const useCustomFields = () => useQuery({ queryKey: ['clinicadmin', 'customFields'], queryFn: () => customFieldService.getAll() });\nexport const useCreateCustomField = () => { const qc = useQueryClient(); return useMutation({ mutationFn: (data: any) => customFieldService.create(data), onSuccess: () => qc.invalidateQueries({ queryKey: ['clinicadmin', 'customFields'] }) }); };\nexport const useUpdateCustomField = () => { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, data }: { id: string; data: any }) => customFieldService.update(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ['clinicadmin', 'customFields'] }) }); };\nexport const useDeleteCustomField = () => { const qc = useQueryClient(); return useMutation({ mutationFn: (id: string) => customFieldService.delete(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['clinicadmin', 'customFields'] }) }); };`,
  'clinicadmin/useTemplates': `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';\nimport { templateService } from '../../services/clinicadmin';\nexport const useTemplates = () => useQuery({ queryKey: ['clinicadmin', 'templates'], queryFn: () => templateService.getAll() });\nexport const useTemplate = (type: string) => useQuery({ queryKey: ['clinicadmin', 'templates', type], queryFn: () => templateService.getByType(type), enabled: !!type });\nexport const useUpdateTemplate = () => { const qc = useQueryClient(); return useMutation({ mutationFn: ({ type, data }: { type: string; data: any }) => templateService.update(type, data), onSuccess: () => qc.invalidateQueries({ queryKey: ['clinicadmin', 'templates'] }) }); };`,
  'clinicadmin/useImport': `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';\nimport { importService } from '../../services/clinicadmin';\nexport const useImportHistory = (params: any = {}) => useQuery({ queryKey: ['clinicadmin', 'import', params], queryFn: () => importService.getHistory(params) });\nexport const useImportData = () => { const qc = useQueryClient(); return useMutation({ mutationFn: (type: string) => importService.importData(type), onSuccess: () => qc.invalidateQueries({ queryKey: ['clinicadmin', 'import'] }) }); };`,
  'clinicadmin/useCompliance': `import { useQuery } from '@tanstack/react-query';\nimport { complianceService } from '../../services/clinicadmin';\nexport const useComplianceStatus = () => useQuery({ queryKey: ['clinicadmin', 'compliance'], queryFn: () => complianceService.getStatus() });`,
  'clinicadmin/useReports': `import { useQuery } from '@tanstack/react-query';\nimport { reportService } from '../../services/clinicadmin';\nexport const useClinicReport = () => useQuery({ queryKey: ['clinicadmin', 'reports'], queryFn: () => reportService.getReport() });`,
  'clinicadmin/index': `export { useClinicDashboard } from './useDashboard';\nexport { useStaffList, useStaff, useCreateStaff, useUpdateStaff, useDeleteStaff } from './useStaff';\nexport { usePatientList, usePatient, useCreatePatient, useUpdatePatient } from './usePatients';\nexport { useClinicConfig, useScheduleConfig, useUpdateScheduleConfig, useDoctorSchedules, useUpdateDoctorSchedule, useBillingConfig, useUpdateBillingConfig, useIdConfig } from './useConfig';\nexport { useCustomFields, useCreateCustomField, useUpdateCustomField, useDeleteCustomField } from './useCustomFields';\nexport { useTemplates, useTemplate, useUpdateTemplate } from './useTemplates';\nexport { useImportHistory, useImportData } from './useImport';\nexport { useComplianceStatus } from './useCompliance';\nexport { useClinicReport } from './useReports';`,
  'doctor/useDashboard': `import { useQuery } from '@tanstack/react-query';\nimport { doctorDashboardService } from '../../services/doctor';\nexport const useDoctorDashboard = () => useQuery({ queryKey: ['doctor', 'dashboard'], queryFn: () => doctorDashboardService.getStats() });`,
  'doctor/useAppointments': `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';\nimport { appointmentService } from '../../services/doctor';\nexport const useDoctorAppointments = (params: any = {}) => useQuery({ queryKey: ['doctor', 'appointments', params], queryFn: () => appointmentService.getAll(params) });\nexport const useDoctorAppointment = (id: string) => useQuery({ queryKey: ['doctor', 'appointments', id], queryFn: () => appointmentService.getById(id), enabled: !!id });\nexport const useUpdateAppointmentStatus = () => { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, status }: { id: string; status: string }) => appointmentService.updateStatus(id, status), onSuccess: () => qc.invalidateQueries({ queryKey: ['doctor', 'appointments'] }) }); };`,
  'doctor/useEncounters': `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';\nimport { encounterService } from '../../services/doctor';\nexport const useEncounterByAppointment = (id: string) => useQuery({ queryKey: ['doctor', 'encounters', id], queryFn: () => encounterService.getByAppointment(id), enabled: !!id });\nexport const useCreateEncounter = () => { const qc = useQueryClient(); return useMutation({ mutationFn: (data: any) => encounterService.create(data), onSuccess: () => qc.invalidateQueries({ queryKey: ['doctor', 'encounters'] }) }); };\nexport const useUpdateEncounter = () => { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, data }: { id: string; data: any }) => encounterService.update(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ['doctor', 'encounters'] }) }); };`,
  'doctor/usePrescriptions': `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';\nimport { prescriptionService } from '../../services/doctor';\nexport const usePrescriptionsByEncounter = (id: string) => useQuery({ queryKey: ['doctor', 'prescriptions', 'encounter', id], queryFn: () => prescriptionService.getByEncounter(id), enabled: !!id });\nexport const usePrescriptionsByPatient = (id: string, params: any = {}) => useQuery({ queryKey: ['doctor', 'prescriptions', 'patient', id, params], queryFn: () => prescriptionService.getByPatient(id, params), enabled: !!id });\nexport const useCreatePrescription = () => { const qc = useQueryClient(); return useMutation({ mutationFn: (data: any) => prescriptionService.create(data), onSuccess: () => qc.invalidateQueries({ queryKey: ['doctor', 'prescriptions'] }) }); };`,
  'doctor/usePatients': `import { useQuery } from '@tanstack/react-query';\nimport { doctorPatientService } from '../../services/doctor';\nexport const useDoctorPatients = (params: any = {}) => useQuery({ queryKey: ['doctor', 'patients', params], queryFn: () => doctorPatientService.getAll(params) });\nexport const useDoctorPatient = (id: string) => useQuery({ queryKey: ['doctor', 'patients', id], queryFn: () => doctorPatientService.getById(id), enabled: !!id });`,
  'doctor/useBilling': `import { useQuery } from '@tanstack/react-query';\nimport { doctorBillingService } from '../../services/doctor';\nexport const useDoctorBilling = (params: any = {}) => useQuery({ queryKey: ['doctor', 'billing', params], queryFn: () => doctorBillingService.getInvoices(params) });`,
  'doctor/useDeviceReports': `import { useQuery } from '@tanstack/react-query';\nimport { deviceReportService } from '../../services/doctor';\nexport const useDoctorDeviceReports = (params: any = {}) => useQuery({ queryKey: ['doctor', 'deviceReports', params], queryFn: () => deviceReportService.getAll(params) });`,
  'doctor/useFamily': `import { useQuery } from '@tanstack/react-query';\nimport { familyService } from '../../services/doctor';\nexport const useFamilyByPatient = (id: string) => useQuery({ queryKey: ['doctor', 'family', id], queryFn: () => familyService.getByPatient(id), enabled: !!id });`,
  'doctor/useWhatsApp': `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';\nimport { whatsappService } from '../../services/doctor';\nexport const useWhatsAppConfig = () => useQuery({ queryKey: ['doctor', 'whatsapp'], queryFn: () => whatsappService.getConfig() });\nexport const useUpdateWhatsAppConfig = () => { const qc = useQueryClient(); return useMutation({ mutationFn: (data: any) => whatsappService.updateConfig(data), onSuccess: () => qc.invalidateQueries({ queryKey: ['doctor', 'whatsapp'] }) }); };`,
  'doctor/useMarketing': `import { useQuery } from '@tanstack/react-query';\nimport { marketingService } from '../../services/doctor';\nexport const useMarketingReviews = (params: any = {}) => useQuery({ queryKey: ['doctor', 'marketing', params], queryFn: () => marketingService.getReviews(params) });`,
  'doctor/index': `export { useDoctorDashboard } from './useDashboard';\nexport { useDoctorAppointments, useDoctorAppointment, useUpdateAppointmentStatus } from './useAppointments';\nexport { useEncounterByAppointment, useCreateEncounter, useUpdateEncounter } from './useEncounters';\nexport { usePrescriptionsByEncounter, usePrescriptionsByPatient, useCreatePrescription } from './usePrescriptions';\nexport { useDoctorPatients, useDoctorPatient } from './usePatients';\nexport { useDoctorBilling } from './useBilling';\nexport { useDoctorDeviceReports } from './useDeviceReports';\nexport { useFamilyByPatient } from './useFamily';\nexport { useWhatsAppConfig, useUpdateWhatsAppConfig } from './useWhatsApp';\nexport { useMarketingReviews } from './useMarketing';`,
  'patient/usePortal': `import { useQuery } from '@tanstack/react-query';\nimport { portalService } from '../../services/patient';\nexport const usePatientDashboard = () => useQuery({ queryKey: ['patient', 'dashboard'], queryFn: () => portalService.getDashboard() });\nexport const usePatientAppointments = (params: any = {}) => useQuery({ queryKey: ['patient', 'appointments', params], queryFn: () => portalService.getAppointments(params) });\nexport const usePatientPrescriptions = (params: any = {}) => useQuery({ queryKey: ['patient', 'prescriptions', params], queryFn: () => portalService.getPrescriptions(params) });\nexport const usePatientHealthRecords = () => useQuery({ queryKey: ['patient', 'healthRecords'], queryFn: () => portalService.getHealthRecords() });\nexport const usePatientFamily = () => useQuery({ queryKey: ['patient', 'family'], queryFn: () => portalService.getFamily() });`,
  'patient/index': `export { usePatientDashboard, usePatientAppointments, usePatientPrescriptions, usePatientHealthRecords, usePatientFamily } from './usePortal';`,
};

for (const [name, content] of Object.entries(hooks)) {
  w(path.join(FE, 'hooks', `${name}.ts`), content + '\n');
}

// Patient pages
w(path.join(FE, 'pages/patient/Appointments.tsx'), `import { useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, CircularProgress, Alert, TablePagination } from '@mui/material';
import { usePatientAppointments } from '../../hooks/patient';

const Appointments = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { data, isLoading, error } = usePatientAppointments({ page, size: rowsPerPage });
  const statusColor = (s: string) => ({ SCHEDULED: 'info' as const, IN_PROGRESS: 'warning' as const, COMPLETED: 'success' as const, CANCELLED: 'error' as const }[s] || 'default' as const);

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3}>My Appointments</Typography>
      {isLoading && <CircularProgress />}
      {error && <Alert severity="error">Failed to load appointments</Alert>}
      {data && (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
          <Table>
            <TableHead><TableRow>
              <TableCell>Date</TableCell><TableCell>Time</TableCell><TableCell>Doctor</TableCell><TableCell>Type</TableCell><TableCell>Status</TableCell>
            </TableRow></TableHead>
            <TableBody>
              {(data.content || []).map((a: any) => (
                <TableRow key={a.id}>
                  <TableCell>{a.appointmentDate}</TableCell><TableCell>{a.startTime}</TableCell>
                  <TableCell>{a.doctorName || '\\u2014'}</TableCell><TableCell>{a.type}</TableCell>
                  <TableCell><Chip label={a.status} color={statusColor(a.status)} size="small" /></TableCell>
                </TableRow>
              ))}
              {(!data.content || data.content.length === 0) && <TableRow><TableCell colSpan={5} align="center">No appointments found</TableCell></TableRow>}
            </TableBody>
          </Table>
          <TablePagination component="div" count={data.totalElements || 0} page={page}
            onPageChange={(_, p) => setPage(p)} rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }} />
        </TableContainer>
      )}
    </Box>
  );
};
export default Appointments;
`);

w(path.join(FE, 'pages/patient/Prescriptions.tsx'), `import { useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, CircularProgress, Alert, TablePagination } from '@mui/material';
import { usePatientPrescriptions } from '../../hooks/patient';

const Prescriptions = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { data, isLoading, error } = usePatientPrescriptions({ page, size: rowsPerPage });

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3}>My Prescriptions</Typography>
      {isLoading && <CircularProgress />}
      {error && <Alert severity="error">Failed to load prescriptions</Alert>}
      {data && (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
          <Table>
            <TableHead><TableRow>
              <TableCell>Date</TableCell><TableCell>Doctor</TableCell><TableCell>Diagnosis</TableCell><TableCell>Status</TableCell>
            </TableRow></TableHead>
            <TableBody>
              {(data.content || []).map((rx: any) => (
                <TableRow key={rx.id}>
                  <TableCell>{rx.createdAt?.split('T')[0]}</TableCell><TableCell>{rx.doctorName || '\\u2014'}</TableCell>
                  <TableCell>{rx.diagnosis || '\\u2014'}</TableCell>
                  <TableCell><Chip label={rx.status} color={rx.status === 'ACTIVE' ? 'success' : 'default'} size="small" /></TableCell>
                </TableRow>
              ))}
              {(!data.content || data.content.length === 0) && <TableRow><TableCell colSpan={4} align="center">No prescriptions found</TableCell></TableRow>}
            </TableBody>
          </Table>
          <TablePagination component="div" count={data.totalElements || 0} page={page}
            onPageChange={(_, p) => setPage(p)} rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }} />
        </TableContainer>
      )}
    </Box>
  );
};
export default Prescriptions;
`);

w(path.join(FE, 'pages/patient/HealthRecords.tsx'), `import { Box, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import { usePatientHealthRecords } from '../../hooks/patient';

const HealthRecords = () => {
  const { data, isLoading, error } = usePatientHealthRecords();
  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3}>Health Records</Typography>
      {isLoading && <CircularProgress />}
      {error && <Alert severity="error">Failed to load health records</Alert>}
      {data && Array.isArray(data) && data.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center', border: '1px solid', borderColor: 'divider' }} elevation={0}>
          <Typography color="text.secondary">No health records yet</Typography>
        </Paper>
      )}
    </Box>
  );
};
export default HealthRecords;
`);

w(path.join(FE, 'pages/patient/Family.tsx'), `import { Box, Typography, Paper, Card, CardContent, Chip, CircularProgress, Alert, Grid } from '@mui/material';
import { usePatientFamily } from '../../hooks/patient';

const Family = () => {
  const { data, isLoading, error } = usePatientFamily();
  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3}>My Family</Typography>
      {isLoading && <CircularProgress />}
      {error && <Alert severity="error">Failed to load family data</Alert>}
      {data && Array.isArray(data) && data.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center', border: '1px solid', borderColor: 'divider' }} elevation={0}>
          <Typography color="text.secondary">No family groups found</Typography>
        </Paper>
      )}
      {data && Array.isArray(data) && data.length > 0 && (
        <Grid container spacing={2}>
          {data.map((g: any) => (
            <Grid item xs={12} md={6} key={g.id}>
              <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>{g.name}</Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>Primary: {g.primaryPatientName || '\\u2014'}</Typography>
                  {(g.members || []).map((m: any) => <Chip key={m.id} label={\`\${m.patientName} (\${m.relationship})\`} sx={{ mr: 1, mb: 1 }} />)}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};
export default Family;
`);

console.log(`\nTotal files written: ${count}`);
