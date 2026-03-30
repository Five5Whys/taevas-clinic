package com.taevas.clinic.model;

import com.taevas.clinic.model.enums.IngestionStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "equidor_ingestion_sessions")
public class EquidorIngestionSession extends BaseEntity {

    @Column(name = "cid", unique = true, nullable = false)
    private String cid;

    @Column(name = "ingestion_date", nullable = false)
    private LocalDate ingestionDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private IngestionStatus status;

    @Column(name = "total_devices", nullable = false)
    private int totalDevices;

    @Column(name = "total_files", nullable = false)
    private int totalFiles;
}
