package com.agencysync.repo;

import com.agencysync.domain.Model;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ModelRepo extends JpaRepository<Model, UUID> {}
