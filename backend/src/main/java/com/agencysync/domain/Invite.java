package com.agencysync.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/** Convite de onboarding. Referencia um modelo OU uma marca (um dos dois). */
@Entity
@Table(name = "invite")
@Getter
@Setter
public class Invite extends BaseEntity {

    private String token;

    @ManyToOne
    @JoinColumn(name = "model_id")
    private Model model;

    @ManyToOne
    @JoinColumn(name = "brand_id")
    private Brand brand;

    private boolean used;
}
