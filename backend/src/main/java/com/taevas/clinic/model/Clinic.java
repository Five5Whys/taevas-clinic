package com.taevas.clinic.model;

import com.taevas.clinic.model.enums.ClinicStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.util.UUID;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "clinics")
public class Clinic extends BaseEntity {

    @Column(name = "country_id")
    private UUID countryId;

    @Column(name = "tenant_id")
    private UUID tenantId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "city")
    private String city;

    @Column(name = "state")
    private String state;

    @Column(name = "address")
    private String address;

    @Column(name = "pincode")
    private String pincode;

    @Column(name = "phone")
    private String phone;

    @Column(name = "email")
    private String email;

    @Column(name = "registration_number")
    private String registrationNumber;

    @Column(name = "license_number")
    private String licenseNumber;

    @Column(name = "license_valid_until")
    private LocalDate licenseValidUntil;

    @Column(name = "logo_url")
    private String logoUrl;

    @Column(name = "patient_code_prefix")
    private String patientCodePrefix;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ClinicStatus status;
}
