package com.taevas.clinic.dto.superadmin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IdFormatTemplateDto {

    private String id;
    private String countryId;
    private String entityType;
    private String prefix;
    private String entityCode;
    private String separator;
    private int padding;
    private int startsAt;
    private boolean locked;
    private String preview;
}
