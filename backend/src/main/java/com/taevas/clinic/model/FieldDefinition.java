package com.taevas.clinic.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
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
@Table(name = "field_definitions")
public class FieldDefinition extends BaseEntity {

    @Column(name = "scope", nullable = false)
    private String scope;

    @Column(name = "country_id")
    private UUID countryId;

    @Column(name = "section", nullable = false)
    private String section;

    @Column(name = "field_key", nullable = false)
    private String fieldKey;

    @Column(name = "label", nullable = false)
    private String label;

    @Column(name = "field_type", nullable = false)
    private String fieldType;

    @Column(name = "locked", nullable = false)
    private boolean locked;

    @Column(name = "required", nullable = false)
    private boolean required;

    @Column(name = "removable", nullable = false)
    private boolean removable;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder;
}
