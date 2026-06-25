-- ============================================================
-- Remove os dados de demonstração (seed) que apareciam no
-- Dashboard, Financeiro, Modelos e Clientes.
-- Mantém as agências e os usuários (logins).
-- As FKs cuidam do cascateamento:
--   model   -> model_agency_link, calendar_event, finance_record,
--              casting_model (CASCADE); app_user.model_id (SET NULL)
--   casting -> casting_model (CASCADE)
--   brand   -> casting.brand_id / finance_record.brand_id (SET NULL)
-- ============================================================

-- Despesas demo (tabela sem FK — remove pelos registros conhecidos).
DELETE FROM expense
 WHERE (description, amount, expense_date) IN (
    ('Produção do book digital',        2500.00, DATE '2026-05-12'),
    ('Anúncios Instagram (scouting)',   1200.00, DATE '2026-06-03'),
    ('Assinatura software de gestão',    300.00, DATE '2026-06-10')
 );

-- Casting demo (remove casting_model em cascata).
DELETE FROM casting WHERE id = 'dddddddd-dddd-dddd-dddd-dddddddddddd';

-- Modelos demo (remove vínculos, agenda e cachês em cascata;
-- zera model_id dos usuários demo via SET NULL).
DELETE FROM model
 WHERE id IN (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
 );

-- Marca demo (Osklen).
DELETE FROM brand WHERE id = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
