-- ============================================================
-- Fase 2 — Fluxo de casting:
-- Solicitado → Em análise → Modelos enviados → Em avaliação → Confirmado → Concluído
-- ============================================================

CREATE TABLE casting (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id           UUID REFERENCES brand(id) ON DELETE SET NULL,
    title              VARCHAR(200) NOT NULL,
    responsible        VARCHAR(160),
    email              VARCHAR(160),
    phone              VARCHAR(40),
    location           VARCHAR(200),
    city               VARCHAR(120),
    state              VARCHAR(80),
    event_date         DATE,
    event_time         VARCHAR(10),
    models_needed      INTEGER NOT NULL DEFAULT 1,
    desired_profile    TEXT,
    cachet             NUMERIC(12,2),
    payment_deadline   VARCHAR(40),
    campaign_duration  VARCHAR(80),
    work_duration      VARCHAR(80),
    description        TEXT,
    status             VARCHAR(20) NOT NULL DEFAULT 'solicitado'
                       CHECK (status IN ('solicitado','em-analise','modelos-enviados','em-avaliacao','confirmado','concluido')),
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE casting_model (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    casting_id  UUID NOT NULL REFERENCES casting(id) ON DELETE CASCADE,
    model_id    UUID NOT NULL REFERENCES model(id)   ON DELETE CASCADE,
    status      VARCHAR(20) NOT NULL DEFAULT 'enviado'
                CHECK (status IN ('enviado','aprovado','reprovado','pendente')),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (casting_id, model_id)
);

CREATE INDEX idx_casting_status        ON casting (status);
CREATE INDEX idx_casting_model_casting ON casting_model (casting_id);

-- Casting de exemplo (vinculado à marca Osklen já existente).
INSERT INTO casting (id, brand_id, title, responsible, email, phone, location, city, state,
                     event_date, event_time, models_needed, desired_profile, cachet,
                     payment_deadline, campaign_duration, work_duration, description, status) VALUES
    ('dddddddd-dddd-dddd-dddd-dddddddddddd',
     'cccccccc-cccc-cccc-cccc-cccccccccccc',
     'Campanha Verão 2026', 'Ana Lima', 'ana@osklen.com', '+55 11 99999-0000',
     'Estúdio Vila Madalena', 'São Paulo', 'SP',
     '2026-07-15', '09:00', 3, 'Mulheres 18-28, 1,75m+, perfil praia/lifestyle', 9000.00,
     '30 dias após entrega', '6 meses', '2 dias',
     'Campanha de verão para a nova coleção, foco em lifestyle e praia.', 'modelos-enviados');

-- A Marina já foi enviada para esse casting.
INSERT INTO casting_model (casting_id, model_id, status) VALUES
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'enviado');
