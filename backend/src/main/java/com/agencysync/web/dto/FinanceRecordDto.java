package com.agencysync.web.dto;

import com.agencysync.domain.FinanceRecord;
import com.agencysync.domain.Model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record FinanceRecordDto(
        UUID id, UUID modelId, String modelName, String campaign, String brand,
        LocalDate date, BigDecimal cachet, String currency,
        BigDecimal agencyComission, BigDecimal modelValue,
        String status, LocalDate paymentDate) {

    public static FinanceRecordDto from(FinanceRecord r) {
        Model m = r.getModel();
        String name = m.getArtisticName() != null ? m.getArtisticName() : m.getName();
        return new FinanceRecordDto(
                r.getId(), m.getId(), name, r.getCampaign(),
                r.getBrand() == null ? null : r.getBrand().getName(),
                r.getEventDate(), r.getCachet(), r.getCurrency(),
                r.agencyCommission(), r.modelValue(),
                r.getStatus(), r.getPaymentDate());
    }
}
