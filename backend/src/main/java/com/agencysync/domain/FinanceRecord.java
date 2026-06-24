package com.agencysync.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

/** Lançamento financeiro de um cachê. Comissão e repasse são derivados. */
@Entity
@Table(name = "finance_record")
@Getter
@Setter
public class FinanceRecord extends BaseEntity {

    @ManyToOne(optional = false)
    @JoinColumn(name = "model_id")
    private Model model;

    @ManyToOne
    @JoinColumn(name = "brand_id")
    private Brand brand;

    private String campaign;

    @Column(name = "event_date")
    private LocalDate eventDate;

    private BigDecimal cachet;
    private String currency;

    @Column(name = "commission_percent")
    private BigDecimal commissionPercent;

    private String status;

    @Column(name = "payment_deadline")
    private String paymentDeadline;

    @Column(name = "payment_date")
    private LocalDate paymentDate;

    /** Comissão da agência = cachet × comissão%. */
    public BigDecimal agencyCommission() {
        if (cachet == null || commissionPercent == null) return BigDecimal.ZERO;
        return cachet.multiply(commissionPercent).divide(new BigDecimal("100"));
    }

    /** Repasse ao modelo = cachet − comissão. */
    public BigDecimal modelValue() {
        if (cachet == null) return BigDecimal.ZERO;
        return cachet.subtract(agencyCommission());
    }
}
