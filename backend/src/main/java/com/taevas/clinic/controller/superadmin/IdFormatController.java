package com.taevas.clinic.controller.superadmin;

import com.taevas.clinic.dto.ApiResponse;
import com.taevas.clinic.dto.superadmin.IdFormatTemplateDto;
import com.taevas.clinic.dto.superadmin.IdFormatUpdateRequest;
import com.taevas.clinic.service.superadmin.IdFormatService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/superadmin/id-formats")
@PreAuthorize("hasRole('SUPERADMIN')")
@Tag(name = "Super Admin - ID Management")
@RequiredArgsConstructor
public class IdFormatController {

    private final IdFormatService idFormatService;

    @GetMapping("/{countryId}")
    @Operation(summary = "Get ID format templates by country")
    public ResponseEntity<ApiResponse<List<IdFormatTemplateDto>>> getByCountry(
            @PathVariable UUID countryId) {
        List<IdFormatTemplateDto> templates = idFormatService.getByCountry(countryId);
        return ResponseEntity.ok(ApiResponse.success(templates));
    }

    @PutMapping("/{countryId}/{entityType}")
    @Operation(summary = "Update ID format template")
    public ResponseEntity<ApiResponse<IdFormatTemplateDto>> update(
            @PathVariable UUID countryId,
            @PathVariable String entityType,
            @Valid @RequestBody IdFormatUpdateRequest request) {
        IdFormatTemplateDto dto = idFormatService.update(countryId, entityType, request);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @PutMapping("/{countryId}/{entityType}/lock")
    @Operation(summary = "Toggle lock on ID format template")
    public ResponseEntity<ApiResponse<String>> toggleLock(
            @PathVariable UUID countryId,
            @PathVariable String entityType) {
        idFormatService.toggleLock(countryId, entityType);
        return ResponseEntity.ok(ApiResponse.success("Lock toggled"));
    }
}
