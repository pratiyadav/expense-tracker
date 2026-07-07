# AI-Enhanced Expense Tracker

A full-stack web application for tracking personal income and expenses, with AI-powered receipt scanning to automate expense entry.

## Overview

Most expense trackers fail because manual data entry is tedious. This project solves that in two stages: a fully-functional core tracker (auth, CRUD, analytics), followed by an AI feature that reads a photo of a receipt and auto-fills the expense details — reducing manual entry to a quick confirmation step.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Authentication | JWT stored in httpOnly cookies |
| Password Security | bcrypt hashing |
| AI (Stage 2) | Claude Vision API |
| File Upload (Stage 2) | Multer + Cloudinary |
| Deployment | Render/Railway (backend), Vercel (frontend) |

## Architecture

```
Client (React)
   ↕ HTTP requests + cookies
Express Server
   ↕
MongoDB Atlas
   ↕ (Stage 2)
Claude Vision API
```

The backend follows a layered structure:
- **Routes** — define endpoints and HTTP methods
- **Middleware** — JWT verification (`protect`) and centralized error handling (`errorHandler`)
- **Controllers** — business logic per feature (auth, expenses, income, analytics)
- **Models** — Mongoose schemas
- **Utils** — reusable helpers (`asyncHandler`, `ApiResponse`, `ApiError`) that standardize API responses and remove repetitive `try/catch` blocks

## Features

### Authentication
- Register and login with bcrypt-hashed passwords
- JWT issued on login, stored as a secure httpOnly cookie (not accessible to frontend JS, protecting against XSS token theft)
- Logout endpoint that clears the auth cookie
- Protected-route middleware verifying the JWT on every request

### Expense Management (CRUD)
- Create, read, update, delete expenses
- All queries scoped to the authenticated user at the database level
- Schema includes fields for future AI integration: `source` (manual vs. receipt_scan), `receiptImageUrl`, `merchant`

### Income Management (CRUD)
- Same pattern as expenses — full CRUD, scoped per user

### Centralized Error Handling
- Custom `ApiError` class and Express error middleware ensure every error returns a consistent JSON shape: `{ success, message, statusCode }`

## Planned Features

**Stage 1 (core, remaining)**
- Analytics endpoint — monthly spending totals and category breakdowns via MongoDB aggregation
- React frontend — auth pages, expense/income forms and lists, chart-based dashboard (Recharts)

**Stage 2 (AI add-on)**
- Receipt image upload (Multer + Cloudinary)
- AI extraction service — sends receipt image to Claude Vision API, receives structured JSON (merchant, amount, category, date)
- Pre-fills the existing expense form with extracted data for user confirmation

**Deployment**
- Backend on Render/Railway, frontend on Vercel, database on MongoDB Atlas (already cloud-hosted)

## Getting Started

### Prerequisites
- Node.js installed
- A MongoDB Atlas account and cluster

### Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in `backend/` based on `.env.example`:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

Run the server:
```bash
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Project Structure

```
expense-tracker/
├── backend/
│   ├── config/          # MongoDB connection
│   ├── controllers/      # Business logic
│   ├── middleware/        # Auth + error handling
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API endpoints
│   ├── services/          # AI extraction service (Stage 2)
│   ├── utils/              # asyncHandler, ApiResponse, ApiError
│   └── server.js
└── frontend/
        └── src/
            ├── components/
            ├── pages/
            ├── context/
            └── api/
```

## License

This project is for educational and portfolio purposes.