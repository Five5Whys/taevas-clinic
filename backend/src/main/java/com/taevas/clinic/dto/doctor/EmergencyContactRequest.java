package com.taevas.clinic.dto.doctor;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class EmergencyContactRequest {
    private String relationship;
    @NotBlank private String fullName;
    @NotBlank private String contactNumber;
}
