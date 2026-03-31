package com.taevas.clinic.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import java.util.UUID;

@Data @SuperBuilder @NoArgsConstructor @AllArgsConstructor @EqualsAndHashCode(callSuper = true)
@Entity @Table(name = "clinic_staff")
public class ClinicStaff extends BaseEntity {
    @Column(name = "clinic_id", nullable = false) private UUID clinicId;
    @Column(name = "user_id") private UUID userId;
    @Column(name = "name", nullable = false) private String name;
    @Column(name = "role", nullable = false) private String role;
    @Column(name = "specialization") private String specialization;
    @Column(name = "phone") private String phone;
    @Column(name = "email") private String email;
    @Column(name = "registration_no") private String registrationNo;
    @Column(name = "status", nullable = false) private String status;
}
