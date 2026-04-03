package com.taevas.clinic.service.doctor;

import com.taevas.clinic.dto.clinicadmin.*;
import com.taevas.clinic.exception.ResourceNotFoundException;
import com.taevas.clinic.model.*;
import com.taevas.clinic.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.UUID;

@Service @RequiredArgsConstructor @Transactional(readOnly = true)
public class DoctorEncounterService {
    private final EncounterRepository repo;
    private final AppointmentRepository appointmentRepo;
    private final ClinicPatientRepository patientRepo;
    private final ClinicStaffRepository staffRepo;

    public EncounterDto getByAppointment(UUID appointmentId) {
        return repo.findByAppointmentId(appointmentId).map(this::toDto).orElse(null);
    }

    @Transactional public EncounterDto create(UUID clinicId, UUID staffId, EncounterRequest r) {
        UUID appointmentId = UUID.fromString(r.getAppointmentId());
        Appointment appointment = appointmentRepo.findById(appointmentId)
            .orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", appointmentId));
        Encounter e = Encounter.builder().clinicId(clinicId).appointmentId(appointmentId)
            .doctorId(staffId).patientId(appointment.getPatientId())
            .chiefComplaint(r.getChiefComplaint()).hpi(r.getHpi()).examination(r.getExamination())
            .diagnosis(r.getDiagnosis()).icd10Code(r.getIcd10Code()).treatmentPlan(r.getTreatmentPlan())
            .followUpDate(r.getFollowUpDate() != null ? LocalDate.parse(r.getFollowUpDate()) : null)
            .status("IN_PROGRESS").build();
        return toDto(repo.save(e));
    }

    @Transactional public EncounterDto update(UUID id, EncounterRequest r) {
        Encounter e = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Encounter", "id", id));
        if (r.getChiefComplaint() != null) e.setChiefComplaint(r.getChiefComplaint());
        if (r.getHpi() != null) e.setHpi(r.getHpi());
        if (r.getExamination() != null) e.setExamination(r.getExamination());
        if (r.getDiagnosis() != null) e.setDiagnosis(r.getDiagnosis());
        if (r.getIcd10Code() != null) e.setIcd10Code(r.getIcd10Code());
        if (r.getTreatmentPlan() != null) e.setTreatmentPlan(r.getTreatmentPlan());
        return toDto(repo.save(e));
    }

    private EncounterDto toDto(Encounter e) {
        String pName = patientRepo.findById(e.getPatientId()).map(p -> p.getFirstName() + " " + (p.getLastName() != null ? p.getLastName() : "")).orElse("");
        String dName = staffRepo.findById(e.getDoctorId()).map(ClinicStaff::getName).orElse("");
        return EncounterDto.builder().id(e.getId().toString()).clinicId(e.getClinicId().toString())
            .appointmentId(e.getAppointmentId() != null ? e.getAppointmentId().toString() : null)
            .patientId(e.getPatientId().toString()).patientName(pName)
            .doctorId(e.getDoctorId().toString()).doctorName(dName)
            .chiefComplaint(e.getChiefComplaint()).hpi(e.getHpi()).examination(e.getExamination())
            .diagnosis(e.getDiagnosis()).icd10Code(e.getIcd10Code()).treatmentPlan(e.getTreatmentPlan())
            .followUpDate(e.getFollowUpDate() != null ? e.getFollowUpDate().toString() : null)
            .status(e.getStatus()).createdAt(e.getCreatedAt() != null ? e.getCreatedAt().toString() : null).build();
    }
}
