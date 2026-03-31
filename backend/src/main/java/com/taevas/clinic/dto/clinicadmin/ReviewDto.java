package com.taevas.clinic.dto.clinicadmin;
import lombok.*; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ReviewDto { private String id, clinicId, patientId, patientName, reviewText, source, status, createdAt; private Integer rating; }
