package com.agencysync.repo;

import com.agencysync.domain.CastingModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CastingModelRepo extends JpaRepository<CastingModel, UUID> {
    List<CastingModel> findByModelIdOrderByCreatedAtDesc(UUID modelId);
    Optional<CastingModel> findByModelIdAndCastingId(UUID modelId, UUID castingId);
}
