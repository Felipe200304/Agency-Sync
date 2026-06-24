package com.agencysync.web.dto;

import com.agencysync.domain.Casting;
import com.agencysync.domain.CastingModel;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

/** Trabalho do ponto de vista do modelo: dados do casting + decisão dele. */
public record MeJobDto(
        UUID castingId, String title, String brand, LocalDate date,
        String location, BigDecimal cachet, String brandStatus, String decision) {

    public static MeJobDto from(CastingModel cm) {
        Casting c = cm.getCasting();
        return new MeJobDto(
                c.getId(), c.getTitle(),
                c.getBrand() == null ? null : c.getBrand().getName(),
                c.getEventDate(), c.getLocation(), c.getCachet(),
                cm.getStatus(), cm.getModelDecision());
    }
}
