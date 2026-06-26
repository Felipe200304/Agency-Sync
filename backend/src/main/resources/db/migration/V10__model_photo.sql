-- ============================================================
-- Foto principal do modelo. Armazenada como data URL (base64) já
-- comprimida no cliente — TEXT comporta a imagem reduzida sem
-- precisar de storage de arquivos externo.
-- ============================================================

ALTER TABLE model ADD COLUMN photo_url TEXT;
