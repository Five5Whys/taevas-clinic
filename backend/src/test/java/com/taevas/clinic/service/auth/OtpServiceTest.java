package com.taevas.clinic.service.auth;

import com.taevas.clinic.model.OtpVerification;
import com.taevas.clinic.repository.OtpVerificationRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OtpServiceTest {

    @Mock
    private OtpVerificationRepository otpVerificationRepository;

    @Mock
    private SmsProvider smsProvider;

    @InjectMocks
    private OtpService otpService;

    @Test
    void generateOtp_returns6DigitCode() {
        String otp = otpService.generateOtp();

        assertNotNull(otp);
        assertEquals(6, otp.length());
        assertTrue(otp.matches("\\d{6}"), "OTP should contain only digits");
    }

    @Test
    void sendOtp_createsOtpVerificationAndSendsSms() {
        String phone = "9876543210";

        when(otpVerificationRepository.save(any(OtpVerification.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        otpService.sendOtp(phone);

        ArgumentCaptor<OtpVerification> captor = ArgumentCaptor.forClass(OtpVerification.class);
        verify(otpVerificationRepository).save(captor.capture());

        OtpVerification saved = captor.getValue();
        assertEquals(phone, saved.getPhone());
        assertNotNull(saved.getOtpCode());
        assertEquals(6, saved.getOtpCode().length());
        assertFalse(saved.isVerified());
        assertNotNull(saved.getExpiresAt());
        assertTrue(saved.getExpiresAt().isAfter(LocalDateTime.now()));

        verify(smsProvider).sendOtp(eq(phone), eq(saved.getOtpCode()));
    }

    @Test
    void verifyOtp_withValidOtp_returnsTrue() {
        String phone = "9876543210";
        String otp = "123456";

        OtpVerification otpVerification = OtpVerification.builder()
                .phone(phone)
                .otpCode(otp)
                .expiresAt(LocalDateTime.now().plusMinutes(5))
                .verified(false)
                .build();

        when(otpVerificationRepository.findByPhoneAndVerifiedFalseOrderByCreatedAtDesc(phone))
                .thenReturn(Optional.of(otpVerification));
        when(otpVerificationRepository.save(any(OtpVerification.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        boolean result = otpService.verifyOtp(phone, otp);

        assertTrue(result);
        assertTrue(otpVerification.isVerified());
        verify(otpVerificationRepository).save(otpVerification);
    }

    @Test
    void verifyOtp_withExpiredOtp_returnsFalse() {
        String phone = "9876543210";
        String otp = "123456";

        OtpVerification otpVerification = OtpVerification.builder()
                .phone(phone)
                .otpCode(otp)
                .expiresAt(LocalDateTime.now().minusMinutes(1))
                .verified(false)
                .build();

        when(otpVerificationRepository.findByPhoneAndVerifiedFalseOrderByCreatedAtDesc(phone))
                .thenReturn(Optional.of(otpVerification));

        boolean result = otpService.verifyOtp(phone, otp);

        assertFalse(result);
        verify(otpVerificationRepository, never()).save(any());
    }

    @Test
    void verifyOtp_withWrongCode_returnsFalse() {
        String phone = "9876543210";

        OtpVerification otpVerification = OtpVerification.builder()
                .phone(phone)
                .otpCode("123456")
                .expiresAt(LocalDateTime.now().plusMinutes(5))
                .verified(false)
                .build();

        when(otpVerificationRepository.findByPhoneAndVerifiedFalseOrderByCreatedAtDesc(phone))
                .thenReturn(Optional.of(otpVerification));

        boolean result = otpService.verifyOtp(phone, "999999");

        assertFalse(result);
        verify(otpVerificationRepository, never()).save(any());
    }

    @Test
    void verifyOtp_withNoUnverifiedOtp_returnsFalse() {
        String phone = "9876543210";

        when(otpVerificationRepository.findByPhoneAndVerifiedFalseOrderByCreatedAtDesc(phone))
                .thenReturn(Optional.empty());

        boolean result = otpService.verifyOtp(phone, "123456");

        assertFalse(result);
        verify(otpVerificationRepository, never()).save(any());
    }
}
