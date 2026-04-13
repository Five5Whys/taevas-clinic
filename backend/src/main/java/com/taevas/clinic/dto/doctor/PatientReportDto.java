package com.taevas.clinic.dto.doctor;

import lombok.*;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class PatientReportDto {
    private String id;
    private String patientId;
    private String patientName;
    private String doctorId;
    private String doctorName;
    private String reportType;
    private String title;
    private String notes;
    private String status;
    private String reportDate;
    private String source;
    private String sourceRefId;
    private List<MediaDto> media;
    private String createdAt;

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class MediaDto {
        private String id;
        private String fileName;
        private String fileUrl;
        private String contentType;
        private Long fileSize;
    }
}
