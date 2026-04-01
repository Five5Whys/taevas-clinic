package com.taevas.clinic.service.clinicadmin;

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

    @Transactional public List<IdConfigDto> updateIdConfig(UUID clinicId, List<IdConfigDto> dtos) {
        for (IdConfigDto dto : dtos) {
            idFormatRepo.findById(UUID.fromString(dto.getId())).ifPresent(t -> {
                t.setPrefix(dto.getPrefix());
                t.setEntityCode(dto.getEntityCode());
                t.setSeparator(dto.getSeparator());
                t.setPadding(dto.getPadding());
                t.setStartsAt(dto.getStartsAt());
                idFormatRepo.save(t);
            });
        }
        return getIdConfig(clinicId);
    }

    public List<IdConfigDto> getIdConfig(UUID clinicId) {
        Clinic clinic = clinicRepo.findById(clinicId).orElse(null);
        if (clinic == null || clinic.getCountryId() == null) return List.of();
        return idFormatRepo.findByCountryId(clinic.getCountryId()).stream()
            .map(t -> IdConfigDto.builder().id(t.getId().toString())
                .countryId(t.getCountryId().toString()).entityType(t.getEntityType())
                .prefix(t.getPrefix()).entityCode(t.getEntityCode()).separator(t.getSeparator())
                .padding(t.getPadding()).startsAt(t.getStartsAt()).locked(t.isLocked()).build())
            .collect(Collectors.toList());
    }
}
