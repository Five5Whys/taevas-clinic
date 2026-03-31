package com.taevas.clinic.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import java.util.UUID;
import java.math.BigDecimal;

@Data @SuperBuilder @NoArgsConstructor @AllArgsConstructor @EqualsAndHashCode(callSuper = true)
@Entity @Table(name = "clinic_billing_config")
public class ClinicBillingConfig extends BaseEntity {
    @Column(name = "clinic_id", unique = true) private UUID clinicId;
    @Column(name = "consultation_fee") private BigDecimal consultationFee;
    @Column(name = "follow_up_fee") private BigDecimal followUpFee;
    @Column(name = "tax_enabled") private Boolean taxEnabled;
    @Column(name = "tax_rate") private BigDecimal taxRate;
    @Column(name = "invoice_prefix") private String invoicePrefix;
    @Column(name = "payment_modes") private String paymentModes;
}
