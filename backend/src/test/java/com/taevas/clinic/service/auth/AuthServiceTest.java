package com.taevas.clinic.service.auth;

import com.taevas.clinic.dto.auth.AuthResponse;
import com.taevas.clinic.dto.auth.LoginRequest;
import com.taevas.clinic.dto.auth.RefreshTokenRequest;
import com.taevas.clinic.dto.auth.VerifyOtpRequest;
import com.taevas.clinic.exception.BadRequestException;
import com.taevas.clinic.exception.UnauthorizedException;
import com.taevas.clinic.model.User;
import com.taevas.clinic.model.UserRole;
import com.taevas.clinic.model.enums.Role;
import com.taevas.clinic.repository.UserRepository;
import com.taevas.clinic.repository.UserRoleRepository;
import com.taevas.clinic.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Duration;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserRoleRepository userRoleRepository;

    @Mock
    private OtpService otpService;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private TokenStore tokenStore;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    private User testUser;
    private UUID userId;
    private UserRole superAdminRole;

    @BeforeEach
    void setUp() {
        userId = UUID.fromString("550e8400-e29b-41d4-a716-446655440000");
        UUID tenantId = UUID.fromString("660e8400-e29b-41d4-a716-446655440001");

        testUser = User.builder()
                .phone("9876543210")
                .email("admin@taevas.com")
                .firstName("Admin")
                .lastName("User")
                .passwordHash("encoded-password")
                .tenantId(tenantId)
                .active(true)
                .build();
        // Set the ID via the inherited setter since BaseEntity uses @SuperBuilder
        testUser.setId(userId);

        superAdminRole = UserRole.builder()
                .user(testUser)
                .role(Role.SUPERADMIN)
                .build();
    }

    @Test
    void login_withValidPhoneAndPassword_returnsAuthResponse() {
        LoginRequest request = new LoginRequest("9876543210", "password");

        when(userRepository.findByPhone("9876543210")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("password", "encoded-password")).thenReturn(true);
        when(userRoleRepository.findByUser_Id(userId)).thenReturn(List.of(superAdminRole));
        when(jwtTokenProvider.generateAccessToken(anyString(), anyString(), anyString()))
                .thenReturn("access-token");
        when(jwtTokenProvider.generateRefreshToken(anyString()))
                .thenReturn("refresh-token");

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("access-token", response.getToken());
        assertEquals("refresh-token", response.getRefreshToken());
        assertNotNull(response.getUser());
        assertEquals(userId.toString(), response.getUser().getId());
        assertEquals("SUPERADMIN", response.getUser().getRole());

        verify(tokenStore).store(eq("refresh:" + userId), eq("refresh-token"), any(Duration.class));
    }

    @Test
    void login_withValidEmailAndPassword_returnsAuthResponse() {
        LoginRequest request = new LoginRequest("admin@taevas.com", "password");

        when(userRepository.findByPhone("admin@taevas.com")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("admin@taevas.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("password", "encoded-password")).thenReturn(true);
        when(userRoleRepository.findByUser_Id(userId)).thenReturn(List.of(superAdminRole));
        when(jwtTokenProvider.generateAccessToken(anyString(), anyString(), anyString()))
                .thenReturn("access-token");
        when(jwtTokenProvider.generateRefreshToken(anyString()))
                .thenReturn("refresh-token");

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("access-token", response.getToken());
    }

    @Test
    void login_withInvalidPassword_throwsUnauthorizedException() {
        LoginRequest request = new LoginRequest("9876543210", "wrong-password");

        when(userRepository.findByPhone("9876543210")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("wrong-password", "encoded-password")).thenReturn(false);

        assertThrows(UnauthorizedException.class, () -> authService.login(request));
    }

    @Test
    void login_withNonExistentUser_throwsUnauthorizedException() {
        LoginRequest request = new LoginRequest("0000000000", "password");

        when(userRepository.findByPhone("0000000000")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("0000000000")).thenReturn(Optional.empty());

        assertThrows(UnauthorizedException.class, () -> authService.login(request));
    }

    @Test
    void verifyOtp_withValidOtp_returnsAuthResponse() {
        VerifyOtpRequest request = VerifyOtpRequest.builder()
                .phone("9876543210")
                .otp("123456")
                .build();

        when(otpService.verifyOtp("9876543210", "123456")).thenReturn(true);
        when(userRepository.findByPhone("9876543210")).thenReturn(Optional.of(testUser));
        when(userRoleRepository.findByUser_Id(userId)).thenReturn(List.of(superAdminRole));
        when(jwtTokenProvider.generateAccessToken(anyString(), anyString(), anyString()))
                .thenReturn("access-token");
        when(jwtTokenProvider.generateRefreshToken(anyString()))
                .thenReturn("refresh-token");

        AuthResponse response = authService.verifyOtp(request);

        assertNotNull(response);
        assertEquals("access-token", response.getToken());
        assertEquals("refresh-token", response.getRefreshToken());
        assertEquals("SUPERADMIN", response.getUser().getRole());
    }

    @Test
    void verifyOtp_withInvalidOtp_throwsBadRequestException() {
        VerifyOtpRequest request = VerifyOtpRequest.builder()
                .phone("9876543210")
                .otp("000000")
                .build();

        when(otpService.verifyOtp("9876543210", "000000")).thenReturn(false);

        assertThrows(BadRequestException.class, () -> authService.verifyOtp(request));
    }

    @Test
    void refreshToken_withValidToken_returnsNewTokens() {
        RefreshTokenRequest request = RefreshTokenRequest.builder()
                .refreshToken("valid-refresh-token")
                .build();

        when(jwtTokenProvider.validateToken("valid-refresh-token")).thenReturn(true);
        when(jwtTokenProvider.getUserIdFromToken("valid-refresh-token")).thenReturn(userId.toString());
        when(tokenStore.get("refresh:" + userId)).thenReturn("valid-refresh-token");
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(userRoleRepository.findByUser_Id(userId)).thenReturn(List.of(superAdminRole));
        when(jwtTokenProvider.generateAccessToken(anyString(), anyString(), anyString()))
                .thenReturn("new-access-token");
        when(jwtTokenProvider.generateRefreshToken(anyString()))
                .thenReturn("new-refresh-token");

        AuthResponse response = authService.refreshToken(request);

        assertNotNull(response);
        assertEquals("new-access-token", response.getToken());
        assertEquals("new-refresh-token", response.getRefreshToken());

        verify(tokenStore).store(eq("refresh:" + userId), eq("new-refresh-token"), any(Duration.class));
    }

    @Test
    void refreshToken_withInvalidToken_throwsUnauthorizedException() {
        RefreshTokenRequest request = RefreshTokenRequest.builder()
                .refreshToken("invalid-token")
                .build();

        when(jwtTokenProvider.validateToken("invalid-token")).thenReturn(false);

        assertThrows(UnauthorizedException.class, () -> authService.refreshToken(request));
    }

    @Test
    void logout_deletesRefreshToken() {
        authService.logout(userId.toString());

        verify(tokenStore).delete("refresh:" + userId);
    }
}
