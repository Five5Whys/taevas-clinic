package com.taevas.clinic.dto.doctor;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoctorProfileRequest {

    private List<String> qualifications;
    private List<String> specializations;
    private Integer experienceYears;
    private String medicalLicenseNumber;
    private String licenseIssuedCountry;
    private String licenseIssuedState;
    private String licenseCertificateUrl;
    private String panCardNumber;
    private String panCardAttachmentUrl;
    private String signatureUrl;
    private String email;
    private String homeAddress;
    private String state;
    private String city;
    private String zipCode;
    private String remarks;
}
