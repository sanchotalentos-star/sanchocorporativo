# Prêmio TOP de Vendas 2026: site de agradecimento ao júri

Página única, pensada para abrir pelo celular a partir de uma tag NFC.

**Endereço:** `https://advbce.com.br/topdevendas2026/`

## Personalizar por jurado (opcional)
Grave na tag NFC de cada jurado o link com o nome dele:

```
https://advbce.com.br/topdevendas2026/?nome=Ana
```

A abertura passa a dizer "Ana, este prêmio tem a sua assinatura." e o agradecimento final também usa o nome.
Sem `?nome=`, a página funciona normalmente com a mensagem genérica.
Nomes compostos usam `%20` no lugar do espaço: `?nome=Ana%20Paula`.

## Preencher os menus (Fotos, Registros, Na imprensa, Depoimentos)
1. Coloque as imagens/vídeos na pasta `midia/`.
2. Edite **apenas** o arquivo `conteudo.js` (há exemplos comentados em cada lista).
3. Enquanto uma lista estiver vazia, o menu mostra "Em breve".

## Estrutura
- `index.html`: a página (logo animada em SVG + GSAP).
- `conteudo.js`: conteúdo dos menus.
- `midia/`: arquivos de fotos e vídeos.

## Publicar em advbce.com.br/topdevendas2026
Envie a pasta `topdevendas2026/` inteira (com `index.html`, `conteudo.js` e `midia/`)
para a raiz pública do site advbce.com.br (geralmente `public_html/` ou `www/`),
via FTP ou pelo gerenciador de arquivos da hospedagem.
O endereço final fica: https://advbce.com.br/topdevendas2026
