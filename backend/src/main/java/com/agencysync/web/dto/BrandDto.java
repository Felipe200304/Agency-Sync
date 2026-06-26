package com.agencysync.web.dto;

import com.agencysync.domain.Brand;

import java.util.UUID;

public record BrandDto(UUID id, String name, String responsible, String email,
                       String phone, String status, String cnpj, String legalName,
                       AddressDto address) {
    public static BrandDto from(Brand b) {
        return new BrandDto(b.getId(), b.getName(), b.getResponsible(), b.getEmail(),
                b.getPhone(), b.getStatus(), b.getCnpj(), b.getLegalName(),
                AddressDto.from(b.getAddress()));
    }
}
