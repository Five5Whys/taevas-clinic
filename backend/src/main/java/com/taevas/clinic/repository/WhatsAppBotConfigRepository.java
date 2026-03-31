package com.taevas.clinic.repository;

import com.taevas.clinic.model.WhatsAppBotConfig;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WhatsAppBotConfigRepository extends JpaRepository<WhatsAppBotConfig, UUID>, JpaSpecificationExecutor<WhatsAppBotConfig> {

    Optional<WhatsAppBotConfig> findByClinicId(UUID clinicId);
}
