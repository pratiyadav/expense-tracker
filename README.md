# FinSight AI (Expense Tracker)

Live demo: https://spendwise-ai-roan.vercel.app

Most expense trackers fail because manual data entry is tedious. This project solves that with a complete core tracker (authentication, expense/income CRUD, analytics dashboards) plus an AI-powered receipt-scanning feature that reads a photo of a receipt and pre-fills the expense form, so adding an expense is just a quick confirmation.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React.js (Vite), React Router, Recharts, Axios |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) on Atlas |
| Authentication | JWT stored in httpOnly cookies |
| Password security | bcrypt hashing |
| File upload | Multer + Cloudinary |
| AI | Google Gemini API (receipt scanning) |
| Email | Nodemailer (Gmail) for password reset |
| Security | helmet, express-rate-limit |
| Deployment | Render (backend), Vercel (frontend), MongoDB Atlas (database) |

## Architecture

```
Client (React)
   |  HTTP requests + cookies
Express server  ----  Cloudinary (images)
   |            ----  Gemini API (receipt scanning)
   |            ----  Gmail (reset emails)
MongoDB Atlas
```

The backend follows a layered structure:

- Routes: define endpoints and HTTP methods
- Middleware: `protect` (JWT verification), `errorHandler` (central error handling), upload handling, rate limiters
- Controllers: business logic for auth, expenses, income, analytics and receipts
- Models: Mongoose schemas
- Services: the Gemini extraction service
- Utils: `asyncHandler`, `ApiResponse`, `ApiError`

## Features

**Authentication**
- Register, login and logout with bcrypt-hashed passwords
- JWT issued on login and stored in an httpOnly cookie, so frontend JavaScript cannot read it
- Login stays after a page refresh (`/auth/me`)
- Forgot password and reset password through an email link (token expires in 15 minutes)
- Profile photo upload (Cloudinary)
- Rate limiting on login, register, forgot password and receipt scanning

**Expense and income management**
- Add, view, edit and delete expenses and income
- Every query is scoped to the logged-in user
- CSV export for both expenses and income

**Analytics dashboard**
- Total balance, income and expenses (MongoDB aggregation, expense and income pipelines run together with `Promise.all`)
- Monthly spending trend, category breakdown, income vs expense and income trend (Recharts)

**AI receipt scanning**
- Upload a receipt photo, Gemini returns merchant, amount, date and category suggestions as JSON
- Fields that cannot be read come back as `null` and the user fills them in
- The form is pre-filled and the user confirms before anything is saved
- Expense fields: `source` (manual or receipt_scan), `receiptImageUrl`, `merchant`

**UI**
- Sidebar navigation with Dashboard, Income and Expense pages
- Dark and light mode with the choice remembered
- Responsive layout

**Error handling**
- Custom `ApiError` class and one error middleware, so API errors return `{ success, message, statusCode }`

## Project Structure

```
ExpenseTracker/
├── backend/
│   ├── config/         # MongoDB and Cloudinary setup
│   ├── controllers/    # Business logic
│   ├── middleware/     # Auth, errors, uploads, rate limiters
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API endpoints
│   ├── scripts/        # Helper scripts for Gemini models
│   ├── services/       # Gemini extraction service
│   ├── utils/          # asyncHandler, ApiResponse, ApiError, sendEmail
│   └── server.js
└── frontend/
    └── src/            # components, pages, context, api, utils
```

## Getting Started

You need Node.js, a MongoDB Atlas cluster, a Cloudinary account, a Gemini API key and a Gmail app password.

Backend:

```
cd backend
npm install
```

Copy `.env.example` to `.env` and fill in the values, then run:

```
npm run dev
```

Frontend:

```
cd frontend
npm install
npm run dev
```

The frontend calls `http://localhost:5000/api` by default. To use another backend, set `VITE_API_URL` in `frontend/.env`.

## Environment Variables (backend)

`PORT`, `NODE_ENV`, `CLIENT_URL`, `MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `GEMINI_API_KEY`, `GEMINI_MODEL` (optional), `EMAIL_USER`, `EMAIL_PASS`

## Deployment

- Backend on Render, frontend on Vercel, database on MongoDB Atlas
- `vercel.json` sends every route to `index.html` so React Router works on refresh
- In production set `NODE_ENV=production` (secure cross-site cookie) and set `CLIENT_URL` to the Vercel URL

## Known Limitations

- No automated tests yet
- Input validation is basic (required fields, positive amount, minimum password length)
- No CSRF tokens; CORS allows only the frontend URL
- Lists are not paginated
- Receipt accuracy was checked on a small set of 10 receipts

## License

This project is for educational and portfolio purposes.
