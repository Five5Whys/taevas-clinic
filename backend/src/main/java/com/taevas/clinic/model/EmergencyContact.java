package com.taevas.clinic.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import java.util.UUID;

@Data @SuperBuilder @NoArgsConstructor @AllArgsConstructor @EqualsAndHashCode(callSuper = true)
@Entity @Table(name = "emergency_contacts")
public class EmergencyContact extends BaseEntity {
    @Column(name = "patient_id", nullable = false) private UUID patientId;
    @Column(name = "relationship", length = 50) private String relationship;
    @Column(name = "full_name", nullable = false) private String fullName;
    @Column(name = "contact_number", nullable = false, length = 20) private String contactNumber;
}
