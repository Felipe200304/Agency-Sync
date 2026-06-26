package com.agencysync.web;

import com.agencysync.domain.Brand;
import com.agencysync.domain.Expense;
import com.agencysync.domain.FinanceRecord;
import com.agencysync.domain.Model;
import com.agencysync.repo.BrandRepo;
import com.agencysync.repo.ExpenseRepo;
import com.agencysync.repo.FinanceRepo;
import com.agencysync.repo.ModelRepo;
import com.agencysync.web.dto.ExpenseDto;
import com.agencysync.web.dto.ExpenseRequest;
import com.agencysync.web.dto.FinanceRecordDto;
import com.agencysync.web.dto.FinanceRequest;
import com.agencysync.web.dto.MonthlyRevenueDto;
import com.agencysync.web.dto.StatusRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.UUID;

@RestController
@RequestMapping("/api/finance")
class FinanceController {

    private static final String[] MONTHS_PT =
            {"jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"};

    private final FinanceRepo finance;
    private final ModelRepo models;
    private final BrandRepo brands;
    private final ExpenseRepo expenses;

    FinanceController(FinanceRepo finance, ModelRepo models, BrandRepo brands, ExpenseRepo expenses) {
        this.finance = finance;
        this.models = models;
        this.brands = brands;
        this.expenses = expenses;
    }

    @GetMapping
    List<FinanceRecordDto> list() {
        return finance.findAllByOrderByEventDateDesc().stream().map(FinanceRecordDto::from).toList();
    }

    /** Agregação por mês para os gráficos. */
    @GetMapping("/monthly")
    List<MonthlyRevenueDto> monthly() {
        Map<YearMonth, BigDecimal[]> byMonth = new TreeMap<>();
        for (FinanceRecord r : finance.findAll()) {
            if (r.getEventDate() == null) continue;
            YearMonth ym = YearMonth.from(r.getEventDate());
            BigDecimal[] acc = byMonth.computeIfAbsent(ym,
                    k -> new BigDecimal[]{BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO});
            acc[0] = acc[0].add(r.getCachet());
            acc[1] = acc[1].add(r.agencyCommission());
            acc[2] = acc[2].add(r.modelValue());
        }
        return byMonth.entrySet().stream()
                .map(e -> new MonthlyRevenueDto(
                        MONTHS_PT[e.getKey().getMonthValue() - 1],
                        e.getValue()[0], e.getValue()[1], e.getValue()[2]))
                .toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    FinanceRecordDto create(@Valid @RequestBody FinanceRequest req) {
        Model model = models.findById(req.modelId())
                .orElseThrow(() -> new NotFoundException("Modelo", req.modelId()));
        Brand brand = req.brandId() == null ? null
                : brands.findById(req.brandId()).orElseThrow(() -> new NotFoundException("Marca", req.brandId()));
        return FinanceRecordDto.from(finance.save(req.applyTo(new FinanceRecord(), model, brand)));
    }

    /** Atualiza o status de pagamento (define a data quando 'pago'). */
    @PutMapping("/{id}/status")
    FinanceRecordDto updateStatus(@PathVariable UUID id, @Valid @RequestBody StatusRequest req) {
        FinanceRecord r = finance.findById(id).orElseThrow(() -> new NotFoundException("Lançamento", id));
        r.setStatus(req.status());
        r.setPaymentDate("paid".equals(req.status()) ? LocalDate.now() : null);
        return FinanceRecordDto.from(finance.save(r));
    }

    // --- Despesas (custos da agência) ---

    @GetMapping("/expenses")
    List<ExpenseDto> expenses() {
        return expenses.findAllByOrderByExpenseDateDesc().stream().map(ExpenseDto::from).toList();
    }

    @PostMapping("/expenses")
    @ResponseStatus(HttpStatus.CREATED)
    ExpenseDto createExpense(@Valid @RequestBody ExpenseRequest req) {
        return ExpenseDto.from(expenses.save(req.applyTo(new Expense())));
    }

    @PutMapping("/expenses/{id}/status")
    ExpenseDto updateExpenseStatus(@PathVariable UUID id, @Valid @RequestBody StatusRequest req) {
        Expense e = expenses.findById(id).orElseThrow(() -> new NotFoundException("Despesa", id));
        e.setStatus(req.status());
        return ExpenseDto.from(expenses.save(e));
    }

    @DeleteMapping("/expenses/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void deleteExpense(@PathVariable UUID id) {
        if (!expenses.existsById(id)) throw new NotFoundException("Despesa", id);
        expenses.deleteById(id);
    }
}
