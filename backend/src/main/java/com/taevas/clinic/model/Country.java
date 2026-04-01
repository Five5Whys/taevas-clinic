package com.taevas.clinic.model;

import com.taevas.clinic.model.enums.CountryStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "countries")
public class Country extends BaseEntity {

    @Column(name = "code", unique = true, nullable = false, length = 2)
    private String code;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "flag_emoji")
    private String flagEmoji;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private CountryStatus status;

    @Column(name = "currency_code", length = 3)
    private String currencyCode;

    @Column(name = "currency_symbol")
    private String currencySymbol;

    @Column(name = "tax_type")
    private String taxType;

    @Column(name = "tax_rate")
    private BigDecimal taxRate;

    @Column(name = "date_format")
    private String dateFormat;

    @Column(name = "primary_language")
    private String primaryLanguage;

    @Column(name = "secondary_language")
    private String secondaryLanguage;

    @Column(name = "regulatory_body")
    private String regulatoryBody;

    @Column(name = "dial_code", length = 10)
    private String dialCode;

    @Column(name = "config", columnDefinition = "text")
    private String config;
}
