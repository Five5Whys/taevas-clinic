package com.taevas.clinic.dto.clinicadmin;
import lombok.*; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class InvoiceSettingsDto { private String invoicePrefix, taxRate; private Boolean taxEnabled; }
