package com.taevas.clinic.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "id_format_templates", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"country_id", "entity_type"})
})
public class IdFormatTemplate extends BaseEntity {

    @Column(name = "country_id", nullable = false)
    private UUID countryId;

    @Column(name = "entity_type", nullable = false)
    private String entityType;

    @Column(name = "prefix")
    private String prefix;

    @Column(name = "entity_code")
    private String entityCode;

    @Column(name = "separator")
    private String separator;

    @Column(name = "padding", nullable = false)
    private int padding;

    @Column(name = "starts_at", nullable = false)
    private int startsAt;

    @Column(name = "locked", nullable = false)
    private boolean locked;
}
