package com.agencysync.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
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
    private String status;

    // Identidade fiscal para emissão de NF
    private String cnpj;

    @Column(name = "legal_name")
    private String legalName;

    @Embedded
    private Address address = new Address();
}
