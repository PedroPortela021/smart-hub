# smart-hub

Sistema básico de gerenciamento de estoque. O Next.js entrega a interface e as server actions. O Postgres fica fora da aplicação, configurado por `DATABASE_URL`.

## Requisitos

- Node.js 20+
- Docker

## Como rodar

```bash
npm install
cp .env.example .env
```

Gere um `AUTH_SECRET` longo e aleatório no `.env`. O banco de desenvolvimento sobe com:

```bash
docker compose up -d
npx prisma migrate dev
npx prisma db seed
npm run dev
```

O Postgres fica em `localhost:5432`, banco `estoque`, usuário e senha `estoque`. Os dados persistem no volume `estoque_pg`.

Abra `http://localhost:3000`.

## Usuário inicial

O seed cria um usuário administrador:

- E-mail: `admin@estoque.local`
- Senha: `admin123`

## Regras

- A quantidade do produto muda apenas por movimentação.
- Cadastro com quantidade inicial maior que zero gera uma entrada.
- Produto com movimentação não pode ser excluído.
- Saída acima do saldo é recusada.
