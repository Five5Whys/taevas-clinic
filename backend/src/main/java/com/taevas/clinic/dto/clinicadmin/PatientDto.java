package com.taevas.clinic.dto.clinicadmin;
import lombok.*; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class PatientDto { private String id, clinicId, userId, firstName, lastName, phone, email, gender, bloodGroup, dateOfBirth, status, lastVisit, createdAt; }
