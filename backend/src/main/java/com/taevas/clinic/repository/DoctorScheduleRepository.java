package com.taevas.clinic.repository;

import com.taevas.clinic.model.DoctorSchedule;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DoctorScheduleRepository extends JpaRepository<DoctorSchedule, UUID>, JpaSpecificationExecutor<DoctorSchedule> {

    List<DoctorSchedule> findByStaffId(UUID staffId);
    List<DoctorSchedule> findByClinicId(UUID clinicId);
    List<DoctorSchedule> findByStaffIdAndDayOfWeek(UUID staffId, int dayOfWeek);
}
