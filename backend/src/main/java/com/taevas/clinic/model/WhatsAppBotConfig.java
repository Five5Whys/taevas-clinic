package com.taevas.clinic.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import java.util.UUID;

@Data @SuperBuilder @NoArgsConstructor @AllArgsConstructor @EqualsAndHashCode(callSuper = true)
@Entity @Table(name = "whatsapp_bot_config")
public class WhatsAppBotConfig extends BaseEntity {
    @Column(name = "clinic_id", unique = true) private UUID clinicId;
    @Column(name = "enabled") private Boolean enabled;
    @Column(name = "phone_number") private String phoneNumber;
    @Column(name = "api_key") private String apiKey;
    @Column(name = "welcome_message") private String welcomeMessage;
    @Column(name = "auto_reply") private Boolean autoReply;
}
