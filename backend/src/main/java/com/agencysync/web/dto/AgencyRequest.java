package com.agencysync.web.dto;

import com.agencysync.domain.Agency;
import jakarta.validation.constraints.NotBlank;

public record AgencyRequest(@NotBlank String name, String country, String city) {
    public Agency applyTo(Agency a) {
        a.setName(name);
        a.setCountry(country == null || country.isBlank() ? "Brasil" : country);
        a.setCity(city);
        return a;
    }
}
