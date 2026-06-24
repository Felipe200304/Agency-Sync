package com.agencysync.web.dto;

import com.agencysync.domain.Invite;

/** Retorno ao gerar o convite (a agência monta o link com o token). */
public record InviteDto(String token, String modelName, boolean used) {
    public static InviteDto from(Invite inv) {
        var m = inv.getModel();
        String name = m.getArtisticName() != null ? m.getArtisticName() : m.getName();
        return new InviteDto(inv.getToken(), name, inv.isUsed());
    }
}
