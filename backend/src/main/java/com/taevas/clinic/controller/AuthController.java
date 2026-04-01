package com.taevas.clinic.controller;

import com.taevas.clinic.dto.ApiResponse;
import com.taevas.clinic.dto.auth.AuthResponse;
import com.taevas.clinic.dto.auth.LoginRequest;
import com.taevas.clinic.dto.auth.RefreshTokenRequest;
import com.taevas.clinic.dto.auth.SendOtpRequest;
import com.taevas.clinic.dto.auth.VerifyOtpRequest;
import com.taevas.clinic.security.UserPrincipal;
import com.taevas.clinic.service.auth.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "OTP-based authentication endpoints")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Login", description = "Login with phone/email + password")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse authResponse = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success(authResponse));
    }

    @PostMapping("/send-otp")
    @Operation(summary = "Send OTP", description = "Send a one-time password to the given phone number")
    public ResponseEntity<ApiResponse<String>> sendOtp(@Valid @RequestBody SendOtpRequest request) {
        authService.sendOtp(request);
        return ResponseEntity.ok(ApiResponse.success("OTP sent"));
    }

    @PostMapping("/verify-otp")
    @Operation(summary = "Verify OTP", description = "Verify OTP and authenticate user, returning access and refresh tokens")
    public ResponseEntity<ApiResponse<AuthResponse>> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        AuthResponse authResponse = authService.verifyOtp(request);
        return ResponseEntity.ok(ApiResponse.success(authResponse));
    }

    @PostMapping("/refresh-token")
    @Operation(summary = "Refresh Token", description = "Exchange a valid refresh token for new access and refresh tokens")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        AuthResponse authResponse = authService.refreshToken(request);
        return ResponseEntity.ok(ApiResponse.success(authResponse));
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout", description = "Invalidate the refresh token and log out the current user")
    public ResponseEntity<ApiResponse<String>> logout() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        authService.logout(principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Logged out"));
    }

    @PostMapping("/change-password")
    @Operation(summary = "Change Password", description = "Change the authenticated user's password")
    public ResponseEntity<ApiResponse<String>> changePassword(@RequestBody java.util.Map<String, String> body) {
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
