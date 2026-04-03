package com.taevas.clinic.service.doctor;

import com.taevas.clinic.dto.clinicadmin.*;
import com.taevas.clinic.exception.ResourceNotFoundException;
import com.taevas.clinic.model.*;
import com.taevas.clinic.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor @Transactional(readOnly = true)
public class DoctorPrescriptionService {
    private final PrescriptionRepository rxRepo;
    private final PrescriptionItemRepository itemRepo;
    private final EncounterRepository encounterRepo;
    private final ClinicPatientRepository patientRepo;
    private final ClinicStaffRepository staffRepo;

    public List<PrescriptionDto> getByEncounter(UUID encounterId) {
        return rxRepo.findByEncounterId(encounterId).stream().map(this::toDto).collect(Collectors.toList());
    }

    public Page<PrescriptionDto> getByPatient(UUID patientId, Pageable pageable) {
        return rxRepo.findByPatientId(patientId, pageable).map(this::toDto);
    }

    @Transactional public PrescriptionDto create(UUID clinicId, UUID staffId, PrescriptionRequest r) {
        UUID encounterId = UUID.fromString(r.getEncounterId());
        Encounter encounter = encounterRepo.findById(encounterId)
            .orElseThrow(() -> new ResourceNotFoundException("Encounter", "id", encounterId));
        Prescription rx = Prescription.builder().clinicId(clinicId).encounterId(encounterId)
            .doctorId(staffId).patientId(encounter.getPatientId()).diagnosis(r.getDiagnosis()).notes(r.getNotes()).status("ACTIVE").build();
        rx = rxRepo.save(rx);
        if (r.getItems() != null) {
            for (int i = 0; i < r.getItems().size(); i++) {
                PrescriptionItemRequest ir = r.getItems().get(i);
                PrescriptionItem item = PrescriptionItem.builder().prescriptionId(rx.getId())
                    .medicineName(ir.getMedicineName()).dosage(ir.getDosage()).frequency(ir.getFrequency())
                    .duration(ir.getDuration()).instructions(ir.getInstructions()).sortOrder(i).build();
                itemRepo.save(item);
            }
        }
        return toDto(rx);
    }

    private PrescriptionDto toDto(Prescription rx) {
        String pName = patientRepo.findById(rx.getPatientId()).map(p -> p.getFirstName()).orElse("");
        String dName = staffRepo.findById(rx.getDoctorId()).map(ClinicStaff::getName).orElse("");
        List<PrescriptionItemDto> items = itemRepo.findByPrescriptionId(rx.getId()).stream()
            .map(i -> PrescriptionItemDto.builder().id(i.getId().toString()).medicineName(i.getMedicineName())
                .dosage(i.getDosage()).frequency(i.getFrequency()).duration(i.getDuration())
                .instructions(i.getInstructions()).sortOrder(i.getSortOrder()).build())
            .collect(Collectors.toList());
        return PrescriptionDto.builder().id(rx.getId().toString()).clinicId(rx.getClinicId().toString())
            .encounterId(rx.getEncounterId() != null ? rx.getEncounterId().toString() : null)
            .patientId(rx.getPatientId().toString()).patientName(pName)
            .doctorId(rx.getDoctorId().toString()).doctorName(dName)
            .diagnosis(rx.getDiagnosis()).notes(rx.getNotes()).status(rx.getStatus())
            .createdAt(rx.getCreatedAt() != null ? rx.getCreatedAt().toString() : null).items(items).build();
    }
}
