package com.agencysync.web.dto;

import com.agencysync.domain.Brand;

import java.util.UUID;

public record BrandDto(UUID id, String name, String responsible, String email,
                       String phone, String city, String state, String status) {
    public static BrandDto from(Brand b) {
        return new BrandDto(b.getId(), b.getName(), b.getResponsible(), b.getEmail(),
                b.getPhone(), b.getCity(), b.getState(), b.getStatus());
    }
}
