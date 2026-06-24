package com.agencysync.repo;

import com.agencysync.domain.CalendarEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface EventRepo extends JpaRepository<CalendarEvent, UUID> {
    List<CalendarEvent> findByModelIdOrderByEventDateAscStartTimeAsc(UUID modelId);
}
