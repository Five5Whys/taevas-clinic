package com.taevas.clinic.dto.superadmin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LocaleSettingsDto {

    private String id;
    private String countryId;
    private String primaryLanguage;
    private String secondaryLanguage;
    private String dateFormat;
    private String weightUnit;
    private String heightUnit;
    private String timezone;
}
