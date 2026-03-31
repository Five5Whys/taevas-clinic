package com.taevas.clinic.dto.clinicadmin;
import lombok.*; import java.math.BigDecimal; import java.util.List; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ClinicReportDto { private long totalPatients, totalAppointments; private BigDecimal totalRevenue; private double completedRate; private List<TopDoctorDto> topDoctors; private List<AppointmentBreakdownDto> appointmentBreakdown; }
