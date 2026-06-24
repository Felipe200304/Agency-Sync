package com.agencysync.repo;

import com.agencysync.domain.Expense;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ExpenseRepo extends JpaRepository<Expense, UUID> {
    List<Expense> findAllByOrderByExpenseDateDesc();
}
