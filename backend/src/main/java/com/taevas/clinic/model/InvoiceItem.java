package com.taevas.clinic.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import java.util.UUID;
import java.math.BigDecimal;

@Data @SuperBuilder @NoArgsConstructor @AllArgsConstructor @EqualsAndHashCode(callSuper = true)
@Entity @Table(name = "invoice_items")
public class InvoiceItem extends BaseEntity {
    @Column(name = "invoice_id", nullable = false) private UUID invoiceId;
    @Column(name = "description", nullable = false) private String description;
    @Column(name = "quantity") private Integer quantity;
    @Column(name = "unit_price", nullable = false) private BigDecimal unitPrice;
    @Column(name = "amount", nullable = false) private BigDecimal amount;
    @Column(name = "sort_order") private Integer sortOrder;
}
