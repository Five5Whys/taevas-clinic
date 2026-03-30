package com.taevas.clinic.dto.superadmin;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClinicRequest {

    @NotBlank(message = "Country ID is required")
    private String countryId;

    @NotBlank(message = "Clinic name is required")
    @Size(max = 200, message = "Clinic name must not exceed 200 characters")
    private String name;

    private String city;
    private String state;
    private String address;
    private String pincode;
    private String phone;

    @Email(message = "Email must be valid")
    private String email;

    private String registrationNumber;
    private String licenseNumber;
    private String licenseValidUntil;
    private String logoUrl;

    @NotBlank(message = "Status is required")
    private String status;
}
