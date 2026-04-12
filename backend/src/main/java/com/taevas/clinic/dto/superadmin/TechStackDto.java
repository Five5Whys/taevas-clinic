package com.taevas.clinic.dto.superadmin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TechStackDto {

    private String id;
    private String name;
    private String category;
    private String version;
    private String description;
    private String status;
    private String usageArea;
    private String createdAt;
    private String updatedAt;
}
