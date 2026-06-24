package com.agencysync.web.dto;

import com.agencysync.domain.CalendarEvent;

import java.time.LocalDate;
import java.util.UUID;

public record EventDto(UUID id, String title, String type, LocalDate eventDate,
                       String startTime, String endTime, String location,
                       String description, UUID agencyId) {
    public static EventDto from(CalendarEvent e) {
        return new EventDto(e.getId(), e.getTitle(), e.getType(), e.getEventDate(),
                e.getStartTime(), e.getEndTime(), e.getLocation(), e.getDescription(), e.getAgencyId());
    }
}
