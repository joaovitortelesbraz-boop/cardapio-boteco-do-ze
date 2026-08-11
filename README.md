# Boteco do Zé — cardápio online

Primeira versão de um cardápio online responsivo. O foco atual é somente consulta: categorias, produtos e preços. Pedidos, autenticação, painel administrativo e persistência ainda não fazem parte do escopo.

## Stack

- Vite (via vinext) para desenvolvimento e build
- React 19 com renderização no servidor e ilhas interativas
- TypeScript em modo estrito
- Tailwind CSS 4
- Saída ESM compatível com Cloudflare Workers
- npm com `package-lock.json`

## Estrutura

```text
app/                              # entrada da aplicação e estilos globais
src/
  config/                         # informações estáticas do estabelecimento
  domain/menu/                    # tipos e contratos de negócio
  data/menu/                      # dados locais e implementação do repositório
  features/menu/application/      # caso de uso que prepara os dados da tela
  features/menu/components/       # componentes específicos do cardápio
  shared/components/              # componentes reaproveitáveis
  shared/lib/                     # utilitários sem dependência de interface
public/images/                    # imagens locais organizadas por categoria
tests/                            # testes do HTML renderizado e regras essenciais
db/ e drizzle/                    # preparação inativa para persistência futura
worker/ e build/                  # integração existente com Cloudflare/Sites
```

O componente da página não conhece a origem dos dados. Hoje ele usa um repositório local; futuramente, uma implementação para API ou banco de dados pode ocupar o mesmo contrato sem alterar os cards e filtros.

## Rodando localmente

Requer Node.js `>=22.13.0`.

```bash
npm ci
npm run dev
```

Para validar uma versão de produção:

```bash
npm run build
```

Outros comandos disponíveis:

```bash
npm test
npm run lint
```

## Próximas evoluções sugeridas

1. Criar casos de uso de carrinho e pedido sem acoplar regras aos componentes.
2. Adicionar uma implementação persistente de `MenuRepository` e novos repositórios para pedidos.
3. Proteger rotas administrativas e separar permissões de atendente e administrador.
4. Criar o painel para categorias, produtos, preços, disponibilidade e imagens.
5. Adicionar testes de domínio, componentes e fluxos críticos antes de liberar pedidos reais.

As integrações de banco e armazenamento estão intencionalmente inativas em `.openai/hosting.json` até que exista uma necessidade real de persistência.

## Identidade visual

A interface usa a arte oficial em `public/logo-boteco-do-ze.png`. Os tokens de cor em `app/globals.css` derivam da própria marca: preto, madeira escura, dourado/âmbar e creme. Isso mantém cabeçalho, hero, filtros, cards e rodapé na mesma linguagem visual.

Informações permanentes do estabelecimento — horário, Instagram e frases da casa — ficam centralizadas em `src/config/venue.ts` para evitar textos divergentes entre as áreas da página.

## Fotos das cervejas

Coloque as fotos reais em `public/images/cervejas/`. Prefira imagens quadradas em WebP, com pelo menos 640 × 640 px. Depois, altere apenas o campo `imageUrl` da cerveja correspondente em `src/data/menu/menu.data.ts`; o componente não precisa ser modificado.

Enquanto as fotos reais não estiverem disponíveis, todos os cards de cerveja usam o placeholder local otimizado `public/images/cervejas/placeholder-cerveja.webp`.
