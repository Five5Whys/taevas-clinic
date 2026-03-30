package com.taevas.clinic.service.auth;

import com.taevas.clinic.dto.auth.AuthResponse;
import com.taevas.clinic.dto.auth.LoginRequest;
import com.taevas.clinic.dto.auth.RefreshTokenRequest;
import com.taevas.clinic.dto.auth.SendOtpRequest;
import com.taevas.clinic.dto.auth.UserDto;
import com.taevas.clinic.dto.auth.VerifyOtpRequest;
import com.taevas.clinic.exception.BadRequestException;
import com.taevas.clinic.exception.UnauthorizedException;
import com.taevas.clinic.model.User;
import com.taevas.clinic.model.UserRole;
import com.taevas.clinic.model.enums.Role;
import com.taevas.clinic.repository.UserRepository;
import com.taevas.clinic.repository.UserRoleRepository;
import com.taevas.clinic.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final OtpService otpService;
    private final JwtTokenProvider jwtTokenProvider;
    private final TokenStore tokenStore;
    private final PasswordEncoder passwordEncoder;

    private static final Duration REFRESH_TOKEN_TTL = Duration.ofDays(7);
    private static final String REFRESH_TOKEN_PREFIX = "refresh:";

    public void sendOtp(SendOtpRequest request) {
        otpService.sendOtp(request.getPhone());
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String identifier = request.getIdentifier();
        User user = userRepository.findByPhone(identifier)
                .or(() -> userRepository.findByEmail(identifier))
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

        if (user.getPasswordHash() == null || !passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid credentials");
        }

        List<UserRole> roles = userRoleRepository.findByUser_Id(user.getId());
        String primaryRole = roles.isEmpty() ? Role.PATIENT.name() : roles.get(0).getRole().name();
        String tenantId = user.getTenantId() != null ? user.getTenantId().toString() : null;

        String accessToken = jwtTokenProvider.generateAccessToken(user.getId().toString(), primaryRole, tenantId);
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId().toString());

        tokenStore.store(REFRESH_TOKEN_PREFIX + user.getId().toString(), refreshToken, REFRESH_TOKEN_TTL);

        UserDto userDto = buildUserDto(user, roles);
        log.info("User logged in via password: {}", user.getId());

        return AuthResponse.builder()
                .token(accessToken)
                .refreshToken(refreshToken)
                .user(userDto)
                .build();
    }

    @Transactional
    public AuthResponse verifyOtp(VerifyOtpRequest request) {
        boolean verified = otpService.verifyOtp(request.getPhone(), request.getOtp());
        if (!verified) {
            throw new BadRequestException("Invalid or expired OTP");
        }

        User user = userRepository.findByPhone(request.getPhone())
                .orElseGet(() -> createNewUser(request.getPhone()));

        List<UserRole> roles = userRoleRepository.findByUser_Id(user.getId());

        String primaryRole = roles.isEmpty() ? Role.PATIENT.name() : roles.get(0).getRole().name();
        String tenantId = user.getTenantId() != null ? user.getTenantId().toString() : null;

        String accessToken = jwtTokenProvider.generateAccessToken(
                user.getId().toString(), primaryRole, tenantId);
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId().toString());

        tokenStore.store(
                REFRESH_TOKEN_PREFIX + user.getId().toString(),
                refreshToken,
                REFRESH_TOKEN_TTL);

        UserDto userDto = buildUserDto(user, roles);

        log.info("User authenticated successfully: {}", user.getId());

        return AuthResponse.builder()
                .token(accessToken)
                .refreshToken(refreshToken)
                .user(userDto)
                .build();
    }

    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String token = request.getRefreshToken();

        if (!jwtTokenProvider.validateToken(token)) {
            throw new UnauthorizedException("Invalid refresh token");
        }

        String userId = jwtTokenProvider.getUserIdFromToken(token);
        String storedToken = tokenStore.get(REFRESH_TOKEN_PREFIX + userId);

        if (storedToken == null || !storedToken.equals(token)) {
            throw new UnauthorizedException("Refresh token not found or revoked");
        }

        User user = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        List<UserRole> roles = userRoleRepository.findByUser_Id(user.getId());

        String primaryRole = roles.isEmpty() ? Role.PATIENT.name() : roles.get(0).getRole().name();
        String tenantId = user.getTenantId() != null ? user.getTenantId().toString() : null;

        String newAccessToken = jwtTokenProvider.generateAccessToken(
                user.getId().toString(), primaryRole, tenantId);
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(user.getId().toString());

        tokenStore.store(
                REFRESH_TOKEN_PREFIX + userId,
                newRefreshToken,
                REFRESH_TOKEN_TTL);

        UserDto userDto = buildUserDto(user, roles);

        log.info("Token refreshed for user: {}", userId);

        return AuthResponse.builder()
                .token(newAccessToken)
                .refreshToken(newRefreshToken)
                .user(userDto)
                .build();
    }

    public void logout(String userId) {
        tokenStore.delete(REFRESH_TOKEN_PREFIX + userId);
        log.info("User logged out: {}", userId);
    }

    private User createNewUser(String phone) {
        User user = User.builder()
                .phone(phone)
                .active(true)
                .build();
        user = userRepository.save(user);

        UserRole patientRole = UserRole.builder()
                .user(user)
                .role(Role.PATIENT)
                .build();
        userRoleRepository.save(patientRole);

        log.info("New user created with phone: {}", phone);
        return user;
    }

    private UserDto buildUserDto(User user, List<UserRole> roles) {
        String primaryRole = roles.isEmpty() ? Role.PATIENT.name() : roles.get(0).getRole().name();

        UserDto.UserDtoBuilder builder = UserDto.builder()
                .id(user.getId().toString())
                .phone(user.getPhone())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(primaryRole)
                .profilePicture(user.getProfilePicture());

        if (user.getTenantId() != null) {
            builder.clinicId(user.getTenantId().toString());
        }

        return builder.build();
    }
}
