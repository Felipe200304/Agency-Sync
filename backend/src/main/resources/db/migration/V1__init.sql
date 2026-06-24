-- ============================================================
-- Agency Sync — Fase 1 (Base): agências, usuários, modelos,
-- vínculo multi-agência com papel/comissão, marcas e agenda.
-- ============================================================

CREATE TABLE agency (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(160) NOT NULL,
    country     VARCHAR(80)  NOT NULL DEFAULT 'Brasil',
    city        VARCHAR(120),
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE app_user (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email         VARCHAR(160) NOT NULL UNIQUE,
    password_hash VARCHAR(120) NOT NULL,
    role          VARCHAR(20)  NOT NULL CHECK (role IN ('AGENCY','MODEL','CLIENT')),
    agency_id     UUID REFERENCES agency(id) ON DELETE SET NULL,
    model_id      UUID,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- Modelo: conta única. A "agência base" é a agência principal do
-- local onde o modelo reside e é a fonte de verdade da disponibilidade.
CREATE TABLE model (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(160) NOT NULL,
    artistic_name   VARCHAR(160),
    base_agency_id  UUID REFERENCES agency(id) ON DELETE SET NULL,
    city            VARCHAR(120),
    state           VARCHAR(80),
    country         VARCHAR(80) NOT NULL DEFAULT 'Brasil',
    height_cm       INTEGER,
    bust            INTEGER,
    waist           INTEGER,
    hips            INTEGER,
    shoe            INTEGER,
    eye_color       VARCHAR(40),
    hair_color      VARCHAR(40),
    instagram       VARCHAR(80),
    status          VARCHAR(20) NOT NULL DEFAULT 'disponivel'
                    CHECK (status IN ('disponivel','em-campanha','inativo')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE app_user
    ADD CONSTRAINT fk_app_user_model FOREIGN KEY (model_id) REFERENCES model(id) ON DELETE SET NULL;

-- Vínculo modelo <-> agência. O papel define quem consulta quem;
-- a comissão é CONFIGURÁVEL por vínculo (mother agency, internacional, etc.).
CREATE TABLE model_agency_link (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_id           UUID NOT NULL REFERENCES model(id)  ON DELETE CASCADE,
    agency_id          UUID NOT NULL REFERENCES agency(id) ON DELETE CASCADE,
    role               VARCHAR(20) NOT NULL DEFAULT 'LOCAL'
                       CHECK (role IN ('BASE','MOTHER','INTERNATIONAL','LOCAL')),
    commission_percent NUMERIC(5,2) NOT NULL DEFAULT 20.00,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (model_id, agency_id)
);

CREATE TABLE brand (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(160) NOT NULL,
    responsible VARCHAR(160),
    email       VARCHAR(160),
    phone       VARCHAR(40),
    city        VARCHAR(120),
    state       VARCHAR(80),
    status      VARCHAR(20) NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo','inativo')),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Agenda do modelo. A disponibilidade é compartilhada entre agências
-- (sem detalhes); 'indisponivel' marca bloqueios do próprio modelo.
CREATE TABLE calendar_event (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_id    UUID NOT NULL REFERENCES model(id)  ON DELETE CASCADE,
    agency_id   UUID REFERENCES agency(id) ON DELETE SET NULL,
    title       VARCHAR(200) NOT NULL,
    type        VARCHAR(20) NOT NULL
                CHECK (type IN ('casting','trabalho','reuniao','producao','evento','indisponivel')),
    event_date  DATE NOT NULL,
    start_time  VARCHAR(10),
    end_time    VARCHAR(10),
    location    VARCHAR(200),
    description TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_link_model   ON model_agency_link (model_id);
CREATE INDEX idx_link_agency  ON model_agency_link (agency_id);
CREATE INDEX idx_event_model  ON calendar_event (model_id, event_date);
