package com.agencysync.repo;

import com.agencysync.domain.ModelAgencyLink;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface LinkRepo extends JpaRepository<ModelAgencyLink, UUID> {
    List<ModelAgencyLink> findByModelId(UUID modelId);
}
