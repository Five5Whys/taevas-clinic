package com.taevas.clinic.dto.clinicadmin;
import lombok.*; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class WhatsAppConfigDto { private String id, clinicId, phoneNumber, welcomeMessage; private Boolean enabled, autoReply; }
