package com.agencysync.service;

import com.agencysync.domain.Casting;
import com.agencysync.domain.Model;
import com.agencysync.domain.UserRole;
import com.agencysync.repo.AppUserRepo;
import org.springframework.stereotype.Service;

/** Monta e dispara as notificações por e-mail dos eventos de casting. */
@Service
public class NotificationService {

    private final MailService mail;
    private final AppUserRepo users;

    public NotificationService(MailService mail, AppUserRepo users) {
        this.mail = mail;
        this.users = users;
    }

    /** Marca solicitou um casting → avisa a agência. */
    public void newCastingToAgency(Casting c) {
        String subject = "Novo pedido de casting: " + c.getTitle();
        String body = """
                Uma marca solicitou um novo casting.

                Título: %s
                Marca: %s
                Data: %s
                Local: %s

                Acesse o painel da agência para analisar e enviar modelos.""".formatted(
                c.getTitle(),
                c.getBrand() != null ? c.getBrand().getName() : "—",
                c.getEventDate() != null ? c.getEventDate() : "a definir",
                nv(c.getCity()));
        users.findByRole(UserRole.AGENCY).forEach(u -> mail.send(u.getEmail(), subject, body));
    }

    /** Agência indicou o modelo para um casting → avisa o modelo. */
    public void castingToModel(Casting c, Model m) {
        users.findByModelId(m.getId()).ifPresent(u -> mail.send(u.getEmail(),
                "Você foi indicado para um casting: " + c.getTitle(),
                """
                Olá! Sua agência te indicou para um casting.

                Título: %s
                Data: %s
                Local: %s

                Acesse o app para ver os detalhes e confirmar ou recusar.""".formatted(
                        c.getTitle(),
                        c.getEventDate() != null ? c.getEventDate() : "a definir",
                        nv(c.getCity()))));
    }

    /** Trabalho confirmado (modelo aprovado) → avisa o modelo. */
    public void workConfirmedToModel(Casting c, Model m) {
        users.findByModelId(m.getId()).ifPresent(u -> mail.send(u.getEmail(),
                "Trabalho confirmado: " + c.getTitle(),
                """
                Boas notícias! Seu trabalho foi confirmado.

                Título: %s
                Marca: %s
                Data: %s

                Confira os detalhes no app.""".formatted(
                        c.getTitle(),
                        c.getBrand() != null ? c.getBrand().getName() : "—",
                        c.getEventDate() != null ? c.getEventDate() : "a definir")));
    }

    private static String nv(String v) {
        return v == null || v.isBlank() ? "—" : v;
    }
}
