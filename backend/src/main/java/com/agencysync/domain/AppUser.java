package com.agencysync.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "app_user")
@Getter
@Setter
public class AppUser extends BaseEntity {

    private String email;

    @Column(name = "password_hash")
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    private UserRole role;

    /** Vínculo de conta: agência, modelo OU marca, conforme o papel. */
    @Column(name = "agency_id")
    private UUID agencyId;

    @Column(name = "model_id")
    private UUID modelId;

    @Column(name = "brand_id")
    private UUID brandId;
}
