package com.agencysync.web.dto;

import com.agencysync.domain.Casting;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record CastingDto(
        UUID id, String brand, UUID brandId, String title,
        String responsible, String email, String phone,
        String location, String city, String state,
        LocalDate date, String time, Integer modelsNeeded, String desiredProfile,
        BigDecimal cachet, String paymentDeadline, String campaignDuration, String workDuration,
        String description, String status, List<CastingModelDto> models, LocalDate createdAt) {

    public static CastingDto from(Casting c) {
        return new CastingDto(
                c.getId(),
                c.getBrand() == null ? null : c.getBrand().getName(),
                c.getBrand() == null ? null : c.getBrand().getId(),
                c.getTitle(), c.getResponsible(), c.getEmail(), c.getPhone(),
                c.getLocation(), c.getCity(), c.getState(),
                c.getEventDate(), c.getEventTime(), c.getModelsNeeded(), c.getDesiredProfile(),
                c.getCachet(), c.getPaymentDeadline(), c.getCampaignDuration(), c.getWorkDuration(),
                c.getDescription(), c.getStatus(),
                c.getModels().stream().map(CastingModelDto::from).toList(),
                c.getCreatedAt() == null ? null : c.getCreatedAt().toLocalDate());
    }
}
