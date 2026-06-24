package com.agencysync.web.dto;

import com.agencysync.domain.Expense;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record ExpenseDto(UUID id, String description, String category,
                         BigDecimal amount, String currency, LocalDate date, String status) {
    public static ExpenseDto from(Expense e) {
        return new ExpenseDto(e.getId(), e.getDescription(), e.getCategory(),
                e.getAmount(), e.getCurrency(), e.getExpenseDate(), e.getStatus());
    }
}
