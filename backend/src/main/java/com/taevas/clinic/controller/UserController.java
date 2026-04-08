package com.taevas.clinic.controller;

import com.taevas.clinic.dto.ApiResponse;
import com.taevas.clinic.security.UserPrincipal;
import com.taevas.clinic.service.auth.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "User", description = "Authenticated user endpoints")
public class UserController {

    private final AuthService authService;

    @PostMapping("/change-password")
    @Operation(summary = "Change Password", description = "Change the authenticated user's password")
    public ResponseEntity<ApiResponse<String>> changePassword(@RequestBody Map<String, String> body) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        String newPassword = body.get("newPassword");
        if (newPassword == null || newPassword.length() < 8) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Password must be at least 8 characters"));
        }
        authService.changePassword(principal.getId(), newPassword);
        return ResponseEntity.ok(ApiResponse.success("Password changed"));
    }
}
