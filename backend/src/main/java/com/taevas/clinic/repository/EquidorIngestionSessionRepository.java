package com.taevas.clinic.repository;

import com.taevas.clinic.model.EquidorIngestionSession;
import com.taevas.clinic.model.enums.IngestionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EquidorIngestionSessionRepository extends JpaRepository<EquidorIngestionSession, UUID> {

    Optional<EquidorIngestionSession> findByCid(String cid);

    List<EquidorIngestionSession> findByStatus(IngestionStatus status);
}
