package com.taevas.clinic.dto.clinicadmin;
import lombok.*; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class DayScheduleDto { private String id, staffId, doctorName, startTime, endTime; private Integer dayOfWeek, slotDuration, maxPatients, bufferMinutes; private Boolean enabled; }
