package com.agencysync.web.dto;

import com.agencysync.domain.Agency;

import java.util.UUID;

public record AgencyDto(UUID id, String name, String country, String city) {
    public static AgencyDto from(Agency a) {
        return new AgencyDto(a.getId(), a.getName(), a.getCountry(), a.getCity());
    }
}
