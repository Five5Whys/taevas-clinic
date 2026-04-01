package com.taevas.clinic.controller.superadmin;

import com.taevas.clinic.dto.ApiResponse;
import com.taevas.clinic.dto.superadmin.DashboardStatsDto;
import com.taevas.clinic.model.AuditLog;
import com.taevas.clinic.service.superadmin.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/superadmin")
@PreAuthorize("hasRole('SUPERADMIN')")
@Tag(name = "Super Admin - Dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    @Operation(summary = "Get dashboard statistics")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getStats() {
        DashboardStatsDto stats = dashboardService.getStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/activity")
    @Operation(summary = "Get recent activity logs")
    public ResponseEntity<ApiResponse<Page<AuditLog>>> getRecentActivity(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) UUID tenantId) {
        Pageable pageable = PageRequest.of(page, size);
        Page<AuditLog> activity = dashboardService.getRecentActivity(tenantId, pageable);
        return ResponseEntity.ok(ApiResponse.success(activity));
    }

    @GetMapping("/ai-insights")
    @Operation(summary = "Get AI-powered insights (stubbed)")
    public ResponseEntity<ApiResponse<List<String>>> getAiInsights() {
        List<String> insights = List.of(
                "Clinic onboarding rate increased by 15% this month across all regions.",
                "3 clinics in India have licenses expiring within the next 30 days.",
                "Patient registration volume is trending 20% higher than the previous quarter."
        );
        return ResponseEntity.ok(ApiResponse.success(insights));
    }
}
