const fs = require('fs');
const path = require('path');
const ROOT = __dirname;
const BE = path.join(ROOT, 'backend/src/main/java/com/taevas/clinic');
let count = 0;

function w(fp, content) {
  fs.mkdirSync(path.dirname(fp), { recursive: true });
  fs.writeFileSync(fp, content, 'utf8');
  count++;
}

// ============================
// DTOs
// ============================
const DTO = path.join(BE, 'dto/clinicadmin');

const dtos = {
StaffDto: `package com.taevas.clinic.dto.clinicadmin;
import lombok.*; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class StaffDto { private String id, clinicId, userId, name, role, specialization, phone, email, registrationNo, status, createdAt; }`,

StaffRequest: `package com.taevas.clinic.dto.clinicadmin;
import jakarta.validation.constraints.NotBlank; import lombok.*; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class StaffRequest { @NotBlank private String name; @NotBlank private String role; private String specialization, phone, email, registrationNo; }`,

PatientDto: `package com.taevas.clinic.dto.clinicadmin;
import lombok.*; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class PatientDto { private String id, clinicId, userId, firstName, lastName, phone, email, gender, bloodGroup, dateOfBirth, status, lastVisit, createdAt; }`,

PatientRequest: `package com.taevas.clinic.dto.clinicadmin;
import jakarta.validation.constraints.NotBlank; import lombok.*; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class PatientRequest { @NotBlank private String firstName; private String lastName, phone, email, gender, bloodGroup, dateOfBirth; }`,

AppointmentDto: `package com.taevas.clinic.dto.clinicadmin;
import lombok.*; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AppointmentDto { private String id, clinicId, patientId, patientName, doctorId, doctorName, appointmentDate, startTime, endTime, type, status, notes, createdAt; private Integer tokenNumber; }`,

AppointmentRequest: `package com.taevas.clinic.dto.clinicadmin;
import jakarta.validation.constraints.NotBlank; import lombok.*; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AppointmentRequest { @NotBlank private String patientId; @NotBlank private String doctorId; @NotBlank private String appointmentDate; @NotBlank private String startTime; private String endTime, type, notes; }`,

EncounterDto: `package com.taevas.clinic.dto.clinicadmin;
import lombok.*; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class EncounterDto { private String id, clinicId, appointmentId, patientId, patientName, doctorId, doctorName, chiefComplaint, hpi, examination, diagnosis, icd10Code, treatmentPlan, followUpDate, status, createdAt; }`,

EncounterRequest: `package com.taevas.clinic.dto.clinicadmin;
import jakarta.validation.constraints.NotBlank; import lombok.*; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class EncounterRequest { @NotBlank private String appointmentId; private String chiefComplaint, hpi, examination, diagnosis, icd10Code, treatmentPlan, followUpDate; }`,

PrescriptionDto: `package com.taevas.clinic.dto.clinicadmin;
import lombok.*; import java.util.List; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class PrescriptionDto { private String id, clinicId, encounterId, patientId, patientName, doctorId, doctorName, diagnosis, notes, status, createdAt; private List<PrescriptionItemDto> items; }`,

PrescriptionItemDto: `package com.taevas.clinic.dto.clinicadmin;
import lombok.*; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class PrescriptionItemDto { private String id, medicineName, dosage, frequency, duration, instructions; private Integer sortOrder; }`,

PrescriptionRequest: `package com.taevas.clinic.dto.clinicadmin;
import jakarta.validation.constraints.NotBlank; import lombok.*; import java.util.List; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class PrescriptionRequest { @NotBlank private String encounterId; private String diagnosis, notes; private List<PrescriptionItemRequest> items; }`,

PrescriptionItemRequest: `package com.taevas.clinic.dto.clinicadmin;
import jakarta.validation.constraints.NotBlank; import lombok.*; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class PrescriptionItemRequest { @NotBlank private String medicineName; private String dosage, frequency, duration, instructions; }`,

InvoiceDto: `package com.taevas.clinic.dto.clinicadmin;
import lombok.*; import java.util.List; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class InvoiceDto { private String id, clinicId, patientId, patientName, encounterId, invoiceNumber, subtotal, taxAmount, discount, total, status, paymentMethod, paidAt, createdAt; private List<InvoiceItemDto> items; }`,

InvoiceItemDto: `package com.taevas.clinic.dto.clinicadmin;
import lombok.*; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class InvoiceItemDto { private String id, description, unitPrice, amount; private Integer quantity; }`,

ClinicConfigDto: `package com.taevas.clinic.dto.clinicadmin;
import lombok.*; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ClinicConfigDto { private String id, clinicName, city, status; }`,

ScheduleConfigDto: `package com.taevas.clinic.dto.clinicadmin;
import lombok.*; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ScheduleConfigDto { private Integer defaultSlotDuration, maxPatientsPerSlot, bufferBetweenSlots; }`,

DayScheduleDto: `package com.taevas.clinic.dto.clinicadmin;
import lombok.*; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class DayScheduleDto { private String id, staffId, doctorName, startTime, endTime; private Integer dayOfWeek, slotDuration, maxPatients, bufferMinutes; private Boolean enabled; }`,

BillingFeesDto: `package com.taevas.clinic.dto.clinicadmin;
import lombok.*; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class BillingFeesDto { private String consultationFee, followUpFee, taxRate, invoicePrefix, paymentModes; private Boolean taxEnabled; }`,

InvoiceSettingsDto: `package com.taevas.clinic.dto.clinicadmin;
import lombok.*; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class InvoiceSettingsDto { private String invoicePrefix, taxRate; private Boolean taxEnabled; }`,

CustomFieldDto: `package com.taevas.clinic.dto.clinicadmin;
import lombok.*; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CustomFieldDto { private String id, clinicId, section, fieldKey, label, fieldType; private Boolean required; private Integer sortOrder; }`,

CustomFieldRequest: `package com.taevas.clinic.dto.clinicadmin;
import jakarta.validation.constraints.NotBlank; import lombok.*; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CustomFieldRequest { @NotBlank private String section; @NotBlank private String fieldKey; @NotBlank private String label; @NotBlank private String fieldType; private Boolean required; private Integer sortOrder; }`,

IdConfigDto: `package com.taevas.clinic.dto.clinicadmin;
import lombok.*; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class IdConfigDto { private String id, countryId, entityType, prefix, entityCode, separator; private Integer padding, startsAt; private Boolean locked; }`,

DataImportDto: `package com.taevas.clinic.dto.clinicadmin;
import lombok.*; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class DataImportDto { private String id, clinicId, importType, fileName, status, errorLog, createdAt; private Integer totalRecords, successCount, failCount; }`,

TemplateSettingsDto: `package com.taevas.clinic.dto.clinicadmin;
import lombok.*; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class TemplateSettingsDto { private String id, clinicId, templateType, configJson, filePath; }`,

ClinicDashboardDto: `package com.taevas.clinic.dto.clinicadmin;
import lombok.*; import java.math.BigDecimal; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ClinicDashboardDto { private long totalPatients, totalAppointments, todayAppointments, pendingAppointments, completedAppointments; private BigDecimal totalRevenue; }`,

ComplianceStatusDto: `package com.taevas.clinic.dto.clinicadmin;
import lombok.*; import java.util.List; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ComplianceStatusDto { private String countryName; private List<ComplianceItemDto> items; }`,

ComplianceItemDto: `package com.taevas.clinic.dto.clinicadmin;
import lombok.*; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ComplianceItemDto { private String moduleName, description; private Boolean enabled; }`,

ClinicReportDto: `package com.taevas.clinic.dto.clinicadmin;
import lombok.*; import java.math.BigDecimal; import java.util.List; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ClinicReportDto { private long totalPatients, totalAppointments; private BigDecimal totalRevenue; private double completedRate; private List<TopDoctorDto> topDoctors; private List<AppointmentBreakdownDto> appointmentBreakdown; }`,

TopDoctorDto: `package com.taevas.clinic.dto.clinicadmin;
import lombok.*; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class TopDoctorDto { private String doctorId, doctorName; private long appointmentCount; }`,

AppointmentBreakdownDto: `package com.taevas.clinic.dto.clinicadmin;
import lombok.*; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AppointmentBreakdownDto { private String status; private long count; }`,

DeviceReportDto: `package com.taevas.clinic.dto.clinicadmin;
import lombok.*; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class DeviceReportDto { private String id, clinicId, patientId, patientName, doctorId, doctorName, deviceName, reportType, fileUrl, findings, status, reportedAt, createdAt; }`,

FamilyDto: `package com.taevas.clinic.dto.clinicadmin;
import lombok.*; import java.util.List; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class FamilyDto { private String id, clinicId, name, primaryPatientId, primaryPatientName; private List<FamilyMemberDto> members; }`,

FamilyMemberDto: `package com.taevas.clinic.dto.clinicadmin;
import lombok.*; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class FamilyMemberDto { private String id, patientId, patientName, relationship; }`,

WhatsAppConfigDto: `package com.taevas.clinic.dto.clinicadmin;
import lombok.*; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class WhatsAppConfigDto { private String id, clinicId, phoneNumber, welcomeMessage; private Boolean enabled, autoReply; }`,

ReviewDto: `package com.taevas.clinic.dto.clinicadmin;
import lombok.*; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ReviewDto { private String id, clinicId, patientId, patientName, reviewText, source, status, createdAt; private Integer rating; }`,
};

