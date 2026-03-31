package com.taevas.clinic.service.doctor;

import com.taevas.clinic.dto.clinicadmin.*;
import com.taevas.clinic.model.*;
import com.taevas.clinic.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor @Transactional(readOnly = true)
public class DoctorFamilyService {
    private final FamilyGroupRepository groupRepo;
    private final FamilyMemberRepository memberRepo;
    private final ClinicPatientRepository patientRepo;

    public List<FamilyDto> getFamilyByPatient(UUID patientId) {
        List<FamilyGroup> groups = groupRepo.findByPrimaryPatientId(patientId);
        return groups.stream().map(g -> {
            String primaryName = patientRepo.findById(g.getPrimaryPatientId()).map(p -> p.getFirstName()).orElse("");
            List<FamilyMemberDto> members = memberRepo.findByFamilyGroupId(g.getId()).stream()
                .map(m -> { String mName = patientRepo.findById(m.getPatientId()).map(p -> p.getFirstName()).orElse("");
                    return FamilyMemberDto.builder().id(m.getId().toString()).patientId(m.getPatientId().toString())
                        .patientName(mName).relationship(m.getRelationship()).build(); })
                .collect(Collectors.toList());
            return FamilyDto.builder().id(g.getId().toString()).clinicId(g.getClinicId().toString())
                .name(g.getName()).primaryPatientId(g.getPrimaryPatientId().toString())
                .primaryPatientName(primaryName).members(members).build();
        }).collect(Collectors.toList());
    }
}
