-- ============================================================
-- Backfill: liga cada usuário BRAND à sua marca (app_user.brand_id).
-- A V13 adicionou a coluna brand_id, mas usuários BRAND criados antes
-- dela ficaram com brand_id NULL — o que faz GET /api/me/castings
-- responder 404 (requireBrandId não acha a marca do usuário).
--
-- Critério: casa por e-mail (lower) e SÓ aplica quando existe exatamente
-- uma marca com aquele e-mail, para nunca vincular ao brand errado.
-- Usuários com e-mail divergente entre login e brand.email ficam de fora
-- e devem ser corrigidos manualmente.
-- ============================================================
UPDATE app_user u
SET brand_id = b.id
FROM brand b
WHERE u.role = 'BRAND'
  AND u.brand_id IS NULL
  AND b.email IS NOT NULL
  AND lower(b.email) = lower(u.email)
  AND (SELECT count(*) FROM brand b2 WHERE lower(b2.email) = lower(u.email)) = 1;
