package com.taevas.clinic.dto.clinicadmin;
import lombok.*; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ComplianceItemDto { private String moduleName, description; private Boolean enabled; }
