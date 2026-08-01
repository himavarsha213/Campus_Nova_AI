# Step 08: Faculty Portal & Notice Management Suite

## 1. What We Did Up To Now
- Built the backend document ingestion pipeline (**Step 04**) and RAG chat core engine (**Step 05**).
- Implemented the student portal, AI chat interface, summarizer, and quiz generator in **Steps 06 & 07**.

---

## 2. Step Master Execution Prompt

```text
You are an expert full-stack developer specializing in administrative interfaces and document workflows. Execute STEP 08 of CampusNova AI by building the complete Faculty Workspace, Document Manager, Notice Publisher, and Unanswered Query Review suite.

### Requirements:
1. Faculty Layout & Dashboard Page (`frontend/app/faculty/dashboard/page.tsx`):
   - Glassmorphic Faculty Navigation Sidebar: Dashboard, Upload Center, Manage Documents, Publish Notice, Student Queries Review, Department Analytics.
   - Quick Stat Grid (`GlassCard`): Uploaded Documents Count, Active Notices, Pending Query Reviews, Total Student Queries Answered.
   - Recent Department Uploads Table & Student Query Trends preview.

2. Document Upload & Management Hub (`frontend/app/faculty/documents/page.tsx`):
   - Drag-and-Drop File Upload Dropzone (`GlassCard`):
     - Supports PDF, DOCX, TXT, CSV up to 50MB.
     - Form controls: Title input, Category dropdown (e.g. 'Syllabus', 'Lab Manual', 'Exam Rules', 'Placement Circular'), Department selector.
     - Progress Bar displaying upload $\rightarrow$ text extraction $\rightarrow$ embedding generation $\rightarrow$ Pinecone storage states.
   - Document Inventory Table (`GlassCard`):
     - Columns: File Title, Category, Version, Upload Date, Processing Status (`Active` green glow pill, `Processing` amber pulsing pill).
     - Action Buttons: Preview PDF Modal, Replace Version (opens upload modal), Delete Document (triggers Pinecone vector deletion).

3. Notice Publisher Module (`frontend/app/faculty/notices/page.tsx` & `backend/app/api/v1/notices.py`):
   - Backend API:
     - `GET /api/v1/notices`: List notices with department/category filter and expiry check.
     - `POST /api/v1/notices`: Create notice (`title`, `description`, `category`, `department_id`, `expiry_date`, `is_pinned`).
     - `PUT /api/v1/notices/{id}/pin` & `DELETE /api/v1/notices/{id}`.
   - Frontend Glass UI:
     - Notice Creation Form Card: Rich text description, category selector pills, expiry date picker, "Pin to Top" toggle switch.
     - Live Glass Notice Feed: Display pinned notices with glowing badge headers, category filters, and single-click delete/edit buttons.

4. Unanswered Student Queries Manager (`frontend/app/faculty/queries/page.tsx`):
   - Interface displaying student questions where AI confidence score was below threshold (`< 70%`) or returned "Information not found".
   - Actions: Faculty can directly upload missing document or type missing information response to automatically append to department knowledge base.

Ensure clean role checks (`require_role(["faculty", "admin"])`) on all APIs and glassmorphic UI polish.
```

---

## 3. Expected Outputs of This Step
- `faculty/dashboard/page.tsx`: Glassmorphic Faculty dashboard with overview stats and document management quick links.
- `faculty/documents/page.tsx`: Interactive drag-and-drop document upload dropzone, document version control table, and preview modal.
- `faculty/notices/page.tsx` & `/api/v1/notices`: Complete notice publisher with pinning, category filters, and expiry tracking.
- `faculty/queries/page.tsx`: Unanswered student query review portal empowering faculty to close institutional knowledge gaps.

---

## 4. Step Connectivity & Dependencies

- **Previous Connection**: Triggers document ingestion pipeline from **Step 04** and updates Supabase database tables created in **Step 02**.
- **Next Connection**: Uploaded department documents and published notices become immediately searchable in **Step 05** (RAG Engine) and visible in **Step 06** (Student Notice Feed).
