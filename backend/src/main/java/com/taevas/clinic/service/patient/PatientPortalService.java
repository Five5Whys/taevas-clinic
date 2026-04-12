package com.taevas.clinic.service.patient;

import com.taevas.clinic.dto.clinicadmin.*;
import com.taevas.clinic.exception.ResourceNotFoundException;
import com.taevas.clinic.model.*;
import com.taevas.clinic.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor @Transactional(readOnly = true)
public class PatientPortalService {
    private final AppointmentRepository appointmentRepo;
    private final PrescriptionRepository rxRepo;
    private final PrescriptionItemRepository itemRepo;
    private final FamilyGroupRepository familyRepo;
    private final FamilyMemberRepository memberRepo;
    private final ClinicPatientRepository patientRepo;
    private final ClinicStaffRepository staffRepo;

    public PatientDto getProfile(UUID clinicId, UUID userId) {
        ClinicPatient p = patientRepo.findByUserIdAndClinicId(userId, clinicId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "userId", userId));
        return toDto(p);
    }

    @Transactional public PatientDto updateProfile(UUID clinicId, UUID userId, PatientRequest r) {
        ClinicPatient p = patientRepo.findByUserIdAndClinicId(userId, clinicId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "userId", userId));
        p.setFirstName(r.getFirstName()); p.setLastName(r.getLastName()); p.setPhone(r.getPhone());
        p.setEmail(r.getEmail()); p.setGender(r.getGender()); p.setBloodGroup(r.getBloodGroup());
        if (r.getDateOfBirth() != null) p.setDateOfBirth(java.time.LocalDate.parse(r.getDateOfBirth()));
        p.setCompleteAddress(r.getCompleteAddress()); p.setPostalCode(r.getPostalCode());
        p.setCountry(r.getCountry()); p.setState(r.getState()); p.setCity(r.getCity());
        p.setSmsNotifications(r.getSmsNotifications()); p.setRemarks(r.getRemarks());
        return toDto(patientRepo.save(p));
    }

    private PatientDto toDto(ClinicPatient p) {
        return PatientDto.builder().id(p.getId().toString()).clinicId(p.getClinicId().toString())
            .userId(p.getUserId() != null ? p.getUserId().toString() : null)
            .patientCode(p.getPatientCode())
            .firstName(p.getFirstName()).lastName(p.getLastName()).phone(p.getPhone()).email(p.getEmail())
            .gender(p.getGender()).bloodGroup(p.getBloodGroup())
            .dateOfBirth(p.getDateOfBirth() != null ? p.getDateOfBirth().toString() : null)
            .status(p.getStatus()).lastVisit(p.getLastVisit() != null ? p.getLastVisit().toString() : null)
            .createdAt(p.getCreatedAt() != null ? p.getCreatedAt().toString() : null)
            .completeAddress(p.getCompleteAddress()).postalCode(p.getPostalCode())
            .country(p.getCountry()).state(p.getState()).city(p.getCity())
            .smsNotifications(p.getSmsNotifications()).remarks(p.getRemarks()).build();
    }

    public Map<String, Object> getDashboard(UUID clinicId, UUID patientId) {
        Map<String, Object> m = new HashMap<>();
        m.put("appointments", appointmentRepo.findByClinicIdAndPatientId(clinicId, patientId).size());
        m.put("prescriptions", rxRepo.findByPatientId(patientId, Pageable.unpaged()).getTotalElements());
        return m;
    }

    public Page<AppointmentDto> getAppointments(UUID clinicId, UUID patientId, Pageable pageable) {
        return appointmentRepo.findAll((root, q, cb) ->
            cb.and(cb.equal(root.get("clinicId"), clinicId), cb.equal(root.get("patientId"), patientId)),
            pageable).map(a -> {
                String dName = staffRepo.findById(a.getDoctorId()).map(ClinicStaff::getName).orElse("");
                return AppointmentDto.builder().id(a.getId().toString()).appointmentDate(a.getAppointmentDate().toString())
                    .startTime(a.getStartTime().toString()).doctorName(dName).type(a.getType()).status(a.getStatus())
                    .tokenNumber(a.getTokenNumber()).build();
            });
    }

    public Page<PrescriptionDto> getPrescriptions(UUID clinicId, UUID patientId, Pageable pageable) {
        return rxRepo.findByPatientId(patientId, pageable).map(rx -> {
            String dName = staffRepo.findById(rx.getDoctorId()).map(ClinicStaff::getName).orElse("");
            List<PrescriptionItemDto> items = itemRepo.findByPrescriptionId(rx.getId()).stream()
                .map(i -> PrescriptionItemDto.builder().id(i.getId().toString()).medicineName(i.getMedicineName())
                    .dosage(i.getDosage()).frequency(i.getFrequency()).duration(i.getDuration()).build())
                .collect(Collectors.toList());
            return PrescriptionDto.builder().id(rx.getId().toString()).doctorName(dName)
                .diagnosis(rx.getDiagnosis()).status(rx.getStatus()).items(items)
                .createdAt(rx.getCreatedAt() != null ? rx.getCreatedAt().toString() : null).build();
        });
    }

    public List<FamilyDto> getFamily(UUID patientId) {
        return familyRepo.findByPrimaryPatientId(patientId).stream().map(g -> {
            List<FamilyMemberDto> members = memberRepo.findByFamilyGroupId(g.getId()).stream()
                .map(m -> FamilyMemberDto.builder().id(m.getId().toString()).patientId(m.getPatientId().toString())
                    .relationship(m.getRelationship()).build())
                .collect(Collectors.toList());
            return FamilyDto.builder().id(g.getId().toString()).name(g.getName()).members(members).build();
        }).collect(Collectors.toList());
    }
}
