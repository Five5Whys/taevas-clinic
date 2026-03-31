package com.taevas.clinic.dto.clinicadmin;
import lombok.*; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class StaffDto { private String id, clinicId, userId, name, role, specialization, phone, email, registrationNo, status, createdAt; }
