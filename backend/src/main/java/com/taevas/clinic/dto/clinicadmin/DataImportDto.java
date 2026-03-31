package com.taevas.clinic.dto.clinicadmin;
import lombok.*; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class DataImportDto { private String id, clinicId, importType, fileName, status, errorLog, createdAt; private Integer totalRecords, successCount, failCount; }
