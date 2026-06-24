package com.agencysync.web.dto;

import com.agencysync.domain.Agency;
import com.agencysync.domain.Model;
import jakarta.validation.constraints.NotBlank;

import java.util.UUID;

public record ModelRequest(
        @NotBlank String name, String artisticName, UUID baseAgencyId,
        String city, String state, String country,
        Integer heightCm, Integer bust, Integer waist, Integer hips, Integer shoe,
        String eyeColor, String hairColor, String instagram, String status) {

    public Model applyTo(Model m, Agency baseAgency) {
        m.setName(name);
        m.setArtisticName(artisticName);
        m.setBaseAgency(baseAgency);
        m.setCity(city);
        m.setState(state);
        m.setCountry(country == null || country.isBlank() ? "Brasil" : country);
        m.setHeightCm(heightCm);
        m.setBust(bust);
        m.setWaist(waist);
        m.setHips(hips);
        m.setShoe(shoe);
        m.setEyeColor(eyeColor);
        m.setHairColor(hairColor);
        m.setInstagram(instagram);
        m.setStatus(status == null || status.isBlank() ? "disponivel" : status);
        return m;
    }
}