console.log('=== DTOs ===');
for (const [name, content] of Object.entries(dtos)) {
  w(path.join(DTO, `${name}.java`), content + '\n');
}

// ============================
// SERVICES
// ============================
console.log('\n=== SERVICES ===');

// Clinic Admin Services
const SVC_CA = path.join(BE, 'service/clinicadmin');

w(path.join(SVC_CA, 'ClinicAdminDashboardService.java'), `package com.taevas.clinic.service.clinicadmin;

import com.taevas.clinic.dto.clinicadmin.ClinicDashboardDto;
import com.taevas.clinic.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Service @RequiredArgsConstructor @Transactional(readOnly = true)
public class ClinicAdminDashboardService {
    private final ClinicPatientRepository patientRepo;
    private final AppointmentRepository appointmentRepo;
    private final InvoiceRepository invoiceRepo;

    public ClinicDashboardDto getDashboard(UUID clinicId) {
        long patients = patientRepo.countByClinicId(clinicId);
        long appointments = appointmentRepo.countByClinicId(clinicId);
        long today = appointmentRepo.countByClinicIdAndAppointmentDate(clinicId, LocalDate.now());
        long pending = appointmentRepo.countByClinicIdAndStatus(clinicId, "SCHEDULED");
        long completed = appointmentRepo.countByClinicIdAndStatus(clinicId, "COMPLETED");
        BigDecimal revenue = invoiceRepo.sumTotalByClinicIdAndStatus(clinicId, "PAID");
        return ClinicDashboardDto.builder().totalPatients(patients).totalAppointments(appointments)
            .todayAppointments(today).pendingAppointments(pending).completedAppointments(completed)
            .totalRevenue(revenue != null ? revenue : BigDecimal.ZERO).build();
    }
}
`);

