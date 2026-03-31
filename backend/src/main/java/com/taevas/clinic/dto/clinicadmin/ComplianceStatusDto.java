package com.taevas.clinic.dto.clinicadmin;
import lombok.*; import java.util.List; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ComplianceStatusDto { private String countryName; private List<ComplianceItemDto> items; }
