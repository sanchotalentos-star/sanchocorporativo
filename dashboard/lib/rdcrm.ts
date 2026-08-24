// lib/rdcrm.ts
// Cliente server-side para o RD Station CRM API v1
// ⚠️  Nunca importar este arquivo no client-side — apenas em Route Handlers e Server Components

import { z } from "zod";

const BASE_URL = "https://crm.rdstation.com/api/v1";

function getToken(): string {
  const token = process.env.RDCRM_TOKEN;
  if (!token) {
    throw new Error("RDCRM_TOKEN não definido nas variáveis de ambiente");
  }
  return token;
}

// ─── Schemas de resposta ──────────────────────────────────────────────────────

export const DealSchema = z.object({
  _id:         z.string(),
  name:        z.string(),
  // Campos de valor — o RD CRM pode usar qualquer combinação destes
  amount:           z.number().optional().nullable(), // campo genérico (alguns pipelines)
  amount_montly:    z.number().optional().nullable(), // nota: typo da API (monthly)
  amount_unique:    z.number().optional().nullable(),
  amount_recurrent: z.number().optional().nullable(),
  win:         z.boolean().optional().nullable(),
  hold:        z.boolean().optional().nullable(),
  win_time:    z.string().optional().nullable(), // data exata do "Marcar venda" no RD CRM
  closed_at:   z.string().optional().nullable(), // alternativa usada por alguns pipelines
  created_at:  z.string().optional().nullable(),
  updated_at:  z.string().optional().nullable(),
  last_activity_at: z.string().optional().nullable(),
  deal_stage: z.object({
    _id:  z.string().optional(),
    name: z.string().optional(),
  }).optional().nullable(),
  user: z.object({
    _id:  z.string().optional(),
    name: z.string().optional(),
  }).optional().nullable(),
  contacts: z.array(z.object({
    name:  z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
  })).optional().nullable(),
  organization: z.object({
    name: z.string().optional(),
  }).optional().nullable(),
});

export const DealStageSchema = z.object({
  _id:         z.string(),
  name:        z.string(),
  order:       z.number().optional().nullable(),
  pipeline_id: z.string().optional().nullable(),
});

export const UserSchema = z.object({
  _id:   z.string(),
  name:  z.string(),
  email: z.string().optional().nullable(),
});

export type Deal      = z.infer<typeof DealSchema>;
export type DealStage = z.infer<typeof DealStageSchema>;
export type RDUser    = z.infer<typeof UserSchema>;

// ─── Helpers de fetch ─────────────────────────────────────────────────────────

async function rdFetch<T>(
  endpoint: string,
  schema: z.ZodType<T>,
  params: Record<string, string | number> = {},
): Promise<T> {
  const token = getToken();
  const url   = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set("token", token);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }

  const res = await fetch(url.toString(), {
    method:  "GET",
    headers: { "Content-Type": "application/json" },
    next:    { revalidate: 300 }, // cache de 5 minutos no Next.js
  });

  if (!res.ok) {
    throw new Error(`RD CRM API error: ${res.status} ${res.statusText}`);
  }

  const json: unknown = await res.json();
  return schema.parse(json);
}

// ─── Endpoint: Deals ──────────────────────────────────────────────────────────

const DealsResponseSchema = z.object({
  deals:        z.array(DealSchema),
  total:        z.number().optional(),
  has_more:     z.boolean().optional(),
});

type DealsResponse = z.infer<typeof DealsResponseSchema>;

/**
 * Busca todas as negociações, paginando automaticamente até o limite.
 * Default de 300 para cobrir funis com 200+ negócios.
 */
export async function getDeals(limit = 300): Promise<Deal[]> {
  const pageSize = 50;
  const pages    = Math.ceil(limit / pageSize);
  const allDeals: Deal[] = [];

  for (let page = 1; page <= pages; page++) {
    let response: DealsResponse;
    try {
      response = await rdFetch("/deals", DealsResponseSchema, {
        page,
        limit: pageSize,
      });
    } catch {
      break;
    }

    allDeals.push(...response.deals);

    if (!response.has_more) break;
    if (allDeals.length >= limit) break;
  }

  return allDeals.slice(0, limit);
}

/**
 * Busca negociações ativas (não ganhas, não perdidas).
 */
export async function getActiveDeals(): Promise<Deal[]> {
  const deals = await getDeals();
  return deals.filter((d) => !d.win && !d.hold);
}

/**
 * Busca todos os negócios GANHOS no ano corrente.
 * Nesta conta do RD CRM os negócios fechados são identificados pela etapa
 * "Realizado" no pipeline — o boolean win=true não é utilizado.
 * Aceita ambas as convenções para compatibilidade futura.
 */
export async function getWonDealsYTD(): Promise<Deal[]> {
  const ano = new Date().getFullYear();
  // Busca até 300 negociações sem filtro server-side (filtramos aqui)
  const all = await getDeals(300);

  return all.filter((d) => {
    // Ganho = boolean win OU etapa "Realizado" (convenção desta conta)
    const isWon = d.win === true || d.deal_stage?.name === "Realizado";
    if (!isWon) return false;
    // Data da venda: win_time (clicou "Marcar venda") > closed_at > updated_at > created_at
    const ref = d.win_time ?? d.closed_at ?? d.updated_at ?? d.created_at;
    if (!ref) return true; // sem data → inclui
    return ref.startsWith(String(ano));
  });
}

// ─── Endpoint: Stages ─────────────────────────────────────────────────────────

const StagesResponseSchema = z.object({
  deal_stages: z.array(DealStageSchema),
});

/**
 * Busca todas as etapas do funil (pipeline stages).
 */
export async function getStages(): Promise<DealStage[]> {
  const response = await rdFetch("/deals_stages", StagesResponseSchema);
  return response.deal_stages.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

// ─── Endpoint: Users ──────────────────────────────────────────────────────────

const UsersResponseSchema = z.object({
  users: z.array(UserSchema),
});

/**
 * Busca todos os vendedores/usuários do CRM.
 */
export async function getUsers(): Promise<RDUser[]> {
  const response = await rdFetch("/users", UsersResponseSchema);
  return response.users;
}
