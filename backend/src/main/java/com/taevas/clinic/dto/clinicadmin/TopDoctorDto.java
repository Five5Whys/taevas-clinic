package com.taevas.clinic.dto.clinicadmin;
import lombok.*; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class TopDoctorDto { private String doctorId, doctorName; private long appointmentCount; }
