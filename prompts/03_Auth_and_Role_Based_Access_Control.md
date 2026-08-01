# Step 03: Auth & Role-Based Access Control (RBAC)

## 1. What We Did Up To Now
- Initialized FastAPI backend and Next.js glassmorphic frontend setup in **Step 01**.
- Provisioned the complete Supabase PostgreSQL database schema (13 tables, performance indexes, RLS policies) and configured Pinecone vector index wrapper in **Step 02**.

---

## 2. Step Master Execution Prompt

```text
You are an expert web security engineer and frontend architect. Execute STEP 03 of CampusNova AI by implementing the full authentication engine, Role-Based Access Control (RBAC) middleware, and building stunning Glassmorphic Login, Register, and Password Reset UI components.

### Requirements:
1. Backend Auth Endpoints & Security (`backend/app/api/v1/auth.py`):
   - JWT Auth flow using `passlib` (bcrypt) for password hashing and `python-jose` for JWT access/refresh token generation.
   - Endpoints:
     - `POST /api/v1/auth/register`: Accepts `full_name`, `email`, `password`, `role` ('student'|'faculty'|'admin'), `department_id`, `semester`. Validates email format, checks for duplicate user, hashes password, inserts into Supabase `users` table.
     - `POST /api/v1/auth/login`: Validates credentials, updates user `last_login`, returns JWT bearer token and user role payload (`user_id`, `email`, `role`, `department_id`).
     - `GET /api/v1/auth/me`: Authenticated endpoint returning user profile.
     - `POST /api/v1/auth/forgot-password` & `/reset-password`.
   - Security Middleware (`backend/app/core/security.py`):
     - `get_current_user` dependency validating JWT headers.
     - `require_role(["admin"])`, `require_role(["faculty", "admin"])` role check decorators/dependencies returning 403 Forbidden on authorization failures.

2. Next.js Auth Context & Middleware (`frontend/lib/auth/`):
   - `AuthContext.tsx`: React Context managing `user`, `token`, `role`, `isAuthenticated`, `login()`, `logout()`, `register()` with persistent state stored in HTTP-only cookies / localStorage.
   - `middleware.ts`: Next.js route protection middleware:
     - Redirect unauthenticated users trying to access `/student/*`, `/faculty/*`, `/admin/*` to `/login`.
     - Prevent Students from accessing `/faculty/*` or `/admin/*`.
     - Prevent Faculty from accessing `/admin/*`.

3. Glassmorphic Auth UI Pages (`frontend/app/(auth)/`):
   - `/login/page.tsx`: Glassmorphic Login Card floating over `AmbientBackground`.
     - Frosted glass panel (`backdrop-filter: blur(20px)`), glowing gradient header badge ("CampusNova AI Portal"), smooth email/password inputs with focus glow, "Remember Me" toggle, tab switcher for role selection indicator.
     - Submit button with animated loading spinner and error toast popups.
   - `/register/page.tsx`: Multi-step Glassmorphic Registration Wizard:
     - Step 1: Account credentials & Role selector (Student / Faculty).
     - Step 2: Department selection dropdown & Semester slider (for students).
     - Glass progress bar with glowing step dots.
   - `/forgot-password/page.tsx`: Glassmorphic password recovery interface with success feedback state.

Ensure clean handling of auth states, token expiration, and precise UI styling aligned with our Glassmorphic Design Token system.
```

---

## 3. Expected Outputs of This Step
- Backend authentication routes (`/api/v1/auth/register`, `/login`, `/me`) in FastAPI with bcrypt password hashing and JWT payload creation.
- RBAC dependencies (`require_role`) enforcing permission boundaries across endpoints.
- Frontend `AuthContext` provider & Next.js middleware enforcing client-side role-based routing.
- High-aesthetic Glassmorphic Auth screens (`/login`, `/register`, `/forgot-password`) with glass card panels, vibrant focus glow effects, and smooth step transitions.

---

## 4. Step Connectivity & Dependencies

- **Previous Connection**: Consumes the `users` and `departments` tables created in **Step 02** and the Glassmorphic UI token primitives created in **Step 01**.
- **Next Connection**: Authenticated user session context and token security headers are required by **Step 04** (Document Upload & RAG Ingestion) and **Step 06** (Student Chat Dashboard).
