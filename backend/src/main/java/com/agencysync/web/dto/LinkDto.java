package com.agencysync.web.dto;

import com.agencysync.domain.AgencyRole;
import com.agencysync.domain.ModelAgencyLink;

import java.math.BigDecimal;
import java.util.UUID;

public record LinkDto(UUID id, UUID agencyId, String agencyName, AgencyRole role, BigDecimal commissionPercent) {
    public static LinkDto from(ModelAgencyLink l) {
        return new LinkDto(l.getId(), l.getAgency().getId(), l.getAgency().getName(),
                l.getRole(), l.getCommissionPercent());
    }
}