w(path.join(SVC_CA, 'StaffService.java'), `package com.taevas.clinic.service.clinicadmin;

import com.taevas.clinic.dto.clinicadmin.StaffDto;
import com.taevas.clinic.dto.clinicadmin.StaffRequest;
import com.taevas.clinic.exception.ResourceNotFoundException;
import com.taevas.clinic.model.ClinicStaff;
import com.taevas.clinic.repository.ClinicStaffRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

@Service @RequiredArgsConstructor @Transactional(readOnly = true)
public class StaffService {
    private final ClinicStaffRepository repo;

    public Page<StaffDto> getAll(UUID clinicId, String role, String status, String search, Pageable pageable) {
        Specification<ClinicStaff> spec = (root, q, cb) -> {
            List<Predicate> preds = new ArrayList<>();
            preds.add(cb.equal(root.get("clinicId"), clinicId));
            if (role != null && !role.isBlank()) preds.add(cb.equal(root.get("role"), role));
            if (status != null && !status.isBlank()) preds.add(cb.equal(root.get("status"), status));
            if (search != null && !search.isBlank()) {
                String p = "%" + search.toLowerCase() + "%";
                preds.add(cb.or(cb.like(cb.lower(root.get("name")), p), cb.like(cb.lower(root.get("email")), p)));
            }
            return cb.and(preds.toArray(new Predicate[0]));
        };
        return repo.findAll(spec, pageable).map(this::toDto);
    }

    public StaffDto getById(UUID clinicId, UUID id) {
        ClinicStaff s = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Staff", "id", id));
        return toDto(s);
    }

    @Transactional public StaffDto create(UUID clinicId, StaffRequest r) {
        ClinicStaff s = ClinicStaff.builder().clinicId(clinicId).name(r.getName()).role(r.getRole())
            .specialization(r.getSpecialization()).phone(r.getPhone()).email(r.getEmail())
            .registrationNo(r.getRegistrationNo()).status("ACTIVE").build();
        return toDto(repo.save(s));
    }

    @Transactional public StaffDto update(UUID clinicId, UUID id, StaffRequest r) {
        ClinicStaff s = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Staff", "id", id));
        s.setName(r.getName()); s.setRole(r.getRole()); s.setSpecialization(r.getSpecialization());
        s.setPhone(r.getPhone()); s.setEmail(r.getEmail()); s.setRegistrationNo(r.getRegistrationNo());
        return toDto(repo.save(s));
    }

    @Transactional public void delete(UUID clinicId, UUID id) {
        ClinicStaff s = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Staff", "id", id));
        repo.delete(s);
    }

    private StaffDto toDto(ClinicStaff s) {
        return StaffDto.builder().id(s.getId().toString()).clinicId(s.getClinicId().toString())
            .userId(s.getUserId() != null ? s.getUserId().toString() : null)
            .name(s.getName()).role(s.getRole()).specialization(s.getSpecialization())
            .phone(s.getPhone()).email(s.getEmail()).registrationNo(s.getRegistrationNo())
            .status(s.getStatus()).createdAt(s.getCreatedAt() != null ? s.getCreatedAt().toString() : null).build();
    }
}
`);

w(path.join(SVC_CA, 'PatientService.java'), `package com.taevas.clinic.service.clinicadmin;

import com.taevas.clinic.dto.clinicadmin.PatientDto;
import com.taevas.clinic.dto.clinicadmin.PatientRequest;
import com.taevas.clinic.exception.ResourceNotFoundException;
import com.taevas.clinic.model.ClinicPatient;
import com.taevas.clinic.repository.ClinicPatientRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.*;

@Service @RequiredArgsConstructor @Transactional(readOnly = true)
public class PatientService {
    private final ClinicPatientRepository repo;

    public Page<PatientDto> getAll(UUID clinicId, String status, String search, Pageable pageable) {
        Specification<ClinicPatient> spec = (root, q, cb) -> {
            List<Predicate> preds = new ArrayList<>();
            preds.add(cb.equal(root.get("clinicId"), clinicId));
            if (status != null && !status.isBlank()) preds.add(cb.equal(root.get("status"), status));
            if (search != null && !search.isBlank()) {
                String p = "%" + search.toLowerCase() + "%";
                preds.add(cb.or(cb.like(cb.lower(root.get("firstName")), p), cb.like(cb.lower(root.get("lastName")), p), cb.like(cb.lower(root.get("phone")), p)));
            }
            return cb.and(preds.toArray(new Predicate[0]));
        };
        return repo.findAll(spec, pageable).map(this::toDto);
    }

    public PatientDto getById(UUID clinicId, UUID id) {
        return toDto(repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Patient", "id", id)));
    }

    @Transactional public PatientDto create(UUID clinicId, PatientRequest r) {
        ClinicPatient p = ClinicPatient.builder().clinicId(clinicId).firstName(r.getFirstName())
            .lastName(r.getLastName()).phone(r.getPhone()).email(r.getEmail()).gender(r.getGender())
            .bloodGroup(r.getBloodGroup()).dateOfBirth(r.getDateOfBirth() != null ? LocalDate.parse(r.getDateOfBirth()) : null)
            .status("ACTIVE").build();
        return toDto(repo.save(p));
    }

    @Transactional public PatientDto update(UUID clinicId, UUID id, PatientRequest r) {
        ClinicPatient p = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Patient", "id", id));
        p.setFirstName(r.getFirstName()); p.setLastName(r.getLastName()); p.setPhone(r.getPhone());
        p.setEmail(r.getEmail()); p.setGender(r.getGender()); p.setBloodGroup(r.getBloodGroup());
        if (r.getDateOfBirth() != null) p.setDateOfBirth(LocalDate.parse(r.getDateOfBirth()));
        return toDto(repo.save(p));
    }

    private PatientDto toDto(ClinicPatient p) {
        return PatientDto.builder().id(p.getId().toString()).clinicId(p.getClinicId().toString())
            .userId(p.getUserId() != null ? p.getUserId().toString() : null)
            .firstName(p.getFirstName()).lastName(p.getLastName()).phone(p.getPhone()).email(p.getEmail())
            .gender(p.getGender()).bloodGroup(p.getBloodGroup())
            .dateOfBirth(p.getDateOfBirth() != null ? p.getDateOfBirth().toString() : null)
            .status(p.getStatus()).lastVisit(p.getLastVisit() != null ? p.getLastVisit().toString() : null)
            .createdAt(p.getCreatedAt() != null ? p.getCreatedAt().toString() : null).build();
    }
}
`);

