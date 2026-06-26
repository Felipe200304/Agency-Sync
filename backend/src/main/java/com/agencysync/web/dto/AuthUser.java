package com.agencysync.web.dto;

import com.agencysync.domain.AppUser;
import com.agencysync.domain.UserRole;

import java.util.UUID;

public record AuthUser(UUID id, String email, UserRole role, UUID agencyId, UUID modelId, UUID brandId) {
    public static AuthUser from(AppUser u) {
        return new AuthUser(u.getId(), u.getEmail(), u.getRole(), u.getAgencyId(), u.getModelId(), u.getBrandId());
    }
}
