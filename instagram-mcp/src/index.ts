import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import axios, { AxiosError } from "axios";

const IG_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
const IG_USER_ID = process.env.INSTAGRAM_USER_ID;
const BASE_URL = "https://graph.instagram.com/v21.0";

if (!IG_TOKEN || !IG_USER_ID) {
  process.stderr.write(
    "Erro: variáveis INSTAGRAM_ACCESS_TOKEN e INSTAGRAM_USER_ID são obrigatórias\n"
  );
  process.exit(1);
}

const api = axios.create({
  baseURL: BASE_URL,
  params: { access_token: IG_TOKEN },
});

const server = new Server(
  { name: "instagram-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "get_profile",
      description: "Busca informações do perfil do Instagram (nome, seguidores, número de posts)",
      inputSchema: { type: "object", properties: {} },
    },
    {
      name: "get_posts",
      description: "Lista as publicações recentes com curtidas, comentários e link",
      inputSchema: {
        type: "object",
        properties: {
          limit: {
            type: "number",
            description: "Quantidade de posts para retornar (padrão: 10, máximo: 50)",
          },
        },
      },
    },
    {
      name: "get_post_insights",
      description: "Retorna métricas detalhadas de um post (impressões, alcance, curtidas, comentários, compartilhamentos, salvamentos)",
      inputSchema: {
        type: "object",
        properties: {
          media_id: {
            type: "string",
            description: "ID do post. Use get_posts para obter o ID",
          },
        },
        required: ["media_id"],
      },
    },
    {
      name: "get_comments",
      description: "Lista os comentários de um post",
      inputSchema: {
        type: "object",
        properties: {
          media_id: {
            type: "string",
            description: "ID do post",
          },
          limit: {
            type: "number",
            description: "Quantidade de comentários (padrão: 20)",
          },
        },
        required: ["media_id"],
      },
    },
    {
      name: "reply_to_comment",
      description: "Responde a um comentário em um post",
      inputSchema: {
        type: "object",
        properties: {
          comment_id: {
            type: "string",
            description: "ID do comentário a responder",
          },
          message: {
            type: "string",
            description: "Texto da resposta",
          },
        },
        required: ["comment_id", "message"],
      },
    },
    {
      name: "get_account_insights",
      description: "Retorna métricas gerais da conta (alcance, impressões, seguidores ganhos) nos últimos 7 ou 30 dias",
      inputSchema: {
        type: "object",
        properties: {
          period: {
            type: "string",
            enum: ["day", "week", "days_28"],
            description: "Período da análise: 'day' (hoje), 'week' (7 dias), 'days_28' (28 dias)",
          },
        },
      },
    },
    {
      name: "publish_photo",
      description: "Publica uma foto no Instagram a partir de uma URL pública",
      inputSchema: {
        type: "object",
        properties: {
          image_url: {
            type: "string",
            description: "URL pública da imagem (deve ser acessível publicamente)",
          },
          caption: {
            type: "string",
            description: "Legenda do post (pode incluir hashtags e emojis)",
          },
        },
        required: ["image_url", "caption"],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const a = (args ?? {}) as Record<string, unknown>;

  try {
    if (name === "get_profile") {
      const { data } = await api.get(`/${IG_USER_ID}`, {
        params: {
          fields: "id,username,name,biography,website,account_type,media_count,followers_count,follows_count,profile_picture_url",
        },
      });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }

    if (name === "get_posts") {
      const limit = Number(a.limit ?? 10);
      const { data } = await api.get(`/${IG_USER_ID}/media`, {
        params: {
          fields: "id,caption,media_type,media_url,thumbnail_url,timestamp,like_count,comments_count,permalink",
          limit: Math.min(limit, 50),
        },
      });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }

    if (name === "get_post_insights") {
      const media_id = String(a.media_id);
      const { data } = await api.get(`/${media_id}/insights`, {
        params: {
          metric: "impressions,reach,likes,comments,shares,saved,total_interactions",
        },
      });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }

    if (name === "get_comments") {
      const media_id = String(a.media_id);
      const limit = Number(a.limit ?? 20);
      const { data } = await api.get(`/${media_id}/comments`, {
        params: {
          fields: "id,text,username,timestamp,like_count,replies{id,text,username,timestamp}",
          limit: Math.min(limit, 100),
        },
      });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }

    if (name === "reply_to_comment") {
      const comment_id = String(a.comment_id);
      const message = String(a.message);
      const { data } = await api.post(`/${comment_id}/replies`, null, {
        params: { message },
      });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }

    if (name === "get_account_insights") {
      const period = String(a.period ?? "week");
      const { data } = await api.get(`/${IG_USER_ID}/insights`, {
        params: {
          metric: "impressions,reach,follower_count,profile_views,website_clicks",
          period,
        },
      });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }

    if (name === "publish_photo") {
      const image_url = String(a.image_url);
      const caption = String(a.caption);

      // Passo 1: criar container de mídia
      const { data: container } = await api.post(`/${IG_USER_ID}/media`, null, {
        params: { image_url, caption, media_type: "IMAGE" },
      });

      // Passo 2: publicar
      const { data: published } = await api.post(`/${IG_USER_ID}/media_publish`, null, {
        params: { creation_id: container.id },
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ success: true, media_id: published.id, container_id: container.id }, null, 2),
          },
        ],
      };
    }

    return {
      content: [{ type: "text", text: `Ferramenta desconhecida: ${name}` }],
      isError: true,
    };
  } catch (error) {
    const err = error as AxiosError<{ error?: { message?: string; code?: number } }>;
    const detail = err.response?.data?.error?.message ?? err.message;
    return {
      content: [{ type: "text", text: `Erro na API do Instagram: ${detail}` }],
      isError: true,
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
