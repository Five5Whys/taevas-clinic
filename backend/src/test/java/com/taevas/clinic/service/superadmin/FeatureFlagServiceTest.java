package com.taevas.clinic.service.superadmin;

import com.taevas.clinic.dto.superadmin.FeatureFlagDto;
import com.taevas.clinic.exception.ResourceNotFoundException;
import com.taevas.clinic.model.Country;
import com.taevas.clinic.model.FeatureFlag;
import com.taevas.clinic.model.FeatureFlagCountry;
import com.taevas.clinic.model.enums.CountryStatus;
import com.taevas.clinic.repository.ClinicRepository;
import com.taevas.clinic.repository.CountryRepository;
import com.taevas.clinic.repository.FeatureFlagCountryRepository;
import com.taevas.clinic.repository.FeatureFlagRepository;
import com.taevas.clinic.repository.UserRoleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FeatureFlagServiceTest {

    @Mock
    private FeatureFlagRepository featureFlagRepository;

    @Mock
    private FeatureFlagCountryRepository featureFlagCountryRepository;

    @Mock
    private CountryRepository countryRepository;

    @Mock
    private ClinicRepository clinicRepository;

    @Mock
    private UserRoleRepository userRoleRepository;

    @InjectMocks
    private FeatureFlagService featureFlagService;

    private UUID flagId;
    private UUID countryId;
    private FeatureFlag testFlag;

    @BeforeEach
    void setUp() {
        flagId = UUID.randomUUID();
        countryId = UUID.randomUUID();

        testFlag = FeatureFlag.builder()
                .key("telehealth")
                .name("Telehealth")
                .description("Enable telehealth consultations")
                .locked(false)
                .build();
        testFlag.setId(flagId);
    }

    @Test
    void getAll_returnsFeatureFlags() {
        FeatureFlagCountry ffc = FeatureFlagCountry.builder()
                .featureFlagId(flagId)
                .countryId(countryId)
                .enabled(true)
                .build();

        when(featureFlagRepository.findAll()).thenReturn(List.of(testFlag));
        when(featureFlagCountryRepository.findByFeatureFlagId(flagId)).thenReturn(List.of(ffc));

        List<FeatureFlagDto> result = featureFlagService.getAll();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("telehealth", result.get(0).getKey());
        assertEquals("Telehealth", result.get(0).getName());
        assertTrue(result.get(0).getCountries().get(countryId.toString()));
    }

    @Test
    void toggleCountry_updatesEnabledState() {
        Country country = Country.builder()
                .code("IN")
                .name("India")
                .status(CountryStatus.ACTIVE)
                .build();
        country.setId(countryId);

        FeatureFlagCountry ffc = FeatureFlagCountry.builder()
                .featureFlagId(flagId)
                .countryId(countryId)
                .enabled(false)
                .build();

        when(featureFlagRepository.findById(flagId)).thenReturn(Optional.of(testFlag));
        when(countryRepository.findById(countryId)).thenReturn(Optional.of(country));
        when(featureFlagCountryRepository.findByFeatureFlagIdAndCountryId(flagId, countryId))
                .thenReturn(Optional.of(ffc));
        when(featureFlagCountryRepository.save(any(FeatureFlagCountry.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(featureFlagCountryRepository.findByFeatureFlagId(flagId)).thenReturn(List.of(ffc));

        FeatureFlagDto result = featureFlagService.toggleCountry(flagId, countryId, true);

        assertNotNull(result);
        assertTrue(ffc.isEnabled());
        verify(featureFlagCountryRepository).save(ffc);
    }

    @Test
    void toggleLock_togglesFlagLockedState() {
        assertFalse(testFlag.isLocked());

        when(featureFlagRepository.findById(flagId)).thenReturn(Optional.of(testFlag));
        when(featureFlagRepository.save(any(FeatureFlag.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(featureFlagCountryRepository.findByFeatureFlagId(flagId)).thenReturn(List.of());

        FeatureFlagDto result = featureFlagService.toggleLock(flagId);

        assertNotNull(result);
        assertTrue(testFlag.isLocked());
        verify(featureFlagRepository).save(testFlag);
    }

    @Test
    void getImpact_returnsAffectedCounts() {
        FeatureFlagCountry ffc = FeatureFlagCountry.builder()
                .featureFlagId(flagId)
                .countryId(countryId)
                .enabled(true)
                .build();

        when(featureFlagRepository.findById(flagId)).thenReturn(Optional.of(testFlag));
        when(featureFlagCountryRepository.findByFeatureFlagIdAndEnabledTrue(flagId)).thenReturn(List.of(ffc));
        when(clinicRepository.countByCountryId(countryId)).thenReturn(10L);
        when(clinicRepository.findByCountryId(countryId)).thenReturn(List.of());

        Map<String, Object> impact = featureFlagService.getImpact(flagId);

        assertNotNull(impact);
        assertEquals(10L, impact.get("totalClinics"));
        assertEquals(0L, impact.get("totalDoctors"));

        @SuppressWarnings("unchecked")
        Map<String, Map<String, Long>> countries = (Map<String, Map<String, Long>>) impact.get("countries");
        assertNotNull(countries);
        assertEquals(10L, countries.get(countryId.toString()).get("clinics"));
    }

    @Test
    void getImpact_withInvalidFlagId_throwsResourceNotFoundException() {
        UUID badId = UUID.randomUUID();
        when(featureFlagRepository.findById(badId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> featureFlagService.getImpact(badId));
    }
}
