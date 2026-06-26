package com.agencysync.web.dto;

import com.agencysync.domain.Invite;

/** Retorno do convite (modelo ou marca). O front monta o link com o token. */
public record InviteDto(String token, String name, String role, boolean used) {
    public static InviteDto from(Invite inv) {
        if (inv.getBrand() != null) {
            return new InviteDto(inv.getToken(), inv.getBrand().getName(), "BRAND", inv.isUsed());
        }
        var m = inv.getModel();
        String name = m.getArtisticName() != null ? m.getArtisticName() : m.getName();
        return new InviteDto(inv.getToken(), name, "MODEL", inv.isUsed());
    }
}
