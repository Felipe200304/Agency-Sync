package com.agencysync.web.dto;

import com.agencysync.domain.Brand;
import com.agencysync.domain.FinanceRecord;
import com.agencysync.domain.Model;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record FinanceRequest(
        @NotNull UUID modelId, UUID brandId, String campaign, LocalDate date,
        @NotNull BigDecimal cachet, String currency, BigDecimal commissionPercent,
        String status, String paymentDeadline) {

    public FinanceRecord applyTo(FinanceRecord r, Model model, Brand brand) {
        r.setModel(model);
        r.setBrand(brand);
        r.setCampaign(campaign);
        r.setEventDate(date);
        r.setCachet(cachet);
        r.setCurrency(currency == null || currency.isBlank() ? "BRL" : currency);
        r.setCommissionPercent(commissionPercent == null ? new BigDecimal("20.00") : commissionPercent);
        r.setStatus(status == null || status.isBlank() ? "pending" : status);
        r.setPaymentDeadline(paymentDeadline);
        return r;
    }
}
