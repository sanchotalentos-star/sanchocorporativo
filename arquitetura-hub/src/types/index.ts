export type UserRole = 'admin' | 'membro';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  bio?: string;
}

export interface KpiEntry {
  id: string;
  user_id: string;
  kpi_name: string;
  category: KpiCategory;
  meta: number;
  atual: number;
  unit: string;
  history: number[];
  updated_at: string;
}

export type KpiCategory = 'Conteúdo' | 'Conversão' | 'Autoridade' | 'Mídia' | 'Rede' | 'Receita';

export interface Pilar {
  id: string;
  user_id: string;
  nome: string;
  descricao: string;
  cor: string;
  ordem: number;
  acoes: PilarAcao[];
}

export interface PilarAcao {
  id: string;
  pilar_id: string;
  texto: string;
  concluida: boolean;
  ordem: number;
}

export type EventoTipo = 'Conteúdo' | 'Evento' | 'Mídia' | 'Relacionamento' | 'Meta';

export interface Evento {
  id: string;
  user_id: string;
  titulo: string;
  tipo: EventoTipo;
  data: string;
  hora?: string;
  local?: string;
}

export interface GrowthData {
  month: string;
  alcance: number;
  leads: number;
  conversoes: number;
}

export interface Member {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  score: number;
  leads: number;
  alcance: number;
  kpis: KpiEntry[];
  growth: GrowthData[];
}

export interface AccountRequest {
  id: string;
  full_name: string;
  email: string;
  mensagem: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}
