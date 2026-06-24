-- ============================================================
-- Hardening de auth: papéis em inglês e extensíveis.
-- 'CLIENT' (marca) → 'BRAND'. Removemos o CHECK rígido para permitir
-- adicionar papéis de funcionários (ADMIN, BOOKER, SCOUT, FINANCE...)
-- futuramente sem nova migração — a validação fica na enum da aplicação.
-- ============================================================

ALTER TABLE app_user DROP CONSTRAINT IF EXISTS app_user_role_check;

UPDATE app_user SET role = 'BRAND' WHERE role = 'CLIENT';
