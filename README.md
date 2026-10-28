# Expense Tracker

A full-stack web application to manage and monitor personal finances — track inflows, outflows, and view transaction history grouped by month.

---

## Project Structure

```
Expense-Tracker/
├── frontend/        # Next.js UI (port 3000)
├── backend/         # Next.js API (port 3001)
└── Docker/          # docker-compose.yml
```

---

## Getting Started

### 1. Start the Database

```bash
cd Docker
docker compose up -d
```

This starts a PostgreSQL 16 container at `localhost:5432` with:
- Database: `expense_tracker`
- User: `your_username`
- Password: `your_password`

---

### 2. Set Up the Backend

```bash
cd backend
```

Copy the example env file and fill in your credentials:

```bash
cp .env.example .env
```

`.env` should look like:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=expense_tracker
DB_USER=postgres
DB_PASSWORD=postgres
```

Install dependencies:

```bash
npm install
```

Push the database schema (creates tables and enums):

```bash
npx drizzle-kit push
```

Start the backend server on port 3001:

```bash
npm run dev -- -p 3001
```

---

### 3. Set Up the Frontend

```bash
cd frontend
```

Copy the example env file:

```bash
cp .env.example .env.local
```

`.env.local` should look like:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Install dependencies:

```bash
npm install
```

Start the frontend server on port 3000:

```bash
npm run dev
```

---

### 4. Open the App

Visit [http://localhost:3000](http://localhost:3000)

---

## Stopping the App

Stop the frontend and backend with `Ctrl + C` in each terminal.

Stop the database:

```bash
cd Docker
docker compose down
```

To also remove the stored data:

```bash
docker compose down -v
```
