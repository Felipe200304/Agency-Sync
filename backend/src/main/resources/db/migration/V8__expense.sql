-- ============================================================
-- Despesas da agência (custos) — complementa as receitas (cachês).
-- ============================================================

CREATE TABLE expense (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    description  VARCHAR(200) NOT NULL,
    category     VARCHAR(80),
    amount       NUMERIC(12,2) NOT NULL,
    currency     VARCHAR(3) NOT NULL DEFAULT 'BRL' CHECK (currency IN ('BRL','USD','EUR')),
    expense_date DATE,
    status       VARCHAR(20) NOT NULL DEFAULT 'pendente' CHECK (status IN ('pago','pendente')),
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO expense (description, category, amount, currency, expense_date, status) VALUES
    ('Produção do book digital', 'Produção', 2500.00, 'BRL', '2026-05-12', 'pago'),
    ('Anúncios Instagram (scouting)', 'Marketing', 1200.00, 'BRL', '2026-06-03', 'pendente'),
    ('Assinatura software de gestão', 'Operacional', 300.00, 'BRL', '2026-06-10', 'pago');
