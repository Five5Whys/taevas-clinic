package com.taevas.clinic.dto.superadmin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EquidorDeviceDto {

    private String deviceId;
    private String deviceName;
    private List<EquidorClinicDto> clinics;
}
