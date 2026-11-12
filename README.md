# Arena Gamer

Sistema web de gerenciamento de uma arena gamer.

## Estrutura

- `api`: backend Express + Prisma + PostgreSQL
- `frontend`: React + Vite + TypeScript
- `shared`: tipos compartilhados

## Requisitos

- Node.js 20+
- Docker
- PostgreSQL via Docker

## Instalação

```bash
npm install
cp api/.env.example api/.env
docker compose up -d
cd api
npx prisma generate
npx prisma db push
npx prisma db seed
cd ..
```

## Desenvolvimento

Terminal 1:

```bash
npm run dev:api
```

Terminal 2:

```bash
npm run dev:frontend
```

Frontend: http://localhost:5173

API: http://localhost:3000

## Login inicial

- E-mail: `admin@arenagamer.com`
- Senha: `admin123`
