# Site Dani — Backend

API da ficha de avaliação/triagem e do portal administrativo.

## Fluxo

1. Paciente entra em contato pelo WhatsApp.
2. Dani/funcionária faz a triagem inicial e decide se deve enviar a ficha.
3. Paciente envia a ficha pelo site.
4. API valida e grava a ficha no PostgreSQL.
5. Dani/funcionária consultam as fichas no portal administrativo.
6. A decisão de aceitar ou não o atendimento continua sendo humana.
7. Fichas que saem do fluxo ativo podem ser arquivadas sem exclusão dos dados.
8. O agendamento continua sendo combinado pelo WhatsApp.

## API

- `GET /health`
- `POST /api/triage` — público
- `POST /api/admin/auth/login` — login administrativo
- `GET /api/admin/auth/me` — revalida a sessão administrativa
- `POST /api/admin/auth/logout` — encerra a sessão administrativa
- `GET /api/admin/triage` — protegido; lista fichas ativas
- `GET /api/admin/triage/archive` — protegido; lista fichas arquivadas
- `GET /api/admin/triage/:id` — protegido; consulta ficha completa
- `PATCH /api/admin/triage/:id/status` — protegido; altera status
- `PATCH /api/admin/triage/:id/archive` — ADMIN; arquiva ficha
- `PATCH /api/admin/triage/:id/restore` — ADMIN; restaura ficha arquivada

## Status

`NEW` → `IN_REVIEW` → `ACCEPTED` ou `DECLINED` → `COMPLETED`

O arquivamento é independente do status e é controlado pelo campo `archivedAt`.

## Desenvolvimento local

```bash
cd backend
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run dev
```

No Windows, copie `.env.example` para `.env` manualmente se o comando `cp` não estiver disponível.

## Variáveis obrigatórias

- `DATABASE_URL`
- `JWT_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `CORS_ORIGIN`
- `PORT` (opcional; padrão 4000)

Use segredos fortes e diferentes em produção. Nunca versione o arquivo `.env`.

## Migrations em produção

Migrations já versionadas devem ser aplicadas com:

```bash
npm run prisma:deploy
```

Esse comando executa `prisma migrate deploy`, que aplica somente migrations pendentes e não cria uma nova migration.

Antes de publicar uma versão que dependa de uma nova coluna ou tabela, aplique as migrations no banco de produção e depois valide:

```bash
npm run prisma:generate
npm run typecheck
npm run build
```

A migration `20260821211118_add_triage_archive` adiciona `archivedAt` e o índice usado pelo Arquivo administrativo.

## Segurança e governança

- Dados da ficha não são registrados em logs da API.
- A sessão administrativa usa cookie HttpOnly; o backend também mantém compatibilidade com Bearer Token quando necessário.
- Login administrativo possui limite básico de tentativas por IP/e-mail.
- Helmet e CORS estão habilitados.
- Payload JSON possui limite de 100 KB.
- Validação de entrada é feita com Zod.
- Segredos ficam apenas em variáveis de ambiente.
- O endpoint de detalhe da ficha é protegido e registra auditoria de leitura.
- Alterações de status, observações internas, arquivamento e restauração são auditadas.
- Fichas arquivadas permanecem preservadas no histórico e não participam da listagem ativa.

> A ficha contém dados pessoais e informações de saúde. A decisão atual do consultório é preservar o histórico das fichas por meio de arquivamento, sem rotina automática de anonimização ou exclusão. Política de privacidade, base legal, controle de acesso, backups e procedimentos de atendimento a solicitações dos titulares devem permanecer documentados e revisados para produção.
