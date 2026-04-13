package com.taevas.clinic.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import java.util.UUID;

@Data @SuperBuilder @NoArgsConstructor @AllArgsConstructor @EqualsAndHashCode(callSuper = true)
@Entity @Table(name = "patient_report_media")
public class PatientReportMedia extends BaseEntity {
    @Column(name = "report_id", nullable = false) private UUID reportId;
    @Column(name = "file_name", nullable = false) private String fileName;
    @Column(name = "file_path", nullable = false, length = 500) private String filePath;
    @Column(name = "content_type", length = 100) private String contentType;
    @Column(name = "file_size") private Long fileSize;
}
