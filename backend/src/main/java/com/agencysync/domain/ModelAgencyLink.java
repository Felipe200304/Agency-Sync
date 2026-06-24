package com.agencysync.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

/** Vínculo multi-agência. Comissão configurável por vínculo (mother/internacional). */
@Entity
@Table(name = "model_agency_link")
@Getter
@Setter
public class ModelAgencyLink extends BaseEntity {

    @ManyToOne(optional = false)
    @JoinColumn(name = "model_id")
    private Model model;

    @ManyToOne(optional = false)
    @JoinColumn(name = "agency_id")
    private Agency agency;

    @Enumerated(EnumType.STRING)
    private AgencyRole role;

    @Column(name = "commission_percent")
    private BigDecimal commissionPercent;
}
