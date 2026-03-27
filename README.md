# Spendly — Expense Tracker Frontend

🌐 Live App: https://expense-tracker-app-gilt-psi.vercel.app (frontend)

## Tech Stack

- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express.js  
- Database: MongoDB Atlas  
- Deployment: Vercel (Frontend), Render (Backend)

## Features

- 🔐 Auth (Login / Register) with JWT cookie
- 📊 Dashboard with area chart + pie chart + stats
- 💸 Expenses page with search, filter by category & status
- ✅ Mark expenses as done/pending
- ✏️ Add / Edit / Delete expenses
- 👤 Profile page with spending stats
- 📱 Responsive sidebar layout
- 🌙 Dark theme with lime green accent

##Screenshots

<img width="756" height="826" alt="image" src="https://github.com/user-attachments/assets/a83c5017-26d4-4e3e-bb35-68757977871e" />
<img width="1907" height="874" alt="image" src="https://github.com/user-attachments/assets/6e5e4bf2-3489-4c6a-96a5-edbaa0c26d29" />


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

