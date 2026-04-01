package com.taevas.clinic.controller.superadmin;

import com.taevas.clinic.controller.BaseController;
import com.taevas.clinic.dto.ApiResponse;
import com.taevas.clinic.dto.superadmin.InvitationDto;
import com.taevas.clinic.dto.superadmin.InviteRequest;
import com.taevas.clinic.service.superadmin.InvitationService;
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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/superadmin")
@PreAuthorize("hasRole('SUPERADMIN')")
@Tag(name = "Super Admin - Invitations")
@RequiredArgsConstructor
public class InvitationController extends BaseController {

    private final InvitationService invitationService;

    @PostMapping("/invite")
    @Operation(summary = "Send a Super Admin invitation")
    public ResponseEntity<ApiResponse<InvitationDto>> invite(
            @Valid @RequestBody InviteRequest request) {
        UUID currentUserId = getUserId();
        InvitationDto dto = invitationService.invite(request, currentUserId);
        return ResponseEntity.ok(ApiResponse.success(dto, "Invitation sent"));
    }

    @GetMapping("/invitations")
    @Operation(summary = "Get all pending invitations")
    public ResponseEntity<ApiResponse<List<InvitationDto>>> getPending() {
        List<InvitationDto> invitations = invitationService.getPending();
        return ResponseEntity.ok(ApiResponse.success(invitations));
    }

    @DeleteMapping("/invitations/{id}")
    @Operation(summary = "Revoke an invitation")
    public ResponseEntity<ApiResponse<String>> revoke(@PathVariable UUID id) {
        invitationService.revoke(id);
        return ResponseEntity.ok(ApiResponse.success("Invitation revoked"));
    }
}
