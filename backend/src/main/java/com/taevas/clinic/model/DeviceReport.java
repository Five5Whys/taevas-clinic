package com.taevas.clinic.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import java.util.UUID;
import java.time.LocalDateTime;

@Data @SuperBuilder @NoArgsConstructor @AllArgsConstructor @EqualsAndHashCode(callSuper = true)
@Entity @Table(name = "device_reports")
public class DeviceReport extends BaseEntity {
    @Column(name = "clinic_id", nullable = false) private UUID clinicId;
    @Column(name = "patient_id") private UUID patientId;
    @Column(name = "doctor_id") private UUID doctorId;
    @Column(name = "device_name") private String deviceName;
    @Column(name = "report_type") private String reportType;
    @Column(name = "file_url") private String fileUrl;
    @Column(name = "findings") private String findings;
    @Column(name = "status", nullable = false) private String status;
    @Column(name = "reported_at") private LocalDateTime reportedAt;
}
