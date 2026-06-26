-- ============================================================
-- Padroniza os valores de status/tipo do banco para inglês.
-- Para cada coluna: remove o CHECK antigo, migra os dados, recria o
-- CHECK em inglês e ajusta o DEFAULT. Rótulos exibidos ao usuário
-- continuam em português no frontend (são mapeados a partir destes códigos).
-- ============================================================

-- model.status
ALTER TABLE model DROP CONSTRAINT IF EXISTS model_status_check;
UPDATE model SET status = CASE status
    WHEN 'disponivel'  THEN 'available'
    WHEN 'em-campanha' THEN 'on-campaign'
    WHEN 'inativo'     THEN 'inactive'
    ELSE status END;
ALTER TABLE model ADD CONSTRAINT model_status_check CHECK (status IN ('available','on-campaign','inactive'));
ALTER TABLE model ALTER COLUMN status SET DEFAULT 'available';

-- brand.status
ALTER TABLE brand DROP CONSTRAINT IF EXISTS brand_status_check;
UPDATE brand SET status = CASE status
    WHEN 'ativo'   THEN 'active'
    WHEN 'inativo' THEN 'inactive'
    ELSE status END;
ALTER TABLE brand ADD CONSTRAINT brand_status_check CHECK (status IN ('active','inactive'));
ALTER TABLE brand ALTER COLUMN status SET DEFAULT 'active';

-- calendar_event.type (sem default)
ALTER TABLE calendar_event DROP CONSTRAINT IF EXISTS calendar_event_type_check;
UPDATE calendar_event SET type = CASE type
    WHEN 'trabalho'     THEN 'job'
    WHEN 'reuniao'      THEN 'meeting'
    WHEN 'producao'     THEN 'production'
    WHEN 'evento'       THEN 'event'
    WHEN 'indisponivel' THEN 'unavailable'
    ELSE type END;
ALTER TABLE calendar_event ADD CONSTRAINT calendar_event_type_check
    CHECK (type IN ('casting','job','meeting','production','event','unavailable'));

-- casting.status
ALTER TABLE casting DROP CONSTRAINT IF EXISTS casting_status_check;
UPDATE casting SET status = CASE status
    WHEN 'solicitado'       THEN 'requested'
    WHEN 'em-analise'       THEN 'reviewing'
    WHEN 'modelos-enviados' THEN 'models-submitted'
    WHEN 'em-avaliacao'     THEN 'evaluating'
    WHEN 'confirmado'       THEN 'confirmed'
    WHEN 'concluido'        THEN 'completed'
    ELSE status END;
ALTER TABLE casting ADD CONSTRAINT casting_status_check
    CHECK (status IN ('requested','reviewing','models-submitted','evaluating','confirmed','completed'));
ALTER TABLE casting ALTER COLUMN status SET DEFAULT 'requested';

-- casting_model.status
ALTER TABLE casting_model DROP CONSTRAINT IF EXISTS casting_model_status_check;
UPDATE casting_model SET status = CASE status
    WHEN 'enviado'   THEN 'submitted'
    WHEN 'aprovado'  THEN 'approved'
    WHEN 'reprovado' THEN 'rejected'
    WHEN 'pendente'  THEN 'pending'
    ELSE status END;
ALTER TABLE casting_model ADD CONSTRAINT casting_model_status_check
    CHECK (status IN ('submitted','approved','rejected','pending'));
ALTER TABLE casting_model ALTER COLUMN status SET DEFAULT 'submitted';

-- casting_model.model_decision
ALTER TABLE casting_model DROP CONSTRAINT IF EXISTS casting_model_model_decision_check;
UPDATE casting_model SET model_decision = CASE model_decision
    WHEN 'pendente'   THEN 'pending'
    WHEN 'confirmado' THEN 'confirmed'
    WHEN 'recusado'   THEN 'declined'
    ELSE model_decision END;
ALTER TABLE casting_model ADD CONSTRAINT casting_model_model_decision_check
    CHECK (model_decision IN ('pending','confirmed','declined'));
ALTER TABLE casting_model ALTER COLUMN model_decision SET DEFAULT 'pending';

-- finance_record.status
ALTER TABLE finance_record DROP CONSTRAINT IF EXISTS finance_record_status_check;
UPDATE finance_record SET status = CASE status
    WHEN 'pago'     THEN 'paid'
    WHEN 'pendente' THEN 'pending'
    WHEN 'atrasado' THEN 'overdue'
    ELSE status END;
ALTER TABLE finance_record ADD CONSTRAINT finance_record_status_check
    CHECK (status IN ('paid','pending','overdue'));
ALTER TABLE finance_record ALTER COLUMN status SET DEFAULT 'pending';

-- expense.status
ALTER TABLE expense DROP CONSTRAINT IF EXISTS expense_status_check;
UPDATE expense SET status = CASE status
    WHEN 'pago'     THEN 'paid'
    WHEN 'pendente' THEN 'pending'
    ELSE status END;
ALTER TABLE expense ADD CONSTRAINT expense_status_check CHECK (status IN ('paid','pending'));
ALTER TABLE expense ALTER COLUMN status SET DEFAULT 'pending';
