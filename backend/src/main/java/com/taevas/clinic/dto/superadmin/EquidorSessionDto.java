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
public class EquidorSessionDto {

    private String id;
    private String cid;
    private String ingestionDate;
    private String status;
    private int totalDevices;
    private int totalFiles;
    private List<EquidorDeviceDto> devices;
}
