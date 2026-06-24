package com.agencysync.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/** Modelo enviado a um casting, com o status de avaliação pela marca. */
@Entity
@Table(name = "casting_model")
@Getter
@Setter
public class CastingModel extends BaseEntity {

    @ManyToOne(optional = false)
    @JoinColumn(name = "casting_id")
    private Casting casting;

    @ManyToOne(optional = false)
    @JoinColumn(name = "model_id")
    private Model model;

    /** Avaliação da marca: enviado/aprovado/reprovado/pendente. */
    private String status;

    /** Decisão do próprio modelo: pendente/confirmado/recusado. */
    @Column(name = "model_decision")
    private String modelDecision;
}
