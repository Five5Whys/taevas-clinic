package com.taevas.clinic.service.doctor;

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
