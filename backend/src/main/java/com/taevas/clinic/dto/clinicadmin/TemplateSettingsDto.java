package com.taevas.clinic.dto.clinicadmin;
import lombok.*; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class TemplateSettingsDto { private String id, clinicId, templateType, configJson, filePath; }
