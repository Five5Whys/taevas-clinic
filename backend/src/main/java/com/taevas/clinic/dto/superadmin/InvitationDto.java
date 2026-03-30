package com.taevas.clinic.dto.superadmin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvitationDto {

    private String id;
    private String email;
    private String phone;
    private String invitedByName;
    private String status;
    private String expiresAt;
    private String createdAt;
}
