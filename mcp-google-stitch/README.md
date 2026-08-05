# MCP Server — Google Stitch × Claude

Configuração completa para conectar o **Google Stitch** (BigQuery + Data Pipeline) ao Claude via protocolo MCP (Model Context Protocol).

---

## Pré-requisitos

| Requisito | Versão mínima |
|-----------|--------------|
| Node.js | 18+ |
| Claude Desktop / Claude Code | última versão |
| Google Cloud SDK (`gcloud`) | instalado e autenticado |
| Conta de serviço GCP | com permissões BigQuery + Stitch |

---

## Estrutura de arquivos

```
mcp-google-stitch/
├── README.md
├── mcp-server.js          ← servidor MCP principal
├── config.json            ← configuração do projeto GCP
├── claude_desktop_config.json  ← snippet para Claude Desktop
└── package.json
```

---

## Configuração rápida

### 1. Instale as dependências

```bash
cd mcp-google-stitch
npm install
```

### 2. Configure sua conta de serviço GCP

```bash
# Autenticação via Application Default Credentials
gcloud auth application-default login

# OU aponte para o arquivo de chave JSON da service account
export GOOGLE_APPLICATION_CREDENTIALS="/caminho/para/sua-chave.json"
```

### 3. Edite `config.json` com seu Project ID real

```json
{
  "projectId": "seu-projeto-real-aqui"
}
```

### 4. Cole o snippet em `claude_desktop_config.json` dentro do Claude Desktop

Caminho do arquivo de configuração do Claude Desktop:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

### 5. Reinicie o Claude Desktop

---

## Variáveis de ambiente suportadas

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `GCP_PROJECT_ID` | Sim | ID do projeto Google Cloud |
| `GCP_DATASET_ID` | Não | Dataset padrão do BigQuery |
| `GOOGLE_APPLICATION_CREDENTIALS` | Condicional | Caminho da chave JSON (se não usar ADC) |
| `STITCH_API_TOKEN` | Não | Token da API Stitch (para operações ETL) |
| `MCP_SERVER_PORT` | Não | Porta do servidor (padrão: 3000) |

---

## Ferramentas disponíveis via MCP

Após conectar, o Claude terá acesso às seguintes ferramentas:

- **`list_datasets`** — lista todos os datasets do projeto BigQuery  
- **`run_query`** — executa queries SQL no BigQuery  
- **`get_table_schema`** — retorna o schema de uma tabela  
- **`list_stitch_sources`** — lista as fontes de dados do Stitch  
- **`get_pipeline_status`** — verifica o status dos pipelines ETL  
- **`preview_table`** — retorna amostra de dados de uma tabela  
