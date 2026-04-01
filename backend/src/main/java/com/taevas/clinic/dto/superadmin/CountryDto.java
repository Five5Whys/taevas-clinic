package com.taevas.clinic.dto.superadmin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CountryDto {

    private String id;
    private String code;
    private String name;
    private String flagEmoji;
    private String status;
    private String currencyCode;
    private String currencySymbol;
    private String taxType;
    private BigDecimal taxRate;
    private String dateFormat;
    private String primaryLanguage;
    private String secondaryLanguage;
    private String regulatoryBody;
    private String dialCode;
    private String config;
    private String createdAt;
    private String updatedAt;

    private long clinicCount;
    private long doctorCount;
}
