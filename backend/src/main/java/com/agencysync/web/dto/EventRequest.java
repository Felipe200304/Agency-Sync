package com.agencysync.web.dto;

import com.agencysync.domain.CalendarEvent;
import com.agencysync.domain.Model;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.UUID;

public record EventRequest(@NotBlank String title, @NotBlank String type,
                           @NotNull LocalDate eventDate, String startTime, String endTime,
                           String location, String description, UUID agencyId) {
    public CalendarEvent applyTo(CalendarEvent e, Model model) {
        e.setModel(model);
        e.setAgencyId(agencyId);
        e.setTitle(title);
        e.setType(type);
        e.setEventDate(eventDate);
        e.setStartTime(startTime);
        e.setEndTime(endTime);
        e.setLocation(location);
        e.setDescription(description);
        return e;
    }
}
