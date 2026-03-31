package com.taevas.clinic.repository;

import com.taevas.clinic.model.FamilyMember;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface FamilyMemberRepository extends JpaRepository<FamilyMember, UUID>, JpaSpecificationExecutor<FamilyMember> {

    List<FamilyMember> findByFamilyGroupId(UUID familyGroupId);
    List<FamilyMember> findByPatientId(UUID patientId);
}
