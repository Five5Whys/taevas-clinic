package com.taevas.clinic.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {

    @NotBlank(message = "Identifier (phone or email) is required")
    private String identifier;

    @NotBlank(message = "Password is required")
    private String password;
}
