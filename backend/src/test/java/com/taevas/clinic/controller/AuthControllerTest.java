package com.taevas.clinic.controller;

import com.taevas.clinic.dto.auth.AuthResponse;
import com.taevas.clinic.dto.auth.LoginRequest;
import com.taevas.clinic.dto.auth.RefreshTokenRequest;
import com.taevas.clinic.dto.auth.SendOtpRequest;
import com.taevas.clinic.dto.auth.UserDto;
import com.taevas.clinic.dto.auth.VerifyOtpRequest;
import com.taevas.clinic.dto.ApiResponse;
import com.taevas.clinic.exception.UnauthorizedException;
import com.taevas.clinic.service.auth.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController authController;

    private AuthResponse mockAuthResponse;

    @BeforeEach
    void setUp() {
        UserDto userDto = UserDto.builder()
                .id("user-123")
                .phone("9876543210")
                .role("SUPERADMIN")
                .build();

        mockAuthResponse = AuthResponse.builder()
                .token("access-token")
                .refreshToken("refresh-token")
                .user(userDto)
                .build();
    }

    @Test
    void login_returns200WithValidCredentials() {
        LoginRequest request = new LoginRequest("9876543210", "password");
        when(authService.login(any(LoginRequest.class))).thenReturn(mockAuthResponse);

        ResponseEntity<ApiResponse<AuthResponse>> response = authController.login(request);

        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().isSuccess());
        assertEquals("access-token", response.getBody().getData().getToken());
        assertEquals("SUPERADMIN", response.getBody().getData().getUser().getRole());
    }

    @Test
    void login_throwsWithBadCredentials() {
        LoginRequest request = new LoginRequest("9876543210", "wrong");
        when(authService.login(any(LoginRequest.class)))
                .thenThrow(new UnauthorizedException("Invalid credentials"));

        assertThrows(UnauthorizedException.class, () -> authController.login(request));
    }

    @Test
    void sendOtp_returns200() {
        SendOtpRequest request = SendOtpRequest.builder().phone("9876543210").build();
        doNothing().when(authService).sendOtp(any(SendOtpRequest.class));

        ResponseEntity<ApiResponse<String>> response = authController.sendOtp(request);

        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().isSuccess());
        assertEquals("OTP sent", response.getBody().getData());
    }

    @Test
    void verifyOtp_returns200() {
        VerifyOtpRequest request = VerifyOtpRequest.builder()
                .phone("9876543210")
                .otp("123456")
                .build();
        when(authService.verifyOtp(any(VerifyOtpRequest.class))).thenReturn(mockAuthResponse);

        ResponseEntity<ApiResponse<AuthResponse>> response = authController.verifyOtp(request);

        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().isSuccess());
        assertEquals("access-token", response.getBody().getData().getToken());
    }

    @Test
    void refreshToken_returns200() {
        RefreshTokenRequest request = RefreshTokenRequest.builder()
                .refreshToken("valid-refresh")
                .build();
        when(authService.refreshToken(any(RefreshTokenRequest.class))).thenReturn(mockAuthResponse);

        ResponseEntity<ApiResponse<AuthResponse>> response = authController.refreshToken(request);

        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().isSuccess());
        assertEquals("access-token", response.getBody().getData().getToken());
        assertEquals("refresh-token", response.getBody().getData().getRefreshToken());
    }
}
