package com.agencysync.web.dto;

import com.agencysync.domain.Brand;
import jakarta.validation.constraints.NotBlank;

public record BrandRequest(@NotBlank String name, String responsible, String email,
                           String phone, String status, String cnpj, String legalName,
                           AddressDto address) {
    public Brand applyTo(Brand b) {
        b.setName(name);
        b.setResponsible(responsible);
        b.setEmail(email);
        b.setPhone(phone);
        b.setStatus(status == null || status.isBlank() ? "ativo" : status);
        b.setCnpj(cnpj);
        b.setLegalName(legalName);
        if (address != null) b.setAddress(address.applyTo(b.getAddress()));
        return b;
    }
}
