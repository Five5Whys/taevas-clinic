package com.taevas.clinic.dto.superadmin;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BillingConfigRequest {

    @NotBlank(message = "Currency symbol is required")
    private String currencySymbol;

    @NotBlank(message = "Currency code is required")
    @Size(max = 3, message = "Currency code must not exceed 3 characters")
    private String currencyCode;

    private BigDecimal taxRate;
    private String taxSplit;
    private String claimCode;
    private String invoicePrefix;
    private String invoiceFormat;
    private String toggles;
}
