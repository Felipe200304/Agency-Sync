package com.agencysync.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

/** Evento da agenda do modelo. 'indisponivel' = bloqueio do próprio modelo. */
@Entity
@Table(name = "calendar_event")
@Getter
@Setter
public class CalendarEvent extends BaseEntity {

    @ManyToOne(optional = false)
    @JoinColumn(name = "model_id")
    private Model model;

    /** Agência que registrou o evento (null = bloqueio do modelo). */
    @Column(name = "agency_id")
    private UUID agencyId;

    private String title;
    private String type;

    @Column(name = "event_date")
    private LocalDate eventDate;

    @Column(name = "start_time")
    private String startTime;

    @Column(name = "end_time")
    private String endTime;

    private String location;
    private String description;
}