w(path.join(SVC_CA, 'ClinicAdminConfigService.java'), `package com.taevas.clinic.service.clinicadmin;

import com.taevas.clinic.dto.clinicadmin.*;
import com.taevas.clinic.model.*;
import com.taevas.clinic.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor @Transactional(readOnly = true)
public class ClinicAdminConfigService {
    private final ClinicRepository clinicRepo;
    private final ClinicScheduleConfigRepository schedConfigRepo;
    private final DoctorScheduleRepository docSchedRepo;
    private final ClinicBillingConfigRepository billingRepo;
    private final ClinicStaffRepository staffRepo;
    private final IdFormatTemplateRepository idFormatRepo;

    public ClinicConfigDto getClinicConfig(UUID clinicId) {
        Clinic c = clinicRepo.findById(clinicId).orElse(null);
        if (c == null) return ClinicConfigDto.builder().build();
        return ClinicConfigDto.builder().id(c.getId().toString()).clinicName(c.getName()).city(c.getCity()).status(c.getStatus().name()).build();
    }

    public ScheduleConfigDto getScheduleConfig(UUID clinicId) {
        return schedConfigRepo.findByClinicId(clinicId).map(c -> ScheduleConfigDto.builder()
            .defaultSlotDuration(c.getDefaultSlotDuration()).maxPatientsPerSlot(c.getMaxPatientsPerSlot())
            .bufferBetweenSlots(c.getBufferBetweenSlots()).build())
            .orElse(ScheduleConfigDto.builder().defaultSlotDuration(15).maxPatientsPerSlot(20).bufferBetweenSlots(5).build());
    }

    @Transactional public ScheduleConfigDto updateScheduleConfig(UUID clinicId, ScheduleConfigDto dto) {
        ClinicScheduleConfig c = schedConfigRepo.findByClinicId(clinicId)
            .orElse(ClinicScheduleConfig.builder().clinicId(clinicId).build());
        c.setDefaultSlotDuration(dto.getDefaultSlotDuration());
        c.setMaxPatientsPerSlot(dto.getMaxPatientsPerSlot());
        c.setBufferBetweenSlots(dto.getBufferBetweenSlots());
        schedConfigRepo.save(c);
        return dto;
    }

    public List<DayScheduleDto> getDoctorSchedules(UUID clinicId) {
        return docSchedRepo.findByClinicId(clinicId).stream().map(s -> {
            String name = staffRepo.findById(s.getStaffId()).map(ClinicStaff::getName).orElse("Unknown");
            return DayScheduleDto.builder().id(s.getId().toString()).staffId(s.getStaffId().toString())
                .doctorName(name).dayOfWeek(s.getDayOfWeek())
                .startTime(s.getStartTime().toString()).endTime(s.getEndTime().toString())
                .slotDuration(s.getSlotDuration()).maxPatients(s.getMaxPatients())
                .bufferMinutes(s.getBufferMinutes()).enabled(s.getEnabled()).build();
        }).collect(Collectors.toList());
    }

    @Transactional public DayScheduleDto updateDoctorSchedule(UUID clinicId, UUID scheduleId, DayScheduleDto dto) {
        DoctorSchedule s = docSchedRepo.findById(scheduleId).orElseThrow();
        s.setEnabled(dto.getEnabled());
        if (dto.getSlotDuration() != null) s.setSlotDuration(dto.getSlotDuration());
        if (dto.getMaxPatients() != null) s.setMaxPatients(dto.getMaxPatients());
        docSchedRepo.save(s);
        return dto;
    }

    public BillingFeesDto getBillingConfig(UUID clinicId) {
        return billingRepo.findByClinicId(clinicId).map(b -> BillingFeesDto.builder()
            .consultationFee(b.getConsultationFee() != null ? b.getConsultationFee().toString() : "0")
            .followUpFee(b.getFollowUpFee() != null ? b.getFollowUpFee().toString() : "0")
            .taxEnabled(b.getTaxEnabled()).taxRate(b.getTaxRate() != null ? b.getTaxRate().toString() : "0")
            .invoicePrefix(b.getInvoicePrefix()).paymentModes(b.getPaymentModes()).build())
            .orElse(BillingFeesDto.builder().consultationFee("0").followUpFee("0").taxEnabled(true).taxRate("0").build());
    }

    @Transactional public BillingFeesDto updateBillingConfig(UUID clinicId, BillingFeesDto dto) {
        ClinicBillingConfig b = billingRepo.findByClinicId(clinicId)
            .orElse(ClinicBillingConfig.builder().clinicId(clinicId).build());
        b.setConsultationFee(new BigDecimal(dto.getConsultationFee()));
        b.setFollowUpFee(new BigDecimal(dto.getFollowUpFee()));
        b.setTaxEnabled(dto.getTaxEnabled());
        b.setTaxRate(new BigDecimal(dto.getTaxRate()));
        b.setInvoicePrefix(dto.getInvoicePrefix());
        b.setPaymentModes(dto.getPaymentModes());
        billingRepo.save(b);
        return dto;
    }

    public List<IdConfigDto> getIdConfig(UUID clinicId) {
        Clinic clinic = clinicRepo.findById(clinicId).orElse(null);
        if (clinic == null || clinic.getCountryId() == null) return List.of();
        return idFormatRepo.findByCountryId(clinic.getCountryId()).stream()
            .map(t -> IdConfigDto.builder().id(t.getId().toString())
                .countryId(t.getCountryId().toString()).entityType(t.getEntityType())
                .prefix(t.getPrefix()).entityCode(t.getEntityCode()).separator(t.getSeparator())
                .padding(t.getPadding()).startsAt(t.getStartsAt()).locked(t.getLocked()).build())
            .collect(Collectors.toList());
    }
}
`);

