package com.agencysync.web.dto;

import com.agencysync.domain.CastingModel;
import com.agencysync.domain.Model;

import java.util.UUID;

public record CastingModelDto(UUID modelId, String modelName, String status, String modelDecision) {
    public static CastingModelDto from(CastingModel cm) {
        Model m = cm.getModel();
        String name = m.getArtisticName() != null ? m.getArtisticName() : m.getName();
        return new CastingModelDto(m.getId(), name, cm.getStatus(), cm.getModelDecision());
    }
}
