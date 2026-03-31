package com.taevas.clinic.dto.clinicadmin;
import lombok.*; import java.util.List; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class PrescriptionDto { private String id, clinicId, encounterId, patientId, patientName, doctorId, doctorName, diagnosis, notes, status, createdAt; private List<PrescriptionItemDto> items; }
