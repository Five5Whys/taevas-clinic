package com.taevas.clinic.service.superadmin;

import com.taevas.clinic.dto.superadmin.DoctorRosterDto;
import com.taevas.clinic.dto.superadmin.RoleUpdateRequest;
import com.taevas.clinic.exception.ResourceNotFoundException;
import com.taevas.clinic.model.Clinic;
import com.taevas.clinic.model.Country;
import com.taevas.clinic.model.User;
import com.taevas.clinic.model.UserRole;
import com.taevas.clinic.model.enums.Role;
import com.taevas.clinic.repository.ClinicRepository;
import com.taevas.clinic.repository.CountryRepository;
import com.taevas.clinic.repository.UserRepository;
import com.taevas.clinic.repository.UserRoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GlobalRosterService {

    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final ClinicRepository clinicRepository;
    private final CountryRepository countryRepository;

    public Page<DoctorRosterDto> getAll(String country, String search, Pageable pageable) {
        // Phase 1: Get all users with DOCTOR role
        List<UserRole> doctorRoles = userRoleRepository.findByRole(Role.DOCTOR);

        // Build a map of userId -> roles for quick lookup
        Map<UUID, List<UserRole>> userRolesMap = doctorRoles.stream()
                .collect(Collectors.groupingBy(ur -> ur.getUser().getId()));

        List<User> doctors = doctorRoles.stream()
                .map(UserRole::getUser)
                .distinct()
                .collect(Collectors.toList());

        // Filter by country if provided
        if (country != null && !country.isBlank()) {
            List<Clinic> countryClinics = clinicRepository.findByCountryId(UUID.fromString(country));
            Set<UUID> tenantIds = countryClinics.stream()
                    .map(Clinic::getTenantId)
                    .collect(Collectors.toSet());
            doctors = doctors.stream()
                    .filter(u -> u.getTenantId() != null && tenantIds.contains(u.getTenantId()))
                    .collect(Collectors.toList());
        }

        // Filter by search (name, email, phone)
        if (search != null && !search.isBlank()) {
            String lowerSearch = search.toLowerCase();
            doctors = doctors.stream()
                    .filter(u -> matches(u, lowerSearch))
                    .collect(Collectors.toList());
        }

        // Manual pagination
        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), doctors.size());

        List<DoctorRosterDto> page;
        if (start >= doctors.size()) {
            page = List.of();
        } else {
            page = doctors.subList(start, end).stream()
                    .map(user -> {
                        List<UserRole> roles = userRolesMap.getOrDefault(user.getId(), List.of());
                        return buildDoctorDto(user, roles);
                    })
                    .collect(Collectors.toList());
        }

        return new PageImpl<>(page, pageable, doctors.size());
    }

    public DoctorRosterDto getById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        List<UserRole> roles = userRoleRepository.findByUser_Id(id);

        return buildDoctorDto(user, roles);
    }

    @Transactional
    public void updateRoles(UUID userId, RoleUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // Delete existing roles
        userRoleRepository.deleteByUser_Id(userId);

        // Create new roles
        List<UserRole> newRoles = request.getRoles().stream()
                .map(roleName -> UserRole.builder()
                        .user(user)
                        .role(Role.valueOf(roleName))
                        .build())
                .collect(Collectors.toList());

        userRoleRepository.saveAll(newRoles);
    }

    @Transactional
    public void deactivate(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        user.setActive(false);
        userRepository.save(user);
    }

    private DoctorRosterDto buildDoctorDto(User user, List<UserRole> roles) {
        String systemId = "TC-" + user.getId().toString().substring(0, 8).toUpperCase();

        List<String> roleNames = roles.stream()
                .map(ur -> ur.getRole().name())
                .collect(Collectors.toList());

        // Resolve clinic and country info from tenantId
        String clinicName = null;
        String countryName = null;
        String countryFlag = null;
        String registration = null;

        if (user.getTenantId() != null) {
            Optional<Clinic> clinicOpt = clinicRepository.findById(user.getTenantId());
            if (clinicOpt.isPresent()) {
                Clinic clinic = clinicOpt.get();
                clinicName = clinic.getName();
                registration = clinic.getRegistrationNumber();

                if (clinic.getCountryId() != null) {
                    Optional<Country> countryOpt = countryRepository.findById(clinic.getCountryId());
                    if (countryOpt.isPresent()) {
                        countryName = countryOpt.get().getName();
                        countryFlag = countryOpt.get().getFlagEmoji();
                    }
                }
            }
        }

        return DoctorRosterDto.builder()
                .id(user.getId().toString())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .systemId(systemId)
                .roles(roleNames)
                .speciality(null)
                .clinic(clinicName)
                .registration(registration)
                .country(countryName)
                .countryFlag(countryFlag)
                .build();
    }

    private boolean matches(User user, String lowerSearch) {
        if (user.getFirstName() != null && user.getFirstName().toLowerCase().contains(lowerSearch)) {
            return true;
        }
        if (user.getLastName() != null && user.getLastName().toLowerCase().contains(lowerSearch)) {
            return true;
        }
        if (user.getEmail() != null && user.getEmail().toLowerCase().contains(lowerSearch)) {
            return true;
        }
        if (user.getPhone() != null && user.getPhone().contains(lowerSearch)) {
            return true;
        }
        return false;
    }
}
