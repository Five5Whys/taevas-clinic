package com.taevas.clinic.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import java.util.UUID;

@Data @SuperBuilder @NoArgsConstructor @AllArgsConstructor @EqualsAndHashCode(callSuper = true)
@Entity @Table(name = "family_members")
public class FamilyMember extends BaseEntity {
    @Column(name = "family_group_id", nullable = false) private UUID familyGroupId;
    @Column(name = "patient_id", nullable = false) private UUID patientId;
    @Column(name = "relationship", nullable = false) private String relationship;
}
