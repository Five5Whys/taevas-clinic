package com.taevas.clinic.service.superadmin;

import com.taevas.clinic.dto.superadmin.BillingConfigDto;
import com.taevas.clinic.dto.superadmin.BillingConfigRequest;
import com.taevas.clinic.exception.ResourceNotFoundException;
import com.taevas.clinic.model.BillingConfig;
import com.taevas.clinic.repository.BillingConfigRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BillingConfigService {

    private final BillingConfigRepository billingConfigRepository;

    public BillingConfigDto getByCountry(UUID countryId) {
        BillingConfig config = billingConfigRepository.findByCountryId(countryId)
                .orElseThrow(() -> new ResourceNotFoundException("BillingConfig", "countryId", countryId));
        return toDto(config);
    }

    @Transactional
    public BillingConfigDto update(UUID countryId, BillingConfigRequest request) {
        BillingConfig config = billingConfigRepository.findByCountryId(countryId)
                .orElseThrow(() -> new ResourceNotFoundException("BillingConfig", "countryId", countryId));

        config.setCurrencySymbol(request.getCurrencySymbol());
        config.setCurrencyCode(request.getCurrencyCode());
        config.setTaxRate(request.getTaxRate());
        config.setTaxSplit(request.getTaxSplit());
        config.setClaimCode(request.getClaimCode());
        config.setInvoicePrefix(request.getInvoicePrefix());
        config.setInvoiceFormat(request.getInvoiceFormat());
        config.setToggles(request.getToggles());

        billingConfigRepository.save(config);

        return toDto(config);
    }

    private BillingConfigDto toDto(BillingConfig entity) {
        return BillingConfigDto.builder()
                .id(entity.getId().toString())
                .countryId(entity.getCountryId().toString())
                .currencySymbol(entity.getCurrencySymbol())
                .currencyCode(entity.getCurrencyCode())
                .taxRate(entity.getTaxRate())
                .taxSplit(entity.getTaxSplit())
                .claimCode(entity.getClaimCode())
                .invoicePrefix(entity.getInvoicePrefix())
                .invoiceFormat(entity.getInvoiceFormat())
                .toggles(entity.getToggles())
                .build();
    }
}
