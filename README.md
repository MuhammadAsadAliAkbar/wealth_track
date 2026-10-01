# WealthTrack - Budgeting & Assets Management System

Complete full-stack application for personal budgeting and asset management.

## Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Frontend    | Next.js 14, React, TypeScript, Tailwind CSS, Recharts |
| Backend     | Node.js, Express.js, MongoDB, Mongoose, JWT |
| Analytics   | Python, FastAPI, NumPy, Pandas      |
| Auth        | JWT + bcrypt                        |

## Features

- ✅ User Authentication (Register / Login)
- ✅ Dashboard with Income, Expenses, Balance & Net Worth
- ✅ Transaction Management (Income & Expenses)
- ✅ Category Management (custom + defaults)
- ✅ Monthly Budgets with progress tracking
- ✅ Asset Tracking (Real Estate, Vehicles, Investments, Cash, etc.)
- ✅ Net Worth calculation
- ✅ Python-powered Analytics:
  - Spending Forecast (3 months)
  - Budget Health Score
  - Asset Value Projection (5 years)
- ✅ Beautiful modern UI with Tailwind
- ✅ Charts & Visualizations

## Project Structure

```
budget-assets-system/
├── backend/                 # Express.js API
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── frontend/                # Next.js App
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── context/
│   │   └── lib/
│   └── package.json
├── python-service/          # FastAPI Analytics
│   ├── app/main.py
│   └── requirements.txt
└── README.md
```

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Python 3.10+
- npm / yarn

## Setup Instructions

### 1. MongoDB

Make sure MongoDB is running locally, or use MongoDB Atlas free tier.

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm install
npm run dev
```

Backend runs on **http://localhost:5000**

### 3. Python Analytics Service

```bash
cd python-service
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Python service runs on **http://localhost:8000**

### 4. Frontend

```bash
cd frontend
npm install
# Optional: create .env.local
# NEXT_PUBLIC_API_URL=http://localhost:5000/api
# NEXT_PUBLIC_PYTHON_URL=http://localhost:8000
npm run dev
```

Frontend runs on **http://localhost:3000**

## API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET  /api/auth/me`

### Transactions
- `GET/POST /api/transactions`
- `PUT/DELETE /api/transactions/:id`
- `GET /api/transactions/stats`

### Budgets
- `GET/POST /api/budgets`
- `DELETE /api/budgets/:id`

### Assets
- `GET/POST /api/assets`
- `PUT/DELETE /api/assets/:id`
- `GET /api/assets/networth`

### Categories
- `GET/POST /api/categories`
- `PUT/DELETE /api/categories/:id`

### Python Analytics
- `POST /api/forecast`
- `POST /api/asset-projection`
- `POST /api/budget-health`

## Default Categories (created on register)

**Income:** Salary, Freelance, Investment Returns  
**Expense:** Food & Dining, Transport, Shopping, Bills & Utilities, Entertainment, Healthcare, Education, Rent/Mortgage, Other

## Notes

- Currency defaults to **PKR** (can be changed in user model)
- All data is user-scoped (JWT protected)
- Python service is optional — core features work without it
- For production: use strong JWT_SECRET, enable HTTPS, use MongoDB Atlas

---

Built with ❤️ using Node.js, Express, MongoDB, Next.js & Python
# wealth_track