w(path.join(SVC_CA, 'CustomFieldService.java'), `package com.taevas.clinic.service.clinicadmin;

import com.taevas.clinic.dto.clinicadmin.*;
import com.taevas.clinic.exception.ResourceNotFoundException;
import com.taevas.clinic.model.ClinicCustomField;
import com.taevas.clinic.repository.ClinicCustomFieldRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor @Transactional(readOnly = true)
public class CustomFieldService {
    private final ClinicCustomFieldRepository repo;

    public List<CustomFieldDto> getAll(UUID clinicId) {
        return repo.findByClinicId(clinicId).stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional public CustomFieldDto create(UUID clinicId, CustomFieldRequest r) {
        ClinicCustomField f = ClinicCustomField.builder().clinicId(clinicId).section(r.getSection())
            .fieldKey(r.getFieldKey()).label(r.getLabel()).fieldType(r.getFieldType())
            .required(r.getRequired() != null ? r.getRequired() : false)
            .sortOrder(r.getSortOrder() != null ? r.getSortOrder() : 0).build();
        return toDto(repo.save(f));
    }

    @Transactional public CustomFieldDto update(UUID clinicId, UUID id, CustomFieldRequest r) {
        ClinicCustomField f = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("CustomField", "id", id));
        f.setLabel(r.getLabel()); f.setFieldType(r.getFieldType());
        if (r.getRequired() != null) f.setRequired(r.getRequired());
        if (r.getSortOrder() != null) f.setSortOrder(r.getSortOrder());
        return toDto(repo.save(f));
    }

    @Transactional public void delete(UUID clinicId, UUID id) {
        repo.deleteById(id);
    }

    private CustomFieldDto toDto(ClinicCustomField f) {
        return CustomFieldDto.builder().id(f.getId().toString()).clinicId(f.getClinicId().toString())
            .section(f.getSection()).fieldKey(f.getFieldKey()).label(f.getLabel())
            .fieldType(f.getFieldType()).required(f.getRequired()).sortOrder(f.getSortOrder()).build();
    }
}
`);

w(path.join(SVC_CA, 'TemplateService.java'), `package com.taevas.clinic.service.clinicadmin;

import com.taevas.clinic.dto.clinicadmin.TemplateSettingsDto;
import com.taevas.clinic.model.ClinicTemplate;
import com.taevas.clinic.repository.ClinicTemplateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor @Transactional(readOnly = true)
public class TemplateService {
    private final ClinicTemplateRepository repo;

    public List<TemplateSettingsDto> getAll(UUID clinicId) {
        return repo.findByClinicId(clinicId).stream().map(this::toDto).collect(Collectors.toList());
    }

    public TemplateSettingsDto getByType(UUID clinicId, String type) {
        return repo.findByClinicIdAndTemplateType(clinicId, type).map(this::toDto).orElse(null);
    }

    @Transactional public TemplateSettingsDto update(UUID clinicId, String type, TemplateSettingsDto dto) {
        ClinicTemplate t = repo.findByClinicIdAndTemplateType(clinicId, type)
            .orElse(ClinicTemplate.builder().clinicId(clinicId).templateType(type).build());
        t.setConfigJson(dto.getConfigJson()); t.setFilePath(dto.getFilePath());
        repo.save(t);
        return toDto(t);
    }

    private TemplateSettingsDto toDto(ClinicTemplate t) {
        return TemplateSettingsDto.builder().id(t.getId() != null ? t.getId().toString() : null)
            .clinicId(t.getClinicId().toString()).templateType(t.getTemplateType())
            .configJson(t.getConfigJson()).filePath(t.getFilePath()).build();
    }
}
`);

