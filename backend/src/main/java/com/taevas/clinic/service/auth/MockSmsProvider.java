package com.taevas.clinic.service.auth;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@ConditionalOnProperty(name = "app.sms.provider", havingValue = "mock")
public class MockSmsProvider implements SmsProvider {

    @Override
    public void sendOtp(String phone, String otp) {
        log.info("MOCK SMS: OTP {} sent to {}", otp, phone);
    }
}
