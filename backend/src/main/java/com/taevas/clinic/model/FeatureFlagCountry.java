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
@Table(name = "feature_flag_countries", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"feature_flag_id", "country_id"})
})
public class FeatureFlagCountry extends BaseEntity {

    @Column(name = "feature_flag_id", nullable = false)
    private UUID featureFlagId;

    @Column(name = "country_id", nullable = false)
    private UUID countryId;

    @Column(name = "enabled", nullable = false)
    private boolean enabled;
}
