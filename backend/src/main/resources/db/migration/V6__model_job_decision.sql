-- ============================================================
-- Capacidades do Modelo: decisão do modelo sobre o trabalho enviado.
-- Independente da avaliação da marca (casting_model.status):
--   model_decision = pendente | confirmado | recusado
-- ============================================================

ALTER TABLE casting_model
    ADD COLUMN model_decision VARCHAR(20) NOT NULL DEFAULT 'pendente'
    CHECK (model_decision IN ('pendente', 'confirmado', 'recusado'));
