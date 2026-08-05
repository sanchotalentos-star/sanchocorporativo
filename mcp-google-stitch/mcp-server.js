/**
 * mcp-server.js
 * Servidor MCP para integração Google Stitch × Claude
 *
 * Conecta o BigQuery e a API do Stitch ao Claude via Model Context Protocol.
 * Substitua "seu-projeto" pelo ID real do seu projeto GCP.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { BigQuery } from "@google-cloud/bigquery";
import axios from "axios";
import { z } from "zod";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// ─── Configuração ─────────────────────────────────────────────────────────────

const __dirname = dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(readFileSync(join(__dirname, "config.json"), "utf-8"));

const PROJECT_ID    = process.env.GCP_PROJECT_ID    || config.projectId;
const DATASET_ID    = process.env.GCP_DATASET_ID    || config.bigquery.datasetId;
const STITCH_TOKEN  = process.env.STITCH_API_TOKEN  || "";
const STITCH_BASE   = config.stitch.apiBaseUrl;

// ─── Clientes ─────────────────────────────────────────────────────────────────

const bigquery = new BigQuery({
  projectId: PROJECT_ID,
  // Se não usar ADC, defina GOOGLE_APPLICATION_CREDENTIALS no ambiente
});

const stitchClient = axios.create({
  baseURL: STITCH_BASE,
  headers: {
    Authorization: `Bearer ${STITCH_TOKEN}`,
    "Content-Type": "application/json",
  },
});

// ─── Servidor MCP ─────────────────────────────────────────────────────────────

const server = new McpServer({
  name: config.server.name,
  version: config.server.version,
});

// ── Ferramenta 1: Listar datasets do BigQuery ──────────────────────────────────
server.tool(
  "list_datasets",
  "Lista todos os datasets disponíveis no projeto BigQuery configurado.",
  {},
  async () => {
    const [datasets] = await bigquery.getDatasets();
    const names = datasets.map((ds) => ds.id);
    return {
      content: [
        {
          type: "text",
          text: `Datasets encontrados no projeto **${PROJECT_ID}**:\n\n${names.map((n) => `- \`${n}\``).join("\n")}`,
        },
      ],
    };
  }
);

// ── Ferramenta 2: Executar query SQL no BigQuery ───────────────────────────────
server.tool(
  "run_query",
  "Executa uma query SQL no BigQuery e retorna os resultados em formato tabular.",
  {
    sql: z.string().describe("Query SQL padrão BigQuery a ser executada"),
    maxResults: z
      .number()
      .int()
      .min(1)
      .max(1000)
      .default(100)
      .describe("Número máximo de linhas a retornar (padrão: 100)"),
  },
  async ({ sql, maxResults }) => {
    const options = {
      query: sql,
      location: config.bigquery.location,
      maximumBytesBilled: config.bigquery.maximumBytesBilled,
    };

    const [rows] = await bigquery.query(options);
    const limited = rows.slice(0, maxResults);

    if (limited.length === 0) {
      return {
        content: [{ type: "text", text: "Nenhum resultado encontrado para a query." }],
      };
    }

    // Formata como tabela Markdown
    const headers = Object.keys(limited[0]);
    const headerRow = `| ${headers.join(" | ")} |`;
    const separator = `| ${headers.map(() => "---").join(" | ")} |`;
    const dataRows = limited.map(
      (row) => `| ${headers.map((h) => String(row[h] ?? "")).join(" | ")} |`
    );

    const table = [headerRow, separator, ...dataRows].join("\n");

    return {
      content: [
        {
          type: "text",
          text: `**Resultado** (${limited.length} linhas):\n\n${table}`,
        },
      ],
    };
  }
);

// ── Ferramenta 3: Schema de uma tabela BigQuery ────────────────────────────────
server.tool(
  "get_table_schema",
  "Retorna o schema (colunas, tipos e descrições) de uma tabela BigQuery.",
  {
    datasetId: z.string().describe("ID do dataset"),
    tableId: z.string().describe("ID da tabela"),
  },
  async ({ datasetId, tableId }) => {
    const dataset = bigquery.dataset(datasetId);
    const table = dataset.table(tableId);
    const [metadata] = await table.getMetadata();
    const fields = metadata.schema?.fields ?? [];

    const rows = fields.map(
      (f) =>
        `| \`${f.name}\` | ${f.type} | ${f.mode ?? "NULLABLE"} | ${f.description ?? "-"} |`
    );

    const md =
      `## Schema: \`${datasetId}.${tableId}\`\n\n` +
      `| Campo | Tipo | Modo | Descrição |\n` +
      `| --- | --- | --- | --- |\n` +
      rows.join("\n");

    return { content: [{ type: "text", text: md }] };
  }
);

// ── Ferramenta 4: Preview de dados de uma tabela ──────────────────────────────
server.tool(
  "preview_table",
  "Retorna uma amostra das primeiras N linhas de uma tabela BigQuery.",
  {
    datasetId: z.string().describe("ID do dataset"),
    tableId: z.string().describe("ID da tabela"),
    limit: z
      .number()
      .int()
      .min(1)
      .max(200)
      .default(20)
      .describe("Quantidade de linhas a retornar (padrão: 20)"),
  },
  async ({ datasetId, tableId, limit }) => {
    const sql = `SELECT * FROM \`${PROJECT_ID}.${datasetId}.${tableId}\` LIMIT ${limit}`;
    const [rows] = await bigquery.query({ query: sql });

    if (rows.length === 0) {
      return { content: [{ type: "text", text: "Tabela vazia ou não encontrada." }] };
    }

    const headers = Object.keys(rows[0]);
    const headerRow = `| ${headers.join(" | ")} |`;
    const separator = `| ${headers.map(() => "---").join(" | ")} |`;
    const dataRows = rows.map(
      (row) => `| ${headers.map((h) => String(row[h] ?? "")).join(" | ")} |`
    );

    return {
      content: [
        {
          type: "text",
          text: `**Preview** de \`${datasetId}.${tableId}\` (${rows.length} linhas):\n\n${[headerRow, separator, ...dataRows].join("\n")}`,
        },
      ],
    };
  }
);

// ── Ferramenta 5: Listar fontes Stitch ────────────────────────────────────────
server.tool(
  "list_stitch_sources",
  "Lista todas as fontes de dados configuradas no Stitch ETL.",
  {},
  async () => {
    if (!STITCH_TOKEN) {
      return {
        content: [
          {
            type: "text",
            text: "⚠️ STITCH_API_TOKEN não configurado. Defina a variável de ambiente para usar esta ferramenta.",
          },
        ],
      };
    }

    const { data } = await stitchClient.get("/sources");
    const sources = data?.data ?? [];

    if (sources.length === 0) {
      return { content: [{ type: "text", text: "Nenhuma fonte encontrada no Stitch." }] };
    }

    const list = sources
      .map(
        (s) =>
          `- **${s.display_name}** (\`id: ${s.id}\`) — tipo: \`${s.type}\` | status: ${s.report_card?.current_step_type ?? "desconhecido"}`
      )
      .join("\n");

    return { content: [{ type: "text", text: `## Fontes Stitch\n\n${list}` }] };
  }
);

// ── Ferramenta 6: Status dos pipelines Stitch ─────────────────────────────────
server.tool(
  "get_pipeline_status",
  "Verifica o status atual dos pipelines ETL no Stitch para uma fonte específica.",
  {
    sourceId: z
      .number()
      .int()
      .describe("ID numérico da fonte Stitch (obtido via list_stitch_sources)"),
  },
  async ({ sourceId }) => {
    if (!STITCH_TOKEN) {
      return {
        content: [
          {
            type: "text",
            text: "⚠️ STITCH_API_TOKEN não configurado.",
          },
        ],
      };
    }

    const { data: source } = await stitchClient.get(`/sources/${sourceId}`);
    const { data: streams } = await stitchClient.get(`/sources/${sourceId}/streams`);

    const streamList = (streams?.data ?? [])
      .map(
        (s) =>
          `  - \`${s.stream_name}\` — selecionado: ${s.metadata?.selected ? "✅" : "❌"}`
      )
      .join("\n");

    const md =
      `## Pipeline: **${source.display_name}** (ID ${sourceId})\n\n` +
      `- **Tipo**: \`${source.type}\`\n` +
      `- **Criado em**: ${source.created_at ?? "-"}\n` +
      `- **Última atualização**: ${source.updated_at ?? "-"}\n\n` +
      `### Streams configurados\n\n${streamList || "Nenhum stream encontrado."}`;

    return { content: [{ type: "text", text: md }] };
  }
);

// ─── Inicialização ────────────────────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(
    `[MCP Google Stitch] Servidor iniciado — projeto: ${PROJECT_ID}`
  );
}

main().catch((err) => {
  console.error("[MCP Google Stitch] Erro fatal:", err);
  process.exit(1);
});
