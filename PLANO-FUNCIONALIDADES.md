# Agency Sync — Plano de Funcionalidades do Sistema

> Documento para validação. O objetivo é confirmar **se os fluxos e funcionalidades abaixo correspondem ao dia a dia da agência** antes de desenvolvermos o sistema completo.
> As **decisões já confirmadas** estão marcadas com ✅.

---

## 1. O que é a plataforma

Um sistema único que conecta **três tipos de usuário** e organiza todo o ciclo de um trabalho de modelo — do primeiro contato da marca até o pagamento do cachê:

- **Agência** — administra tudo (modelos, marcas, castings, agenda e financeiro).
- **Marca / Cliente** — solicita modelos, acompanha e aprova candidatos.
- **Modelo** — recebe trabalhos, vê a agenda e acompanha pagamentos.

Cada um entra com seu próprio login e enxerga apenas o que lhe diz respeito.

---

## 2. Ponto-chave: um modelo pode ter VÁRIAS agências 🔑

Um modelo pode ser representado por **mais de uma agência ao mesmo tempo** — inclusive em **países diferentes** (ex.: São Paulo, Rio de Janeiro, Alemanha, França).

Como isso funciona no sistema (✅ confirmado):

- O modelo tem **uma única conta**, ligada a várias agências.
- A agência **convida o modelo por um link**; ele usa o link para criar o login.
- **O material/perfil é por agência:** o modelo envia suas fotos/medidas para cada agência, e cada agência trabalha com o que recebeu (não é um perfil único compartilhado).
- **A agenda é do modelo e o acompanha em qualquer lugar.** Quando uma agência marca um trabalho numa data, as **outras agências veem que ele está ocupado** naquele dia (sem ver os detalhes do trabalho), evitando marcação dupla.

---

## 2.1. Hierarquia das agências e a agenda do modelo 🔑

Nem toda agência tem o mesmo papel sobre um modelo. O sistema reconhece uma **agência base** (a agência principal onde o modelo está estabelecido, no local onde ele reside) e, opcionalmente, uma **mother agency** (agência-mãe que descobriu/desenvolve o modelo e o posiciona em outras agências, inclusive fora do país — ex.: uma agência de São Paulo que coloca o modelo em agências na Europa ou nos EUA).

Regras de agenda decorrentes dessa hierarquia (a confirmar ✅):

- **A agenda do modelo é prioritária à agência base** — a agência do local onde ele reside é a referência sobre disponibilidade real, viagens, compromissos e indisponibilidades.
- **Agência internacional sempre consulta a agência base antes de bookar.** Uma agência fora do país, ao querer agendar o modelo, **entra em contato com a agência base** para entender a agenda e apresentar as opções de datas — evitando conflito de datas e marcação dupla.
- **Mother agency e comissão sobre bookings no exterior.** Se o modelo foi posicionado por uma mother agency (ex.: São Paulo), essa agência-mãe **recebe comissão sobre os valores bookados pela agência internacional**.
  - **Comissão configurável:** por enquanto, **o percentual da comissão da mother agency é configurável** por vínculo/modelo (não fica fixo no sistema), permitindo ajustar caso a caso até definirmos uma regra padrão.
  - **Exceção:** se o modelo **já tinha uma agência fora do país antes** de fechar com a mother agency de SP, essa relação anterior é preservada e a mother agency não entra nessa comissão.
- **Independentemente da comissão**, a agência internacional **sempre consulta a agência principal onde o modelo reside** para acessar/entender a agenda e o trabalho, garantindo que não haja conflito de datas.
- **Exportação da agenda:** a agenda do modelo pode ser **exportada em Excel (.xlsx)** — útil para enviar/alinhar disponibilidade com agências parceiras e internacionais.

> No sistema, isso significa: cada vínculo modelo ↔ agência terá um **papel** (base / mother / internacional / representação local) e a agenda do modelo terá a **agência base como fonte de verdade da disponibilidade**, que as demais agências consultam antes de confirmar um trabalho.

