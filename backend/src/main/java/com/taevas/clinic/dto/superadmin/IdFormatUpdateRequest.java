package com.taevas.clinic.dto.superadmin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IdFormatUpdateRequest {

    private String prefix;
    private String entityCode;
    private String separator;
    private int padding;
    private int startsAt;
}
