package com.taevas.clinic.controller.superadmin;

import com.taevas.clinic.dto.ApiResponse;
import com.taevas.clinic.dto.superadmin.FieldDefinitionDto;
import com.taevas.clinic.dto.superadmin.FieldReorderRequest;
import com.taevas.clinic.dto.superadmin.FieldRequest;
import com.taevas.clinic.service.superadmin.FieldDefinitionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/superadmin/fields")
@PreAuthorize("hasRole('SUPERADMIN')")
@Tag(name = "Super Admin - Field Manager")
@RequiredArgsConstructor
public class FieldDefinitionController {

    private final FieldDefinitionService fieldDefinitionService;

    @GetMapping
    @Operation(summary = "Get field definitions by section and optional country")
    public ResponseEntity<ApiResponse<List<FieldDefinitionDto>>> getFields(
            @RequestParam String section,
            @RequestParam(required = false) UUID countryId) {
        List<FieldDefinitionDto> fields = fieldDefinitionService.getFields(section, countryId);
        return ResponseEntity.ok(ApiResponse.success(fields));
    }

    @PostMapping
    @Operation(summary = "Add a new field definition")
    public ResponseEntity<ApiResponse<FieldDefinitionDto>> addField(
            @Valid @RequestBody FieldRequest request) {
        FieldDefinitionDto dto = fieldDefinitionService.addField(request);
        return ResponseEntity.ok(ApiResponse.success(dto, "Field added"));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a field definition")
    public ResponseEntity<ApiResponse<FieldDefinitionDto>> updateField(
            @PathVariable UUID id,
            @Valid @RequestBody FieldRequest request) {
        FieldDefinitionDto dto = fieldDefinitionService.updateField(id, request);
        return ResponseEntity.ok(ApiResponse.success(dto, "Field updated"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a field definition")
    public ResponseEntity<ApiResponse<String>> deleteField(@PathVariable UUID id) {
        fieldDefinitionService.deleteField(id);
        return ResponseEntity.ok(ApiResponse.success("Field removed"));
    }

    @PutMapping("/reorder")
    @Operation(summary = "Reorder field definitions")
    public ResponseEntity<ApiResponse<String>> reorderFields(
            @Valid @RequestBody FieldReorderRequest request) {
        fieldDefinitionService.reorderFields(request);
        return ResponseEntity.ok(ApiResponse.success("Fields reordered"));
    }
}
