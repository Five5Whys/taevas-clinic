package com.taevas.clinic.service.doctor;

import com.taevas.clinic.dto.clinicadmin.WhatsAppConfigDto;
import com.taevas.clinic.model.WhatsAppBotConfig;
import com.taevas.clinic.repository.WhatsAppBotConfigRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Service @RequiredArgsConstructor @Transactional(readOnly = true)
public class DoctorWhatsAppService {
    private final WhatsAppBotConfigRepository repo;

    public WhatsAppConfigDto getConfig(UUID clinicId) {
        return repo.findByClinicId(clinicId).map(c -> WhatsAppConfigDto.builder()
            .id(c.getId().toString()).clinicId(c.getClinicId().toString())
            .enabled(c.getEnabled()).phoneNumber(c.getPhoneNumber())
            .welcomeMessage(c.getWelcomeMessage()).autoReply(c.getAutoReply()).build())
            .orElse(WhatsAppConfigDto.builder().enabled(false).autoReply(true).build());
    }

    @Transactional public WhatsAppConfigDto updateConfig(UUID clinicId, WhatsAppConfigDto dto) {
        WhatsAppBotConfig c = repo.findByClinicId(clinicId)
            .orElse(WhatsAppBotConfig.builder().clinicId(clinicId).build());
        c.setEnabled(dto.getEnabled()); c.setPhoneNumber(dto.getPhoneNumber());
        c.setWelcomeMessage(dto.getWelcomeMessage()); c.setAutoReply(dto.getAutoReply());
        repo.save(c);
        return dto;
    }
}
