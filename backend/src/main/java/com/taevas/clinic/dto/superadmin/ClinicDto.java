package com.taevas.clinic.dto.superadmin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClinicDto {

    private String id;
    private String countryId;
    private String tenantId;
    private String name;
    private String city;
    private String state;
    private String address;
    private String pincode;
    private String phone;
    private String email;
    private String registrationNumber;
    private String licenseNumber;
    private String licenseValidUntil;
    private String logoUrl;
    private String patientCodePrefix;
    private String status;
    private String createdAt;
    private String updatedAt;

    private String countryName;
    private String countryFlag;
    private List<String> complianceTags;
}
