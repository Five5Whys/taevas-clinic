package com.taevas.clinic.service.clinicadmin;

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
