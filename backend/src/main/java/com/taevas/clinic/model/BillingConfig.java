package com.taevas.clinic.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "billing_configs")
public class BillingConfig extends BaseEntity {

    @Column(name = "country_id", unique = true, nullable = false)
    private UUID countryId;

    @Column(name = "currency_symbol")
    private String currencySymbol;

    @Column(name = "currency_code")
    private String currencyCode;

    @Column(name = "tax_rate")
    private BigDecimal taxRate;

    @Column(name = "tax_split")
    private String taxSplit;

    @Column(name = "claim_code")
    private String claimCode;

    @Column(name = "invoice_prefix")
    private String invoicePrefix;

    @Column(name = "invoice_format")
    private String invoiceFormat;

    @Column(name = "toggles", columnDefinition = "text")
    private String toggles;
}
