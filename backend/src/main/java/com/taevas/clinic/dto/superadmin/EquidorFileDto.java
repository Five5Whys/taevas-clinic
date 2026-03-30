package com.taevas.clinic.dto.superadmin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EquidorFileDto {

    private String id;
    private String fileName;
    private String fileType;
    private long fileSize;
    private String status;
    private String failReason;
    private String receivedAt;
}
