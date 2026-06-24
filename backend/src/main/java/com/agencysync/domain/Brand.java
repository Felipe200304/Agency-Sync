package com.agencysync.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "brand")
@Getter
@Setter
public class Brand extends BaseEntity {
    private String name;
    private String responsible;
    private String email;
    private String phone;
    private String city;
    private String state;
    private String status;
}
