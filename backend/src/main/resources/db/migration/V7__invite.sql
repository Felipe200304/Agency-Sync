-- ============================================================
-- Onboarding do modelo: a agência gera um link de convite; o modelo
-- usa o link para criar o próprio login (AppUser MODEL vinculado ao model).
-- ============================================================

CREATE TABLE invite (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token       VARCHAR(80) NOT NULL UNIQUE,
    model_id    UUID NOT NULL REFERENCES model(id) ON DELETE CASCADE,
    used        BOOLEAN NOT NULL DEFAULT false,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_invite_token ON invite (token);
