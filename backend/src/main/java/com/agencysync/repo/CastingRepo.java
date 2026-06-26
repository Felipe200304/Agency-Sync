package com.agencysync.repo;

import com.agencysync.domain.Casting;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CastingRepo extends JpaRepository<Casting, UUID> {
    List<Casting> findAllByOrderByCreatedAtDesc();

    /** Castings de uma marca específica (portal do cliente). */
    List<Casting> findByBrandIdOrderByCreatedAtDesc(UUID brandId);
}
