# Site Dani — Backend

API inicial para a ficha de avaliação/triagem e portal administrativo.

## Fluxo

1. Paciente entra em contato pelo WhatsApp.
2. Dani/funcionária decide se deve enviar a ficha.
3. Paciente envia a ficha pelo site.
4. API grava a ficha no PostgreSQL.
5. Funcionária/Dani consultam as fichas no portal administrativo.
6. A decisão de aceitar ou não o atendimento continua sendo humana.

## API inicial

- `GET /health`
- `POST /api/triage`
- `POST /api/admin/auth/login`
- `GET /api/admin/triage` — protegido
- `PATCH /api/admin/triage/:id/status` — protegido

## Status da triagem

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

## Segurança

- Dados da ficha não são registrados em logs da API.
- Endpoints administrativos exigem Bearer Token.
- Helmet e CORS estão habilitados.
- Payload JSON possui limite de 100 KB.
- Validação de entrada é feita com Zod.
- Segredos ficam apenas em variáveis de ambiente.

> A ficha contém dados pessoais e informações de saúde. Antes de produção, precisamos finalizar autenticação/gestão de usuários, políticas de retenção, auditoria, consentimento/LGPD, backups e proteção adicional de acesso.
