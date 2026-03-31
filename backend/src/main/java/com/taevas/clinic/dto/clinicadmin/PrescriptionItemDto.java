package com.taevas.clinic.dto.clinicadmin;
import lombok.*; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class PrescriptionItemDto { private String id, medicineName, dosage, frequency, duration, instructions; private Integer sortOrder; }
