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
public class DoctorRosterDto {

    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String systemId;
    private List<String> roles;
    private String speciality;
    private String clinic;
    private String registration;
    private String country;
    private String countryFlag;
}
