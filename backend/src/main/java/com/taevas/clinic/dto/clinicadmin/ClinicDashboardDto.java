package com.taevas.clinic.dto.clinicadmin;
import lombok.*; import java.math.BigDecimal; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ClinicDashboardDto { private long totalPatients, totalAppointments, todayAppointments, pendingAppointments, completedAppointments; private BigDecimal totalRevenue; }
