package com.taevas.clinic.service.doctor;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.taevas.clinic.dto.doctor.DoctorProfileDto;
import com.taevas.clinic.dto.doctor.DoctorProfileRequest;
import com.taevas.clinic.dto.doctor.ProfileCompletionDto;
import com.taevas.clinic.model.DoctorProfile;
import com.taevas.clinic.model.enums.ProfileStatus;
import com.taevas.clinic.repository.DoctorProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DoctorProfileService {

    private final DoctorProfileRepository doctorProfileRepository;
    private final ObjectMapper objectMapper;

    public DoctorProfileDto getProfile(UUID userId) {
        Optional<DoctorProfile> profile = doctorProfileRepository.findByUserId(userId);
        return profile.map(this::toDto).orElse(null);
    }

    @Transactional
    public DoctorProfileDto saveProfile(UUID userId, DoctorProfileRequest request) {
        DoctorProfile profile = doctorProfileRepository.findByUserId(userId)
                .orElse(DoctorProfile.builder()
                        .userId(userId)
                        .status(ProfileStatus.DRAFT)
                        .build());

        profile.setQualifications(toJsonString(request.getQualifications()));
        profile.setSpecializations(toJsonString(request.getSpecializations()));
        profile.setExperienceYears(request.getExperienceYears());
        profile.setMedicalLicenseNumber(request.getMedicalLicenseNumber());
        profile.setLicenseIssuedCountry(request.getLicenseIssuedCountry());
        profile.setLicenseIssuedState(request.getLicenseIssuedState());
        profile.setLicenseCertificateUrl(request.getLicenseCertificateUrl());
        profile.setPanCardNumber(request.getPanCardNumber());
        profile.setPanCardAttachmentUrl(request.getPanCardAttachmentUrl());
        profile.setSignatureUrl(request.getSignatureUrl());
        profile.setEmail(request.getEmail());
        profile.setHomeAddress(request.getHomeAddress());
        profile.setState(request.getState());
        profile.setCity(request.getCity());
        profile.setZipCode(request.getZipCode());
        profile.setRemarks(request.getRemarks());

        // Auto-detect status based on mandatory fields
        profile.setStatus(computeStatus(profile));

        DoctorProfile saved = doctorProfileRepository.save(profile);
        return toDto(saved);
    }

    @Transactional
    public void deleteProfile(UUID userId) {
        doctorProfileRepository.findByUserId(userId)
                .ifPresent(doctorProfileRepository::delete);
    }

    public ProfileCompletionDto getCompletionStatus(UUID userId) {
        Optional<DoctorProfile> optProfile = doctorProfileRepository.findByUserId(userId);
        if (optProfile.isEmpty()) {
            return ProfileCompletionDto.builder()
                    .complete(false)
                    .missingFields(List.of(
                            "qualifications", "specializations", "experienceYears"))
                    .build();
        }

        DoctorProfile profile = optProfile.get();
        List<String> missing = getMissingFields(profile);

        return ProfileCompletionDto.builder()
                .complete(missing.isEmpty())
                .missingFields(missing)
                .build();
    }

    // ── Helpers ────────────────────────────────────────────────

    private ProfileStatus computeStatus(DoctorProfile profile) {
        List<String> missing = getMissingFields(profile);
        return missing.isEmpty() ? ProfileStatus.COMPLETE : ProfileStatus.DRAFT;
    }

    private List<String> getMissingFields(DoctorProfile profile) {
        List<String> missing = new ArrayList<>();

        if (isBlankJson(profile.getQualifications())) {
            missing.add("qualifications");
        }
        if (isBlankJson(profile.getSpecializations())) {
            missing.add("specializations");
        }
        if (profile.getExperienceYears() == null) {
            missing.add("experienceYears");
        }
        // Medical license fields are optional

        return missing;
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private boolean isBlankJson(String json) {
        if (json == null || json.isBlank()) return true;
        List<String> list = fromJsonString(json);
        return list == null || list.isEmpty();
    }

    private String toJsonString(List<String> list) {
        if (list == null || list.isEmpty()) return null;
        try {
            return objectMapper.writeValueAsString(list);
        } catch (JsonProcessingException e) {
            return null;
        }
    }

    private List<String> fromJsonString(String json) {
        if (json == null || json.isBlank()) return List.of();
        try {
            return objectMapper.readValue(json, new TypeReference<List<String>>() {});
        } catch (JsonProcessingException e) {
            return List.of();
        }
    }

    private DoctorProfileDto toDto(DoctorProfile profile) {
        return DoctorProfileDto.builder()
                .id(profile.getId() != null ? profile.getId().toString() : null)
                .userId(profile.getUserId() != null ? profile.getUserId().toString() : null)
                .qualifications(fromJsonString(profile.getQualifications()))
                .specializations(fromJsonString(profile.getSpecializations()))
                .experienceYears(profile.getExperienceYears())
                .medicalLicenseNumber(profile.getMedicalLicenseNumber())
                .licenseIssuedCountry(profile.getLicenseIssuedCountry())
                .licenseIssuedState(profile.getLicenseIssuedState())
                .licenseCertificateUrl(profile.getLicenseCertificateUrl())
                .panCardNumber(profile.getPanCardNumber())
                .panCardAttachmentUrl(profile.getPanCardAttachmentUrl())
                .signatureUrl(profile.getSignatureUrl())
                .email(profile.getEmail())
                .homeAddress(profile.getHomeAddress())
                .state(profile.getState())
                .city(profile.getCity())
                .zipCode(profile.getZipCode())
                .remarks(profile.getRemarks())
                .status(profile.getStatus() != null ? profile.getStatus().name() : null)
                .createdAt(profile.getCreatedAt() != null ? profile.getCreatedAt().toString() : null)
                .updatedAt(profile.getUpdatedAt() != null ? profile.getUpdatedAt().toString() : null)
                .build();
    }
}
