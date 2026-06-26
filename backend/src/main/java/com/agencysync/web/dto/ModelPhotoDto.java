package com.agencysync.web.dto;

import com.agencysync.domain.ModelPhoto;

import java.util.UUID;

public record ModelPhotoDto(UUID id, String url, int position) {

    public static ModelPhotoDto from(ModelPhoto p) {
        return new ModelPhotoDto(p.getId(), p.getUrl(), p.getPosition());
    }
}
