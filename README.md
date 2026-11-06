# smart-hub

Sistema de estoque para cadastrar produtos de informática, lançar entradas e saídas e acompanhar o saldo em um dashboard. A interface e o servidor ficam no mesmo projeto Next.js. O Postgres roda à parte e é configurado pela `DATABASE_URL`.

## Status

O projeto está em desenvolvimento ativo. Estamos trabalhando em novas funcionalidades, correções de bugs e melhorias.

## Telas

| Rota | Função |
| --- | --- |
| `/login` | Entrada com e-mail e senha, sem o menu |
| `/dashboard` | Totais, valor em estoque, itens no mínimo e últimas movimentações |
| `/produtos` | Busca, cadastro, edição e exclusão |
| `/movimentacoes` | Entrada, saída e histórico com filtro por produto e período |

Depois do login, o menu fica fixo à esquerda: Dashboard, Produtos, Movimentações e Sair. O tema é somente claro.

## Stack

- Next.js (App Router) e TypeScript
- Tailwind CSS e shadcn/ui
- Auth.js com e-mail e senha, sessão em JWT
- Prisma e PostgreSQL 16
- Docker Compose para o banco local

## Regras

- A quantidade do produto só muda por movimentação. A edição altera nome, SKU, preço e estoque mínimo.
- Quantidade inicial maior que zero gera uma entrada no mesmo lançamento. Quantidade zero não gera histórico.
- Produto com movimentação não pode ser excluído.
- Saída maior que o saldo é recusada. O saldo nunca fica negativo.
- Movimentação registrada não é editada nem apagada.

## Requisitos

- Node.js 20 ou superior
- Docker

## Como rodar

```bash
npm install
cp .env.example .env
openssl rand -base64 32
```

Cole o valor gerado em `AUTH_SECRET` no `.env`. A `DATABASE_URL` de exemplo já aponta para o Postgres do Compose.

```bash
npm run db:up
npm run db:migrate
npm run db:seed
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

| Acesso | Valor |
| --- | --- |
| E-mail | `admin@estoque.local` |
| Senha | `admin123` |
| Host | `localhost:5432` |
| Banco | `estoque` |
| Usuário e senha do banco | `estoque` |

Os dados do Postgres ficam no volume `estoque_pg`. `npm run db:down` para o container e preserva o volume.

## Seed

`npm run db:seed` recria o catálogo e mantém o administrador. São 28 produtos de informática (notebooks, monitores, periféricos, armazenamento, memória, rede, impressão e peças) e as movimentações que explicam o saldo de cada um. Parte do catálogo fica no mínimo ou abaixo, para o dashboard ter o que mostrar.

Rodar a seed de novo apaga produtos e movimentações anteriores e grava esse catálogo outra vez.

## Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Sobe a aplicação em desenvolvimento |
| `npm run build` | Gera a versão de produção |
| `npm run start` | Sobe a versão gerada |
| `npm run lint` | Roda o ESLint |
| `npm run db:up` | Sobe o Postgres |
| `npm run db:down` | Para o Postgres |
| `npm run db:migrate` | Aplica as migrações do Prisma |
| `npm run db:seed` | Grava o usuário e o catálogo |

## Variáveis

| Variável | Uso |
| --- | --- |
| `DATABASE_URL` | Conexão do Postgres |
| `AUTH_SECRET` | Segredo da sessão. Troque o valor de exemplo antes de publicar |

O arquivo `.env` não entra no Git. O `.env.example` só guarda o formato.

## Estrutura

```text
app/
  login/                  tela de acesso
  (app)/                  dashboard, produtos e movimentações
  api/auth/               rotas do Auth.js
actions/                  cadastro, edição, exclusão e movimentação
components/               menu, formulários e componentes de interface
lib/                      Prisma, autenticação e validação
prisma/                   schema, migração e seed
docker-compose.yml        Postgres local
proxy.ts                  protege as rotas autenticadas
```