---

## 3. O fluxo principal (passo a passo) ✅ confirmado

Este é o coração do sistema — o caminho de um casting:

1. **A marca solicita um trabalho pelo sistema**
   A marca preenche um formulário com: tipo de campanha, perfil de modelo desejado, data, local, duração e cachê oferecido.

2. **A agência recebe e analisa**
   O pedido cai no painel da agência. O booker analisa e seleciona, do banco de modelos, os perfis mais adequados.

3. **A agência envia os modelos para o casting**
   Os perfis selecionados (com fotos e composite) são enviados digitalmente para a marca avaliar.

4. **A marca aprova ou reprova cada modelo**
   A marca vê os portfólios e aprova/reprova candidato por candidato.

5. **Confirmação e briefing**
   Os modelos aprovados recebem automaticamente os detalhes do trabalho, briefing e contrato.

6. **Realização e pagamento**
   Após o trabalho, o financeiro registra o cachê, a comissão da agência e o repasse ao modelo, com controle de pago/pendente/atrasado.

**Status que um casting percorre:**
`Solicitado → Em análise → Modelos enviados → Em avaliação → Confirmado → Concluído`

---

## 4. O que cada perfil faz (permissões por papel)

> Papéis no sistema (nomes em inglês): **`AGENCY`**, **`MODEL`**, **`BRAND`** (marca/cliente) e, futuramente, papéis de **funcionários da agência** (ex.: `ADMIN`, `BOOKER`, `SCOUT`, `FINANCE`) — escopo desses ainda **a definir**.
> Legenda: ✅ já implementado · 🔜 a fazer.

