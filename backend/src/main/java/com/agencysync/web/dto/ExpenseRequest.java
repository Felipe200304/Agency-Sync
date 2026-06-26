package com.agencysync.web.dto;

import com.agencysync.domain.Expense;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ExpenseRequest(
        @NotBlank String description, String category,
        @NotNull BigDecimal amount, String currency, LocalDate date, String status) {

    public Expense applyTo(Expense e) {
        e.setDescription(description);
        e.setCategory(category);
        e.setAmount(amount);
        e.setCurrency(currency == null || currency.isBlank() ? "BRL" : currency);
        e.setExpenseDate(date);
        e.setStatus(status == null || status.isBlank() ? "pending" : status);
        return e;
    }
}
