package com.taevas.clinic.service.superadmin;

import com.taevas.clinic.dto.superadmin.CountryConfigRequest;
import com.taevas.clinic.dto.superadmin.CountryDto;
import com.taevas.clinic.exception.ResourceNotFoundException;
import com.taevas.clinic.model.Country;
import com.taevas.clinic.model.enums.CountryStatus;
import com.taevas.clinic.repository.ClinicRepository;
import com.taevas.clinic.repository.CountryRepository;
import com.taevas.clinic.repository.UserRoleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CountryServiceTest {

    @Mock
    private CountryRepository countryRepository;

    @Mock
    private ClinicRepository clinicRepository;

    @Mock
    private UserRoleRepository userRoleRepository;

    @InjectMocks
    private CountryService countryService;

    private UUID countryId;
    private Country testCountry;

    @BeforeEach
    void setUp() {
        countryId = UUID.randomUUID();

        testCountry = Country.builder()
                .code("IN")
                .name("India")
                .flagEmoji("flag-in")
                .status(CountryStatus.ACTIVE)
                .currencyCode("INR")
                .currencySymbol("Rs")
                .taxType("GST")
                .taxRate(new BigDecimal("18.00"))
                .dateFormat("dd/MM/yyyy")
                .primaryLanguage("en")
                .build();
        testCountry.setId(countryId);
    }

    @Test
    void getAll_returnsCountriesList() {
        when(countryRepository.findAll()).thenReturn(List.of(testCountry));
        when(clinicRepository.countByCountryId(countryId)).thenReturn(5L);

        List<CountryDto> result = countryService.getAll();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("India", result.get(0).getName());
        assertEquals("IN", result.get(0).getCode());
        assertEquals(5L, result.get(0).getClinicCount());
    }

    @Test
    void getById_returnsCountryDto() {
        when(countryRepository.findById(countryId)).thenReturn(Optional.of(testCountry));
        when(clinicRepository.countByCountryId(countryId)).thenReturn(3L);

        CountryDto result = countryService.getById(countryId);

        assertNotNull(result);
        assertEquals(countryId.toString(), result.getId());
        assertEquals("India", result.getName());
        assertEquals("INR", result.getCurrencyCode());
        assertEquals(3L, result.getClinicCount());
    }

    @Test
    void getById_notFound_throwsResourceNotFoundException() {
        UUID badId = UUID.randomUUID();
        when(countryRepository.findById(badId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> countryService.getById(badId));
    }

    @Test
    void create_savesNewCountry() {
        CountryConfigRequest request = CountryConfigRequest.builder()
                .code("AE")
                .name("UAE")
                .flagEmoji("flag-ae")
                .status("ACTIVE")
                .currencyCode("AED")
                .currencySymbol("AED")
                .taxType("VAT")
                .taxRate(new BigDecimal("5.00"))
                .dateFormat("dd/MM/yyyy")
                .primaryLanguage("ar")
                .build();

        when(countryRepository.save(any(Country.class))).thenAnswer(invocation -> {
            Country c = invocation.getArgument(0);
            c.setId(UUID.randomUUID());
            return c;
        });
        when(clinicRepository.countByCountryId(any())).thenReturn(0L);

        CountryDto result = countryService.create(request);

        assertNotNull(result);
        assertEquals("UAE", result.getName());
        assertEquals("AE", result.getCode());
        assertEquals("AED", result.getCurrencyCode());
        verify(countryRepository).save(any(Country.class));
    }

    @Test
    void update_modifiesCountry() {
        CountryConfigRequest request = CountryConfigRequest.builder()
                .code("IN")
                .name("India Updated")
                .flagEmoji("flag-in")
                .status("PILOT")
                .currencyCode("INR")
                .currencySymbol("Rs")
                .taxType("GST")
                .taxRate(new BigDecimal("18.00"))
                .dateFormat("dd/MM/yyyy")
                .primaryLanguage("en")
                .secondaryLanguage("hi")
                .build();

        when(countryRepository.findById(countryId)).thenReturn(Optional.of(testCountry));
        when(countryRepository.save(any(Country.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(clinicRepository.countByCountryId(countryId)).thenReturn(5L);

        CountryDto result = countryService.update(countryId, request);

        assertNotNull(result);
        assertEquals("India Updated", result.getName());
        assertEquals("PILOT", result.getStatus());
        assertEquals("hi", result.getSecondaryLanguage());
    }
}