w(path.join(SVC_CA, 'DataImportService.java'), `package com.taevas.clinic.service.clinicadmin;

import com.taevas.clinic.dto.clinicadmin.DataImportDto;
import com.taevas.clinic.model.DataImportSession;
import com.taevas.clinic.repository.DataImportSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Service @RequiredArgsConstructor @Transactional(readOnly = true)
public class DataImportService {
    private final DataImportSessionRepository repo;

    public Page<DataImportDto> getHistory(UUID clinicId, Pageable pageable) {
        return repo.findByClinicId(clinicId, pageable).map(this::toDto);
    }

    @Transactional public DataImportDto importData(UUID clinicId, String type, String fileName) {
        DataImportSession s = DataImportSession.builder().clinicId(clinicId).importType(type)
            .fileName(fileName).totalRecords(0).successCount(0).failCount(0).status("PENDING").build();
        return toDto(repo.save(s));
    }

    private DataImportDto toDto(DataImportSession s) {
        return DataImportDto.builder().id(s.getId().toString()).clinicId(s.getClinicId().toString())
            .importType(s.getImportType()).fileName(s.getFileName())
            .totalRecords(s.getTotalRecords()).successCount(s.getSuccessCount()).failCount(s.getFailCount())
            .status(s.getStatus()).errorLog(s.getErrorLog())
            .createdAt(s.getCreatedAt() != null ? s.getCreatedAt().toString() : null).build();
    }
}
`);

w(path.join(SVC_CA, 'ClinicComplianceService.java'), `package com.taevas.clinic.service.clinicadmin;

import com.taevas.clinic.dto.clinicadmin.*;
import com.taevas.clinic.model.*;
import com.taevas.clinic.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor @Transactional(readOnly = true)
public class ClinicComplianceService {
    private final ClinicRepository clinicRepo;
    private final CountryRepository countryRepo;
    private final ComplianceModuleRepository complianceRepo;

    public ComplianceStatusDto getStatus(UUID clinicId) {
        Clinic clinic = clinicRepo.findById(clinicId).orElse(null);
        if (clinic == null || clinic.getCountryId() == null) {
            return ComplianceStatusDto.builder().countryName("Unknown").items(List.of()).build();
        }
        String countryName = countryRepo.findById(clinic.getCountryId()).map(Country::getName).orElse("Unknown");
        List<ComplianceItemDto> items = complianceRepo.findByCountryIdAndEnabledTrue(clinic.getCountryId()).stream()
            .map(m -> ComplianceItemDto.builder().moduleName(m.getModuleName()).description(m.getDescription()).enabled(m.getEnabled()).build())
            .collect(Collectors.toList());
        return ComplianceStatusDto.builder().countryName(countryName).items(items).build();
    }
}
`);

w(path.join(SVC_CA, 'ReportService.java'), `package com.taevas.clinic.service.clinicadmin;

import com.taevas.clinic.dto.clinicadmin.*;
import com.taevas.clinic.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor @Transactional(readOnly = true)
public class ReportService {
    private final ClinicPatientRepository patientRepo;
    private final AppointmentRepository appointmentRepo;
    private final InvoiceRepository invoiceRepo;
    private final ClinicStaffRepository staffRepo;

    public ClinicReportDto getReport(UUID clinicId) {
        long patients = patientRepo.countByClinicId(clinicId);
        long appointments = appointmentRepo.countByClinicId(clinicId);
        long completed = appointmentRepo.countByClinicIdAndStatus(clinicId, "COMPLETED");
        BigDecimal revenue = invoiceRepo.sumTotalByClinicIdAndStatus(clinicId, "PAID");
        double completedRate = appointments > 0 ? (double) completed / appointments * 100 : 0;

        List<AppointmentBreakdownDto> breakdown = List.of("SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED").stream()
            .map(s -> AppointmentBreakdownDto.builder().status(s).count(appointmentRepo.countByClinicIdAndStatus(clinicId, s)).build())
            .collect(Collectors.toList());

        return ClinicReportDto.builder().totalPatients(patients).totalAppointments(appointments)
            .totalRevenue(revenue != null ? revenue : BigDecimal.ZERO).completedRate(completedRate)
            .topDoctors(List.of()).appointmentBreakdown(breakdown).build();
    }
}
`);

// Doctor Services
const SVC_DOC = path.join(BE, 'service/doctor');

w(path.join(SVC_DOC, 'DoctorDashboardService.java'), `package com.taevas.clinic.service.doctor;

import com.taevas.clinic.dto.clinicadmin.ClinicDashboardDto;
import com.taevas.clinic.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Service @RequiredArgsConstructor @Transactional(readOnly = true)
public class DoctorDashboardService {
    private final AppointmentRepository appointmentRepo;
    private final ClinicPatientRepository patientRepo;

    public ClinicDashboardDto getDashboard(UUID clinicId, UUID staffId) {
        long appointments = appointmentRepo.countByClinicId(clinicId);
        long today = appointmentRepo.countByClinicIdAndAppointmentDate(clinicId, LocalDate.now());
        long patients = patientRepo.countByClinicId(clinicId);
        return ClinicDashboardDto.builder().totalPatients(patients).totalAppointments(appointments)
            .todayAppointments(today).totalRevenue(BigDecimal.ZERO).build();
    }
}
`);

