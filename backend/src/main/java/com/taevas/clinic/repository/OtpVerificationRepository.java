package com.taevas.clinic.repository;

import com.taevas.clinic.model.OtpVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OtpVerificationRepository extends JpaRepository<OtpVerification, UUID> {

    Optional<OtpVerification> findByPhoneAndVerifiedFalseOrderByCreatedAtDesc(String phone);

    void deleteByExpiresAtBefore(LocalDateTime dateTime);
}
