package com.taevas.clinic.controller.doctor;

import com.taevas.clinic.dto.ApiResponse;
import com.taevas.clinic.dto.clinicadmin.FamilyDto;
import com.taevas.clinic.service.doctor.DoctorFamilyService;
import com.taevas.clinic.controller.BaseController;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController @RequestMapping("/api/doctor/family") @PreAuthorize("hasAnyRole('DOCTOR','CLINIC_ADMIN')")
@Tag(name = "Doctor - Family") @RequiredArgsConstructor
public class DoctorFamilyController extends BaseController {
    private final DoctorFamilyService service;

    @GetMapping("/patient/{patientId}") public ResponseEntity<ApiResponse<List<FamilyDto>>> getByPatient(@PathVariable UUID patientId) {
        return ResponseEntity.ok(ApiResponse.success(service.getFamilyByPatient(patientId)));
    }
}
