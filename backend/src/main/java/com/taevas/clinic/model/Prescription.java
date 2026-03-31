package com.taevas.clinic.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import java.util.UUID;

@Data @SuperBuilder @NoArgsConstructor @AllArgsConstructor @EqualsAndHashCode(callSuper = true)
@Entity @Table(name = "prescriptions")
public class Prescription extends BaseEntity {
    @Column(name = "clinic_id", nullable = false) private UUID clinicId;
    @Column(name = "encounter_id") private UUID encounterId;
    @Column(name = "patient_id", nullable = false) private UUID patientId;
    @Column(name = "doctor_id", nullable = false) private UUID doctorId;
    @Column(name = "diagnosis") private String diagnosis;
    @Column(name = "notes") private String notes;
    @Column(name = "status", nullable = false) private String status;
}
