package com.taevas.clinic.dto.clinicadmin;
import jakarta.validation.constraints.NotBlank; import lombok.*; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class PrescriptionItemRequest { @NotBlank private String medicineName; private String dosage, frequency, duration, instructions; }
