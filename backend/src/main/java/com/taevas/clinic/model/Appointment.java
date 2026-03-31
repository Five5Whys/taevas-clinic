package com.taevas.clinic.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import java.util.UUID;
import java.time.LocalDate;
import java.time.LocalTime;

@Data @SuperBuilder @NoArgsConstructor @AllArgsConstructor @EqualsAndHashCode(callSuper = true)
@Entity @Table(name = "appointments")
public class Appointment extends BaseEntity {
    @Column(name = "clinic_id", nullable = false) private UUID clinicId;
    @Column(name = "patient_id", nullable = false) private UUID patientId;
    @Column(name = "doctor_id", nullable = false) private UUID doctorId;
    @Column(name = "appointment_date", nullable = false) private LocalDate appointmentDate;
    @Column(name = "start_time", nullable = false) private LocalTime startTime;
    @Column(name = "end_time") private LocalTime endTime;
    @Column(name = "type", nullable = false) private String type;
    @Column(name = "status", nullable = false) private String status;
    @Column(name = "notes") private String notes;
    @Column(name = "token_number") private Integer tokenNumber;
}
