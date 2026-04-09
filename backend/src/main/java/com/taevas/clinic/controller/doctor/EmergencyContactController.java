package com.taevas.clinic.controller.doctor;

import com.taevas.clinic.controller.BaseController;
import com.taevas.clinic.dto.ApiResponse;
import com.taevas.clinic.dto.doctor.EmergencyContactDto;
import com.taevas.clinic.dto.doctor.EmergencyContactRequest;
import com.taevas.clinic.service.doctor.EmergencyContactService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController @RequestMapping("/api/doctor") @PreAuthorize("hasAnyRole('DOCTOR','CLINIC_ADMIN')")
@Tag(name = "Doctor - Emergency Contacts") @RequiredArgsConstructor
public class EmergencyContactController extends BaseController {
    private final EmergencyContactService service;

    @GetMapping("/patients/{patientId}/emergency-contacts")
    public ResponseEntity<ApiResponse<List<EmergencyContactDto>>> list(@PathVariable UUID patientId) {
        return ResponseEntity.ok(ApiResponse.success(service.list(patientId)));
    }

    @PostMapping("/patients/{patientId}/emergency-contacts")
    public ResponseEntity<ApiResponse<EmergencyContactDto>> add(@PathVariable UUID patientId, @Valid @RequestBody EmergencyContactRequest request) {
        return ResponseEntity.ok(ApiResponse.success(service.add(patientId, request)));
    }

    @PutMapping("/emergency-contacts/{contactId}")
    public ResponseEntity<ApiResponse<EmergencyContactDto>> update(@PathVariable UUID contactId, @Valid @RequestBody EmergencyContactRequest request) {
        return ResponseEntity.ok(ApiResponse.success(service.update(contactId, request)));
    }

    @DeleteMapping("/emergency-contacts/{contactId}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID contactId) {
        service.delete(contactId);
        return ResponseEntity.ok(ApiResponse.success(null, "Deleted"));
    }
}
