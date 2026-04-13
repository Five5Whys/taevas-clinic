package com.taevas.clinic.controller.patient;

import com.taevas.clinic.controller.BaseController;
import com.taevas.clinic.dto.ApiResponse;
import com.taevas.clinic.dto.clinicadmin.*;
import com.taevas.clinic.dto.clinicadmin.AppointmentRequest;
import com.taevas.clinic.dto.doctor.EmergencyContactDto;
import com.taevas.clinic.dto.doctor.EmergencyContactRequest;
import com.taevas.clinic.dto.doctor.PatientReportDto;
import com.taevas.clinic.service.doctor.EmergencyContactService;
import com.taevas.clinic.service.patient.PatientPortalService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.*;

@RestController @RequestMapping("/api/patient") @PreAuthorize("hasAnyRole('PATIENT','DOCTOR','CLINIC_ADMIN')")
@Tag(name = "Patient Portal") @RequiredArgsConstructor
public class PatientPortalController extends BaseController {
    private final PatientPortalService service;
    private final EmergencyContactService ecService;

    private UUID resolvePatientRecordId() {
        return service.getPatientRecordId(getClinicId(), getPatientId());
    }

    @GetMapping("/profile") public ResponseEntity<ApiResponse<PatientDto>> getProfile() {
        return ResponseEntity.ok(ApiResponse.success(service.getProfile(getClinicId(), getPatientId())));
    }
    @PutMapping("/profile") public ResponseEntity<ApiResponse<PatientDto>> updateProfile(@RequestBody PatientRequest request) {
        return ResponseEntity.ok(ApiResponse.success(service.updateProfile(getClinicId(), getPatientId(), request), "Profile updated"));
    }
    @GetMapping("/dashboard") public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboard() {
        return ResponseEntity.ok(ApiResponse.success(service.getDashboard(getClinicId(), getPatientId())));
    }
    @GetMapping("/appointments") public ResponseEntity<ApiResponse<Page<AppointmentDto>>> getAppointments(
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(service.getAppointments(getClinicId(), getPatientId(), PageRequest.of(page, size))));
    }
    @GetMapping("/prescriptions") public ResponseEntity<ApiResponse<Page<PrescriptionDto>>> getPrescriptions(
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(service.getPrescriptions(getClinicId(), getPatientId(), PageRequest.of(page, size))));
    }
    @GetMapping("/family") public ResponseEntity<ApiResponse<List<FamilyDto>>> getFamily() {
        return ResponseEntity.ok(ApiResponse.success(service.getFamily(getClinicId(), getPatientId())));
    }
    @GetMapping("/health-records") public ResponseEntity<ApiResponse<List<PatientReportDto>>> getHealthRecords() {
        return ResponseEntity.ok(ApiResponse.success(service.getHealthRecords(getClinicId(), getPatientId())));
    }
    @PostMapping(value = "/health-records", consumes = {"multipart/form-data"})
    public ResponseEntity<ApiResponse<PatientReportDto>> uploadHealthRecord(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam(value = "reportType", required = false) String reportType,
            @RequestParam(value = "reportDate", required = false) String reportDate,
            @RequestParam(value = "notes", required = false) String notes) {
        return ResponseEntity.ok(ApiResponse.success(
                service.uploadHealthRecord(getClinicId(), getPatientId(), title, reportType, reportDate, notes, file),
                "Record uploaded"));
    }
    @DeleteMapping("/health-records/{reportId}")
    public ResponseEntity<ApiResponse<Void>> deleteHealthRecord(@PathVariable UUID reportId) {
        service.deleteHealthRecord(getClinicId(), getPatientId(), reportId);
        return ResponseEntity.ok(ApiResponse.success(null, "Record deleted"));
    }
    @GetMapping("/doctors") public ResponseEntity<ApiResponse<List<Map<String, String>>>> listDoctors() {
        return ResponseEntity.ok(ApiResponse.success(service.getClinicDoctors(getClinicId())));
    }
    @PostMapping("/appointments") public ResponseEntity<ApiResponse<AppointmentDto>> bookAppointment(@RequestBody AppointmentRequest request) {
        return ResponseEntity.ok(ApiResponse.success(service.bookAppointment(getClinicId(), getPatientId(), request), "Appointment booked"));
    }

    @GetMapping("/emergency-contacts") public ResponseEntity<ApiResponse<List<EmergencyContactDto>>> listContacts() {
        return ResponseEntity.ok(ApiResponse.success(ecService.list(resolvePatientRecordId())));
    }
    @PostMapping("/emergency-contacts") public ResponseEntity<ApiResponse<EmergencyContactDto>> addContact(@Valid @RequestBody EmergencyContactRequest request) {
        return ResponseEntity.ok(ApiResponse.success(ecService.add(resolvePatientRecordId(), request), "Emergency contact added"));
    }
    @PutMapping("/emergency-contacts/{contactId}") public ResponseEntity<ApiResponse<EmergencyContactDto>> updateContact(@PathVariable UUID contactId, @Valid @RequestBody EmergencyContactRequest request) {
        return ResponseEntity.ok(ApiResponse.success(ecService.update(contactId, request), "Emergency contact updated"));
    }
    @DeleteMapping("/emergency-contacts/{contactId}") public ResponseEntity<ApiResponse<Void>> deleteContact(@PathVariable UUID contactId) {
        ecService.delete(contactId);
        return ResponseEntity.ok(ApiResponse.success(null, "Emergency contact deleted"));
    }
}
