package com.taevas.clinic.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import java.util.UUID;

@Data @SuperBuilder @NoArgsConstructor @AllArgsConstructor @EqualsAndHashCode(callSuper = true)
@Entity @Table(name = "marketing_reviews")
public class MarketingReview extends BaseEntity {
    @Column(name = "clinic_id", nullable = false) private UUID clinicId;
    @Column(name = "patient_id") private UUID patientId;
    @Column(name = "patient_name") private String patientName;
    @Column(name = "rating") private Integer rating;
    @Column(name = "review_text") private String reviewText;
    @Column(name = "source") private String source;
    @Column(name = "status", nullable = false) private String status;
}
