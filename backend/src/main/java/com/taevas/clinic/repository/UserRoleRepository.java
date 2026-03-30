package com.taevas.clinic.repository;

import com.taevas.clinic.model.UserRole;
import com.taevas.clinic.model.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, UUID> {

    List<UserRole> findByRole(Role role);

    List<UserRole> findByUser_Id(UUID userId);

    void deleteByUser_Id(UUID userId);

    long countByRole(Role role);
}
