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
public class BillingConfigDto {

    private String id;
    private String countryId;
    private String currencySymbol;
    private String currencyCode;
    private BigDecimal taxRate;
    private String taxSplit;
    private String claimCode;
    private String invoicePrefix;
    private String invoiceFormat;
    private String toggles;
}
