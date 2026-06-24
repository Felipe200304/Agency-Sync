package com.agencysync.repo;

import com.agencysync.domain.Agency;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface AgencyRepo extends JpaRepository<Agency, UUID> {}
