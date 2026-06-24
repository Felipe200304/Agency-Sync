package com.agencysync.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "invite")
@Getter
@Setter
public class Invite extends BaseEntity {

    private String token;

    @ManyToOne(optional = false)
    @JoinColumn(name = "model_id")
    private Model model;

    private boolean used;
}
