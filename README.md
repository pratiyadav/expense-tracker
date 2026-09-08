# SpendWise AI — Personal Finance Analytics Platform

A full-stack web application for tracking personal income and expenses, built around a fully-functional core tracker (auth, CRUD, analytics) with an AI-powered receipt-scanning add-on layered on top.

**Live demo:** https://spendwise-ai-roan.vercel.app

---

## Overview

Most expense trackers fail because manual data entry is tedious. This project tackles that in two stages:

1. A complete core tracker — authentication, expense/income CRUD, and analytics dashboards.
2. An AI extraction feature that reads a photo of a receipt and auto-fills the expense form, reducing manual entry to a quick confirmation step.

## Tech Stack

| Layer              | Technology                                    |
|--------------------|------------------------------------------------|
| Frontend           | React.js                                       |
| Backend            | Node.js, Express.js                            |
| Database           | MongoDB (Mongoose)                             |
| Authentication     | JWT stored in httpOnly cookies                 |
| Password Security  | bcrypt hashing                                 |
| File Upload        | Multer + Cloudinary                            |
| Deployment         | Render (backend), Vercel (frontend), MongoDB Atlas (database) |

## Architecture

```
Client (React)
   ↕ HTTP requests + cookies
Express Server
   ↕
MongoDB Atlas
```

The backend follows a layered structure:

- **Routes** — define endpoints and HTTP methods
- **Middleware** — JWT verification (`protect`) and centralized error handling (`errorHandler`)
- **Controllers** — business logic per feature (auth, expenses, income, analytics)
- **Models** — Mongoose schemas
- **Utils** — reusable helpers (`asyncHandler`, `ApiResponse`, `ApiError`) that standardize API responses and remove repetitive `try/catch` blocks

## Features

### Authentication
- Register, login, and logout with bcrypt-hashed passwords
- JWT issued on login and stored as a secure httpOnly cookie (not accessible to frontend JS, protecting against XSS token theft)
- Forgot password / reset password flow via email (Nodemailer)
- Profile photo upload (Cloudinary)
- Persistent login across page refresh

### Expense & Income Management
- Full CRUD for both expenses and income, all queries scoped to the authenticated user at the database level
- CSV export for both expense and income records

### Analytics
- Monthly spending trend (area chart)
- Category breakdown (donut chart)
- Income vs. expense comparison (bar chart)
- Income trend and source breakdown

### UI/UX
- Sidebar navigation with dedicated Dashboard, Income, and Expense pages
- Dark mode / light mode toggle with persistence
- Fully responsive layout

### Centralized Error Handling
- Custom `ApiError` class and Express error middleware ensure every error returns a consistent JSON shape: `{ success, message, statusCode }`

### Planned (Phase 2) — AI Receipt Scanning
- Receipt image upload (Multer + Cloudinary)
- AI extraction service that sends the receipt image to a vision model and receives structured JSON (merchant, amount, category, date)
- Pre-fills the existing expense form with extracted data for user confirmation
- Expense schema already includes fields for this: `source` (manual vs. receipt_scan), `receiptImageUrl`, `merchant`

## Project Structure

```
expense-tracker/
├── backend/
│   ├── config/          # MongoDB connection
│   ├── controllers/     # Business logic
│   ├── middleware/       # Auth + error handling
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API endpoints
│   ├── services/          # AI extraction service (Phase 2)
│   ├── utils/              # asyncHandler, ApiResponse, ApiError
│   └── server.js
└── frontend/
    └── src/
        ├── components/
        ├── pages/
        ├── context/
        └── api/
```

## Getting Started

### Prerequisites
- Node.js installed
- A MongoDB Atlas account and cluster

### Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
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

## Deployment
- Backend deployed on Render
- Frontend deployed on Vercel
- MongoDB Atlas (cloud-hosted database)
- Configured for secure cross-origin cookie authentication in production

## License

This project is for educational and portfolio purposes.
