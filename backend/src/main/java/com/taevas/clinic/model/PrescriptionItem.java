package com.taevas.clinic.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import java.util.UUID;

@Data @SuperBuilder @NoArgsConstructor @AllArgsConstructor @EqualsAndHashCode(callSuper = true)
@Entity @Table(name = "prescription_items")
public class PrescriptionItem extends BaseEntity {
    @Column(name = "prescription_id", nullable = false) private UUID prescriptionId;
    @Column(name = "medicine_name", nullable = false) private String medicineName;
    @Column(name = "dosage") private String dosage;
    @Column(name = "frequency") private String frequency;
    @Column(name = "duration") private String duration;
    @Column(name = "instructions") private String instructions;
    @Column(name = "sort_order") private Integer sortOrder;
}
