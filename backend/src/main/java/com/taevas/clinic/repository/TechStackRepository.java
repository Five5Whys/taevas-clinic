package com.taevas.clinic.repository;

import com.taevas.clinic.model.TechStack;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface TechStackRepository extends JpaRepository<TechStack, UUID> {
}
