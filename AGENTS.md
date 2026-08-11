# Sobre o projeto

Este projeto é um cardápio online responsivo para um estabelecimento.

Na versão atual, o objetivo principal é apresentar os produtos, categorias, descrições e preços.

No futuro, o projeto poderá evoluir para incluir pedidos online e outras funcionalidades.

## Contexto técnico verificado

- Framework e interface: React 19 com APIs compatíveis com Next.js App Router.
- Build e desenvolvimento: Vite 8 por meio do `vinext`.
- Linguagem: TypeScript em modo estrito.
- Estilos: Tailwind CSS 4, importado em `app/globals.css`.
- Runtime de hospedagem: saída ESM compatível com Cloudflare Workers.
- Persistência: Drizzle e Cloudflare D1 estão preparados, mas inativos na versão atual.
- Gerenciador de pacotes: npm. Preserve `package-lock.json`.
- Versão mínima do Node.js: 22.13.0.

## Comandos reais do projeto

- Instalar exatamente as dependências do lockfile: `npm ci`
- Iniciar o ambiente de desenvolvimento: `npm run dev`
- Gerar o build de produção: `npm run build`
- Executar os testes: `npm test`
- Executar a análise estática: `npm run lint`

O script `npm run dev` executa `vinext dev`. Na configuração atual, o servidor local usa normalmente `http://localhost:3000`, mas o agente deve conferir a URL exibida pelo processo ao iniciar.

## Estrutura do projeto

- `app/`: entrada da aplicação, layout, metadados e estilos globais.
- `src/config/`: informações estáticas do estabelecimento.
- `src/domain/`: tipos e contratos de negócio.
- `src/data/`: dados locais e implementações de repositórios.
- `src/features/`: casos de uso e componentes específicos de cada funcionalidade.
- `src/shared/`: componentes e utilitários reutilizáveis.
- `public/`: assets públicos, logo e imagens de produtos.
- `tests/`: testes automatizados do HTML renderizado e dos comportamentos essenciais.
- `db/` e `drizzle/`: base opcional para uma futura persistência.
- `worker/`, `build/` e `.openai/`: integração existente com Cloudflare e Sites; não substituir sem autorização.

Os dados do cardápio ficam em `src/data/menu/menu.data.ts`. Os contratos ficam em `src/domain/menu/menu.types.ts`. Os componentes do cardápio ficam em `src/features/menu/components/`.

# Regras para agentes

- Sempre analisar o código existente antes de modificar.
- Nunca recriar o projeto do zero sem autorização.
- Preservar a identidade visual existente.
- Não alterar nomes, preços, produtos ou categorias sem autorização.
- Não remover funcionalidades existentes.
- Manter compatibilidade com desktop e mobile.
- Priorizar componentes reutilizáveis.
- Evitar duplicação de código.
- Não instalar dependências desnecessárias.
- Não trocar framework, bundler ou gerenciador de pacotes sem autorização.
- Manter a estrutura simples e organizada.
- Não modificar vários arquivos sem necessidade.
- Preservar mudanças locais e o histórico Git existente. Nunca descartar trabalho não relacionado.
- Não publicar, enviar código para repositórios remotos ou alterar acesso sem autorização explícita.
- Antes de finalizar uma tarefa, verificar se o projeto continua compilando.
- Corrigir erros introduzidos pela própria alteração antes de finalizar.
- Informar ao usuário quais arquivos foram modificados.

# Imagens

As imagens dos produtos devem ficar organizadas dentro de:

`public/images/`

Quando necessário, criar subpastas correspondentes às categorias reais existentes no cardápio, usando nomes estáveis e descritivos, por exemplo `public/images/cervejas/`.

Os caminhos das imagens devem ser declarados no arquivo de dados do cardápio. Não espalhar caminhos diretamente pelos componentes.

Os componentes não devem depender de URLs externas aleatórias para imagens importantes do cardápio. Preferir WebP ou outro formato otimizado, dimensões consistentes e texto alternativo adequado.

# Git e segurança

- O repositório Git já existe na branch `main`; não executar `git init` novamente.
- Preservar commits e mudanças locais existentes.
- Dependências, builds, caches, logs locais e arquivos de ambiente devem continuar ignorados pelo Git.
- Nunca imprimir, copiar, alterar ou versionar tokens, senhas, chaves ou outras credenciais.
- Arquivos `.env` reais não devem ser versionados. Um eventual `.env.example` deve conter somente nomes de variáveis e valores fictícios.

# Checklist antes de finalizar

1. Confirmar que a alteração ficou restrita ao pedido do usuário.
2. Conferir `git diff` e preservar mudanças não relacionadas.
3. Executar ao menos `npm run build` após mudanças de código ou configuração.
4. Executar os testes relevantes quando aplicável.
5. Informar arquivos criados e modificados, validações executadas e qualquer limitação encontrada.
