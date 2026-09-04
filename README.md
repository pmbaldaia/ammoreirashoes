# AM Moreira — website institucional + CMS

Projeto Nuxt full-stack, mobile-first, com website público, CMS responsivo em `/admin`, API Nitro e MongoDB. Não contém e-commerce.

## Instalação

```bash
npm install
npm run mongo:setup
npm run mongo:sync

## Instalação local

O projeto fixa o Nuxt em `3.19.3` para evitar a regressão do alias interno `#app-manifest` presente nas versões 3.20+.

```bash
npm run clean
npm ci
npm run dev
```

Se o teu gestor bloquear scripts de instalação, aprova apenas `esbuild` e `sharp` antes de iniciar o projeto. `fsevents` é opcional no macOS.
npm run dev
```

O ficheiro `.env` aponta para a base exclusiva `ammoreira`. A aplicação nunca cria nem repõe conteúdo automaticamente em execução. A preparação inicial da base é uma ação explícita através de `npm run mongo:setup`; não executes `npm run mongo:sync` numa base que já esteja a ser gerida pelo CMS, pois esse comando destina-se apenas à sincronização manual de dados de exemplo.

O MongoDB só materializa a base quando é criado o primeiro documento; por isso a criação é feita através dos dados e configurações iniciais da AM Moreira.

## Áreas

- Website: `/`
- CMS: `/admin`
- Login: `/admin/login`
- Estado MongoDB: `/api/health`

## Conteúdo gerido

Páginas, blocos, produtos, categorias, coleções, feiras/eventos, galeria, media, contactos, menus, empresa/SEO, utilizadores e auditoria.

O website público não lê conteúdo institucional de ficheiros locais. Navegação, cabeçalho, páginas, secções, footer, contactos, assuntos do formulário e SEO são carregados da API e persistidos no MongoDB. Os ficheiros locais contêm apenas componentes de apresentação e assets da identidade.

## Perfis

- `admin`: acesso total, utilizadores e eliminação.
- `viewer`: criação e edição de conteúdos.
- `commercial`: contactos e acompanhamento comercial.

Todas as permissões são verificadas na API. A interface não é a fonte de autorização.
As contas do CMS são lidas e gravadas exclusivamente na coleção MongoDB `users`; passwords são persistidas apenas como hash.

## Dados iniciais

`server/backend/core/seed-data.mjs` contém apenas informação factual retirada dos materiais fornecidos: marca, telefones, presença regional, Instagram, categorias e navegação. História, fabrico, produtos e eventos ficam vazios até validação pela AM Moreira.

## Media

Uploads são guardados em MongoDB GridFS e servidos por `/uploads/:id`. Preencher sempre título e texto alternativo. São suportadas imagens responsivas e lazy loading no website.

## Testes recomendados

Validar 360, 430, 768, 1024, 1440 e 1920 px, incluindo menu, formulários, tabelas/cartões, modais, biblioteca de media e construtor de blocos. Executar `npm run build` antes de publicar.

Consultar `AM_MOREIRA_ARCHITECTURE.md` para a arquitetura e os limites da primeira versão.
# AM Moreira — Netlify

## Publicação no Netlify

O projeto já está preparado para SSR no Netlify. Mantém o comando de build `npm run build` e a pasta de publicação `dist`; o adaptador Nitro cria automaticamente a função SSR em `.netlify/functions-internal` durante o build.

Antes do primeiro deploy, adiciona estas variáveis em **Site configuration → Environment variables**, tanto em **Production** como em **Deploy Previews** quando aplicável:

| Variável | Obrigatória | Finalidade |
| --- | --- | --- |
| `MONGODB_URI` | Sim | Ligação ao MongoDB Atlas. O cluster tem de aceitar ligações provenientes do Netlify. |
| `MONGODB_DB` | Sim | Base de dados, normalmente `ammoreira`. |
| `NUXT_SITE_URL` | Sim | URL pública final, sem `/` no fim. É usada no link de recuperação. |
| `RESEND_API_KEY` | Sim | Chave da API Resend para envio dos e-mails de recuperação. |
| `RESEND_FROM` | Sim | Remetente num domínio verificado no Resend, por exemplo `AM Moreira <no-reply@dominio.pt>`. |

Sem estas variáveis, a API não consegue consultar o CMS/MongoDB e o envio de recuperação de palavra-passe não pode ser concluído.
