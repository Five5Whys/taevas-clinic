package com.taevas.clinic.dto.clinicadmin;
import jakarta.validation.constraints.NotBlank; import lombok.*; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class EncounterRequest { @NotBlank private String appointmentId; private String chiefComplaint, hpi, examination, diagnosis, icd10Code, treatmentPlan, followUpDate; }
