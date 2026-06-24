package com.agencysync.web.dto;

import java.math.BigDecimal;
import java.util.List;

/** Visão financeira do modelo: resumo + lançamentos. */
public record MeFinanceDto(Summary summary, List<FinanceRecordDto> records) {

    public record Summary(
            int jobs,
            BigDecimal grossTotal,
            BigDecimal netReceived,
            BigDecimal netPending,
            BigDecimal totalCommission) {}
}
