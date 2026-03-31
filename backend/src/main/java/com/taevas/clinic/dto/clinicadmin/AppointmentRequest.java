package com.taevas.clinic.dto.clinicadmin;
import jakarta.validation.constraints.NotBlank; import lombok.*; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AppointmentRequest { @NotBlank private String patientId; @NotBlank private String doctorId; @NotBlank private String appointmentDate; @NotBlank private String startTime; private String endTime, type, notes; }
