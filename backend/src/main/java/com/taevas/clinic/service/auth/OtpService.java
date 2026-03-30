package com.taevas.clinic.service.auth;

import com.taevas.clinic.model.OtpVerification;
import com.taevas.clinic.repository.OtpVerificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class OtpService {

    private final OtpVerificationRepository otpVerificationRepository;
    private final SmsProvider smsProvider;

    private static final SecureRandom RANDOM = new SecureRandom();
    private static final int OTP_LENGTH = 6;
    private static final int OTP_EXPIRY_MINUTES = 5;

    public String generateOtp() {
        int otp = RANDOM.nextInt((int) Math.pow(10, OTP_LENGTH));
        return String.format("%0" + OTP_LENGTH + "d", otp);
    }

    @Transactional
    public void sendOtp(String phone) {
        String otp = generateOtp();

        OtpVerification otpVerification = OtpVerification.builder()
                .phone(phone)
                .otpCode(otp)
                .expiresAt(LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES))
                .verified(false)
                .build();

        otpVerificationRepository.save(otpVerification);
        smsProvider.sendOtp(phone, otp);

        log.debug("OTP sent to phone: {}", phone);
    }

    @Transactional
    public boolean verifyOtp(String phone, String otp) {
        Optional<OtpVerification> optionalOtp = otpVerificationRepository
                .findByPhoneAndVerifiedFalseOrderByCreatedAtDesc(phone);

        if (optionalOtp.isEmpty()) {
            log.warn("No unverified OTP found for phone: {}", phone);
            return false;
        }

        OtpVerification otpVerification = optionalOtp.get();

        if (otpVerification.getExpiresAt().isBefore(LocalDateTime.now())) {
            log.warn("OTP expired for phone: {}", phone);
            return false;
        }

        if (!otpVerification.getOtpCode().equals(otp)) {
            log.warn("OTP mismatch for phone: {}", phone);
            return false;
        }

        otpVerification.setVerified(true);
        otpVerificationRepository.save(otpVerification);

        log.debug("OTP verified successfully for phone: {}", phone);
        return true;
    }

    @Scheduled(fixedRate = 3600000)
    @Transactional
    public void cleanExpiredOtps() {
        log.info("Cleaning expired OTPs");
        otpVerificationRepository.deleteByExpiresAtBefore(LocalDateTime.now());
    }
}
