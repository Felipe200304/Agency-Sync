package com.agencysync.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "model")
@Getter
@Setter
public class Model extends BaseEntity {

    private String name;

    @Column(name = "artistic_name")
    private String artisticName;

    /** Agência base: local onde o modelo reside; fonte de verdade da agenda. */
    @ManyToOne
    @JoinColumn(name = "base_agency_id")
    private Agency baseAgency;

    private String city;
    private String state;
    private String country;

    @Column(name = "height_cm")
    private Integer heightCm;

    private Integer bust;
    private Integer waist;
    private Integer hips;
    private Integer shoe;

    @Column(name = "eye_color")
    private String eyeColor;

    @Column(name = "hair_color")
    private String hairColor;

    private String instagram;
    private String status;

    /** Foto principal como data URL (base64) já comprimida no cliente. */
    @Column(name = "photo_url", columnDefinition = "text")
    private String photoUrl;
}
