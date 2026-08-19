# Site Dani — Backend

API da ficha de avaliação/triagem e do portal administrativo.

## Fluxo

1. Paciente entra em contato pelo WhatsApp.
2. Dani/funcionária faz a triagem inicial e decide se deve enviar a ficha.
3. Paciente envia a ficha pelo site.
4. API valida e grava a ficha no PostgreSQL.
5. Dani/funcionária consultam as fichas no portal administrativo.
6. A decisão de aceitar ou não o atendimento continua sendo humana.
7. O agendamento continua sendo combinado pelo WhatsApp.

## API

- `GET /health`
- `POST /api/triage` — público
- `POST /api/admin/auth/login` — login administrativo
- `GET /api/admin/triage` — protegido; lista fichas
- `GET /api/admin/triage/:id` — protegido; consulta ficha completa
- `PATCH /api/admin/triage/:id/status` — protegido; altera status

## Status

`NEW` → `IN_REVIEW` → `ACCEPTED` ou `DECLINED` → `COMPLETED`

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

## Segurança inicial

- Dados da ficha não são registrados em logs da API.
- Endpoints administrativos exigem Bearer Token JWT com expiração de 8 horas.
- Login administrativo possui limite básico de tentativas por IP/e-mail.
- Helmet e CORS estão habilitados.
- Payload JSON possui limite de 100 KB.
- Validação de entrada é feita com Zod.
- Segredos ficam apenas em variáveis de ambiente.
- O endpoint de detalhe da ficha é protegido e só retorna dados completos após autenticação.

> A ficha contém dados pessoais e informações de saúde. Antes de produção, ainda precisamos finalizar gestão de usuários/perfis, políticas de retenção e exclusão, auditoria de acesso, revisão do consentimento/LGPD, backups e controles adicionais de infraestrutura.
