package com.taevas.clinic.dto.doctor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class PatientReportRequest {
    @NotNull private String patientId;
    @NotBlank private String title;
    private String reportType;
    private String notes;
    private String status;
    private String reportDate;
}
