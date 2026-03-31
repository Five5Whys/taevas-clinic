package com.taevas.clinic.dto.clinicadmin;
import lombok.*; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AppointmentDto { private String id, clinicId, patientId, patientName, doctorId, doctorName, appointmentDate, startTime, endTime, type, status, notes, createdAt; private Integer tokenNumber; }
