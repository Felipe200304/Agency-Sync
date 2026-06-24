package com.agencysync.web.dto;

import com.agencysync.domain.Brand;
import jakarta.validation.constraints.NotBlank;

public record BrandRequest(@NotBlank String name, String responsible, String email,
                           String phone, String city, String state, String status) {
    public Brand applyTo(Brand b) {
        b.setName(name);
        b.setResponsible(responsible);
        b.setEmail(email);
        b.setPhone(phone);
        b.setCity(city);
        b.setState(state);
        b.setStatus(status == null || status.isBlank() ? "ativo" : status);
        return b;
    }
}
