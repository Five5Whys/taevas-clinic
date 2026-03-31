package com.taevas.clinic.service.doctor;

import com.taevas.clinic.dto.clinicadmin.ReviewDto;
import com.taevas.clinic.repository.MarketingReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Service @RequiredArgsConstructor @Transactional(readOnly = true)
public class DoctorMarketingService {
    private final MarketingReviewRepository repo;
    public Page<ReviewDto> getReviews(UUID clinicId, Pageable pageable) {
        return repo.findByClinicId(clinicId, pageable).map(r -> ReviewDto.builder()
            .id(r.getId().toString()).patientName(r.getPatientName()).rating(r.getRating())
            .reviewText(r.getReviewText()).source(r.getSource()).status(r.getStatus())
            .createdAt(r.getCreatedAt() != null ? r.getCreatedAt().toString() : null).build());
    }
}
