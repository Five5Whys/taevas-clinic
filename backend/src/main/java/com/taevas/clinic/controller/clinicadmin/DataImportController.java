package com.taevas.clinic.controller.clinicadmin;

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
    private UUID getClinicId() { return UUID.fromString("d0000000-0000-0000-0000-000000000001"); }

    @GetMapping("/history") public ResponseEntity<ApiResponse<Page<DataImportDto>>> getHistory(
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(service.getHistory(getClinicId(), PageRequest.of(page, size))));
    }
    @PostMapping("/{type}") public ResponseEntity<ApiResponse<DataImportDto>> importData(@PathVariable String type) {
        return ResponseEntity.ok(ApiResponse.success(service.importData(getClinicId(), type, null)));
    }
}
