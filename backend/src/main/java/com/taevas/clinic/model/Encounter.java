package com.taevas.clinic.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import java.util.UUID;
import java.time.LocalDate;

@Data @SuperBuilder @NoArgsConstructor @AllArgsConstructor @EqualsAndHashCode(callSuper = true)
@Entity @Table(name = "encounters")
public class Encounter extends BaseEntity {
    @Column(name = "clinic_id", nullable = false) private UUID clinicId;
    @Column(name = "appointment_id") private UUID appointmentId;
    @Column(name = "patient_id", nullable = false) private UUID patientId;
    @Column(name = "doctor_id", nullable = false) private UUID doctorId;
    @Column(name = "chief_complaint") private String chiefComplaint;
    @Column(name = "hpi") private String hpi;
    @Column(name = "examination") private String examination;
    @Column(name = "diagnosis") private String diagnosis;
    @Column(name = "icd10_code") private String icd10Code;
    @Column(name = "treatment_plan") private String treatmentPlan;
    @Column(name = "follow_up_date") private LocalDate followUpDate;
    @Column(name = "status", nullable = false) private String status;
}
