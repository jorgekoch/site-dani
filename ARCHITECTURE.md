# Site Danielle Evangelista — arquitetura inicial

## Direção do produto

O projeto será mais do que um site institucional: será a porta de entrada para a jornada digital do paciente, mantendo uma identidade visual dark, elegante, humana e autoral.

Fluxo previsto:

`Site → Agendamento → Ficha de avaliação → Consulta → Pós-consulta → Feedback → Google`

## Portal administrativo

O painel será construído com dois perfis desde o início:

### ADMIN — Danielle
- acesso completo ao painel;
- configurações da clínica;
- gestão de usuários da equipe;
- agenda e disponibilidade;
- pacientes e histórico;
- avaliações e documentos;
- relatórios e configurações futuras.

### ASSISTANT — Funcionária da clínica
- visualizar e criar agendamentos;
- remarcar/cancelar consultas conforme permissões;
- cadastrar e atualizar dados cadastrais do paciente;
- acompanhar fichas pendentes;
- acessar as informações necessárias para o atendimento administrativo;
- enviar lembretes e orientações;
- acompanhar feedbacks.

O perfil de assistente não deve receber automaticamente permissões administrativas ou acesso irrestrito a dados clínicos. As permissões serão definidas por recurso quando o backend for implementado.

## Privacidade e segurança

A ficha de avaliação poderá conter dados pessoais sensíveis. Por isso, o backend deve nascer com autenticação, autorização por função, armazenamento privado, validação de uploads, logs e políticas de retenção/exclusão. Dados clínicos não devem ser expostos em URLs públicas nem incluídos desnecessariamente em mensagens de e-mail/WhatsApp.

## Próxima etapa técnica

1. Definir serviços e regras de agenda.
2. Modelar PostgreSQL.
3. Criar API Node.js + Express + TypeScript.
4. Implementar autenticação e RBAC (`ADMIN`, `ASSISTANT`).
5. Implementar agenda.
6. Implementar ficha de avaliação em etapas.
7. Implementar painel administrativo.
8. Integrar notificações.
9. Implementar fluxo pós-consulta.

A implementação do backend deve aguardar as orientações finais da clínica sobre agenda, serviços, perguntas da ficha, canais de comunicação e regras operacionais.
