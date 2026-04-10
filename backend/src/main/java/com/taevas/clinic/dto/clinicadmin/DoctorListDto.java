package com.taevas.clinic.dto.clinicadmin;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoctorListDto {
    private String id;
    private String firstName;
    private String lastName;
    private String department;
    private String doctorCode;
}
