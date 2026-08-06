-- ============================================================
-- Sancho Dashboard — Schema inicial
-- Executar no SQL Editor do Supabase (Dashboard → SQL Editor)
-- ============================================================

-- ── Configuração geral da empresa ────────────────────────────
CREATE TABLE IF NOT EXISTS config (
  id           text PRIMARY KEY DEFAULT 'default',
  logo_url     text,
  company_name text NOT NULL DEFAULT 'Sancho Gestão de Carreira',
  updated_at   timestamptz DEFAULT now()
);

-- Linha padrão (upsert seguro se já existir)
INSERT INTO config (id) VALUES ('default') ON CONFLICT (id) DO NOTHING;

-- ── Membros da equipe ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS membros (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome        text NOT NULL,
  email       text,
  foto_url    text,
  funcao      text,
  rd_user_id  text,  -- _id do usuário no RD Station CRM (para vincular negociações)
  ativo       boolean NOT NULL DEFAULT true,
  created_at  timestamptz DEFAULT now()
);

-- ── Metas mensais (editáveis por mês) ────────────────────────
CREATE TABLE IF NOT EXISTS metas_mensais (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mes                    date NOT NULL,      -- primeiro dia do mês: ex 2026-08-01
  -- Área: Palestras
  palestras_eventos      int  NOT NULL DEFAULT 4,
  palestras_valor        numeric NOT NULL DEFAULT 50000,
  -- Área: Apresentações
  apresentacoes_eventos  int  NOT NULL DEFAULT 4,
  apresentacoes_valor    numeric NOT NULL DEFAULT 30000,
  -- Área: Publicidades
  publicidades_contratos int  NOT NULL DEFAULT 4,
  publicidades_valor     numeric NOT NULL DEFAULT 40000,
  -- Cadência operacional (Eixo 1 do Playbook)
  prospeccoes_dia        int  NOT NULL DEFAULT 10,
  contatos_dia           int  NOT NULL DEFAULT 5,
  agendamentos_semana    int  NOT NULL DEFAULT 5,
  fechamentos_semana     int  NOT NULL DEFAULT 3,
  reunioes_semana        int  NOT NULL DEFAULT 5,
  propostas_semana       int  NOT NULL DEFAULT 3,
  novos_clientes_mes     int  NOT NULL DEFAULT 2,
  created_at             timestamptz DEFAULT now(),
  UNIQUE (mes)
);

-- ── Histórico de resultado real por mês ──────────────────────
CREATE TABLE IF NOT EXISTS historico_mes (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mes                       date NOT NULL,
  ganhos                    int     NOT NULL DEFAULT 0,
  perdidos                  int     NOT NULL DEFAULT 0,
  faturamento_palestras     numeric NOT NULL DEFAULT 0,
  faturamento_apresentacoes numeric NOT NULL DEFAULT 0,
  faturamento_publicidades  numeric NOT NULL DEFAULT 0,
  eventos_palestras         int     NOT NULL DEFAULT 0,
  eventos_apresentacoes     int     NOT NULL DEFAULT 0,
  contratos_publicidades    int     NOT NULL DEFAULT 0,
  updated_at                timestamptz DEFAULT now(),
  UNIQUE (mes)
);

-- ── Row Level Security ────────────────────────────────────────
-- Leitura pública via anon key; escrita apenas pelo service_role (server-side)

ALTER TABLE config        ENABLE ROW LEVEL SECURITY;
ALTER TABLE membros       ENABLE ROW LEVEL SECURITY;
ALTER TABLE metas_mensais ENABLE ROW LEVEL SECURITY;
ALTER TABLE historico_mes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read config"    ON config        FOR SELECT USING (true);
CREATE POLICY "public read membros"   ON membros       FOR SELECT USING (ativo = true);
CREATE POLICY "public read metas"     ON metas_mensais FOR SELECT USING (true);
CREATE POLICY "public read historico" ON historico_mes FOR SELECT USING (true);

-- Escrita via service_role (bypassa RLS por design do Supabase)

-- ── Storage Buckets ───────────────────────────────────────────
-- Criar manualmente no Supabase Dashboard → Storage:
--   Bucket "logos"         → Public: ON
--   Bucket "fotos-membros" → Public: ON
-- Ou via SQL:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('logos', 'logos', true) ON CONFLICT DO NOTHING;
-- INSERT INTO storage.buckets (id, name, public) VALUES ('fotos-membros', 'fotos-membros', true) ON CONFLICT DO NOTHING;
