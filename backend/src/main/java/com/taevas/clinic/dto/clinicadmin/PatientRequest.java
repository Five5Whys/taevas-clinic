package com.taevas.clinic.dto.clinicadmin;
import jakarta.validation.constraints.NotBlank; import lombok.*; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class PatientRequest { @NotBlank private String firstName; private String lastName, phone, email, gender, bloodGroup, dateOfBirth; }
