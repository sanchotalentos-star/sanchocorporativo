// lib/supabase-types.ts
// Tipos TypeScript das tabelas do Supabase (gerado manualmente do schema)
// ⚠️  Evitar referências circulares — definir Insert/Update com tipos explícitos

// ── Row types ────────────────────────────────────────────────────────────────

export interface ConfigRow {
  id:           string;
  logo_url:     string | null;
  company_name: string;
  updated_at:   string;
}

export interface MembroRow {
  id:         string;
  nome:       string;
  email:      string | null;
  foto_url:   string | null;
  funcao:     string | null;
  rd_user_id: string | null;
  ativo:      boolean;
  created_at: string;
}

export interface MetasRow {
  id:                     string;
  mes:                    string; // ISO date: "2026-08-01"
  palestras_eventos:      number;
  palestras_valor:        number;
  apresentacoes_eventos:  number;
  apresentacoes_valor:    number;
  publicidades_contratos: number;
  publicidades_valor:     number;
  prospeccoes_dia:        number;
  contatos_dia:           number;
  agendamentos_semana:    number;
  fechamentos_semana:     number;
  reunioes_semana:        number;
  propostas_semana:       number;
  novos_clientes_mes:     number;
  created_at:             string;
}

export interface HistoricoRow {
  id:                        string;
  mes:                       string;
  ganhos:                    number;
  perdidos:                  number;
  faturamento_palestras:     number;
  faturamento_apresentacoes: number;
  faturamento_publicidades:  number;
  eventos_palestras:         number;
  eventos_apresentacoes:     number;
  contratos_publicidades:    number;
  updated_at:                string;
}

// ── Insert types (omit server-generated fields) ───────────────────────────────

export type ConfigInsert = {
  id?:           string;
  logo_url?:     string | null;
  company_name?: string;
  updated_at?:   string;
};

export type MembroInsert = {
  id?:         string;
  nome:        string;
  email?:      string | null;
  foto_url?:   string | null;
  funcao?:     string | null;
  rd_user_id?: string | null;
  ativo?:      boolean;
};

export type MetasInsert = {
  id?:                      string;
  mes:                      string;
  palestras_eventos?:       number;
  palestras_valor?:         number;
  apresentacoes_eventos?:   number;
  apresentacoes_valor?:     number;
  publicidades_contratos?:  number;
  publicidades_valor?:      number;
  prospeccoes_dia?:         number;
  contatos_dia?:            number;
  agendamentos_semana?:     number;
  fechamentos_semana?:      number;
  reunioes_semana?:         number;
  propostas_semana?:        number;
  novos_clientes_mes?:      number;
};

export type HistoricoInsert = {
  id?:                         string;
  mes:                         string;
  ganhos?:                     number;
  perdidos?:                   number;
  faturamento_palestras?:      number;
  faturamento_apresentacoes?:  number;
  faturamento_publicidades?:   number;
  eventos_palestras?:          number;
  eventos_apresentacoes?:      number;
  contratos_publicidades?:     number;
  updated_at?:                 string;
};

// ── Database interface (used by createClient<Database>) ───────────────────────
// @supabase/supabase-js v2 requires Relationships on every table entry.

export interface Database {
  public: {
    Tables: {
      config: {
        Row:           ConfigRow;
        Insert:        ConfigInsert;
        Update:        Partial<ConfigInsert>;
        Relationships: [];
      };
      membros: {
        Row:           MembroRow;
        Insert:        MembroInsert;
        Update:        Partial<MembroInsert>;
        Relationships: [];
      };
      metas_mensais: {
        Row:           MetasRow;
        Insert:        MetasInsert;
        Update:        Partial<MetasInsert>;
        Relationships: [];
      };
      historico_mes: {
        Row:           HistoricoRow;
        Insert:        HistoricoInsert;
        Update:        Partial<HistoricoInsert>;
        Relationships: [];
      };
    };
    Views:          Record<string, never>;
    Functions:      Record<string, never>;
    Enums:          Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
