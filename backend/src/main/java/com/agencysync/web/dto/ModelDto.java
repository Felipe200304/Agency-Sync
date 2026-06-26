package com.agencysync.web.dto;

import com.agencysync.domain.Agency;
import com.agencysync.domain.Model;

import java.util.UUID;

public record ModelDto(
        UUID id, String name, String artisticName,
        UUID baseAgencyId, String baseAgencyName,
        String city, String state, String country,
        Integer heightCm, Integer bust, Integer waist, Integer hips, Integer shoe,
        String eyeColor, String hairColor, String instagram, String status, String photoUrl) {

    public static ModelDto from(Model m) {
        Agency base = m.getBaseAgency();
        return new ModelDto(
                m.getId(), m.getName(), m.getArtisticName(),
                base == null ? null : base.getId(),
                base == null ? null : base.getName(),
                m.getCity(), m.getState(), m.getCountry(),
                m.getHeightCm(), m.getBust(), m.getWaist(), m.getHips(), m.getShoe(),
                m.getEyeColor(), m.getHairColor(), m.getInstagram(), m.getStatus(), m.getPhotoUrl());
    }
}
