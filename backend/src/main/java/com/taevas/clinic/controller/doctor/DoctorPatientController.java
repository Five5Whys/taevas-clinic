package com.taevas.clinic.controller.doctor;

import com.taevas.clinic.controller.BaseController;
import com.taevas.clinic.dto.ApiResponse;
import com.taevas.clinic.dto.clinicadmin.PatientDto;
import com.taevas.clinic.dto.doctor.AssignPatientsRequest;
import com.taevas.clinic.dto.doctor.AssignPatientsResponse;
import com.taevas.clinic.service.clinicadmin.PatientService;
import com.taevas.clinic.service.doctor.DoctorPatientService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController @RequestMapping("/api/doctor/patients") @PreAuthorize("hasAnyRole('DOCTOR','CLINIC_ADMIN')")
@Tag(name = "Doctor - Patients") @RequiredArgsConstructor
public class DoctorPatientController extends BaseController {
    private final PatientService service;
    private final DoctorPatientService doctorPatientService;

    @GetMapping public ResponseEntity<ApiResponse<Page<PatientDto>>> getAll(
            @RequestParam(required = false) String search, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(service.getAll(getClinicId(), null, search, PageRequest.of(page, size))));
    }
    @GetMapping("/{id}") public ResponseEntity<ApiResponse<PatientDto>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(service.getById(getClinicId(), id)));
    }
    @GetMapping("/code/{code}") public ResponseEntity<ApiResponse<PatientDto>> getByCode(@PathVariable String code) {
        return ResponseEntity.ok(ApiResponse.success(service.getByCode(getClinicId(), code)));
    }
    @PostMapping public ResponseEntity<ApiResponse<PatientDto>> create(@RequestBody com.taevas.clinic.dto.clinicadmin.PatientRequest request) {
        return ResponseEntity.ok(ApiResponse.success(service.create(getClinicId(), request)));
    }
    @PutMapping("/{id}") public ResponseEntity<ApiResponse<PatientDto>> update(@PathVariable UUID id, @RequestBody com.taevas.clinic.dto.clinicadmin.PatientRequest request) {
        return ResponseEntity.ok(ApiResponse.success(service.update(getClinicId(), id, request), "Patient updated"));
    }
    @DeleteMapping("/{id}") public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        service.delete(getClinicId(), id); return ResponseEntity.ok(ApiResponse.success(null, "Patient deleted"));
    }

    // ── Doctor-Patient Assignment Endpoints ──────────────────────────────

    @PostMapping("/assign")
    public ResponseEntity<ApiResponse<AssignPatientsResponse>> assignPatients(
            @Valid @RequestBody AssignPatientsRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                doctorPatientService.assignPatients(getStaffId(), request), "Patients assigned"));
    }

    @GetMapping("/my-patients")
    public ResponseEntity<ApiResponse<Page<PatientDto>>> getMyPatients(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(
                doctorPatientService.getMyPatients(getStaffId(), search, PageRequest.of(page, size))));
    }

    @DeleteMapping("/unassign/{patientId}")
    public ResponseEntity<ApiResponse<Void>> unassignPatient(@PathVariable UUID patientId) {
        doctorPatientService.unassignPatient(getStaffId(), patientId);
        return ResponseEntity.ok(ApiResponse.success(null, "Patient unassigned"));
    }
}
