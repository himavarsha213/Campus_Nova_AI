# Step 09: Admin Suite & AI Parameter Configuration

## 1. What We Did Up To Now
- Implemented core database architecture, JWT auth, and RBAC security middleware (**Steps 02 & 03**).
- Completed student chat dashboard (**Step 06**), AI study tools (**Step 07**), and faculty document/notice publisher (**Step 08**).

---

## 2. Step Master Execution Prompt

```text
You are an expert platform architect and system administrator suite developer. Execute STEP 09 of CampusNova AI by building the complete Administrator Control Center, User & Department Management engine, Vector Knowledge Base Rebuilder, and AI Parameter Configuration Suite.

### Requirements:
1. Admin Layout & Overview Dashboard (`frontend/app/admin/dashboard/page.tsx`):
   - Admin Glass Navigation Sidebar: Overview, User Management, Department Management, Knowledge Base, AI Configuration, Audit Logs, System Health.
   - Platform Overview Metrics (`GlassCard`): Total Platform Users (Students/Faculty/Admins), Total Uploaded Documents, Active Pinecone Vector Count, Daily AI Query Volume, Average Response Latency (ms), Hallucination Rate (< 1%).
   - Global System Status Indicator: Vector DB connectivity indicator, Supabase connection status, OpenAI API latency indicator.

2. User & Department Management Portal (`frontend/app/admin/users/page.tsx` & `departments/page.tsx`):
   - User Management Table: User search filter, role badge selector (`Student`, `Faculty`, `Admin`), department filter, suspend user button, reset password trigger modal, add user form modal.
   - Department Management Panel: Create new department (Name, Code, HOD Name), assign faculty leads, view total assigned students & documents per department.
   - APIs (`backend/app/api/v1/admin.py`):
     - `GET /api/v1/admin/users`, `POST /users`, `PUT /users/{id}`, `DELETE /users/{id}`.
     - `GET /api/v1/admin/departments`, `POST /departments`, `PUT /departments/{id}`.

3. Global Knowledge Base Rebuilder Tool (`frontend/app/admin/knowledge-base/page.tsx`):
   - Global Index Telemetry Card: Vector count, storage size, document chunk status breakdown.
   - Admin Controls: "Rebuild Vector Index" trigger button (triggers async background re-indexing of all active documents), "Clear Stale Vector Chunks" button, document approval workflow table.
   - API: `POST /api/v1/rag/rebuild` & `POST /api/v1/rag/refresh` restricted to Admin.

4. AI Parameter Configuration Suite (`frontend/app/admin/ai-config/page.tsx`):
   - Interactive Glass Settings Form (`GlassCard`):
     - AI LLM Model Selector Dropdown: `gpt-4o-mini`, `gpt-4o`, `gpt-3.5-turbo`.
     - Temperature Slider: `0.0` (Strictly Grounded) to `1.0` (Creative).
     - Max Tokens Input: `256` to `2048`.
     - Retrieval Top-K Slider: `1` to `10` vector chunks retrieved per query.
     - Vector Similarity Threshold Slider: `0.60` to `0.90`.
     - System Prompt Template Editor: Editable glass textarea with variable tokens (`{context_chunks}`, `{chat_history}`, `{user_question}`).
   - API: `PUT /api/v1/admin/ai-settings` updating runtime configuration settings stored in Supabase / Redis cache.

5. System Audit Logs Viewer (`frontend/app/admin/logs/page.tsx`):
   - Log Viewer Table displaying user activity, document modifications, auth attempts, security alerts, and IP addresses with search and severity filter.

Enforce strict `require_role(["admin"])` authorization across all administrative endpoints.
```

---

## 3. Expected Outputs of This Step
- `admin/dashboard/page.tsx`: Glassmorphic admin overview with system telemetry and real-time operational status cards.
- `admin/users/page.tsx` & `departments/page.tsx`: User and department management tools with modal forms and role assignments.
- `admin/knowledge-base/page.tsx`: Vector DB rebuilder and document index manager.
- `admin/ai-config/page.tsx`: Dynamic AI parameter tuning dashboard with temperature sliders, Top-K selectors, and system prompt editor.
- `admin/logs/page.tsx`: Audit logging viewer tracking security events and user activity.

---

## 4. Step Connectivity & Dependencies

- **Previous Connection**: Controls and manages data entities created in **Steps 02, 03, 04 & 05**.
- **Next Connection**: AI configuration settings dynamically govern the RAG retrieval behavior in **Step 05** and feed system metrics into **Step 10** (Analytics & Polish).
