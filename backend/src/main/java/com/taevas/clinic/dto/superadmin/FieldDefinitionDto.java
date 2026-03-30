package com.taevas.clinic.dto.superadmin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FieldDefinitionDto {

    private String id;
    private String scope;
    private String countryId;
    private String section;
    private String fieldKey;
    private String label;
    private String fieldType;
    private boolean locked;
    private boolean required;
    private boolean removable;
    private int sortOrder;
}
