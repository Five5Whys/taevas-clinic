package com.taevas.clinic.service.auth;

public interface SmsProvider {

    void sendOtp(String phone, String otp);
}
