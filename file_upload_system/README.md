# AuthenticationSystem-and-FileManagement

Two standalone Node.js/Express backends in one repo:

| Folder | Purpose |
|---|---|
| [`auth/`](./auth) | Email/OTP-based signup + login service (MongoDB) with a bare React/Vite client scaffold |
| [`file_upload_system/`](./file_upload_system) | Role-based authenticated file upload, listing, download, and delete service (PostgreSQL) |

The two services are independent — they don't share a database or call each other — so each has its own setup below.

---

## `auth/` — Signup, OTP Verification & Login

**Stack:** Express 5 · Mongoose (MongoDB) · Zod validation · bcrypt · JWT · Nodemailer (Gmail) · `otp-generator` · `express-rate-limit`

### Flow
1. `POST /signup` — validates input with Zod, hashes the password, creates an unverified user, generates a 6-digit OTP, emails it, and stores it with a 5-minute TTL (Mongo TTL index on the `OTP` collection).
2. `POST /signup/verifyotp` — checks the OTP and marks the user verified.
3. `POST /signup/resendotp` — invalidates the old OTP and sends a new one.
4. `POST /login` — accepts either email or username as `identifier`, requires a verified account, compares the password hash, and returns a JWT.

All routes are rate-limited (4 requests/minute per IP).

### API Reference

| Method | Route | Body | Notes |
|---|---|---|---|
| POST | `/signup` | `email, username, password` | Password must be 8–20 chars with upper, lower, number, special char |
| POST | `/signup/verifyotp` | `email, otp` | |
| POST | `/signup/resendotp` | `email` | |
| POST | `/login` | `identifier, password` | `identifier` = email or username |

A `jwtAuthMiddleware` exists (`src/middlewares/jwt.auth.middleware.js`) for protecting future routes, though no protected route currently uses it.

### Environment Variables (`auth/server/.env`)

```
MONGO_URI=
JWT_SECRET_KEY=
JWT_EXPIRES_IN=1h
BCRYPT_SALT_ROUNDS=10
APP_EMAIL=            # Gmail address used to send OTP mails
APP_PASSWORD=         # Gmail App Password (not your normal password)
```

### Running it

```bash
cd auth/server
npm install
node server.js        # listens on port 3000 (hardcoded)
```

The `auth/client` folder is an unmodified Vite + React + Tailwind starter — no signup/login UI has been built yet, so it isn't wired to the API.

---

## `file_upload_system/` — Authenticated File Storage

**Stack:** Express 5 · Drizzle ORM (PostgreSQL) · JWT (cookie-based) · Multer (disk storage) · bcrypt+pepper · `uuid` · `express-rate-limit`

### Flow
1. `POST /auth/signup` and `POST /auth/login` create/authenticate a user and set an **httpOnly cookie** (`token`) rather than returning the JWT in the body.
2. `POST /files/upload` — requires auth + role `user` or `admin`; stores the file on disk under a per-user UUID-named folder and records metadata (name, size, MIME type, path) in Postgres via Drizzle.
3. `GET /files` — paginated list; admins see every file, regular users see only their own.
4. `GET /files/:id/download` — streams the file back, blocked with 403 if it belongs to another non-admin user.
5. `DELETE /files/:id` — removes the file from disk and its DB row, with the same ownership check.

### API Reference

| Method | Route | Auth | Notes |
|---|---|---|---|
| POST | `/auth/signup` | – | `username, email, password` |
| POST | `/auth/login` | – | `email, password` |
| POST | `/files/upload` | cookie + role `user`/`admin` | multipart field name `file`, 100 MB limit, blocks `.exe/.sh/.csh` MIME types |
| GET | `/files` | cookie | query params `page`, `limit` (max 50) |
| GET | `/files/:id/download` | cookie + role `user`/`admin` | |
| DELETE | `/files/:id` | cookie | |

### Environment Variables (`file_upload_system/.env`)

```
PORT=5000
DATABASE_URL=                 # postgres connection string
JWT_SECRET=
JWT_EXPIRES_IN=1h
SALT_ROUNDS=10
SITE_PEPPER=                  # extra secret appended to passwords before hashing
UPLOAD_STORAGE_PATH=./storage/uploads
```

### Running it

```bash
cd file_upload_system
npm install
npx drizzle-kit generate      # generate SQL migrations from src/db/schema.js
npx drizzle-kit migrate       # apply them to DATABASE_URL
npm run dev                   # nodemon, or `npm start` for plain node
```

`src/config/db.js` and `src/config/redis.js` are currently empty placeholder files — the real DB connection lives in `src/db/index.js`, and no Redis client is wired up yet despite the file existing.

---

## Notes from review

- **Signup/login response bug:** in `file_upload_system`, `authService.signup`/`login` already return `{ user, token }`, but `signupController`/`loginController` then call `jwtUtility.generateToken({ id: user.id, ... })` on that wrapper object instead of `user.user` — so the token sent in the response cookie is signed with `undefined` id/role. Worth fixing before relying on the cookie auth.
- Duplicate logic exists between the two services (JWT utils, bcrypt hashing, rate limiter) — could be extracted into a shared package if this becomes one deployable unit.
- Neither service has tests, request logging (`logger.js` is empty), or a `.env.example` committed, which will slow down onboarding.
- `auth/server` hardcodes `app.listen(3000, ...)` instead of reading `PORT` from env, unlike `file_upload_system`.

---

## Repo Structure

```
.
├── auth/
│   ├── client/        # Vite + React + Tailwind starter (not yet built out)
│   └── server/         # Express + MongoDB signup/OTP/login API
└── file_upload_system/  # Express + PostgreSQL (Drizzle) file storage API
```
