package com.taevas.clinic.dto.superadmin;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FieldReorderRequest {

    @NotEmpty(message = "Ordered IDs list must not be empty")
    private List<String> orderedIds;
}
