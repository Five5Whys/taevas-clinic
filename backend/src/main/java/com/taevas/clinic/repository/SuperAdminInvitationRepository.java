package com.taevas.clinic.repository;

import com.taevas.clinic.model.SuperAdminInvitation;
import com.taevas.clinic.model.enums.InvitationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SuperAdminInvitationRepository extends JpaRepository<SuperAdminInvitation, UUID> {

    Optional<SuperAdminInvitation> findByToken(String token);

    List<SuperAdminInvitation> findByStatusOrderByCreatedAtDesc(InvitationStatus status);
}
