-- ============================================================
-- Galeria (book) do modelo: muitas fotos por modelo. Uma linha por
-- foto mantém a inserção/remoção barata e a ordenação explícita,
-- evitando inchar a linha do modelo. Cada foto é um data URL (base64)
-- já comprimido no cliente.
-- ============================================================

CREATE TABLE model_photo (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_id   UUID NOT NULL REFERENCES model(id) ON DELETE CASCADE,
    url        TEXT NOT NULL,
    position   INT  NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_model_photo_model ON model_photo (model_id, position);
