package com.taevas.clinic.service.superadmin;

import com.taevas.clinic.dto.superadmin.ClinicDto;
import com.taevas.clinic.dto.superadmin.ClinicRequest;
import com.taevas.clinic.exception.ResourceNotFoundException;
import com.taevas.clinic.model.Clinic;
import com.taevas.clinic.model.Country;
import com.taevas.clinic.model.enums.ClinicStatus;
import com.taevas.clinic.model.enums.CountryStatus;
import com.taevas.clinic.repository.ClinicRepository;
import com.taevas.clinic.repository.ComplianceModuleRepository;
import com.taevas.clinic.repository.CountryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ClinicServiceTest {

    @Mock
    private ClinicRepository clinicRepository;

    @Mock
    private CountryRepository countryRepository;

    @Mock
    private ComplianceModuleRepository complianceModuleRepository;

    @InjectMocks
    private ClinicService clinicService;

    private UUID clinicId;
    private UUID countryId;
    private Clinic testClinic;
    private Country testCountry;

    @BeforeEach
    void setUp() {
        clinicId = UUID.randomUUID();
        countryId = UUID.randomUUID();

        testCountry = Country.builder()
                .code("IN")
                .name("India")
                .flagEmoji("flag-in")
                .status(CountryStatus.ACTIVE)
                .build();
        testCountry.setId(countryId);

        testClinic = Clinic.builder()
                .countryId(countryId)
                .name("Test Clinic")
                .city("Mumbai")
                .state("Maharashtra")
                .email("test@clinic.com")
                .status(ClinicStatus.ACTIVE)
                .build();
        testClinic.setId(clinicId);
    }

    @Test
    @SuppressWarnings("unchecked")
    void getAll_returnsPaginatedClinics() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Clinic> clinicPage = new PageImpl<>(List.of(testClinic), pageable, 1);

        when(clinicRepository.findAll(any(Specification.class), eq(pageable))).thenReturn(clinicPage);
        when(countryRepository.findById(countryId)).thenReturn(Optional.of(testCountry));
        when(complianceModuleRepository.findByCountryIdAndEnabledTrue(countryId)).thenReturn(List.of());

        Page<ClinicDto> result = clinicService.getAll(null, null, null, pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("Test Clinic", result.getContent().get(0).getName());
        assertEquals("India", result.getContent().get(0).getCountryName());
    }

    @Test
    void getById_returnsClinicDto() {
        when(clinicRepository.findById(clinicId)).thenReturn(Optional.of(testClinic));
        when(countryRepository.findById(countryId)).thenReturn(Optional.of(testCountry));
        when(complianceModuleRepository.findByCountryIdAndEnabledTrue(countryId)).thenReturn(List.of());

        ClinicDto result = clinicService.getById(clinicId);

        assertNotNull(result);
        assertEquals(clinicId.toString(), result.getId());
        assertEquals("Test Clinic", result.getName());
        assertEquals("India", result.getCountryName());
    }

    @Test
    void getById_withInvalidId_throwsResourceNotFoundException() {
        UUID badId = UUID.randomUUID();
        when(clinicRepository.findById(badId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> clinicService.getById(badId));
    }

    @Test
    void create_savesNewClinic() {
        ClinicRequest request = ClinicRequest.builder()
                .countryId(countryId.toString())
                .name("New Clinic")
                .city("Delhi")
                .state("Delhi")
                .email("new@clinic.com")
                .status("ACTIVE")
                .build();

        when(countryRepository.findById(countryId)).thenReturn(Optional.of(testCountry));
        when(clinicRepository.save(any(Clinic.class))).thenAnswer(invocation -> {
            Clinic c = invocation.getArgument(0);
            c.setId(UUID.randomUUID());
            return c;
        });
        when(complianceModuleRepository.findByCountryIdAndEnabledTrue(countryId)).thenReturn(List.of());

        ClinicDto result = clinicService.create(request);

        assertNotNull(result);
        assertEquals("New Clinic", result.getName());
        assertEquals("Delhi", result.getCity());
        assertEquals("ACTIVE", result.getStatus());
        verify(clinicRepository).save(any(Clinic.class));
    }

    @Test
    void create_withInvalidCountryId_throwsResourceNotFoundException() {
        UUID badCountryId = UUID.randomUUID();
        ClinicRequest request = ClinicRequest.builder()
                .countryId(badCountryId.toString())
                .name("New Clinic")
                .status("ACTIVE")
                .build();

        when(countryRepository.findById(badCountryId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> clinicService.create(request));
        verify(clinicRepository, never()).save(any());
    }

    @Test
    void update_modifiesExistingClinic() {
        ClinicRequest request = ClinicRequest.builder()
                .countryId(countryId.toString())
                .name("Updated Clinic")
                .city("Chennai")
                .state("Tamil Nadu")
                .email("updated@clinic.com")
                .status("PILOT")
                .build();

        when(clinicRepository.findById(clinicId)).thenReturn(Optional.of(testClinic));
        when(countryRepository.findById(countryId)).thenReturn(Optional.of(testCountry));
        when(clinicRepository.save(any(Clinic.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(complianceModuleRepository.findByCountryIdAndEnabledTrue(countryId)).thenReturn(List.of());

        ClinicDto result = clinicService.update(clinicId, request);

        assertNotNull(result);
        assertEquals("Updated Clinic", result.getName());
        assertEquals("Chennai", result.getCity());
        assertEquals("PILOT", result.getStatus());
    }
}
