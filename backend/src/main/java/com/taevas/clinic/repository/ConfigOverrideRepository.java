package com.taevas.clinic.repository;

import com.taevas.clinic.model.ConfigOverride;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ConfigOverrideRepository extends JpaRepository<ConfigOverride, UUID> {

    List<ConfigOverride> findByConfigTypeAndScopeTypeAndScopeId(String configType, String scopeType, UUID scopeId);
}
