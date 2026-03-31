package com.taevas.clinic.dto.clinicadmin;
import jakarta.validation.constraints.NotBlank; import lombok.*; import java.util.List; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class PrescriptionRequest { @NotBlank private String encounterId; private String diagnosis, notes; private List<PrescriptionItemRequest> items; }
