# AM Moreira — website institucional + CMS

Projeto Nuxt full-stack, mobile-first, com website público, CMS responsivo em `/admin`, API Nitro e MongoDB. Não contém e-commerce.

## Instalação

```bash
npm install
npm run mongo:setup
npm run dev
```

O ficheiro `.env` já aponta para a base exclusiva `ammoreira`. O backend executa um bootstrap idempotente na primeira ligação: se a base ainda não existir, cria as coleções, índices, dados iniciais e o administrador. `npm run mongo:setup` permite executar antecipadamente o mesmo processo.

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
- `editor`: criação e edição editorial.
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
