# Sancho Corporativo — Guia para Claude

## Visão Geral do Projeto

Este repositório contém ferramentas de apresentação interativa para workshops e eventos da **Sancho Talentos**. Os arquivos são HTML/CSS/JS puro (sem framework), com integração Firebase Realtime Database para funcionalidades ao vivo (contador de participantes, nuvem de palavras, sorteio).

### Arquivos Principais

| Arquivo | Descrição |
|---|---|
| `index.html` | Apresentação principal — Workshop "Marca que Vende SEM Cerimônias" |
| `marca-que-vende.html` | Versão alternativa da apresentação |
| `marca-que-vende-react.html` | Versão React da apresentação |
| `se-amostramento.html` | Formulário interativo de participação do público |
| `painel-amostramento.html` | Painel administrativo de gestão de leads |
| `slide-editor.html` | Editor de slides |
| `ROTEIRO.md` | Roteiro completo para o palestrante |
| `render.yaml` | Configuração de deploy (Render.com) |

### Paleta de Design (Tokens CSS)

```css
--pink:       #E8186D   /* cor primária */
--pink-dark:  #B01254
--yellow:     #F5E600   /* destaque */
--dark:       #0A0A0F   /* fundo principal */
--white:      #FFFFFF
```

Fonte padrão: **Barlow** (Google Fonts), pesos 400–900.

---

## Integração com 21st.dev (Magic MCP)

O projeto está configurado com o **21st.dev Magic MCP**, que permite ao Claude buscar e implementar componentes de UI profissionais a partir da biblioteca do [21st.dev](https://21st.dev) durante o desenvolvimento.

### Como Funciona

Quando ativo, o servidor MCP do 21st.dev expõe uma ferramenta `21st_magic_component_builder` que o Claude usa para:

1. **Buscar componentes** — procura na biblioteca do 21st.dev componentes relevantes para o que você está pedindo
2. **Gerar código** — retorna o código do componente adaptado ao contexto do projeto
3. **Inspirar soluções** — mesmo que o projeto use HTML puro, os componentes servem como referência visual e de UX para criar equivalentes nativos

### Configuração Necessária

O arquivo `.mcp.json` já está criado na raiz do projeto. Para ativar:

1. Acesse [21st.dev](https://21st.dev) e crie uma conta
2. Vá em **Settings → API Keys** e gere uma chave
3. Substitua `SUA_CHAVE_API_AQUI` no arquivo `.mcp.json` pela chave real

**Ou** configure via variável de ambiente antes de iniciar o Claude Code:
```bash
export MAGIC_API_KEY="sua_chave_aqui"
claude
```

### Uso Durante o Desenvolvimento

Ao pedir mudanças de UI/UX ao Claude, use frases como:
- *"Use o 21st.dev para buscar um componente de card elegante"*
- *"Procura no 21st.dev um modal de confirmação"*
- *"Implemente um slider inspirado nos componentes do 21st.dev"*

O Claude irá automaticamente consultar a biblioteca e adaptar o componente para HTML/CSS/JS puro, mantendo a paleta de cores e tipografia Sancho.

---

## Convenções de Código

- **HTML puro** — sem build step, sem bundler. Tudo deve funcionar com `open index.html`.
- **CSS inline via `<style>`** — não usar arquivos `.css` separados nos slides.
- **Firebase** — sempre use o SDK compat (`firebase-app-compat.js`), não o modular.
- **Animações** — preferir CSS transitions/animations ao invés de bibliotecas externas.
- **Responsividade** — slides são projetados para 16:9 (1280×720px mínimo). Use `vw`/`vh` quando relevante.

## Comandos Úteis

```bash
# Ver o projeto localmente (qualquer servidor HTTP simples)
python3 -m http.server 8080
# Depois abra http://localhost:8080

# Deploy via Render (configurado em render.yaml)
git push origin main
```
