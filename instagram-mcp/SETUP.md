# Instagram MCP — Guia de Configuração

## Passo 1: Obter credenciais do Instagram

### 1.1 Criar app na Meta
1. Acesse https://developers.facebook.com
2. Clique em **Meus Apps → Criar App**
3. Escolha **Empresa** → preencha o nome (ex: "Sancho Instagram")
4. Em "Adicionar produto", clique em **Configurar** no card **Instagram Graph API**

### 1.2 Conectar sua conta
1. No menu lateral: **Instagram Graph API → Configuração básica**
2. Clique em **Adicionar conta do Instagram** e autorize
3. Anote o **Instagram User ID** exibido (string numérica)

### 1.3 Gerar Access Token
1. No menu lateral: **Ferramentas → Graph API Explorer**
2. Em "Aplicativo", selecione seu app criado
3. Em "Permissões", adicione:
   - `instagram_basic`
   - `instagram_manage_comments`
   - `instagram_content_publish`
   - `instagram_manage_insights`
4. Clique em **Gerar Token de Acesso**
5. Copie o token gerado

> **Dica:** Para um token de longa duração (60 dias), troque o token de curta duração via:
> `GET https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_id=APP_ID&client_secret=APP_SECRET&access_token=TOKEN_CURTO`

---

## Passo 2: Instalar e compilar o servidor MCP

```bash
cd instagram-mcp
npm install
npm run build
```

---

## Passo 3: Configurar o Claude Code

Adicione ao arquivo `~/.claude/claude.json` (crie se não existir):

```json
{
  "mcpServers": {
    "instagram": {
      "command": "node",
      "args": ["/home/user/sanchocorporativo/instagram-mcp/dist/index.js"],
      "env": {
        "INSTAGRAM_ACCESS_TOKEN": "seu_token_aqui",
        "INSTAGRAM_USER_ID": "seu_user_id_aqui"
      }
    }
  }
}
```

Substitua:
- `seu_token_aqui` → token gerado no Passo 1.3
- `seu_user_id_aqui` → ID numérico do Passo 1.2

---

## Passo 4: Reiniciar o Claude Code

```bash
claude
```

---

## Ferramentas disponíveis

| Ferramenta | O que faz |
|---|---|
| `get_profile` | Perfil, seguidores, bio |
| `get_posts` | Últimas publicações com métricas |
| `get_post_insights` | Alcance, impressões, curtidas de um post |
| `get_comments` | Comentários de um post |
| `reply_to_comment` | Responde a um comentário |
| `get_account_insights` | Métricas gerais da conta |
| `publish_photo` | Publica uma foto via URL |

## Exemplos de uso no Claude Code

```
> Mostre meu perfil do Instagram
> Quais foram meus 5 posts com mais curtidas?
> Analise o desempenho da minha conta nos últimos 28 dias
> Responda o comentário ID 123 com "Obrigado pelo carinho!"
```
