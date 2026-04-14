package com.taevas.clinic.dto.clinicadmin;
import lombok.*; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class PatientDto { private String id, clinicId, userId, patientCode, firstName, lastName, phone, email, gender, bloodGroup, dateOfBirth, status, lastVisit, createdAt, assignedDoctorId, assignedDoctorName, completeAddress, postalCode, country, state, city, remarks; private Boolean smsNotifications; private Boolean emailNotifications; }
