package com.taevas.clinic.dto.superadmin;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TechStackRequest {

    @NotBlank(message = "Name is required")
    @Size(max = 100)
    private String name;

    @NotBlank(message = "Category is required")
    @Size(max = 50)
    private String category;

    @Size(max = 50)
    private String version;

    @Size(max = 500)
    private String description;

    private String status;

    @Size(max = 200)
    private String usageArea;
}
