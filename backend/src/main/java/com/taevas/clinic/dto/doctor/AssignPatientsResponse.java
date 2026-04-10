package com.taevas.clinic.dto.doctor;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssignPatientsResponse {

    private UUID doctorId;
    private int totalRequested;
    private int successfullyAssigned;
    private int alreadyAssigned;
    private List<UUID> assignedPatientIds;
    private List<UUID> alreadyAssignedPatientIds;
    private LocalDateTime assignmentTime;
}
