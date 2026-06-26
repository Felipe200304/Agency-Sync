-- ============================================================
-- Convite generalizado: além de modelo, a agência pode convidar uma
-- MARCA a criar o próprio login. O convite passa a referenciar modelo
-- OU marca (um dos dois). E o usuário BRAND fica vinculado à sua marca.
-- ============================================================

-- Convite serve para modelo ou marca (um deles é nulo).
ALTER TABLE invite ALTER COLUMN model_id DROP NOT NULL;
ALTER TABLE invite ADD COLUMN brand_id UUID REFERENCES brand(id) ON DELETE CASCADE;

-- Usuário da marca vinculado à marca (espelha o model_id existente).
ALTER TABLE app_user ADD COLUMN brand_id UUID REFERENCES brand(id) ON DELETE SET NULL;
