package com.agencysync.web.dto;

import com.agencysync.domain.Agency;
import com.agencysync.domain.AgencyRole;
import com.agencysync.domain.Model;
import com.agencysync.domain.ModelAgencyLink;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

/** Vincula uma agência ao modelo com papel e comissão configurável. */
public record LinkRequest(@NotNull java.util.UUID agencyId, AgencyRole role, BigDecimal commissionPercent) {

    private static final BigDecimal DEFAULT_COMMISSION = new BigDecimal("20.00");

    public ModelAgencyLink applyTo(ModelAgencyLink link, Model model, Agency agency) {
        link.setModel(model);
        link.setAgency(agency);
        link.setRole(role == null ? AgencyRole.LOCAL : role);
        link.setCommissionPercent(commissionPercent == null ? DEFAULT_COMMISSION : commissionPercent);
        return link;
    }
}
