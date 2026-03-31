package com.taevas.clinic.service.patient;

import com.taevas.clinic.dto.clinicadmin.*;
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
