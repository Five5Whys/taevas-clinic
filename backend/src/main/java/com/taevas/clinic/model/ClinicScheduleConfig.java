package com.taevas.clinic.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import java.util.UUID;

@Data @SuperBuilder @NoArgsConstructor @AllArgsConstructor @EqualsAndHashCode(callSuper = true)
@Entity @Table(name = "clinic_schedule_config")
public class ClinicScheduleConfig extends BaseEntity {
    @Column(name = "clinic_id", unique = true) private UUID clinicId;
    @Column(name = "default_slot_duration") private Integer defaultSlotDuration;
    @Column(name = "max_patients_per_slot") private Integer maxPatientsPerSlot;
    @Column(name = "buffer_between_slots") private Integer bufferBetweenSlots;
}
