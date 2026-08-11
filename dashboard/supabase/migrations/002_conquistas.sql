-- ── Tabela: conquistas_2026 ─────────────────────────────────────────────────
-- Rastreia o progresso das metas estratégicas e financeiras YTD de 2026.
-- Uma única row (id = 'default') atualizada via PUT /api/conquistas.

CREATE TABLE IF NOT EXISTS conquistas_2026 (
  id                    text PRIMARY KEY DEFAULT 'default',

  -- Novos Agenciados (meta: 3 palestrantes + 2 criadores)
  novos_palestrantes    int NOT NULL DEFAULT 0,
  novos_criadores       int NOT NULL DEFAULT 0,

  -- Negócios Recorrentes (meta: 6 combos + 5 embaixadas)
  combos_eventos        int NOT NULL DEFAULT 0,
  embaixadas            int NOT NULL DEFAULT 0,

  -- Equipe (meta: 2 agentes + 1 inteligência)
  agentes_comerciais    int NOT NULL DEFAULT 0,
  inteligencia_mercado  int NOT NULL DEFAULT 0,

  -- Faturamento YTD (R$ realizados no ano — preenchido pelo historico_mes
  --                  ou ajustado manualmente)
  faturamento_ytd       numeric NOT NULL DEFAULT 0,

  updated_at            timestamptz DEFAULT now()
);

-- Garante row default
INSERT INTO conquistas_2026 (id)
VALUES ('default')
ON CONFLICT (id) DO NOTHING;

-- RLS
ALTER TABLE conquistas_2026 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read"  ON conquistas_2026 FOR SELECT USING (true);
CREATE POLICY "anon write"   ON conquistas_2026 FOR ALL   USING (true) WITH CHECK (true);
