package com.agencysync.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/** Uma foto do book do modelo. Muitas por modelo; ordenada por {@code position}. */
@Entity
@Table(name = "model_photo")
@Getter
@Setter
public class ModelPhoto extends BaseEntity {

    @ManyToOne(optional = false)
    @JoinColumn(name = "model_id")
    private Model model;

    /** Data URL (base64) já comprimido no cliente. */
    @Column(columnDefinition = "text", nullable = false)
    private String url;

    private int position;
}
