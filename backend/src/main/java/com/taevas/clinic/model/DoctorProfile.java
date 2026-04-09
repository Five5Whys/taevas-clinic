package com.taevas.clinic.model;

import com.taevas.clinic.model.enums.ProfileStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "doctor_profiles")
public class DoctorProfile extends BaseEntity {

    @Column(name = "user_id", nullable = false, unique = true)
    private UUID userId;

    @Column(name = "qualifications", columnDefinition = "TEXT")
    private String qualifications;

    @Column(name = "specializations", columnDefinition = "TEXT")
    private String specializations;

    @Column(name = "experience_years")
    private Integer experienceYears;

    @Column(name = "medical_license_number", length = 100)
    private String medicalLicenseNumber;

    @Column(name = "license_issued_country", length = 100)
    private String licenseIssuedCountry;

    @Column(name = "license_issued_state", length = 100)
    private String licenseIssuedState;

    @Column(name = "license_certificate_url", length = 500)
    private String licenseCertificateUrl;

    @Column(name = "pan_card_number", length = 20)
    private String panCardNumber;

    @Column(name = "pan_card_attachment_url", length = 500)
    private String panCardAttachmentUrl;

    @Column(name = "signature_url", length = 500)
    private String signatureUrl;

    @Column(name = "email", length = 255)
    private String email;

    @Column(name = "home_address", columnDefinition = "TEXT")
    private String homeAddress;

    @Column(name = "state", length = 100)
    private String state;

    @Column(name = "city", length = 100)
    private String city;

    @Column(name = "zip_code", length = 20)
    private String zipCode;

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ProfileStatus status;
}
