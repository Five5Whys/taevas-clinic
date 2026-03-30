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
public class FieldRequest {

    @NotBlank(message = "Scope is required")
    private String scope;

    private String countryId;

    @NotBlank(message = "Section is required")
    private String section;

    @NotBlank(message = "Field key is required")
    private String fieldKey;

    @NotBlank(message = "Label is required")
    private String label;

    @NotBlank(message = "Field type is required")
    private String fieldType;

    private boolean locked;
    private boolean required;
    private boolean removable;
}
