package com.agencysync.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "expense")
@Getter
@Setter
public class Expense extends BaseEntity {

    private String description;
    private String category;
    private BigDecimal amount;
    private String currency;

    @Column(name = "expense_date")
    private LocalDate expenseDate;

    private String status;
}
