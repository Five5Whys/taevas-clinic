package com.taevas.clinic.controller.superadmin;

import com.taevas.clinic.dto.ApiResponse;
import com.taevas.clinic.dto.superadmin.EquidorFileDto;
import com.taevas.clinic.dto.superadmin.EquidorSessionDto;
import com.taevas.clinic.service.superadmin.EquidorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/superadmin/equidor")
@PreAuthorize("hasRole('SUPERADMIN')")
@Tag(name = "Super Admin - Equidor")
@RequiredArgsConstructor
public class EquidorController {

    private final EquidorService equidorService;

    @GetMapping("/sessions")
    @Operation(summary = "Get Equidor ingestion sessions with optional filters")
    public ResponseEntity<ApiResponse<List<EquidorSessionDto>>> getSessions(
            @RequestParam(required = false) String dateFrom,
            @RequestParam(required = false) String dateTo,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {
        List<EquidorSessionDto> sessions = equidorService.getSessions(dateFrom, dateTo, type, status, search);
        return ResponseEntity.ok(ApiResponse.success(sessions));
    }

    @GetMapping("/sessions/{cid}")
    @Operation(summary = "Get Equidor session detail with device tree")
    public ResponseEntity<ApiResponse<EquidorSessionDto>> getSession(@PathVariable String cid) {
        EquidorSessionDto session = equidorService.getSession(cid);
        return ResponseEntity.ok(ApiResponse.success(session));
    }

    @GetMapping("/files/{fileId}")
    @Operation(summary = "Get Equidor file detail")
    public ResponseEntity<ApiResponse<EquidorFileDto>> getFile(@PathVariable UUID fileId) {
        EquidorFileDto file = equidorService.getFile(fileId);
        return ResponseEntity.ok(ApiResponse.success(file));
    }

    @PostMapping("/sessions/{cid}/retry")
    @Operation(summary = "Retry failed files in an Equidor session")
    public ResponseEntity<ApiResponse<String>> retrySession(@PathVariable String cid) {
        equidorService.retrySession(cid);
        return ResponseEntity.ok(ApiResponse.success("Retry initiated"));
    }
}