w(path.join(SVC_DOC, 'DoctorAppointmentService.java'), `package com.taevas.clinic.service.doctor;

import com.taevas.clinic.dto.clinicadmin.AppointmentDto;
import com.taevas.clinic.exception.ResourceNotFoundException;
import com.taevas.clinic.model.*;
import com.taevas.clinic.repository.*;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.*;

@Service @RequiredArgsConstructor @Transactional(readOnly = true)
public class DoctorAppointmentService {
    private final AppointmentRepository repo;
    private final ClinicPatientRepository patientRepo;
    private final ClinicStaffRepository staffRepo;

    public Page<AppointmentDto> getAppointments(UUID clinicId, UUID staffId, String date, String status, Pageable pageable) {
        Specification<Appointment> spec = (root, q, cb) -> {
            List<Predicate> preds = new ArrayList<>();
            preds.add(cb.equal(root.get("clinicId"), clinicId));
            preds.add(cb.equal(root.get("doctorId"), staffId));
            if (date != null && !date.isBlank()) preds.add(cb.equal(root.get("appointmentDate"), LocalDate.parse(date)));
            if (status != null && !status.isBlank()) preds.add(cb.equal(root.get("status"), status));
            return cb.and(preds.toArray(new Predicate[0]));
        };
        return repo.findAll(spec, pageable).map(this::toDto);
    }

    public AppointmentDto getById(UUID id) {
        return toDto(repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", id)));
    }

    @Transactional public AppointmentDto updateStatus(UUID id, String status) {
        Appointment a = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", id));
        a.setStatus(status);
        return toDto(repo.save(a));
    }

    private AppointmentDto toDto(Appointment a) {
        String pName = patientRepo.findById(a.getPatientId()).map(p -> p.getFirstName() + " " + (p.getLastName() != null ? p.getLastName() : "")).orElse("Unknown");
        String dName = staffRepo.findById(a.getDoctorId()).map(ClinicStaff::getName).orElse("Unknown");
        return AppointmentDto.builder().id(a.getId().toString()).clinicId(a.getClinicId().toString())
            .patientId(a.getPatientId().toString()).patientName(pName)
            .doctorId(a.getDoctorId().toString()).doctorName(dName)
            .appointmentDate(a.getAppointmentDate().toString())
            .startTime(a.getStartTime().toString())
            .endTime(a.getEndTime() != null ? a.getEndTime().toString() : null)
            .type(a.getType()).status(a.getStatus()).notes(a.getNotes())
            .tokenNumber(a.getTokenNumber())
            .createdAt(a.getCreatedAt() != null ? a.getCreatedAt().toString() : null).build();
    }
}
`);

w(path.join(SVC_DOC, 'DoctorEncounterService.java'), `package com.taevas.clinic.service.doctor;

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
    private final ClinicPatientRepository patientRepo;
    private final ClinicStaffRepository staffRepo;

    public EncounterDto getByAppointment(UUID appointmentId) {
        return repo.findByAppointmentId(appointmentId).map(this::toDto).orElse(null);
    }

    @Transactional public EncounterDto create(UUID clinicId, UUID staffId, EncounterRequest r) {
        Encounter e = Encounter.builder().clinicId(clinicId).appointmentId(UUID.fromString(r.getAppointmentId()))
            .doctorId(staffId).patientId(clinicId) // will be set from appointment
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
`);

w(path.join(SVC_DOC, 'DoctorPrescriptionService.java'), `package com.taevas.clinic.service.doctor;

import com.taevas.clinic.dto.clinicadmin.*;
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
    private final ClinicPatientRepository patientRepo;
    private final ClinicStaffRepository staffRepo;

    public List<PrescriptionDto> getByEncounter(UUID encounterId) {
        return rxRepo.findByEncounterId(encounterId).stream().map(this::toDto).collect(Collectors.toList());
    }

    public Page<PrescriptionDto> getByPatient(UUID patientId, Pageable pageable) {
        return rxRepo.findByPatientId(patientId, pageable).map(this::toDto);
    }

    @Transactional public PrescriptionDto create(UUID clinicId, UUID staffId, PrescriptionRequest r) {
        Prescription rx = Prescription.builder().clinicId(clinicId).encounterId(UUID.fromString(r.getEncounterId()))
            .doctorId(staffId).patientId(clinicId).diagnosis(r.getDiagnosis()).notes(r.getNotes()).status("ACTIVE").build();
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
`);

w(path.join(SVC_DOC, 'DoctorBillingService.java'), `package com.taevas.clinic.service.doctor;

import com.taevas.clinic.dto.clinicadmin.InvoiceDto;
import com.taevas.clinic.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Service @RequiredArgsConstructor @Transactional(readOnly = true)
public class DoctorBillingService {
    private final InvoiceRepository repo;
    public Page<InvoiceDto> getInvoices(UUID clinicId, Pageable pageable) {
        return repo.findByClinicId(clinicId, pageable).map(i -> InvoiceDto.builder()
            .id(i.getId().toString()).clinicId(i.getClinicId().toString())
            .invoiceNumber(i.getInvoiceNumber()).total(i.getTotal() != null ? i.getTotal().toString() : "0")
            .status(i.getStatus()).createdAt(i.getCreatedAt() != null ? i.getCreatedAt().toString() : null).build());
    }
}
`);

