package com.agencysync.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "agency")
@Getter
@Setter
public class Agency extends BaseEntity {
    private String name;
    private String country;
    private String city;
}
