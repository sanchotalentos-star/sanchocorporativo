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
  amount_montly: z.number().optional().nullable(),
  amount_unique: z.number().optional().nullable(),
  amount_recurrent: z.number().optional().nullable(),
  win:         z.boolean().optional().nullable(),
  hold:        z.boolean().optional().nullable(),
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
 * Máximo de 200 negociações retornadas para evitar timeout.
 */
export async function getDeals(limit = 200): Promise<Deal[]> {
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
 * Busca todos os negócios GANHOS no ano corrente, paginando até o fim.
 * Busca com win=true sem filtro de data (a API do RD CRM não suporta
 * start_date/end_date combinado com win=true de forma confiável) e
 * filtra o ano corrente client-side via updated_at ou created_at.
 */
export async function getWonDealsYTD(): Promise<Deal[]> {
  const ano      = new Date().getFullYear();
  const pageSize = 50;
  const allDeals: Deal[] = [];

  for (let page = 1; page <= 20; page++) {           // max 1000 registros
    let response: z.infer<typeof DealsResponseSchema>;
    try {
      response = await rdFetch("/deals", DealsResponseSchema, {
        page,
        limit: pageSize,
        win:   "true",
      });
    } catch {
      break;
    }

    allDeals.push(...response.deals);
    if (!response.has_more || response.deals.length === 0) break;
  }

  // Filtra: só deals realmente ganhos E com data de referência no ano corrente
  return allDeals.filter((d) => {
    if (d.win !== true) return false;
    const ref = d.updated_at ?? d.created_at;
    if (!ref) return true; // sem data → inclui (não descarta)
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
