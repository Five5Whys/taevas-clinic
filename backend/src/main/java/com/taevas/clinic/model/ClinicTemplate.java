package com.taevas.clinic.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import java.util.UUID;

@Data @SuperBuilder @NoArgsConstructor @AllArgsConstructor @EqualsAndHashCode(callSuper = true)
@Entity @Table(name = "clinic_templates")
public class ClinicTemplate extends BaseEntity {
    @Column(name = "clinic_id", nullable = false) private UUID clinicId;
    @Column(name = "template_type", nullable = false) private String templateType;
    @Column(name = "config_json") private String configJson;
    @Column(name = "file_path") private String filePath;
}
