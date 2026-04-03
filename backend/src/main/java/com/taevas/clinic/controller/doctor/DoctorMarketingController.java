package com.taevas.clinic.controller.doctor;

import com.taevas.clinic.controller.BaseController;
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
public class DoctorMarketingController extends BaseController {
    private final DoctorMarketingService service;

    @GetMapping("/reviews") public ResponseEntity<ApiResponse<Page<ReviewDto>>> getReviews(
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(service.getReviews(getClinicId(), PageRequest.of(page, size))));
    }
}
