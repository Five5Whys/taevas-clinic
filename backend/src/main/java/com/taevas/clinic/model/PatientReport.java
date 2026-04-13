package com.taevas.clinic.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import java.time.LocalDate;
import java.util.UUID;

@Data @SuperBuilder @NoArgsConstructor @AllArgsConstructor @EqualsAndHashCode(callSuper = true)
@Entity @Table(name = "patient_reports")
public class PatientReport extends BaseEntity {
    @Column(name = "clinic_id", nullable = false) private UUID clinicId;
    @Column(name = "patient_id", nullable = false) private UUID patientId;
    @Column(name = "doctor_id") private UUID doctorId;
    @Column(name = "report_type", length = 50) private String reportType;
    @Column(name = "title", nullable = false) private String title;
    @Column(name = "notes", columnDefinition = "TEXT") private String notes;
    @Column(name = "status", length = 30) private String status;
    @Column(name = "report_date") private LocalDate reportDate;
    @Column(name = "source", nullable = false, length = 30) private String source;
    @Column(name = "source_ref_id", length = 255) private String sourceRefId;
}
