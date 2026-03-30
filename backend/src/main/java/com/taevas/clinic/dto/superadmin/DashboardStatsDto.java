package com.taevas.clinic.dto.superadmin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDto {

    private long totalCountries;
    private long totalClinics;
    private long totalDoctors;
    private long totalPatients;

    private double countryDelta;
    private double clinicDelta;
    private double doctorDelta;
    private double patientDelta;
}
