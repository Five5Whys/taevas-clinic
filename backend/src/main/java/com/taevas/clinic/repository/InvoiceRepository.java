package com.taevas.clinic.repository;

import com.taevas.clinic.model.Invoice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, UUID>, JpaSpecificationExecutor<Invoice> {

    Page<Invoice> findByClinicId(UUID clinicId, Pageable pageable);
    List<Invoice> findByPatientId(UUID patientId);
    long countByClinicId(UUID clinicId);

    @org.springframework.data.jpa.repository.Query("SELECT COALESCE(SUM(i.total),0) FROM Invoice i WHERE i.clinicId = :clinicId AND i.status = :status")
    java.math.BigDecimal sumTotalByClinicIdAndStatus(@org.springframework.data.repository.query.Param("clinicId") UUID clinicId, @org.springframework.data.repository.query.Param("status") String status);
}
