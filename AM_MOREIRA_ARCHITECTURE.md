# AM Moreira — arquitetura da primeira versão

Aplicação Nuxt full-stack com website público e CMS no mesmo projeto. O website consome apenas a API pública; o CMS usa a API protegida. MongoDB é a fonte de verdade.

## Domínios

- `pages` e `contentBlocks`: páginas e construtor editorial.
- `products`, `categories` e `collections`: catálogo informativo, sem preço ou compra.
- `events`: feiras e eventos.
- `gallery` e `media`: biblioteca visual.
- `contacts`: pedidos recebidos e workflow comercial.
- `menus` e `settings`: navegação, rodapé, empresa e SEO global.
- `users`, `roles` e `auditLogs`: acesso, autorização e auditoria.

## Responsividade

Breakpoints de referência: 360, 430, 768, 1024, 1440 e 1920 px. O site é mobile-first. No CMS, tabelas passam a cartões abaixo de 768 px, a sidebar torna-se drawer e formulários passam a uma coluna.

## Segurança

Sessões assinadas, hash `scrypt`, permissões verificadas na API, validação e sanitização de payloads, limites de upload, rate limit no contacto, cabeçalhos de segurança e auditoria administrativa.

## Fora do âmbito

Carrinho, preços, checkout, pagamentos, encomendas, stock, contas de cliente e área B2B.
