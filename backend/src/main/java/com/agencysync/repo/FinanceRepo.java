package com.agencysync.repo;

import com.agencysync.domain.FinanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface FinanceRepo extends JpaRepository<FinanceRecord, UUID> {
    List<FinanceRecord> findAllByOrderByEventDateDesc();
    List<FinanceRecord> findByModelIdOrderByEventDateDesc(UUID modelId);
}
