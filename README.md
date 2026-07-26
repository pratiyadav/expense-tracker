# FinSight AI — Intelligent Personal Finance Tracker

A full-stack personal finance platform with secure authentication, complete expense/income management, spending analytics, and AI-powered receipt scanning that automatically extracts and categorizes expenses from photos.

## Live Demo
- **App:** https://spendwise-ai-roan.vercel.app
- **API:** https://spendwise-ai-0r8b.onrender.com

> Note: the backend is hosted on Render's free tier, which spins down after inactivity — the first request after idling may take 20–30 seconds to respond.

## Overview

Most expense trackers fail because manual data entry is tedious. This project solves that with a fully-functional core tracker (auth, CRUD, analytics) combined with an AI feature that reads a photo of a receipt and auto-fills the expense form — reducing manual entry to a quick confirmation step.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, React Router, Recharts, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose) |
| Authentication | JWT stored in httpOnly cookies, bcrypt password hashing |
| File Storage | Cloudinary (avatars, receipt images) |
| AI | Google Gemini API (vision/multimodal) |
| Email | Nodemailer (password reset) |
| Deployment | Render (backend), Vercel (frontend) |

## Architecture

```
Client (React, Vercel)
   ↕ HTTP requests + httpOnly cookies (cross-origin)
Express Server (Render)
   ↕
MongoDB Atlas          Cloudinary          Gemini API
(data)                 (images)            (receipt extraction)
```

The backend follows a layered structure:
- **Routes** — define endpoints and HTTP methods
- **Middleware** — JWT verification (`protect`), file upload handling (`Multer`), centralized error handling (`errorHandler`)
- **Controllers** — request/response logic per feature (auth, expenses, income, analytics, receipts)
- **Services** — isolated business logic, including the AI extraction pipeline (`aiExtractService.js`) — kept separate so the AI provider could be swapped (Claude → Gemini) by changing a single file
- **Models** — Mongoose schemas
- **Utils** — reusable helpers (`asyncHandler`, `ApiResponse`, `ApiError`) that standardize API responses and remove repetitive `try/catch` blocks

## Features

### Authentication
- Register and login with bcrypt-hashed passwords
- JWT issued on login, stored as a secure httpOnly cookie (inaccessible to frontend JS, protecting against XSS token theft)
- Session persistence across page refresh via a `/auth/me` endpoint
- Forgot password / reset password flow via email, using time-limited, hashed reset tokens
- Profile photo upload (Multer + Cloudinary)
- Logout endpoint that clears the auth cookie
- Protected-route middleware verifying the JWT on every request
- Cross-origin cookie configuration (`sameSite: none`, `secure: true` in production) for frontend/backend on separate domains

### Expense & Income Management (CRUD)
- Full create, read, update, delete for both expenses and income
- All queries scoped to the authenticated user at the database level
- CSV export for both expense and income records (client-side, no backend round-trip)
- Schema includes fields supporting AI-scanned entries: `source` (manual vs. receipt_scan), `receiptImageUrl`, `merchant`

### AI-Powered Receipt Scanning
- Upload a photo of a receipt
- Image sent to Google's Gemini API (multimodal vision model) with a structured prompt
- AI extracts merchant, amount, date, and returns **confidence-scored category suggestions** rather than a single rigid guess
- Receipt image stored via Cloudinary
- Extracted data pre-fills the existing expense form; user reviews and confirms before saving — AI never writes directly to the database

### Analytics
- Monthly spending trend (area chart)
- Category breakdown (donut chart with center total)
- Income vs. expense comparison (bar chart)
- Income trend and source breakdown
- All computed server-side via MongoDB aggregation pipelines

### UI/UX
- Sidebar navigation with dedicated Dashboard, Income, and Expense pages
- Dark mode / light mode toggle with persistence (CSS custom properties, no page reload needed)
- Fully responsive layout
- Colored, auto-assigned category icons (deterministic hashing — same category always gets the same color/icon)

### Centralized Error Handling
- Custom `ApiError` class and Express error middleware ensure every error returns a consistent JSON shape: `{ success, message, statusCode }`

## Getting Started

### Prerequisites
- Node.js installed
- A MongoDB Atlas account and cluster
- Cloudinary account (free tier)
- Google AI Studio account for a Gemini API key (free tier, no card required)
- Gmail account with an App Password (for password reset emails)

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
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GEMINI_API_KEY=your_gemini_key
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Run the server:
```bash
npm run dev
```

### Frontend Setup
```bash
cd frontend/expense-tracker
npm install
```

Create a `.env` file in `frontend/expense-tracker/`:
```
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

## Project Structure

```
expense-tracker/
├── backend/
│   ├── config/            # MongoDB + Cloudinary connections
│   ├── controllers/       # Request/response logic
│   ├── middleware/        # Auth, file upload, error handling
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API endpoints
│   ├── services/          # AI extraction service
│   ├── utils/              # asyncHandler, ApiResponse, ApiError, email sender
│   └── server.js
└── frontend/
    └── expense-tracker/
        └── src/
            ├── components/     # Forms, lists, charts, upload widgets
            ├── pages/          # Dashboard, Income, Expense, Auth pages
            ├── context/        # Auth + Theme context
            ├── api/            # Axios instance
            └── utils/          # Category color/icon assignment
```

## Deployment Notes

- Backend deployed on Render, frontend on Vercel — separate domains, requiring explicit cross-origin cookie configuration (`sameSite: none`, `secure: true`) for authentication to work in production
- Environment variables configured separately per platform; never committed to version control
- `vercel.json` rewrite rule included to support client-side routing (React Router) on Vercel

## Roadmap

- [ ] Service layer refactor for Expense/Income controllers (partially applied to AI extraction)
- [ ] AI-generated spending insights (natural-language summaries of month-over-month trends)
- [ ] Simple budget tracking with progress indicators
- [ ] Automated test coverage for auth and CRUD endpoints

## License

This project is for educational and portfolio purposes.
