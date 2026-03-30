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
@Table(name = "locale_settings")
public class LocaleSettings extends BaseEntity {

    @Column(name = "country_id", unique = true, nullable = false)
    private UUID countryId;

    @Column(name = "primary_language")
    private String primaryLanguage;

    @Column(name = "secondary_language")
    private String secondaryLanguage;

    @Column(name = "date_format")
    private String dateFormat;

    @Column(name = "weight_unit")
    private String weightUnit;

    @Column(name = "height_unit")
    private String heightUnit;

    @Column(name = "timezone")
    private String timezone;
}
