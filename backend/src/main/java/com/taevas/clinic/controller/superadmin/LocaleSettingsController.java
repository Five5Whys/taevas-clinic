package com.taevas.clinic.controller.superadmin;

import com.taevas.clinic.dto.ApiResponse;
import com.taevas.clinic.dto.superadmin.LocaleSettingsDto;
import com.taevas.clinic.dto.superadmin.LocaleSettingsRequest;
import com.taevas.clinic.service.superadmin.LocaleSettingsService;
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

import java.util.UUID;

@RestController
@RequestMapping("/api/superadmin/locale")
@PreAuthorize("hasRole('SUPERADMIN')")
@Tag(name = "Super Admin - Locale & Language")
@RequiredArgsConstructor
public class LocaleSettingsController {

    private final LocaleSettingsService localeSettingsService;

    @GetMapping("/{countryId}")
    @Operation(summary = "Get locale settings by country")
    public ResponseEntity<ApiResponse<LocaleSettingsDto>> getByCountry(
            @PathVariable UUID countryId) {
        LocaleSettingsDto dto = localeSettingsService.getByCountry(countryId);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @PutMapping("/{countryId}")
    @Operation(summary = "Update locale settings for a country")
    public ResponseEntity<ApiResponse<LocaleSettingsDto>> update(
            @PathVariable UUID countryId,
            @Valid @RequestBody LocaleSettingsRequest request) {
        LocaleSettingsDto dto = localeSettingsService.update(countryId, request);
        return ResponseEntity.ok(ApiResponse.success(dto, "Locale settings updated"));
    }
}
