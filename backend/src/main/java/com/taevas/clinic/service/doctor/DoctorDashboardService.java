package com.taevas.clinic.service.doctor;

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
