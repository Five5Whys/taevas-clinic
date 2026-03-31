package com.taevas.clinic.dto.clinicadmin;
import lombok.*; import java.util.List; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class FamilyDto { private String id, clinicId, name, primaryPatientId, primaryPatientName; private List<FamilyMemberDto> members; }
