# Spendwise AI (Expense Tracker)

Most expense trackers fail because manual data entry is tedious. This project solves that with a complete core tracker (authentication, expense/income CRUD, analytics dashboards) plus an AI-powered receipt-scanning feature that reads a photo of a receipt and pre-fills the expense form, reducing manual entry to a quick confirmation step.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React.js (Vite), Recharts, React Router |
| Backend | Node.js, Express 5 |
| Database | MongoDB (Mongoose) on Atlas |
| Authentication | JWT stored in httpOnly cookies |
| Password security | bcrypt hashing, 8+ character passwords |
| File upload | Multer (memory) + Cloudinary |
| AI | Google Gemini API (receipt scanning) |
| Security middleware | helmet, express-rate-limit, input validation |
| Deployment | Render (backend), Vercel (frontend), MongoDB Atlas (database) |

## Architecture

```
Client (React)  <--HTTP + httpOnly cookie-->  Express API  <-->  MongoDB Atlas
                                                  |
                                                  +--> Cloudinary (images)
                                                  +--> Gemini API (receipt scanning)
                                                  +--> SMTP / Gmail (password reset emails)
```

The backend follows a layered structure:

- **Routes**: endpoints and HTTP methods (rate limiters attached to sensitive routes)
- **Middleware**: `protect` (JWT verification), `errorHandler` (centralized errors), upload handling, rate limiters
- **Controllers**: business logic per feature (auth, expenses, income, analytics, receipts)
- **Models**: Mongoose schemas with indexes on `{ userId, date }`
- **Services**: the Gemini extraction service
- **Utils**: `asyncHandler`, `ApiResponse`, `ApiError`, input validators

## Features

**Authentication**
- Register, login, logout with bcrypt-hashed passwords
- JWT issued on login and stored in an httpOnly cookie (not readable by frontend JavaScript)
- Forgot / reset password by email (random token, only its SHA-256 hash is stored, 15-minute expiry, single use). A reset also signs out older sessions.
- Profile photo upload (Cloudinary), persistent login across page refresh

**Expense and income management**
- Full CRUD, always scoped to the authenticated user at the database level
- Update endpoints accept only whitelisted fields; all input is validated and normalized
- CSV export for both (generated in the browser, formula-injection safe)

**Analytics**
- Monthly spending trend, category breakdown, income vs. expense, income trend and sources
- Months are grouped in the configured timezone (`APP_TIMEZONE`, default Asia/Kolkata)
- Dashboard totals are computed in MongoDB; the overview runs the expense and income pipelines concurrently with `Promise.all`

**AI receipt scanning**
- Image upload, then Gemini returns merchant, amount, date and ranked category suggestions as JSON
- Output is validated; unreadable fields come back as `null` and the user fills them in
- The form is pre-filled and the user confirms, so nothing is saved automatically
- Expense fields: `source` (manual or receipt_scan), `receiptImageUrl`, `merchant`

**Reliability and security**
- Centralized error handling: every error returns `{ success, message, statusCode }`; 500 messages are generic in production
- Rate limiting on login/register, password reset, and receipt scanning
- helmet security headers, 404 handler, request body size limit

## Project Structure

```
ExpenseTracker/
├── backend/
│   ├── config/        # MongoDB and Cloudinary setup
│   ├── controllers/   # Business logic
│   ├── middleware/    # Auth, errors, uploads, rate limiters
│   ├── models/        # Mongoose schemas
│   ├── routes/        # API endpoints
│   ├── scripts/       # Developer helpers (list/test Gemini models)
│   ├── services/      # Gemini extraction service
│   ├── utils/         # asyncHandler, ApiResponse, ApiError, validators
│   └── server.js
└── frontend/
    └── src/ (components, pages, context, api, utils)
```

## Getting Started

Prerequisites: Node.js, a MongoDB Atlas cluster, and accounts for Cloudinary and Google AI Studio (Gemini).

**Backend**
```
cd backend
npm install
cp .env.example .env     # then fill in every value
npm run dev
```

**Frontend**
```
cd frontend
npm install
npm run dev
```
Set `VITE_API_URL` (for example `http://localhost:5000/api`) in `frontend/.env` if your API is not on the default URL.

## Environment variables (backend)

See `backend/.env.example`: `PORT`, `NODE_ENV`, `CLIENT_URL`, `APP_TIMEZONE`, `MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `GEMINI_API_KEY`, `GEMINI_MODEL` (optional), `EMAIL_USER`, `EMAIL_PASS`.

## Deployment

- Backend on Render, frontend on Vercel (`vercel.json` rewrites all routes to `index.html`), database on MongoDB Atlas.
- In production set `NODE_ENV=production` so the auth cookie is `Secure` with `SameSite=None`, and set `CLIENT_URL` to the exact frontend URL for CORS.

## Known limitations and next steps

- No automated tests yet (planned: Jest + Supertest for auth and per-user data isolation).
- No CSRF tokens (the production cookie uses `SameSite=None`); CORS is restricted to one origin.
- Lists are not paginated yet.
- Money is stored as a number rounded to two decimals; integer minor units would be more robust.
- Receipt images are stored on Cloudinary when a receipt is scanned, even if the user later cancels.
- Receipt-scanning accuracy was checked on a small set of 10 receipts, not a large labelled dataset.

## License

This project is for educational and portfolio purposes.
