package com.taevas.clinic.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import java.util.UUID;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data @SuperBuilder @NoArgsConstructor @AllArgsConstructor @EqualsAndHashCode(callSuper = true)
@Entity @Table(name = "invoices")
public class Invoice extends BaseEntity {
    @Column(name = "clinic_id", nullable = false) private UUID clinicId;
    @Column(name = "patient_id", nullable = false) private UUID patientId;
    @Column(name = "encounter_id") private UUID encounterId;
    @Column(name = "invoice_number", unique = true) private String invoiceNumber;
    @Column(name = "subtotal") private BigDecimal subtotal;
    @Column(name = "tax_amount") private BigDecimal taxAmount;
    @Column(name = "discount") private BigDecimal discount;
    @Column(name = "total") private BigDecimal total;
    @Column(name = "status", nullable = false) private String status;
    @Column(name = "payment_method") private String paymentMethod;
    @Column(name = "paid_at") private LocalDateTime paidAt;
}
