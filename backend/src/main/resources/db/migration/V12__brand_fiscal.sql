-- ============================================================
-- Dados fiscais do cliente (marca/empresa) para emissão de NF:
-- CNPJ, razão social e endereço completo. Cidade/UF já existiam.
-- ============================================================

ALTER TABLE brand ADD COLUMN cnpj          VARCHAR(18);
ALTER TABLE brand ADD COLUMN legal_name    VARCHAR(200);
ALTER TABLE brand ADD COLUMN cep           VARCHAR(9);
ALTER TABLE brand ADD COLUMN street        VARCHAR(200);
ALTER TABLE brand ADD COLUMN number        VARCHAR(20);
ALTER TABLE brand ADD COLUMN complement    VARCHAR(120);
ALTER TABLE brand ADD COLUMN district      VARCHAR(120);
