package com.taevas.clinic.service.clinicadmin;

import com.taevas.clinic.dto.clinicadmin.AdminAssignPatientRequest;
import com.taevas.clinic.dto.clinicadmin.DoctorListDto;
import com.taevas.clinic.exception.ResourceNotFoundException;
import com.taevas.clinic.exception.UnauthorizedException;
import com.taevas.clinic.model.ClinicPatient;
import com.taevas.clinic.model.ClinicStaff;
import com.taevas.clinic.model.DoctorPatientAssignment;
import com.taevas.clinic.repository.ClinicPatientRepository;
import com.taevas.clinic.repository.ClinicStaffRepository;
import com.taevas.clinic.repository.DoctorPatientAssignmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ClinicAdminAssignmentService {

    private final ClinicStaffRepository staffRepo;
    private final ClinicPatientRepository patientRepo;
    private final DoctorPatientAssignmentRepository assignmentRepo;

    /**
     * Returns all doctors (clinic_staff with role=DOCTOR) for the given clinic.
     */
    public List<DoctorListDto> getDoctors(UUID clinicId) {
        List<ClinicStaff> doctors = staffRepo.findByClinicIdAndRole(clinicId, "DOCTOR");
        return doctors.stream().map(this::toDoctorDto).toList();
    }

    /**
     * Assigns a patient to a doctor. Both must belong to the same clinic.
     * Returns true if newly assigned, false if already assigned.
     */
    @Transactional
    public boolean assignPatientToDoctor(UUID clinicId, AdminAssignPatientRequest request) {
        UUID doctorId = request.getDoctorId();
        UUID patientId = request.getPatientId();

        // Validate doctor belongs to this clinic
        List<ClinicStaff> doctorStaff = staffRepo.findByClinicIdAndRole(clinicId, "DOCTOR");
        boolean doctorBelongsToClinic = doctorStaff.stream()
                .anyMatch(s -> s.getUserId() != null && s.getUserId().equals(doctorId));
        if (!doctorBelongsToClinic) {
            throw new UnauthorizedException("Doctor does not belong to this clinic");
        }

        // Validate patient belongs to this clinic
        ClinicPatient patient = patientRepo.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", patientId));
        if (!patient.getClinicId().equals(clinicId)) {
            throw new UnauthorizedException("Patient does not belong to this clinic");
        }

        // Check if already assigned
        if (assignmentRepo.existsByDoctorIdAndPatientId(doctorId, patientId)) {
            return false;
        }

        DoctorPatientAssignment assignment = DoctorPatientAssignment.builder()
                .doctorId(doctorId)
                .patientId(patientId)
                .build();
        assignmentRepo.save(assignment);
        return true;
    }

    /**
     * Unassigns a patient from their doctor(s). Deletes all assignments for this patient.
     */
    @Transactional
    public void unassignPatient(UUID clinicId, UUID patientId) {
        // Validate patient belongs to this clinic
        ClinicPatient patient = patientRepo.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", patientId));
        if (!patient.getClinicId().equals(clinicId)) {
            throw new UnauthorizedException("Patient does not belong to this clinic");
        }

        List<DoctorPatientAssignment> assignments = assignmentRepo.findByPatientId(patientId);
        if (assignments.isEmpty()) {
            throw new ResourceNotFoundException("DoctorPatientAssignment", "patientId", patientId);
        }
        assignmentRepo.deleteByPatientId(patientId);
    }

    private DoctorListDto toDoctorDto(ClinicStaff staff) {
        // Split the single 'name' field into first/last name
        String firstName = staff.getName();
        String lastName = null;
        if (staff.getName() != null && staff.getName().contains(" ")) {
            int idx = staff.getName().indexOf(' ');
            firstName = staff.getName().substring(0, idx);
            lastName = staff.getName().substring(idx + 1);
        }

        return DoctorListDto.builder()
                .id(staff.getUserId() != null ? staff.getUserId().toString() : staff.getId().toString())
                .firstName(firstName)
                .lastName(lastName)
                .department(staff.getSpecialization())
                .doctorCode(staff.getRegistrationNo())
                .build();
    }
}
