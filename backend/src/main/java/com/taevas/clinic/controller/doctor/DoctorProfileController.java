package com.taevas.clinic.controller.doctor;

import com.taevas.clinic.controller.BaseController;
import com.taevas.clinic.dto.ApiResponse;
import com.taevas.clinic.dto.doctor.DoctorProfileDto;
import com.taevas.clinic.dto.doctor.DoctorProfileRequest;
import com.taevas.clinic.dto.doctor.ProfileCompletionDto;
import com.taevas.clinic.service.doctor.DoctorProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/doctors/profile")
@PreAuthorize("hasAnyRole('DOCTOR', 'CLINIC_ADMIN')")
@Tag(name = "Doctor - Profile", description = "Doctor professional profile management")
@RequiredArgsConstructor
public class DoctorProfileController extends BaseController {

    private final DoctorProfileService doctorProfileService;

    @GetMapping
    @Operation(summary = "Get current doctor's profile")
    public ResponseEntity<ApiResponse<DoctorProfileDto>> getProfile() {
        UUID userId = getUserId();
        DoctorProfileDto profile = doctorProfileService.getProfile(userId);
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    @PutMapping
    @Operation(summary = "Create or update doctor profile (upsert with auto-save/draft support)")
    public ResponseEntity<ApiResponse<DoctorProfileDto>> saveProfile(@RequestBody DoctorProfileRequest request) {
        UUID userId = getUserId();
        DoctorProfileDto profile = doctorProfileService.saveProfile(userId, request);
        return ResponseEntity.ok(ApiResponse.success(profile, "Profile saved"));
    }

    @DeleteMapping
    @Operation(summary = "Delete doctor profile")
    public ResponseEntity<ApiResponse<String>> deleteProfile() {
        UUID userId = getUserId();
        doctorProfileService.deleteProfile(userId);
        return ResponseEntity.ok(ApiResponse.success("Profile deleted"));
    }

    @GetMapping("/completion")
    @Operation(summary = "Get profile completion status")
    public ResponseEntity<ApiResponse<ProfileCompletionDto>> getCompletionStatus() {
        UUID userId = getUserId();
        ProfileCompletionDto completion = doctorProfileService.getCompletionStatus(userId);
        return ResponseEntity.ok(ApiResponse.success(completion));
    }
}
