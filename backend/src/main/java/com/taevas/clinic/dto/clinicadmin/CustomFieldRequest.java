package com.taevas.clinic.dto.clinicadmin;
import jakarta.validation.constraints.NotBlank; import lombok.*; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CustomFieldRequest { @NotBlank private String section; @NotBlank private String fieldKey; @NotBlank private String label; @NotBlank private String fieldType; private Boolean required; private Integer sortOrder; }
