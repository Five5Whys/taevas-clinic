package com.taevas.clinic.service.superadmin;

import com.taevas.clinic.dto.superadmin.EquidorClinicDto;
import com.taevas.clinic.dto.superadmin.EquidorDeviceDto;
import com.taevas.clinic.dto.superadmin.EquidorFileDto;
import com.taevas.clinic.dto.superadmin.EquidorPatientDto;
import com.taevas.clinic.dto.superadmin.EquidorSessionDto;
import com.taevas.clinic.exception.ResourceNotFoundException;
import com.taevas.clinic.model.EquidorDeviceData;
import com.taevas.clinic.model.EquidorIngestionSession;
import com.taevas.clinic.model.enums.IngestionStatus;
import com.taevas.clinic.repository.EquidorDeviceDataRepository;
import com.taevas.clinic.repository.EquidorIngestionSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EquidorService {

    private final EquidorIngestionSessionRepository sessionRepository;
    private final EquidorDeviceDataRepository deviceDataRepository;

    public List<EquidorSessionDto> getSessions(String dateFrom, String dateTo,
                                                String type, String status, String search) {
        List<EquidorIngestionSession> sessions = sessionRepository.findAll();

        // Filter by date range
        if (dateFrom != null && !dateFrom.isBlank()) {
            LocalDate from = LocalDate.parse(dateFrom);
            sessions = sessions.stream()
                    .filter(s -> !s.getIngestionDate().isBefore(from))
                    .collect(Collectors.toList());
        }
        if (dateTo != null && !dateTo.isBlank()) {
            LocalDate to = LocalDate.parse(dateTo);
            sessions = sessions.stream()
                    .filter(s -> !s.getIngestionDate().isAfter(to))
                    .collect(Collectors.toList());
        }

        // Filter by status
        if (status != null && !status.isBlank()) {
            IngestionStatus ingestionStatus = IngestionStatus.valueOf(status.toUpperCase());
            sessions = sessions.stream()
                    .filter(s -> s.getStatus() == ingestionStatus)
                    .collect(Collectors.toList());
        }

        // Filter by search (CID)
        if (search != null && !search.isBlank()) {
            String lowerSearch = search.toLowerCase();
            sessions = sessions.stream()
                    .filter(s -> s.getCid().toLowerCase().contains(lowerSearch))
                    .collect(Collectors.toList());
        }

        return sessions.stream()
                .map(this::toSummaryDto)
                .collect(Collectors.toList());
    }

    public EquidorSessionDto getSession(String cid) {
        EquidorIngestionSession session = sessionRepository.findByCid(cid)
                .orElseThrow(() -> new ResourceNotFoundException("EquidorIngestionSession", "cid", cid));

        List<EquidorDeviceData> deviceDataList = deviceDataRepository.findBySessionId(session.getId());

        // Build tree: group by deviceId -> clinicId -> patientId -> files
        Map<String, List<EquidorDeviceData>> byDevice = deviceDataList.stream()
                .collect(Collectors.groupingBy(EquidorDeviceData::getDeviceId, LinkedHashMap::new, Collectors.toList()));

        List<EquidorDeviceDto> devices = new ArrayList<>();
        for (Map.Entry<String, List<EquidorDeviceData>> deviceEntry : byDevice.entrySet()) {
            String deviceId = deviceEntry.getKey();
            List<EquidorDeviceData> deviceFiles = deviceEntry.getValue();
            String deviceName = deviceFiles.get(0).getDeviceName();

            // Group by clinicId
            Map<UUID, List<EquidorDeviceData>> byClinic = deviceFiles.stream()
                    .collect(Collectors.groupingBy(
                            d -> d.getClinicId() != null ? d.getClinicId() : UUID.fromString("00000000-0000-0000-0000-000000000000"),
                            LinkedHashMap::new, Collectors.toList()));

            List<EquidorClinicDto> clinics = new ArrayList<>();
            for (Map.Entry<UUID, List<EquidorDeviceData>> clinicEntry : byClinic.entrySet()) {
                UUID clinicId = clinicEntry.getKey();
                List<EquidorDeviceData> clinicFiles = clinicEntry.getValue();

                // Group by patientId
                Map<UUID, List<EquidorDeviceData>> byPatient = clinicFiles.stream()
                        .collect(Collectors.groupingBy(
                                d -> d.getPatientId() != null ? d.getPatientId() : UUID.fromString("00000000-0000-0000-0000-000000000000"),
                                LinkedHashMap::new, Collectors.toList()));

                List<EquidorPatientDto> patients = new ArrayList<>();
                for (Map.Entry<UUID, List<EquidorDeviceData>> patientEntry : byPatient.entrySet()) {
                    UUID patientId = patientEntry.getKey();
                    List<EquidorDeviceData> patientFiles = patientEntry.getValue();

                    List<EquidorFileDto> files = patientFiles.stream()
                            .map(this::toFileDto)
                            .collect(Collectors.toList());

                    patients.add(EquidorPatientDto.builder()
                            .patientId(patientId.toString())
                            .patientName(null)
                            .files(files)
                            .build());
                }

                clinics.add(EquidorClinicDto.builder()
                        .clinicId(clinicId.toString())
                        .clinicName(null)
                        .patients(patients)
                        .build());
            }

            devices.add(EquidorDeviceDto.builder()
                    .deviceId(deviceId)
                    .deviceName(deviceName)
                    .clinics(clinics)
                    .build());
        }

        return EquidorSessionDto.builder()
                .id(session.getId().toString())
                .cid(session.getCid())
                .ingestionDate(session.getIngestionDate().toString())
                .status(session.getStatus().name())
                .totalDevices(session.getTotalDevices())
                .totalFiles(session.getTotalFiles())
                .devices(devices)
                .build();
    }

    public EquidorFileDto getFile(UUID fileId) {
        EquidorDeviceData data = deviceDataRepository.findById(fileId)
                .orElseThrow(() -> new ResourceNotFoundException("EquidorDeviceData", "id", fileId));
        return toFileDto(data);
    }

    @Transactional
    public void retrySession(String cid) {
        EquidorIngestionSession session = sessionRepository.findByCid(cid)
                .orElseThrow(() -> new ResourceNotFoundException("EquidorIngestionSession", "cid", cid));

        List<EquidorDeviceData> failedData = deviceDataRepository
                .findBySessionIdAndStatus(session.getId(), IngestionStatus.FAILED);

        for (EquidorDeviceData data : failedData) {
            data.setStatus(IngestionStatus.QUEUED);
            data.setFailReason(null);
        }

        deviceDataRepository.saveAll(failedData);

        // Reset session status if it was FAILED
        if (session.getStatus() == IngestionStatus.FAILED) {
            session.setStatus(IngestionStatus.QUEUED);
            sessionRepository.save(session);
        }
    }

    private EquidorSessionDto toSummaryDto(EquidorIngestionSession session) {
        return EquidorSessionDto.builder()
                .id(session.getId().toString())
                .cid(session.getCid())
                .ingestionDate(session.getIngestionDate().toString())
                .status(session.getStatus().name())
                .totalDevices(session.getTotalDevices())
                .totalFiles(session.getTotalFiles())
                .devices(null)
                .build();
    }

    private EquidorFileDto toFileDto(EquidorDeviceData data) {
        return EquidorFileDto.builder()
                .id(data.getId().toString())
                .fileName(data.getFileName())
                .fileType(data.getFileType())
                .fileSize(data.getFileSize())
                .status(data.getStatus().name())
                .failReason(data.getFailReason())
                .receivedAt(data.getReceivedAt() != null ? data.getReceivedAt().toString() : null)
                .build();
    }
}
