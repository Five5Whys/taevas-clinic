package com.taevas.clinic.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import java.util.UUID;

@Data @SuperBuilder @NoArgsConstructor @AllArgsConstructor @EqualsAndHashCode(callSuper = true)
@Entity @Table(name = "data_import_sessions")
public class DataImportSession extends BaseEntity {
    @Column(name = "clinic_id", nullable = false) private UUID clinicId;
    @Column(name = "import_type", nullable = false) private String importType;
    @Column(name = "file_name") private String fileName;
    @Column(name = "total_records") private Integer totalRecords;
    @Column(name = "success_count") private Integer successCount;
    @Column(name = "fail_count") private Integer failCount;
    @Column(name = "status", nullable = false) private String status;
    @Column(name = "error_log") private String errorLog;
}
