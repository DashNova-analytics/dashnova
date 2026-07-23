# AI Analytics Backend

This backend is designed to support the AI Analytics application with MongoDB persistence for users, organizations, uploads, products, and customers.

## Setup

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Configure MongoDB:
   - Set `MONGODB_URI` in `backend/.env`
   - Example: `mongodb://localhost:27017/ai-analytics`

3. Seed the database:
   ```bash
   npm run seed
   ```

4. Start the server:
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

