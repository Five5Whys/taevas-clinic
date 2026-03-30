package com.taevas.clinic.dto.superadmin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComplianceModuleDto {

    private String id;
    private String moduleKey;
    private String moduleName;
    private String description;
    private boolean enabled;
    private int sortOrder;
}
