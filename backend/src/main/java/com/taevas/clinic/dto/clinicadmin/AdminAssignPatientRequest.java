package com.taevas.clinic.dto.clinicadmin;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminAssignPatientRequest {

    @NotNull(message = "patientId is required")
    private UUID patientId;

    @NotNull(message = "doctorId is required")
    private UUID doctorId;
}
