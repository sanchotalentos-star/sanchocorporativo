# Roteiro do Palestrante
## Workshop "Marca que Vende SEM Cerimônias"
**23 de junho · 19h · Casa MD — Moura Dubeux · Fortaleza-CE**

---

## 1. Setup Firebase (faça isso ANTES do evento)

### Passo a passo

1. Acesse [console.firebase.google.com](https://console.firebase.google.com) e entre com sua conta Google.
2. Clique em **"Adicionar projeto"** → dê um nome (ex: `marca-vende-workshop`) → clique em Continuar até criar.
3. No menu lateral, clique em **Build → Realtime Database**.
4. Clique em **"Criar banco de dados"** → escolha a região mais próxima (ex: `us-central1`) → selecione **"Iniciar no modo de teste"** → Ativar.
5. Ainda no menu lateral, clique em **Visão geral do projeto** (ícone de engrenagem) → **Configurações do projeto**.
6. Role até **"Seus aplicativos"** → clique em **`</>`** (Web) → registre o app (nome qualquer) → copie o bloco `firebaseConfig` que aparece.
7. Abra `marca-que-vende.html` em qualquer editor de texto e substitua o bloco:

```javascript
const firebaseConfig = {
  apiKey:            "COLE_AQUI",   // ← cole o valor real
  authDomain:        "COLE_AQUI",
  databaseURL:       "COLE_AQUI",  // ← OBRIGATÓRIO — URL do Realtime DB
  projectId:         "COLE_AQUI",
  storageBucket:     "COLE_AQUI",
  messagingSenderId: "COLE_AQUI",
  appId:             "COLE_AQUI"
};
```

> **Atenção:** o campo `databaseURL` normalmente termina com `.firebaseio.com`. Se ele não aparecer automaticamente, copie da página do Realtime Database (URL no topo da tela de dados).

---

## 2. Publicação no Netlify Drop

1. Acesse **[app.netlify.com/drop](https://app.netlify.com/drop)** (pode estar em netlify.com/drop também).
2. Arraste o arquivo `marca-que-vende.html` para a área indicada.
3. Aguarde o deploy (segundos). A URL final aparecerá, ex: `https://amazing-name-123.netlify.app`.
4. Abra o arquivo `marca-que-vende.html` novamente e substitua `[URL_DO_APP]` pela URL real:

```javascript
// Exemplo — ajuste para sua URL real:
// O app detecta automaticamente a URL, então a única coisa que
// precisar atualizar é verificar se o QR code no slide 3 aponta
// para o endereço correto após o deploy.
```

> O app gera o QR code automaticamente com base na URL atual da página — depois do deploy no Netlify, abra o arquivo publicado no notebook e o QR já apontará para o endereço certo automaticamente.

---

## 3. Ensaio completo (no dia anterior ao evento)

- [ ] Abra a URL publicada no notebook em tela cheia (tecla **F**)
- [ ] Navegue até o **Slide 3** (QR code)
- [ ] Escaneie o QR com o celular pessoal
- [ ] Preencha o formulário com dados fictícios
- [ ] Verifique se o contador no projetor sobe de 0 para 1
- [ ] Avance até o **Slide 9** e confirme que sua palavra aparece na nuvem
- [ ] Teste o botão **"Sortear ganhador"** no Slide 14
- [ ] Teste o botão **"Apagar todos os dados"** (e confirme que o contador volta a 0)
- [ ] Apague os dados de teste antes do evento

---

## 4. Plano B — Sem Internet

Se houver falha de internet no evento:

1. Pressione a tecla **D** na tela de slides — 13 participantes de demonstração serão injetados.
2. O banner laranja no topo indica "Modo ensaio".
3. Todas as funcionalidades visuais funcionam normalmente (nuvem de palavras, sorteio, etc.).
4. Para a plateia: simplesmente não peça que escaneiem o QR. Continue a apresentação normalmente.

**Como comunicar (opcional):** *"Vamos continuar com nossos participantes de demonstração para vocês verem como funciona na prática."*

---

## 5. Comandos durante a palestra

| Ação | Controle |
|---|---|
| Avançar slide / revelar item | `→` ou `Espaço` |
| Voltar slide | `←` |
| Avançar (clique) | Terço central ou direito da tela |
| Voltar (clique) | Terço esquerdo da tela |
| Tela cheia | `F` |
| Injetar participantes de teste | `D` (modo ensaio) |
| Sortear ganhador | Botão na tela (Slide 3 ou 14) |
| Apagar dados ao vivo | Botão na tela (Slide 14) |

---

## 6. Roteiro Minuto a Minuto (30 minutos)

### `00:00–02:00` — Abertura + QR Code na tela

- Já comece com o **Slide 3** (QR) projetado enquanto as pessoas chegam.
- Peça que escaneiem antes de você começar a falar.
- Frase sugerida: *"Antes de tudo, escaneia esse QR ali. Vai levar 20 segundos — e vale uma surpresa no final."*

### `02:00–05:00` — Slides 1–3: Provocação de abertura

- **Slide 1 (Capa):** apresentação formal, título do workshop, seus nomes.
- **Slide 2 (Speakers):** apresente você e o Diego em 30 segundos cada.
- **Slide 3 (QR):** já deve ter participantes. Mostre o contador ao vivo. *"Olha, já temos X pessoas participando."*

### `05:00–10:00` — Slides 4–6: Mito da humildade + Autoridade

- **Slide 4:** lance a provocação da quote. Pause. Deixe a pergunta pesar.
  - Revele o fragmento: *"O mercado não premia apenas competência..."*
- **Slide 5:** o mito da humildade silenciosa. Revele os itens um a um.
  - Na frase final laranja: pause e deixe o silêncio agir.
- **Slide 6:** a distinção arrogância vs. autoridade. Explore os cards.

### `10:00–15:00` — Slides 7–8: Conceito + 5 Níveis

- **Slide 7:** apresente o método Se Amostramento Profissional.
  - Revele os 5 itens um a um, comentando brevemente cada um.
- **Slide 8:** os 5 níveis. Pergunte para a plateia: *"Em que nível vocês estão?"*
  - Peça que levantem a mão para cada nível.
  - Revele do Nível 1 ao 5, construindo a tensão até o Nível 5 (laranja).

### `15:00–18:00` — Slide 9: Reveal da nuvem de palavras

- Avance para o **Slide 9**.
- Frase sugerida: *"Agora vou mostrar o que a sala disse sobre si mesma."*
- Revele a nuvem. Destaque palavras repetidas. Comente algumas.
- *"Essas palavras são o começo de uma marca. Agora o trabalho é torná-las visíveis."*
- Revele o fragmento final (quote itálica).

### `18:00–22:00` — Slides 10–11: Essência + Ação prática

- **Slide 10:** a essência não pode ser negociada. Revele os itens.
  - No destaque laranja final: desacelere, fale devagar.
- **Slide 11:** ação prática. Revele os 5 verbos um a um.
  - No último (REPETIR): *"Esse é o segredo. Não é intensidade. É consistência."*

### `22:00–25:00` — Slide 12: História pessoal do Wladson

- **Slide 12:** conte a história pessoal. Revele os fragmentos no seu ritmo.
- Deixe o peso de cada item repousar antes de revelar o próximo.
- Termine com a byline discreta no rodapé.

### `25:00–27:00` — Slide 13: Encerramento

- **Slide 13:** a grande frase final. Leia devagar, com pausa entre as três linhas.
- Revele o fragmento laranja. Encerre com convicção.

### `27:00–30:00` — Slide 14: Sorteio + Apagamento dos dados

- **Slide 14:** mostre o número total de participantes.
- *"Vamos sortear. Esse sorteio é real — aconteceu aqui, ao vivo, com vocês."*
- Clique em **"🎯 Sortear ganhador"** — o nome aparece na tela.
- Anuncie o ganhador. Entregue o prêmio.
- *"E agora, assim como prometemos: vamos apagar os dados aqui na frente de todos."*
- Clique em **"🗑 Apagar todos os dados ao vivo"** — confirme.
- O contador vai a 0. *"Dados apagados. Transparência é a base de qualquer marca que vende."*

---

## 7. Cuidados Importantes

**Não revele a mecânica antes.** O sorteio tem mais impacto se a plateia não souber que os dados serão apagados ao vivo. Guarde essa revelação para o momento (Slide 14).

**Sortear de verdade.** O botão escolhe aleatoriamente entre os participantes reais. Não combine com ninguém antes. A credibilidade do ato é o ponto.

**Apagar ao vivo.** Esse gesto é intencional e simbólico. Fale sobre ele: *"Assim como sua marca, sua palavra fica na memória de quem estava aqui — mas os dados, não."*

**Deixe o contador visível.** Quando estiver no Slide 3 e o contador estiver subindo, fique nele por alguns segundos. O crescimento em tempo real é o melhor gancho de abertura.

**Tela cheia.** Antes de começar, pressione **F** para entrar em tela cheia. Isso elimina a barra do navegador do projetor.

**Wi-Fi no local.** Confirme que o notebook e a rede suportam o Firebase (sem bloqueio de firewall corporativo). Se possível, use dados do celular via hotspot como backup.

---

*Boa palestra. Mostre-se.*
