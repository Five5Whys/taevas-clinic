package com.taevas.clinic.dto.doctor;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssignPatientsRequest {

    @NotEmpty(message = "At least one patient ID is required")
    private List<UUID> patientIds;

    private String remarks;
}
