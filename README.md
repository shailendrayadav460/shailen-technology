# Shailendra Technology

React (Vite) frontend + Node/Express/MongoDB backend. Light theme (warm white and gold).

## Run locally

Backend (needs MongoDB running locally or an Atlas URI):

    cd backend
    cp .env.example .env      # edit JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
    npm install
    npm run seed              # creates the admin + 2 sample posts
    npm run dev               # http://localhost:5000

Frontend:

    cd frontend
    cp .env.example .env
    npm install
    npm run dev               # http://localhost:5173

Admin: click **Admin login** in the header (or open `/admin/login`) and sign in with the
ADMIN_EMAIL / ADMIN_PASSWORD from backend/.env. After signing in you land on the Blog page,
where **Write a new post**, **Edit** and **Delete** appear. Drafts and contact messages are in the Dashboard.
Visitors never see these tools, and the API rejects any write without the admin cookie.

## Architecture

Frontend: pages/ (routes) -> components/ (UI) -> context/ (shared state) -> services/ (API calls) -> config/ (base URL, site data).
- `config/env.js` holds the API base URL (VITE_API_URL).
- `BlogContext` loads posts once. If the API fails or takes over 8s, it shows `data/fallbackPosts.js` and a "saved content" banner with a retry button.
- The contact form shows a clear error plus a direct email link when the server is down.
- `AuthContext` holds the admin session. `/admin` is wrapped in `ProtectedRoute`.

Backend: routes/ -> controllers/ -> models/, with middleware/ for auth, validation, and errors.

## Security in place

- Visitors can only read: GET posts, POST contact. Create, edit, delete exist only under /api/admin.
- Every /api/admin route requires a valid admin JWT (httpOnly cookie, 8 hours, HS256 only).
- Passwords hashed with bcrypt (cost 12). There is no public register route; the single admin comes from `npm run seed`.
- Login limited to 5 failed tries per 15 min per IP. Contact form limited to 5 per hour. Global limit 300 per 15 min.
- Helmet headers, strict CORS (only CLIENT_ORIGIN), 50kb body limit.
- NoSQL injection blocked (express-mongo-sanitize). All input validated with zod. HTML tags stripped, and React renders posts as plain text.
- CSRF: cookies are httpOnly + SameSite, and state-changing calls require a custom header that other sites cannot send.
- Contact form has a honeypot field for bots.
- Generic error messages in production (no stack traces).

## Deploy

- Backend (Render): set MONGO_URI, JWT_SECRET, CLIENT_ORIGIN=https://your-site.com, NODE_ENV=production, COOKIE_SAMESITE=none (only if the frontend and API are on different domains). Better: put both on the same parent domain and use `lax`.
- Frontend (Vercel): set VITE_API_URL=https://your-api.onrender.com/api. Add a rewrite of all paths to /index.html so /blog/... works on refresh.
- Rotate the seeded admin password after first login by re-running `npm run seed` with a new ADMIN_PASSWORD.

## Adding services later (hosting)

- Add a card in `frontend/src/config/site.js` (`status: 'soon'` becomes `'live'`).
- For client hosting access: do not store client passwords as plain text. Ask clients for a limited-access account or API token, and if you must store it, encrypt it with AES-256-GCM using a key kept in an environment variable, in a separate model that only admin routes can read.
