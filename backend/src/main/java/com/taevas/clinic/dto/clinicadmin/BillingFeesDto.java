package com.taevas.clinic.dto.clinicadmin;
import lombok.*; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class BillingFeesDto { private String consultationFee, followUpFee, taxRate, invoicePrefix, paymentModes; private Boolean taxEnabled; }
