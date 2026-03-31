package com.taevas.clinic.dto.clinicadmin;
import lombok.*; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class DeviceReportDto { private String id, clinicId, patientId, patientName, doctorId, doctorName, deviceName, reportType, fileUrl, findings, status, reportedAt, createdAt; }
