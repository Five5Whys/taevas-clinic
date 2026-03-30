package com.taevas.clinic.service.superadmin;

import com.taevas.clinic.dto.superadmin.InvitationDto;
import com.taevas.clinic.dto.superadmin.InviteRequest;
import com.taevas.clinic.exception.ResourceNotFoundException;
import com.taevas.clinic.model.SuperAdminInvitation;
import com.taevas.clinic.model.User;
import com.taevas.clinic.model.enums.InvitationStatus;
import com.taevas.clinic.repository.SuperAdminInvitationRepository;
import com.taevas.clinic.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class InvitationService {

    private final SuperAdminInvitationRepository invitationRepository;
    private final UserRepository userRepository;

    @Transactional
    public InvitationDto invite(InviteRequest request, UUID invitedBy) {
        SuperAdminInvitation invitation = SuperAdminInvitation.builder()
                .email(request.getEmail())
                .phone(request.getPhone())
                .invitedBy(invitedBy)
                .token(UUID.randomUUID().toString())
                .status(InvitationStatus.PENDING)
                .expiresAt(LocalDateTime.now().plusDays(7))
                .build();

        invitationRepository.save(invitation);

        return toDto(invitation, invitedBy);
    }

    public List<InvitationDto> getPending() {
        return invitationRepository.findByStatusOrderByCreatedAtDesc(InvitationStatus.PENDING).stream()
                .map(inv -> toDto(inv, inv.getInvitedBy()))
                .collect(Collectors.toList());
    }

    @Transactional
    public void revoke(UUID invitationId) {
        SuperAdminInvitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new ResourceNotFoundException("SuperAdminInvitation", "id", invitationId));

        invitation.setStatus(InvitationStatus.REVOKED);
        invitationRepository.save(invitation);
    }

    private InvitationDto toDto(SuperAdminInvitation entity, UUID invitedById) {
        String invitedByName = null;
        if (invitedById != null) {
            invitedByName = userRepository.findById(invitedById)
                    .map(user -> {
                        String first = user.getFirstName() != null ? user.getFirstName() : "";
                        String last = user.getLastName() != null ? user.getLastName() : "";
                        return (first + " " + last).trim();
                    })
                    .orElse(null);
        }

        return InvitationDto.builder()
                .id(entity.getId().toString())
                .email(entity.getEmail())
                .phone(entity.getPhone())
                .invitedByName(invitedByName)
                .status(entity.getStatus().name())
                .expiresAt(entity.getExpiresAt() != null ? entity.getExpiresAt().toString() : null)
                .createdAt(entity.getCreatedAt() != null ? entity.getCreatedAt().toString() : null)
                .build();
    }
}
