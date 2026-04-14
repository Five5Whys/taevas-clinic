package com.taevas.clinic.service.patient;

import com.taevas.clinic.dto.FileUploadResponse;
import com.taevas.clinic.dto.clinicadmin.*;
import com.taevas.clinic.dto.doctor.PatientReportDto;
import com.taevas.clinic.exception.BadRequestException;
import com.taevas.clinic.exception.ResourceNotFoundException;
import com.taevas.clinic.model.*;
import com.taevas.clinic.repository.*;
import com.taevas.clinic.service.FileUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDate;
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
    private final PatientReportRepository reportRepo;
    private final PatientReportMediaRepository mediaRepo;
    private final FileUploadService fileUploadService;

    public UUID getPatientRecordId(UUID clinicId, UUID userId) {
        return patientRepo.findByUserIdAndClinicId(userId, clinicId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "userId", userId)).getId();
    }

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
        p.setSmsNotifications(r.getSmsNotifications()); p.setEmailNotifications(r.getEmailNotifications()); p.setRemarks(r.getRemarks());
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
            .smsNotifications(p.getSmsNotifications()).emailNotifications(p.getEmailNotifications()).remarks(p.getRemarks()).build();
    }

    public Map<String, Object> getDashboard(UUID clinicId, UUID userId) {
        UUID patientId = getPatientRecordId(clinicId, userId);
        Map<String, Object> m = new HashMap<>();
        m.put("appointments", appointmentRepo.findByClinicIdAndPatientId(clinicId, patientId).size());
        m.put("prescriptions", rxRepo.findByPatientId(patientId, Pageable.unpaged()).getTotalElements());
        return m;
    }

    public Page<AppointmentDto> getAppointments(UUID clinicId, UUID userId, Pageable pageable) {
        UUID patientId = getPatientRecordId(clinicId, userId);
        return appointmentRepo.findAll((root, q, cb) ->
            cb.and(cb.equal(root.get("clinicId"), clinicId), cb.equal(root.get("patientId"), patientId)),
            pageable).map(a -> {
                String dName = staffRepo.findById(a.getDoctorId()).map(ClinicStaff::getName).orElse("");
                return AppointmentDto.builder().id(a.getId().toString()).appointmentDate(a.getAppointmentDate().toString())
                    .startTime(a.getStartTime().toString()).doctorName(dName).type(a.getType()).status(a.getStatus())
                    .tokenNumber(a.getTokenNumber()).build();
            });
    }

    public Page<PrescriptionDto> getPrescriptions(UUID clinicId, UUID userId, Pageable pageable) {
        UUID patientId = getPatientRecordId(clinicId, userId);
        return rxRepo.findByPatientId(patientId, pageable).map(rx -> {
            String dName = staffRepo.findById(rx.getDoctorId()).map(ClinicStaff::getName).orElse("");
            List<PrescriptionItemDto> items = itemRepo.findByPrescriptionId(rx.getId()).stream()
                .map(i -> PrescriptionItemDto.builder().id(i.getId().toString()).medicineName(i.getMedicineName())
                    .dosage(i.getDosage()).frequency(i.getFrequency()).duration(i.getDuration())
                    .instructions(i.getInstructions()).sortOrder(i.getSortOrder()).build())
                .collect(Collectors.toList());
            return PrescriptionDto.builder().id(rx.getId().toString()).doctorName(dName)
                .diagnosis(rx.getDiagnosis()).notes(rx.getNotes()).status(rx.getStatus()).items(items)
                .createdAt(rx.getCreatedAt() != null ? rx.getCreatedAt().toString() : null).build();
        });
    }

    public List<PatientReportDto> getHealthRecords(UUID clinicId, UUID userId) {
        UUID patientId = getPatientRecordId(clinicId, userId);
        return reportRepo.findByClinicIdAndPatientIdOrderByReportDateDesc(clinicId, patientId).stream()
            .map(this::toReportDto)
            .collect(Collectors.toList());
    }

    private PatientReportDto toReportDto(PatientReport r) {
        String dName = r.getDoctorId() != null
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
            .doctorId(r.getDoctorId() != null ? r.getDoctorId().toString() : null)
            .doctorName(dName)
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

    @Transactional public PatientReportDto uploadHealthRecord(UUID clinicId, UUID userId, String title,
            String reportType, String reportDate, String notes, MultipartFile file) {
        if (file == null || file.isEmpty()) throw new BadRequestException("File is required");
        UUID patientId = getPatientRecordId(clinicId, userId);
        PatientReport report = PatientReport.builder()
            .clinicId(clinicId)
            .patientId(patientId)
            .reportType(reportType)
            .title(title)
            .notes(notes)
            .status("COMPLETED")
            .reportDate(reportDate != null && !reportDate.isBlank() ? LocalDate.parse(reportDate) : LocalDate.now())
            .source("PATIENT_UPLOADED")
            .build();
        report = reportRepo.save(report);
        FileUploadResponse uploaded = fileUploadService.uploadFile(file, "health-records/" + patientId);
        PatientReportMedia m = PatientReportMedia.builder()
            .reportId(report.getId())
            .fileName(uploaded.getFileName())
            .filePath(uploaded.getFilePath())
            .contentType(uploaded.getContentType())
            .fileSize(uploaded.getFileSize())
            .build();
        mediaRepo.save(m);
        return toReportDto(report);
    }

    @Transactional public void deleteHealthRecord(UUID clinicId, UUID userId, UUID reportId) {
        UUID patientId = getPatientRecordId(clinicId, userId);
        PatientReport r = reportRepo.findByIdAndClinicId(reportId, clinicId)
            .orElseThrow(() -> new ResourceNotFoundException("PatientReport", "id", reportId));
        if (!r.getPatientId().equals(patientId)) throw new BadRequestException("Not your record");
        if (!"PATIENT_UPLOADED".equals(r.getSource())) throw new BadRequestException("Only your own uploads can be deleted");
        mediaRepo.deleteByReportId(reportId);
        reportRepo.delete(r);
    }

    public List<Map<String, String>> getClinicDoctors(UUID clinicId) {
        return staffRepo.findByClinicIdAndRole(clinicId, "DOCTOR").stream()
            .map(s -> Map.of("id", s.getId().toString(), "name", s.getName()))
            .collect(Collectors.toList());
    }

    @Transactional public AppointmentDto bookAppointment(UUID clinicId, UUID userId, AppointmentRequest req) {
        UUID patientRecordId = getPatientRecordId(clinicId, userId);
        Appointment a = Appointment.builder()
            .clinicId(clinicId)
            .patientId(patientRecordId)
            .doctorId(UUID.fromString(req.getDoctorId()))
            .appointmentDate(java.time.LocalDate.parse(req.getAppointmentDate()))
            .startTime(java.time.LocalTime.parse(req.getStartTime()))
            .endTime(req.getEndTime() != null ? java.time.LocalTime.parse(req.getEndTime()) : null)
            .type(req.getType() != null ? req.getType() : "CONSULTATION")
            .status("SCHEDULED")
            .notes(req.getNotes())
            .build();
        a = appointmentRepo.save(a);
        String dName = staffRepo.findById(a.getDoctorId()).map(ClinicStaff::getName).orElse("");
        return AppointmentDto.builder().id(a.getId().toString()).appointmentDate(a.getAppointmentDate().toString())
            .startTime(a.getStartTime().toString()).doctorName(dName).type(a.getType()).status(a.getStatus()).build();
    }

    public List<FamilyDto> getFamily(UUID clinicId, UUID userId) {
        UUID patientId = getPatientRecordId(clinicId, userId);
        return familyRepo.findByPrimaryPatientId(patientId).stream().map(g -> {
            List<FamilyMemberDto> members = memberRepo.findByFamilyGroupId(g.getId()).stream()
                .map(m -> FamilyMemberDto.builder().id(m.getId().toString()).patientId(m.getPatientId().toString())
                    .relationship(m.getRelationship()).build())
                .collect(Collectors.toList());
            return FamilyDto.builder().id(g.getId().toString()).name(g.getName()).members(members).build();
        }).collect(Collectors.toList());
    }
}
