package com.taevas.clinic.dto.clinicadmin;
import lombok.*; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CustomFieldDto { private String id, clinicId, section, fieldKey, label, fieldType; private Boolean required; private Integer sortOrder; }
