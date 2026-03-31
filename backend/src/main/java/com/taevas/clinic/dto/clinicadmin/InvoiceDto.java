package com.taevas.clinic.dto.clinicadmin;
import lombok.*; import java.util.List; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class InvoiceDto { private String id, clinicId, patientId, patientName, encounterId, invoiceNumber, subtotal, taxAmount, discount, total, status, paymentMethod, paidAt, createdAt; private List<InvoiceItemDto> items; }
