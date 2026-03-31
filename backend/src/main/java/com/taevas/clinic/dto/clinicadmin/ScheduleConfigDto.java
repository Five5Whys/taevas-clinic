package com.taevas.clinic.dto.clinicadmin;
import lombok.*; @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ScheduleConfigDto { private Integer defaultSlotDuration, maxPatientsPerSlot, bufferBetweenSlots; }
