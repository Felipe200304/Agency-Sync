-- ============================================================
-- Guarda-rail: todo usuário com papel BRAND precisa estar vinculado
-- a uma marca (brand_id NOT NULL). Sem isso, GET /api/me/castings
-- responde 404 (requireBrandId não acha a marca do usuário).
--
-- Usa NOT VALID de propósito: pode haver usuários BRAND legados com
-- brand_id NULL (contas de teste) que fariam a validação inicial
-- falhar e quebrar o deploy. NOT VALID pula a varredura das linhas
-- já existentes, mas o CHECK passa a valer para todo INSERT/UPDATE
-- futuro — que é o objetivo do guarda-rail.
--
-- O CHECK não usa UNIQUE: no futuro (multi-seat) vários usuários da
-- mesma agência/marca poderão compartilhar o mesmo brand_id.
-- ============================================================
ALTER TABLE app_user
    ADD CONSTRAINT brand_user_requires_brand
    CHECK (role <> 'BRAND' OR brand_id IS NOT NULL)
    NOT VALID;
