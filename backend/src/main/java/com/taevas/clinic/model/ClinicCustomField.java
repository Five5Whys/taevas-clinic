package com.taevas.clinic.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import java.util.UUID;

@Data @SuperBuilder @NoArgsConstructor @AllArgsConstructor @EqualsAndHashCode(callSuper = true)
@Entity @Table(name = "clinic_custom_fields")
public class ClinicCustomField extends BaseEntity {
    @Column(name = "clinic_id", nullable = false) private UUID clinicId;
    @Column(name = "section", nullable = false) private String section;
    @Column(name = "field_key", nullable = false) private String fieldKey;
    @Column(name = "label", nullable = false) private String label;
    @Column(name = "field_type", nullable = false) private String fieldType;
    @Column(name = "required") private Boolean required;
    @Column(name = "sort_order") private Integer sortOrder;
}
