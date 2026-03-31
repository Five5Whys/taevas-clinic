package com.taevas.clinic.repository;

import com.taevas.clinic.model.InvoiceItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface InvoiceItemRepository extends JpaRepository<InvoiceItem, UUID>, JpaSpecificationExecutor<InvoiceItem> {

    List<InvoiceItem> findByInvoiceId(UUID invoiceId);
}
