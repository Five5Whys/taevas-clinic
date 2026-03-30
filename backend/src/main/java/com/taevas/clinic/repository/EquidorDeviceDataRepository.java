package com.taevas.clinic.repository;

import com.taevas.clinic.model.EquidorDeviceData;
import com.taevas.clinic.model.enums.IngestionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EquidorDeviceDataRepository extends JpaRepository<EquidorDeviceData, UUID> {

    List<EquidorDeviceData> findBySessionId(UUID sessionId);

    List<EquidorDeviceData> findByStatus(IngestionStatus status);

    List<EquidorDeviceData> findBySessionIdAndStatus(UUID sessionId, IngestionStatus status);

    long countByStatus(IngestionStatus status);
}
