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
public class CountryConfigRequest {

    @NotBlank(message = "Country code is required")
    @Size(min = 2, max = 2, message = "Country code must be exactly 2 characters")
    private String code;

    @NotBlank(message = "Country name is required")
    @Size(max = 100, message = "Country name must not exceed 100 characters")
    private String name;

    private String flagEmoji;

    @NotBlank(message = "Status is required")
    private String status;

    @Size(max = 3, message = "Currency code must not exceed 3 characters")
    private String currencyCode;

    private String currencySymbol;
    private String taxType;
    private BigDecimal taxRate;
    private String dateFormat;
    private String primaryLanguage;
    private String secondaryLanguage;
    private String regulatoryBody;
}
