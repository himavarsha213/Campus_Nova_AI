# Step 01: Project Setup & Glassmorphic Design System

## 1. What We Did Up To Now
- Conducted a comprehensive analysis of all 15 PRD specification files in [`prd`](file:///C:/Users/B%20himavarsha/OneDrive/Documents/project3/prd).
- Defined the full system architecture: **Next.js (Frontend)**, **FastAPI (Backend)**, **Supabase PostgreSQL (Database & Auth)**, **Pinecone (Vector Database)**, and **OpenAI/Hugging Face (RAG & Embeddings)**.
- Established project scope, user role definitions (Student, Faculty, Admin), and technical KPIs (latency < 3s, accuracy > 90%).
- Designed the master step pipeline and defined the unified **Glassmorphic UI/UX Design System**.

---

## 2. Step Master Execution Prompt

```text
You are an expert full-stack engineer and UI designer. Execute STEP 01 of the CampusNova AI project by setting up the dual frontend/backend project architecture and building the core Glassmorphic UI Design System.

### Requirements:
1. Workspace Directory Setup:
   - Create a clean monorepo folder layout:
     - `/backend`: FastAPI Python application structure (`main.py`, `/app/core`, `/app/api`, `/app/models`, `/app/services`, `/app/schemas`, `requirements.txt`).
     - `/frontend`: Next.js 14+ (TypeScript, Tailwind CSS, App Router) structure (`/app`, `/components/ui`, `/styles`, `/lib`, `/hooks`).

2. Backend Configuration (`backend/`):
   - Setup `requirements.txt` with dependencies: `fastapi`, `uvicorn`, `pydantic`, `supabase`, `pinecone-client`, `sentence-transformers`, `openai`, `python-multipart`, `python-jose`, `passlib`.
   - Setup `app/core/config.py` using `pydantic-settings` to load `.env` variables (`SUPABASE_URL`, `SUPABASE_KEY`, `PINECONE_API_KEY`, `OPENAI_API_KEY`, `JWT_SECRET`).
   - Create FastAPI entrypoint `main.py` with CORS middleware allowed for frontend (`http://localhost:3000`), healthcheck `/api/v1/health` endpoint, and global exception handlers.

3. Frontend Glassmorphic Design System (`frontend/`):
   - Configure Tailwind CSS (`tailwind.config.js`) and Root CSS (`app/globals.css`) to define the Glassmorphic Design Tokens:
     - Color Tokens: Dark ambient Canvas (`#060913`, `#0F172A`), Ambient Mesh Gradients (Indigo `#6366F1`, Cyan `#06B6D4`, Violet `#8B5CF6`), Glass Surface (`rgba(15, 23, 42, 0.65)`), Glass Border (`rgba(255, 255, 255, 0.12)`).
     - Glass Utilities: `.glass-panel`, `.glass-card`, `.glass-input`, `.glass-button`, `.glass-sidebar` using `backdrop-filter: blur(16px)`, subtle radial gradients, and inner highlights (`inset 0 1px 1px rgba(255, 255, 255, 0.15)`).
     - Typography: Import Google Fonts **Outfit** for headings and **Inter** for crisp body text.
   - Build reusable foundational UI components in `components/ui`:
     - `GlassCard.tsx`: Hover lift effect, border glow on hover, responsive padding.
     - `GlassButton.tsx`: Primary (gradient glowing border), Secondary (subtle glass), Icon variants with smooth spring micro-animations.
     - `GlassInput.tsx`: Floating label, focus ring glow, built-in icon support.
     - `GlassBadge.tsx`: Glowing status indicators (`Student`, `Faculty`, `Admin`, `Active`, `Pending`).
     - `AmbientBackground.tsx`: Animated background mesh with subtle floating gradient light orbs.

4. Base Root Layout (`frontend/app/layout.tsx`):
   - Wrap application with `AmbientBackground`, font providers, dark mode root class, and metadata ("CampusNova AI - AI-Powered College Knowledge Assistant").

Deliver clean, production-ready code with complete configuration files.
```

---

## 3. Expected Outputs of This Step
- Monorepo folder layout with working `/backend` and `/frontend` directories.
- Configured FastAPI server with CORS, `.env` loader, and healthy `/api/v1/health` endpoint.
- Working Next.js 14+ application with complete **Glassmorphic Design Tokens** (`globals.css` and `tailwind.config.js`).
- Reusable Glassmorphic UI components (`GlassCard`, `GlassButton`, `GlassInput`, `GlassBadge`, `AmbientBackground`).
- Ambient background canvas with animated dark mesh gradients and blur effects.

---

## 4. Step Connectivity & Dependencies

- **Previous Connection**: Takes requirements, tech stack choices, and UI design directives established in PRD Analysis ([`01_Project_Overview.md`](file:///C:/Users/B%20himavarsha/OneDrive/Documents/project3/prd/01_Project_Overview.md)).
- **Next Connection**: Outputs the foundational codebase and Glassmorphic UI component library required by **Step 02** (Database Schema) and **Step 03** (Auth & RBAC UI).
