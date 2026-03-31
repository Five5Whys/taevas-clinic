package com.taevas.clinic.dto.clinicadmin;
import lombok.*; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class InvoiceItemDto { private String id, description, unitPrice, amount; private Integer quantity; }
