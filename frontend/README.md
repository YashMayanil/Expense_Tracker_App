# Spendly — Expense Tracker Frontend

A modern React frontend for the Expense Tracker backend.

## Tech Stack

- **React 18** + **React Router v6**
- **Axios** for API calls (with proxy to backend)
- **Recharts** for charts (area + pie)
- **React Hot Toast** for notifications
- **Lucide React** for icons
- **Vite** for blazing-fast dev server
- Custom CSS with CSS variables (no CSS framework)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Start development server

```bash
npm run dev
```

The frontend runs on `http://localhost:5173` and proxies all `/api` requests to your backend at `http://localhost:8000`.

### 3. Make sure backend is running

```bash
# In your backend folder
npm run dev
```

## API Endpoints Used

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/user/register` | Register |
| POST | `/api/v1/user/login` | Login |
| GET | `/api/v1/user/logout` | Logout |
| POST | `/api/v1/expense/add` | Add expense |
| GET | `/api/v1/expense/getAll` | Get all (filterable) |
| PUT | `/api/v1/expense/update/:id` | Update expense |
| DELETE | `/api/v1/expense/remove/:id` | Delete expense |
| PUT | `/api/v1/expense/:id/done` | Toggle done/undone |

## Features

- 🔐 Auth (Login / Register) with JWT cookie
- 📊 Dashboard with area chart + pie chart + stats
- 💸 Expenses page with search, filter by category & status
- ✅ Mark expenses as done/pending
- ✏️ Add / Edit / Delete expenses
- 👤 Profile page with spending stats
- 📱 Responsive sidebar layout
- 🌙 Dark theme with lime green accent