### 4.1 Agência (`AGENCY`) — acesso a praticamente todas as telas
- **Dashboard** com indicadores e gráficos. ✅
- **Modelos:** cadastrar/gerenciar ficha completa, **foto principal + galeria (book)** com compressão no cliente. ✅ Gerar **link de convite** para o modelo criar o próprio login. ✅
- **Castings:** criar, acompanhar status (**editável direto na lista/kanban**), enviar/**escalar modelos**, gerenciar avaliação. ✅
- **Marcas:** cadastro completo com **dados fiscais (CNPJ, razão social, endereço + busca de CEP)** para NF, e histórico. ✅ (histórico de campanhas 🔜)
- **Agenda/Calendário:** criar e **editar** eventos (castings, trabalhos, reuniões, produções); export em Excel. ✅ (calendário consolidado editável 🔜)
- **Financeiro:** cachês, comissões e repasses com status de pagamento ✅; **lançar despesas** (custos da agência). ✅
- **Configurações** da agência/conta. ✅
- **Equipe:** **múltiplos logins por agência com papéis e acessos diferentes** (RBAC). 🔜 (**Fase 1 da monetização — ver seção 9**)

### 4.2 Marca (`BRAND`)
- Solicitar um novo trabalho pelo sistema. ✅
- Acompanhar o andamento do pedido. ✅
- Ver os modelos enviados e **aprovar/reprovar** cada candidato. ✅
- Explorar modelos e histórico de campanhas. ✅ (explorar ✅; histórico 🔜)

### 4.3 Modelo (`MODEL`)  — **área mobile-first** (tab bar no rodapé; rumo a app)
- Criar a conta pelo **link de convite** da agência. ✅
- **Confirmar presença nos castings** que a agência enviar ("Meus Castings"). ✅
- **Agenda em calendário** mostrando **Casting** (presença confirmada pelo modelo) e **Trabalho** (modelo aprovado pela marca), com modal por dia e confirmar/recusar. ✅ Export em Excel. ✅
- Ver as **próprias finanças:** nº de trabalhos, **total líquido recebido**, **histórico** e **valor das comissões**. ✅
- **Bloquear dias** (indisponibilidade): backend suporta `indisponivel`; UI saiu da agenda na virada para calendário — **a reavaliar**. 🔜
- Enviar/atualizar seu material (fotos, medidas) para cada agência. 🔜

> **Casting ≠ Trabalho:** o casting é o **teste**; o modelo **confirma presença** no casting; quem **aprova o modelo para o trabalho é a marca**. Só então vira trabalho (na agenda, dourado).

### 4.4 Notas Fiscais
- **Emissão de NF** disponível como parte do **plano Pro do modelo** (e para a agência), via provedor de NFS-e. 🔜 (**Fase 2 da monetização — ver seção 9**)

---

## 5. Regras de negócio confirmadas ✅

- **Comissão da agência: 20% fixo** para todas as agências (repasse de 80% ao modelo).
- **Login por convite:** o modelo entra a partir de um link enviado pela agência.
- **Disponibilidade compartilhada:** as agências enxergam os dias ocupados do modelo (sem detalhes), para evitar conflito.
- **Agenda prioritária da agência base:** a agência do local onde o modelo reside é a fonte de verdade da disponibilidade; toda agência internacional consulta essa agência base antes de bookar (ver seção 2.1).
- **Papel do vínculo modelo ↔ agência:** cada vínculo identifica o papel da agência (base / mother / internacional / representação local), determinando quem consulta quem e como se aplica a comissão da mother agency em bookings no exterior.
- **Comissão da mother agency configurável:** percentual definido por vínculo/modelo (não fixo) — diferente dos 20% padrão da agência.
- **Exportação da agenda em Excel (.xlsx):** disponível para alinhar disponibilidade com agências parceiras/internacionais.

---

## 6. Notificações, contratos e idiomas ✅

- **Notificações:** por **WhatsApp e e-mail**, a cada etapa (novo pedido, modelos enviados, aprovação, confirmação, pagamento).
- **Contratos:** o sistema **gera o documento em PDF** (sem assinatura digital nesta fase).
- **Idiomas:** **português e inglês** (PT/EN).
- **Moedas:** padrão **Real (R$)** no Brasil; em trabalhos **internacionais a agência informa a moeda** (predominantemente **Dólar US$**, podendo ser **Euro €** na Europa).

---

## 7. O que muda do que já existe hoje

Hoje existe a **interface navegável** (todas as telas desenhadas), porém com **dados fictícios** — nada é salvo e ainda não há login real. Para virar um sistema funcional, será desenvolvido:

1. **Banco de dados** — guardar de verdade modelos, agências, castings, marcas, pagamentos.
2. **Login e permissões** — cada usuário com seu acesso e visão própria, incluindo o vínculo modelo ↔ várias agências.
3. **Backend (servidor)** — a lógica que conecta tudo e faz os fluxos funcionarem.
4. **Formulários e ações reais** — solicitar casting, aprovar modelo, registrar pagamento passam a funcionar de fato.
5. **Notificações (WhatsApp/e-mail), uploads de fotos/documentos e geração de PDF.**

---

## 8. Entrega em fases

**Fases de produto já entregues:**

| Fase | Entrega | Status |
|------|---------|--------|
| **1 — Base** | Login único + papéis (AGENCY/MODEL/BRAND), banco, agências, modelos (multi-agência), marcas, agenda + export Excel | ✅ feito |
| **2 — Casting** | Fluxo completo (solicitar → enviar → aprovar → confirmar) nas telas da agência e do cliente | ✅ feito |
| **3 — Financeiro** | Cachês/comissão/repasses, status de pagamento, multi-moeda, gráficos por mês | ✅ feito |
| **Hardening auth** | JWT por requisição + autorização por papel | ✅ feito |
| **4 — Capacidades do Modelo** | Convite; **agenda em calendário** (casting/trabalho); **confirmar presença**; próprias finanças; **área mobile-first** | ✅ feito |
| **5 — Capacidades extra da Agência** | Convite de modelo; **despesas**; **configurações**; cadastro de marca com **dados fiscais + CEP**; **fotos/galeria do modelo**; status de casting editável na lista/kanban | ✅ feito |
| **6 — Portais externos** | Notificações (e-mail iniciado; **WhatsApp** 🔜) + contratos em **PDF** 🔜 | 🟡 parcial |

**Roadmap de monetização (ver seção 9):**

| Fase | Entrega | Status |
|------|---------|--------|
| **M1 — Agência: RBAC + Assinatura** | Múltiplos logins por agência com **papéis/acessos** (ADMIN/BOOKER/SCOUT/FINANCE) + **billing de assinatura** (faixa de seats) | 🔜 **PRÓXIMA** |
| **M2 — Modelo Pro + NF** | Plano **Pro** opcional do modelo com **emissão de NF** (provedor NFS-e); NF também p/ agência | 🔜 |
| **M3 — Vitrine de Talentos + Boost** | Scouting aberto: perfis auto-listados, agências navegam, **boost pago**; **verificar agências** e **proteger menores** | 🔜 futuro |
| **Extras** | Internacional PT/EN, relatórios, refinamentos | 🔜 |

---

## 9. Modelo de negócio e monetização (decidido em 2026-06-26)

Quem é o cliente pagante e por quê:

| Lado | Cobrança | Racional |
|------|----------|----------|
| **Marca** | **Grátis** | Lado da demanda — maximiza o volume de castings, que é o valor que sustenta a assinatura da agência. |
| **Agência** | **Assinatura mensal multi-seat** | Lado que extrai o valor operacional (CRM, agenda, financeiro). Cobrar **por faixa de logins** (nº de funcionários ≈ tamanho ≈ capacidade de pagar). |
| **Modelo** | **Grátis** + **Pro** opcional | App grátis garante adesão/retenção; quem quiser **NF** assina o **Pro**. NF é **add-on de valor**, não mensalidade forçada a todos. |
| **Talentos (futuro)** | Grátis p/ postar + **boost pago** | Aspirantes se listam; pagam para **impulsionar visibilidade** às agências. |

**Roadmap de monetização em fases:**

1. **Fase 1 — Agência: RBAC + Assinatura.** Vários usuários por agência com **papéis e escopo de acesso** (ADMIN/BOOKER/SCOUT/FINANCE) e **billing de assinatura** por faixa de seats. É o **pré-requisito** da própria assinatura e da futura verificação de agências. → **próxima a desenvolver.**
2. **Fase 2 — Modelo Pro + NF.** Plano Pro do modelo incluindo **emissão de NF** via **provedor de NFS-e** (Focus NFe / eNotas / PlugNotas / NFe.io). Validar antes se é o modelo ou a agência quem emite a nota no fluxo real.
3. **Fase 3 — Vitrine de talentos + boost (futuro).** Produto separado do "modelo gerenciado": perfis de scouting auto-listados, agências navegam, **boost pago** para mais visibilidade. **Requisitos inegociáveis:** verificar agências, proteger menores (gate de idade/consentimento), e **boost como desempate dentro da relevância** (não furar a fila).

**Princípios:** não cobrar da marca (subsidiar a demanda); não cobrar mensalidade fixa de NF de todo modelo (renda esporádica → churn); concentrar a receita-base na **agência**; sequenciar as frentes de cobrança (M1 → M2 → M3) para não acumular complexidade de billing.

> Atenção a app store: assinatura digital vendida dentro de app iOS/Android sofre taxa de 15–30% — considerar no preço do Pro.

---

## 10. Pendências para alinhar

- Validar se o fluxo e as regras acima refletem 100% a operação da agência.
- Definir prazos e investimento por fase.
- **Definir o escopo de permissões por papel da agência** (o que ADMIN/BOOKER/SCOUT/FINANCE veem e podem fazer) — entra na Fase 1 da monetização.

---

*Documento de escopo — Agency Sync. Atualizado conforme validação. Sujeito a ajustes.*
