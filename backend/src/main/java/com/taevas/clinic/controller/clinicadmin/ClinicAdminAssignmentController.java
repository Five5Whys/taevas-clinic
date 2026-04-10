package com.taevas.clinic.controller.clinicadmin;

import com.taevas.clinic.controller.BaseController;
import com.taevas.clinic.dto.ApiResponse;
import com.taevas.clinic.dto.clinicadmin.AdminAssignPatientRequest;
import com.taevas.clinic.dto.clinicadmin.DoctorListDto;
import com.taevas.clinic.service.clinicadmin.ClinicAdminAssignmentService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/clinicadmin")
@PreAuthorize("hasRole('CLINIC_ADMIN')")
@Tag(name = "Clinic Admin - Doctor-Patient Assignments")
@RequiredArgsConstructor
public class ClinicAdminAssignmentController extends BaseController {

    private final ClinicAdminAssignmentService service;

    @GetMapping("/doctors")
    public ResponseEntity<ApiResponse<List<DoctorListDto>>> getDoctors() {
        return ResponseEntity.ok(ApiResponse.success(service.getDoctors(getClinicId())));
    }

    @PostMapping("/patients/assign")
    public ResponseEntity<ApiResponse<Void>> assignPatient(
            @Valid @RequestBody AdminAssignPatientRequest request) {
        boolean newlyAssigned = service.assignPatientToDoctor(getClinicId(), request);
        String message = newlyAssigned ? "Patient assigned to doctor" : "Patient already assigned to this doctor";
        return ResponseEntity.ok(ApiResponse.success(null, message));
    }

    @DeleteMapping("/patients/unassign/{patientId}")
    public ResponseEntity<ApiResponse<Void>> unassignPatient(@PathVariable UUID patientId) {
        service.unassignPatient(getClinicId(), patientId);
        return ResponseEntity.ok(ApiResponse.success(null, "Patient unassigned"));
    }
}
