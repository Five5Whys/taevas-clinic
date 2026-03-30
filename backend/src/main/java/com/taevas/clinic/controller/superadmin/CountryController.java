package com.taevas.clinic.controller.superadmin;

import com.taevas.clinic.dto.ApiResponse;
import com.taevas.clinic.dto.superadmin.CountryConfigRequest;
import com.taevas.clinic.dto.superadmin.CountryDto;
import com.taevas.clinic.service.superadmin.CountryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/superadmin/countries")
@PreAuthorize("hasRole('SUPERADMIN')")
@Tag(name = "Super Admin - Countries")
@RequiredArgsConstructor
public class CountryController {

    private final CountryService countryService;

    @GetMapping
    @Operation(summary = "Get all countries")
    public ResponseEntity<ApiResponse<List<CountryDto>>> getAll() {
        List<CountryDto> countries = countryService.getAll();
        return ResponseEntity.ok(ApiResponse.success(countries));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get country by ID")
    public ResponseEntity<ApiResponse<CountryDto>> getById(@PathVariable UUID id) {
        CountryDto country = countryService.getById(id);
        return ResponseEntity.ok(ApiResponse.success(country));
    }

    @PostMapping
    @Operation(summary = "Create a new country")
    public ResponseEntity<ApiResponse<CountryDto>> create(@Valid @RequestBody CountryConfigRequest request) {
        CountryDto country = countryService.create(request);
        return ResponseEntity.ok(ApiResponse.success(country, "Country created"));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a country")
    public ResponseEntity<ApiResponse<CountryDto>> update(
            @PathVariable UUID id,
            @Valid @RequestBody CountryConfigRequest request) {
        CountryDto country = countryService.update(id, request);
        return ResponseEntity.ok(ApiResponse.success(country, "Country updated"));
    }
}
