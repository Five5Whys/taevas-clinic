package com.taevas.clinic.controller.superadmin;

import com.taevas.clinic.dto.ApiResponse;
import com.taevas.clinic.dto.superadmin.TechStackDto;
import com.taevas.clinic.dto.superadmin.TechStackRequest;
import com.taevas.clinic.service.superadmin.TechStackService;
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
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/superadmin/tech-stacks")
@PreAuthorize("hasRole('SUPERADMIN')")
@Tag(name = "Super Admin - Tech Stack")
@RequiredArgsConstructor
public class TechStackController {

    private final TechStackService techStackService;

    @GetMapping
    @Operation(summary = "Get all tech stack entries")
    public ResponseEntity<ApiResponse<List<TechStackDto>>> getAll() {
        List<TechStackDto> list = techStackService.getAll();
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get tech stack entry by ID")
    public ResponseEntity<ApiResponse<TechStackDto>> getById(@PathVariable UUID id) {
        TechStackDto dto = techStackService.getById(id);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @PostMapping
    @Operation(summary = "Create a new tech stack entry")
    public ResponseEntity<ApiResponse<TechStackDto>> create(@Valid @RequestBody TechStackRequest request) {
        TechStackDto dto = techStackService.create(request);
        return ResponseEntity.ok(ApiResponse.success(dto, "Tech stack entry created"));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a tech stack entry")
    public ResponseEntity<ApiResponse<TechStackDto>> update(
            @PathVariable UUID id,
            @Valid @RequestBody TechStackRequest request) {
        TechStackDto dto = techStackService.update(id, request);
        return ResponseEntity.ok(ApiResponse.success(dto, "Tech stack entry updated"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a tech stack entry")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        techStackService.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Tech stack entry deleted"));
    }
}
