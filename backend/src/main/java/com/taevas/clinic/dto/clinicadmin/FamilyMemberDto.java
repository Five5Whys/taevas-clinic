package com.taevas.clinic.dto.clinicadmin;
import lombok.*; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class FamilyMemberDto { private String id, patientId, patientName, relationship; }
