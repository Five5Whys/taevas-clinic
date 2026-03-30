package com.taevas.clinic.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {

    private String id;
    private String phone;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
    private String profilePicture;
    private String clinicId;
    private String clinicName;
}
