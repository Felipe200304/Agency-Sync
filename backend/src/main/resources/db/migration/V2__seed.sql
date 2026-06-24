-- ============================================================
-- Dados de exemplo. Ilustra a hierarquia de agências:
-- Way (São Paulo) como agência base/mother e Elite (Paris) internacional,
-- com comissão configurável por vínculo.
-- ============================================================

INSERT INTO agency (id, name, country, city) VALUES
    ('11111111-1111-1111-1111-111111111111', 'Way Model Management', 'Brasil',  'São Paulo'),
    ('22222222-2222-2222-2222-222222222222', 'Elite Paris',          'França',  'Paris');

-- Modelo que reside em São Paulo: Way é a agência base (fonte da agenda).
INSERT INTO model (id, name, artistic_name, base_agency_id, city, state, country,
                   height_cm, bust, waist, hips, shoe, eye_color, hair_color, instagram, status) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Marina Souza', 'Marina S.',
     '11111111-1111-1111-1111-111111111111', 'São Paulo', 'SP', 'Brasil',
     178, 84, 60, 90, 38, 'castanhos', 'castanho', '@marina.souza', 'disponivel'),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Lucas Andrade', 'Lucas A.',
     '11111111-1111-1111-1111-111111111111', 'São Paulo', 'SP', 'Brasil',
     185, 96, 76, 94, 43, 'verdes', 'preto', '@lucas.andrade', 'em-campanha');

-- Vínculos: papel + comissão configurável por vínculo.
INSERT INTO model_agency_link (model_id, agency_id, role, commission_percent) VALUES
    -- Marina: base em SP (20%) e representação internacional em Paris (15%).
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'BASE',          20.00),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'INTERNATIONAL', 15.00),
    -- Lucas: Way como mother agency (10% sobre bookings no exterior) + Paris (20%).
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'MOTHER',        10.00),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'INTERNATIONAL', 20.00);

INSERT INTO brand (id, name, responsible, email, phone, city, state, status) VALUES
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Osklen', 'Ana Lima', 'ana@osklen.com', '+55 11 99999-0000', 'São Paulo', 'SP', 'ativo');

-- Agenda da Marina (a disponibilidade é compartilhada entre Way e Elite Paris).
INSERT INTO calendar_event (model_id, agency_id, title, type, event_date, start_time, end_time, location, description) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111',
     'Casting Osklen Verão', 'casting', '2026-07-02', '10:00', '12:00', 'São Paulo', 'Seleção campanha verão'),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111',
     'Editorial Vogue', 'trabalho', '2026-07-05', '08:00', '18:00', 'São Paulo', 'Produção editorial'),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NULL,
     'Indisponível (viagem pessoal)', 'indisponivel', '2026-07-10', NULL, NULL, NULL, 'Bloqueio marcado pela modelo');

-- Usuários (hash placeholder — autenticação entra na próxima etapa).
INSERT INTO app_user (email, password_hash, role, agency_id, model_id) VALUES
    ('booker@way.com',     'PLACEHOLDER', 'AGENCY', '11111111-1111-1111-1111-111111111111', NULL),
    ('marina@modelo.com',  'PLACEHOLDER', 'MODEL',  NULL, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
