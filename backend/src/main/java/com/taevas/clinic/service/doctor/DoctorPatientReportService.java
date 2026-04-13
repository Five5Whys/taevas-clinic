package com.taevas.clinic.service.doctor;

import com.taevas.clinic.dto.doctor.PatientReportDto;
import com.taevas.clinic.dto.doctor.PatientReportRequest;
import com.taevas.clinic.exception.ResourceNotFoundException;
import com.taevas.clinic.model.ClinicPatient;
import com.taevas.clinic.model.ClinicStaff;
import com.taevas.clinic.model.PatientReport;
import com.taevas.clinic.model.PatientReportMedia;
import com.taevas.clinic.repository.ClinicPatientRepository;
import com.taevas.clinic.repository.ClinicStaffRepository;
import com.taevas.clinic.repository.PatientReportMediaRepository;
import com.taevas.clinic.repository.PatientReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor @Transactional(readOnly = true)
public class DoctorPatientReportService {
    private final PatientReportRepository repo;
    private final PatientReportMediaRepository mediaRepo;
    private final ClinicPatientRepository patientRepo;
    private final ClinicStaffRepository staffRepo;

    public Page<PatientReportDto> list(UUID clinicId, UUID doctorId, Pageable pageable) {
        return repo.findByClinicIdAndDoctorIdOrderByReportDateDesc(clinicId, doctorId, pageable).map(this::toDto);
    }

    public PatientReportDto getById(UUID clinicId, UUID reportId) {
        PatientReport r = repo.findByIdAndClinicId(reportId, clinicId)
                .orElseThrow(() -> new ResourceNotFoundException("PatientReport", "id", reportId));
        return toDto(r);
    }

    @Transactional
    public PatientReportDto create(UUID clinicId, UUID doctorId, PatientReportRequest req) {
        UUID patientId = UUID.fromString(req.getPatientId());
        patientRepo.findById(patientId).orElseThrow(() -> new ResourceNotFoundException("Patient", "id", patientId));
        PatientReport report = PatientReport.builder()
                .clinicId(clinicId)
                .patientId(patientId)
                .doctorId(doctorId)
                .reportType(req.getReportType())
                .title(req.getTitle())
                .notes(req.getNotes())
                .status(req.getStatus() != null ? req.getStatus() : "COMPLETED")
                .reportDate(req.getReportDate() != null ? LocalDate.parse(req.getReportDate()) : LocalDate.now())
                .source("DOCTOR_CREATED")
                .build();
        return toDto(repo.save(report));
    }

    private PatientReportDto toDto(PatientReport r) {
        String patientName = patientRepo.findById(r.getPatientId())
                .map(p -> (p.getFirstName() != null ? p.getFirstName() : "") +
                          (p.getLastName() != null ? " " + p.getLastName() : "")).orElse("");
        String doctorName = r.getDoctorId() != null
                ? staffRepo.findById(r.getDoctorId()).map(ClinicStaff::getName).orElse("")
                : "";
        List<PatientReportDto.MediaDto> media = mediaRepo.findByReportId(r.getId()).stream().map(m ->
                PatientReportDto.MediaDto.builder()
                        .id(m.getId().toString())
                        .fileName(m.getFileName())
                        .fileUrl("/uploads/" + m.getFilePath())
                        .contentType(m.getContentType())
                        .fileSize(m.getFileSize())
                        .build()
        ).collect(Collectors.toList());
        return PatientReportDto.builder()
                .id(r.getId().toString())
                .patientId(r.getPatientId().toString())
                .patientName(patientName.trim())
                .doctorId(r.getDoctorId() != null ? r.getDoctorId().toString() : null)
                .doctorName(doctorName)
                .reportType(r.getReportType())
                .title(r.getTitle())
                .notes(r.getNotes())
                .status(r.getStatus())
                .reportDate(r.getReportDate() != null ? r.getReportDate().toString() : null)
                .source(r.getSource())
                .sourceRefId(r.getSourceRefId())
                .media(media)
                .createdAt(r.getCreatedAt() != null ? r.getCreatedAt().toString() : null)
                .build();
    }
}
