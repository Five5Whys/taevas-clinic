package com.taevas.clinic.dto.clinicadmin;
import jakarta.validation.constraints.NotBlank; import lombok.*; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class StaffRequest { @NotBlank private String name; @NotBlank private String role; private String specialization, phone, email, registrationNo; }
