package com.taevas.clinic.service.doctor;

import com.taevas.clinic.dto.clinicadmin.InvoiceDto;
import com.taevas.clinic.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Service @RequiredArgsConstructor @Transactional(readOnly = true)
public class DoctorBillingService {
    private final InvoiceRepository repo;
    public Page<InvoiceDto> getInvoices(UUID clinicId, Pageable pageable) {
        return repo.findByClinicId(clinicId, pageable).map(i -> InvoiceDto.builder()
            .id(i.getId().toString()).clinicId(i.getClinicId().toString())
            .invoiceNumber(i.getInvoiceNumber()).total(i.getTotal() != null ? i.getTotal().toString() : "0")
            .status(i.getStatus()).createdAt(i.getCreatedAt() != null ? i.getCreatedAt().toString() : null).build());
    }
}
