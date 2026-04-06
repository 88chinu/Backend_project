# Finance Backend — Access Control & Data Processing API

A RESTful backend for a finance dashboard system with role-based access control, financial record management, and aggregated analytics.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken) |
| Validation | express-validator |
| Password hashing | bcryptjs |

---

## Setup

### Prerequisites
- Node.js v18
- MongoDB running locally or a connection URI (e.g. MongoDB Atlas)

### Installation

```bash
# 1. Clone and install dependencies
npm install -y

# 2. Configure environment
cp .env.example .env
# Edit .env and set your MONGO_URI and JWT_SECRET

# 3. Seed the database with test users and records
npm run seed

# 4. Start the server
npm run dev       # development (nodemon)
npm start         # production
```

Server runs at `http://localhost:5000`.


## API Reference

All protected routes require the header:
```
Authorization: Bearer <token>
```

### Auth

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login and receive JWT |
| GET | `/api/auth/me` | Any authenticated | Get current user profile |

**Register body:**
```json
{
  "name": "Alice Admin",
  "email": "alice@example.com",
  "password": "password123",
  "role": "admin"
}
```

**Login body:**
```json
{
  "email": "alice@example.com",
  "password": "password123"
}
```

---

### Users

 GET - `/api/users`
 GET - `/api/users/:id` 
 PATCH - `/api/users/:id` 
 DELETE - `/api/users/:id` 

**Query params for GET /api/users:**
- `page`, `limit` — pagination
- `role` — filter by role (`viewer`, `analyst`, `admin`)
- `status` — filter by status (`active`, `inactive`)



**Query params for GET /api/records:**
- `page`, `limit`
- `type` — `income` or `expense`
- `category` — e.g. `salary`, `food`, `rent`
- `startDate`, `endDate` — ISO 8601 dates
- `search` — keyword search in notes

**Create/update record body:**
```json
{
  "amount": 85000,
  "type": "income",
  "category": "salary",
  "date": "2024-01-01",
  "notes": "January salary"
}
```

**Valid categories:**

Income: `salary`, `freelance`, `investment`, `rental`, `other_income`

Expense: `food`, `transport`, `utilities`, `healthcare`, `entertainment`, `shopping`, `education`, `rent`, `other_expense`

---

GET - /api/dashboard/summary → Fetches total income, expenses, and net balance

GET - /api/dashboard/categories → Retrieves totals grouped by category

GET - /api/dashboard/monthly?months=6 → Shows monthly income/expense trend for the last 6 months

GET - /api/dashboard/weekly → Provides week-by-week breakdown for the current month

GET - /api/dashboard/recent?limit=10 → Returns the 10 most recent records

---

## Project Structure

```
src/
├── config/
│   └── db.js               MongoDB connection
├── middleware/
│   ├── auth.js             JWT verify + role guard
│   └── error.js            Validation runner + global error handler
├── models/
│   ├── User.js             User schema
│   └── Record.js           Financial record schema (with soft delete)
├── routes/
│   ├── auth.js             /api/auth
│   ├── users.js            /api/users
│   ├── records.js          /api/records
│   └── dashboard.js        /api/dashboard
├── services/
│   ├── authService.js      Registration, login, JWT signing
│   ├── userService.js      User CRUD
│   ├── recordService.js    Record CRUD + filtering
│   └── analyticsService.js MongoDB aggregations for dashboard
├── utils/
│   └── seed.js             Test data seeder
└── index.js                Express app entry point
```

---

## Assumptions & Design Decisions

- **Role assignment on register:** The register endpoint accepts a `role` field. In a real system, only admins should be able to assign the admin role. For this assignment, it is left open for testing convenience.
- **Soft delete:** Records are soft-deleted (an `isDeleted` flag is set). They remain in the database but are excluded from all queries via a Mongoose pre-query hook. This allows for future restore functionality.
- **Viewer dashboard access:** Viewers can read financial records but cannot access aggregated analytics. This is a deliberate design choice to demonstrate layered access control.
- **Password field:** The `password` field uses `select: false` on the Mongoose schema so it is never accidentally returned in API responses.
- **Categories are enumerated:** This prevents inconsistent free-text entries and makes category-wise analytics reliable.
- **No refresh tokens:** JWT expiry is set to 7 days for simplicity. A production system would implement refresh tokens.

---

## Test Credentials (after running `npm run seed`)

| Role |           Email    | Password |
| Admin | admin@finance.com | password123 |
| Analyst | analyst@finance.com | password123 |
| Viewer | viewer@finance.com | password123 |
