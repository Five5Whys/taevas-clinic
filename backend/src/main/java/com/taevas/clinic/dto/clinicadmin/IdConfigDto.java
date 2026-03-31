package com.taevas.clinic.dto.clinicadmin;
import lombok.*; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class IdConfigDto { private String id, countryId, entityType, prefix, entityCode, separator; private Integer padding, startsAt; private Boolean locked; }
