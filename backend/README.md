# AI Analytics Backend

This backend is designed to support the AI Analytics application with Prisma-powered persistence for users, organizations, uploads, products, and customers.

## Setup

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Generate Prisma client and run the migration:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   npm run seed
   ```

3. Start the server:
   ```bash
   npm run dev
   ```

## Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/organizations`
- `POST /api/uploads`
- `POST /api/products`
- `POST /api/customers`
- `GET /api/dashboard`
- `GET /api/analytics`
- `GET /api/forecasting`
- `GET /api/reports`
- `GET /api/ai`

## Prisma Models

The Prisma schema includes `User`, `Organization`, `Product`, `Customer`, and `Upload`.

