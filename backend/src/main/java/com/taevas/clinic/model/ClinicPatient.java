package com.taevas.clinic.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import java.util.UUID;
import java.time.LocalDate;

@Data @SuperBuilder @NoArgsConstructor @AllArgsConstructor @EqualsAndHashCode(callSuper = true)
@Entity @Table(name = "clinic_patients")
public class ClinicPatient extends BaseEntity {
    @Column(name = "clinic_id", nullable = false) private UUID clinicId;
    @Column(name = "user_id") private UUID userId;
    @Column(name = "first_name", nullable = false) private String firstName;
    @Column(name = "last_name") private String lastName;
    @Column(name = "phone") private String phone;
    @Column(name = "email") private String email;
    @Column(name = "gender") private String gender;
    @Column(name = "blood_group") private String bloodGroup;
    @Column(name = "date_of_birth") private LocalDate dateOfBirth;
    @Column(name = "patient_code", unique = true, nullable = false) private String patientCode;
    @Column(name = "status", nullable = false) private String status;
    @Column(name = "last_visit") private LocalDate lastVisit;
    @Column(name = "complete_address", length = 500) private String completeAddress;
    @Column(name = "postal_code", length = 20) private String postalCode;
    @Column(name = "country", length = 100) private String country;
    @Column(name = "state", length = 100) private String state;
    @Column(name = "city", length = 100) private String city;
    @Column(name = "sms_notifications") private Boolean smsNotifications;
    @Column(name = "remarks", columnDefinition = "TEXT") private String remarks;
}
