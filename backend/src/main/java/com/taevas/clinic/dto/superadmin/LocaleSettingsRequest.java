package com.taevas.clinic.dto.superadmin;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LocaleSettingsRequest {

    @NotBlank(message = "Primary language is required")
    private String primaryLanguage;

    private String secondaryLanguage;

    @NotBlank(message = "Date format is required")
    private String dateFormat;

    @NotBlank(message = "Weight unit is required")
    private String weightUnit;

    @NotBlank(message = "Height unit is required")
    private String heightUnit;

    @NotBlank(message = "Timezone is required")
    private String timezone;
}