w(path.join(SVC_DOC, 'DoctorDeviceReportService.java'), `package com.taevas.clinic.service.doctor;

import com.taevas.clinic.dto.clinicadmin.DeviceReportDto;
import com.taevas.clinic.repository.DeviceReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Service @RequiredArgsConstructor @Transactional(readOnly = true)
public class DoctorDeviceReportService {
    private final DeviceReportRepository repo;
    public Page<DeviceReportDto> getReports(UUID clinicId, UUID staffId, Pageable pageable) {
        return repo.findByDoctorId(staffId, pageable).map(r -> DeviceReportDto.builder()
            .id(r.getId().toString()).deviceName(r.getDeviceName()).reportType(r.getReportType())
            .findings(r.getFindings()).status(r.getStatus())
            .reportedAt(r.getReportedAt() != null ? r.getReportedAt().toString() : null).build());
    }
}
`);

w(path.join(SVC_DOC, 'DoctorFamilyService.java'), `package com.taevas.clinic.service.doctor;

import com.taevas.clinic.dto.clinicadmin.*;
import com.taevas.clinic.model.*;
import com.taevas.clinic.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor @Transactional(readOnly = true)
public class DoctorFamilyService {
    private final FamilyGroupRepository groupRepo;
    private final FamilyMemberRepository memberRepo;
    private final ClinicPatientRepository patientRepo;

    public List<FamilyDto> getFamilyByPatient(UUID patientId) {
        List<FamilyGroup> groups = groupRepo.findByPrimaryPatientId(patientId);
        return groups.stream().map(g -> {
            String primaryName = patientRepo.findById(g.getPrimaryPatientId()).map(p -> p.getFirstName()).orElse("");
            List<FamilyMemberDto> members = memberRepo.findByFamilyGroupId(g.getId()).stream()
                .map(m -> { String mName = patientRepo.findById(m.getPatientId()).map(p -> p.getFirstName()).orElse("");
                    return FamilyMemberDto.builder().id(m.getId().toString()).patientId(m.getPatientId().toString())
                        .patientName(mName).relationship(m.getRelationship()).build(); })
                .collect(Collectors.toList());
            return FamilyDto.builder().id(g.getId().toString()).clinicId(g.getClinicId().toString())
                .name(g.getName()).primaryPatientId(g.getPrimaryPatientId().toString())
                .primaryPatientName(primaryName).members(members).build();
        }).collect(Collectors.toList());
    }
}
`);

w(path.join(SVC_DOC, 'DoctorWhatsAppService.java'), `package com.taevas.clinic.service.doctor;

import com.taevas.clinic.dto.clinicadmin.WhatsAppConfigDto;
import com.taevas.clinic.model.WhatsAppBotConfig;
import com.taevas.clinic.repository.WhatsAppBotConfigRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Service @RequiredArgsConstructor @Transactional(readOnly = true)
public class DoctorWhatsAppService {
    private final WhatsAppBotConfigRepository repo;

    public WhatsAppConfigDto getConfig(UUID clinicId) {
        return repo.findByClinicId(clinicId).map(c -> WhatsAppConfigDto.builder()
            .id(c.getId().toString()).clinicId(c.getClinicId().toString())
            .enabled(c.getEnabled()).phoneNumber(c.getPhoneNumber())
            .welcomeMessage(c.getWelcomeMessage()).autoReply(c.getAutoReply()).build())
            .orElse(WhatsAppConfigDto.builder().enabled(false).autoReply(true).build());
    }

    @Transactional public WhatsAppConfigDto updateConfig(UUID clinicId, WhatsAppConfigDto dto) {
        WhatsAppBotConfig c = repo.findByClinicId(clinicId)
            .orElse(WhatsAppBotConfig.builder().clinicId(clinicId).build());
        c.setEnabled(dto.getEnabled()); c.setPhoneNumber(dto.getPhoneNumber());
        c.setWelcomeMessage(dto.getWelcomeMessage()); c.setAutoReply(dto.getAutoReply());
        repo.save(c);
        return dto;
    }
}
`);

w(path.join(SVC_DOC, 'DoctorMarketingService.java'), `package com.taevas.clinic.service.doctor;

import com.taevas.clinic.dto.clinicadmin.ReviewDto;
import com.taevas.clinic.repository.MarketingReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Service @RequiredArgsConstructor @Transactional(readOnly = true)
public class DoctorMarketingService {
    private final MarketingReviewRepository repo;
    public Page<ReviewDto> getReviews(UUID clinicId, Pageable pageable) {
        return repo.findByClinicId(clinicId, pageable).map(r -> ReviewDto.builder()
            .id(r.getId().toString()).patientName(r.getPatientName()).rating(r.getRating())
            .reviewText(r.getReviewText()).source(r.getSource()).status(r.getStatus())
            .createdAt(r.getCreatedAt() != null ? r.getCreatedAt().toString() : null).build());
    }
}
`);

// Patient Service
const SVC_PAT = path.join(BE, 'service/patient');

w(path.join(SVC_PAT, 'PatientPortalService.java'), `package com.taevas.clinic.service.patient;

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
`);

console.log(`\nTotal files written: ${count}`);
