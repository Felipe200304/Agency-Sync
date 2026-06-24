package com.agencysync.web.dto;

import java.math.BigDecimal;

/** Agregação mensal para os gráficos (receita/comissões/repasses). */
public record MonthlyRevenueDto(String month, BigDecimal receita, BigDecimal comissoes, BigDecimal repasses) {}
