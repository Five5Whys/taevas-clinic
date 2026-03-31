package com.taevas.clinic.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import java.util.UUID;
import java.time.LocalTime;

@Data @SuperBuilder @NoArgsConstructor @AllArgsConstructor @EqualsAndHashCode(callSuper = true)
@Entity @Table(name = "doctor_schedules")
public class DoctorSchedule extends BaseEntity {
    @Column(name = "staff_id", nullable = false) private UUID staffId;
    @Column(name = "clinic_id", nullable = false) private UUID clinicId;
    @Column(name = "day_of_week", nullable = false) private Integer dayOfWeek;
    @Column(name = "start_time", nullable = false) private LocalTime startTime;
    @Column(name = "end_time", nullable = false) private LocalTime endTime;
    @Column(name = "slot_duration") private Integer slotDuration;
    @Column(name = "max_patients") private Integer maxPatients;
    @Column(name = "buffer_minutes") private Integer bufferMinutes;
    @Column(name = "enabled") private Boolean enabled;
}
