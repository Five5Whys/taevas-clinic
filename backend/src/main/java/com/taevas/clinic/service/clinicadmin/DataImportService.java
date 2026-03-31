package com.taevas.clinic.service.clinicadmin;

import com.taevas.clinic.dto.clinicadmin.DataImportDto;
import com.taevas.clinic.model.DataImportSession;
import com.taevas.clinic.repository.DataImportSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Service @RequiredArgsConstructor @Transactional(readOnly = true)
public class DataImportService {
    private final DataImportSessionRepository repo;

    public Page<DataImportDto> getHistory(UUID clinicId, Pageable pageable) {
        return repo.findByClinicId(clinicId, pageable).map(this::toDto);
    }

    @Transactional public DataImportDto importData(UUID clinicId, String type, String fileName) {
        DataImportSession s = DataImportSession.builder().clinicId(clinicId).importType(type)
            .fileName(fileName).totalRecords(0).successCount(0).failCount(0).status("PENDING").build();
        return toDto(repo.save(s));
    }

    private DataImportDto toDto(DataImportSession s) {
        return DataImportDto.builder().id(s.getId().toString()).clinicId(s.getClinicId().toString())
            .importType(s.getImportType()).fileName(s.getFileName())
            .totalRecords(s.getTotalRecords()).successCount(s.getSuccessCount()).failCount(s.getFailCount())
            .status(s.getStatus()).errorLog(s.getErrorLog())
            .createdAt(s.getCreatedAt() != null ? s.getCreatedAt().toString() : null).build();
    }
}
