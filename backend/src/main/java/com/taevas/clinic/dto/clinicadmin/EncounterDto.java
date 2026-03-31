package com.taevas.clinic.dto.clinicadmin;
import lombok.*; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class EncounterDto { private String id, clinicId, appointmentId, patientId, patientName, doctorId, doctorName, chiefComplaint, hpi, examination, diagnosis, icd10Code, treatmentPlan, followUpDate, status, createdAt; }
