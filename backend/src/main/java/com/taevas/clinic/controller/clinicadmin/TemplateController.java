package com.taevas.clinic.controller.clinicadmin;

import com.taevas.clinic.controller.BaseController;
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
public class TemplateController extends BaseController {
    private final TemplateService service;

    @GetMapping public ResponseEntity<ApiResponse<List<TemplateSettingsDto>>> getAll() { return ResponseEntity.ok(ApiResponse.success(service.getAll(getClinicId()))); }
    @GetMapping("/{type}") public ResponseEntity<ApiResponse<TemplateSettingsDto>> getByType(@PathVariable String type) { return ResponseEntity.ok(ApiResponse.success(service.getByType(getClinicId(), type))); }
    @PutMapping("/{type}") public ResponseEntity<ApiResponse<TemplateSettingsDto>> update(@PathVariable String type, @RequestBody TemplateSettingsDto dto) { return ResponseEntity.ok(ApiResponse.success(service.update(getClinicId(), type, dto))); }
}
