package com.agencysync.domain;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "casting")
@Getter
@Setter
public class Casting extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "brand_id")
    private Brand brand;

    private String title;
    private String responsible;
    private String email;
    private String phone;
    private String location;
    private String city;
    private String state;

    @Column(name = "event_date")
    private LocalDate eventDate;

    @Column(name = "event_time")
    private String eventTime;

    @Column(name = "models_needed")
    private Integer modelsNeeded;

    @Column(name = "desired_profile")
    private String desiredProfile;

    private BigDecimal cachet;

    @Column(name = "payment_deadline")
    private String paymentDeadline;

    @Column(name = "campaign_duration")
    private String campaignDuration;

    @Column(name = "work_duration")
    private String workDuration;

    private String description;
    private String status;

    @OneToMany(mappedBy = "casting", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("createdAt ASC")
    private List<CastingModel> models = new ArrayList<>();
}
