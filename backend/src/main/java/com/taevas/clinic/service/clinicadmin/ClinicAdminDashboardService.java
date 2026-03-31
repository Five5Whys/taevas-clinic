package com.taevas.clinic.service.clinicadmin;

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
