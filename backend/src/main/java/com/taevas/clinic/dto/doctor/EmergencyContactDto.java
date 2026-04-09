package com.taevas.clinic.dto.doctor;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class EmergencyContactDto {
    private String id;
    private String patientId;
    private String relationship;
    private String fullName;
    private String contactNumber;
    private String createdAt;
}
