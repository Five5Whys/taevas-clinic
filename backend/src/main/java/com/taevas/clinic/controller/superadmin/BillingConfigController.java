package com.taevas.clinic.controller.superadmin;

import com.taevas.clinic.dto.ApiResponse;
import com.taevas.clinic.dto.superadmin.BillingConfigDto;
import com.taevas.clinic.dto.superadmin.BillingConfigRequest;
import com.taevas.clinic.service.superadmin.BillingConfigService;
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
@RequestMapping("/api/superadmin/billing-config")
@PreAuthorize("hasRole('SUPERADMIN')")
@Tag(name = "Super Admin - Billing Config")
@RequiredArgsConstructor
public class BillingConfigController {

    private final BillingConfigService billingConfigService;

    @GetMapping("/{countryId}")
    @Operation(summary = "Get billing config by country")
    public ResponseEntity<ApiResponse<BillingConfigDto>> getByCountry(
            @PathVariable UUID countryId) {
        BillingConfigDto dto = billingConfigService.getByCountry(countryId);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @PutMapping("/{countryId}")
    @Operation(summary = "Update billing config for a country")
    public ResponseEntity<ApiResponse<BillingConfigDto>> update(
            @PathVariable UUID countryId,
            @Valid @RequestBody BillingConfigRequest request) {
        BillingConfigDto dto = billingConfigService.update(countryId, request);
        return ResponseEntity.ok(ApiResponse.success(dto, "Billing config updated"));
    }
}
