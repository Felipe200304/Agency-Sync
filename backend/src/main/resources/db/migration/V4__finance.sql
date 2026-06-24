-- ============================================================
-- Fase 3 — Financeiro: cachês, comissão configurável, repasse ao modelo,
-- status de pagamento e multi-moeda.
-- agency_commission e model_value são DERIVADOS (cachet x commission_percent).
-- ============================================================

CREATE TABLE finance_record (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_id           UUID NOT NULL REFERENCES model(id)   ON DELETE CASCADE,
    casting_id         UUID REFERENCES casting(id) ON DELETE SET NULL,
    brand_id           UUID REFERENCES brand(id)   ON DELETE SET NULL,
    campaign           VARCHAR(200),
    event_date         DATE,
    cachet             NUMERIC(12,2) NOT NULL,
    currency           VARCHAR(3) NOT NULL DEFAULT 'BRL' CHECK (currency IN ('BRL','USD','EUR')),
    commission_percent NUMERIC(5,2) NOT NULL DEFAULT 20.00,
    status             VARCHAR(20) NOT NULL DEFAULT 'pendente' CHECK (status IN ('pago','pendente','atrasado')),
    payment_deadline   VARCHAR(40),
    payment_date       DATE,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_finance_model  ON finance_record (model_id);
CREATE INDEX idx_finance_status ON finance_record (status);

INSERT INTO finance_record (model_id, brand_id, campaign, event_date, cachet, currency, commission_percent, status, payment_deadline, payment_date) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Campanha Verão 2026', '2026-02-10',  9000.00, 'BRL', 20.00, 'pago',     '30 dias', '2026-03-10'),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Editorial Inverno',   '2026-03-15',  6000.00, 'BRL', 20.00, 'pendente', '30 dias', NULL),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NULL,                                   'Desfile SPFW',        '2026-04-20', 12000.00, 'BRL', 20.00, 'pago',     '45 dias', '2026-05-30'),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', NULL,                                   'Catálogo Inverno',    '2026-05-05',  4000.00, 'BRL', 20.00, 'atrasado', '30 dias', NULL),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NULL,                                   'Editorial Paris',     '2026-06-01',  8000.00, 'USD', 15.00, 'pendente', '60 dias', NULL);
