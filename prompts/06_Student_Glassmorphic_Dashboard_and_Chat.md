# Step 06: Student Glassmorphic Dashboard & AI Chat Experience

## 1. What We Did Up To Now
- Initialized FastAPI backend and Next.js glassmorphic frontend structure in **Step 01**.
- Created Supabase PostgreSQL schema and initialized Pinecone vector database client in **Step 02**.
- Implemented JWT authentication and RBAC permissions in **Step 03**.
- Built the document ingestion pipeline (**Step 04**) and RAG retrieval & chat streaming API (**Step 05**).

---

## 2. Step Master Execution Prompt

```text
You are a master UI/UX engineer specializing in modern React interfaces and Glassmorphic aesthetics. Execute STEP 06 of CampusNova AI by building the complete Student Portal and AI Chat Experience.

### Requirements:
1. Student Glassmorphic Layout (`frontend/app/student/layout.tsx`):
   - Sidebar (`GlassSidebar`): Floating frosted glass panel (`backdrop-filter: blur(20px)`), glowing active indicator pills, navigation items:
     - Dashboard (`/student/dashboard`)
     - AI Chat (`/student/chat`)
     - Summarizer (`/student/summarizer`)
     - Quiz Generator (`/student/quiz`)
     - Document Search (`/student/documents`)
     - Department Notices (`/student/notices`)
     - Settings (`/student/settings`)
   - Header Navbar: User avatar badge, department chip, glowing unread notifications bell button, theme toggle.

2. Student Dashboard Page (`frontend/app/student/dashboard/page.tsx`):
   - Welcome Banner Card: Personalized greeting ("Welcome back, [Student Name]!"), semester/department details, radial glowing accent.
   - Quick Stat Grid (`GlassCard`): Available Documents, Recent Notices Count, Active Conversations, Completed Quizzes.
   - Quick Actions Bar: Glass action pills with hover scale animations ("Ask AI", "Search Policy", "Generate Quiz", "View Notices").
   - Recent Conversations List & Latest Notices Feed cards.

3. AI Chat Interface Page (`frontend/app/student/chat/page.tsx`):
   - Conversational Chat Container:
     - History Drawer / Sidebar: List of previous chat sessions, new chat button, search chat input, rename/delete session options.
     - Active Message Thread:
       - User Message Bubbles: Compact glass pill aligned right with subtle border highlight.
       - AI Assistant Message Bubbles: Frosted glass panel aligned left featuring streaming text animation, markdown renderer (bold, lists, code blocks), confidence percentage pill (e.g. `96% Confidence`), and **Source Citation Badges**.
     - Citation Source Drawer / Modal: Clicking a citation pill opens a floating glass modal displaying document title, page number, department, confidence score, and relevant text snippet.
     - Input Bar: Floating glass input box (`GlassInput`) with paperclip icon (attach document), send button with glow effect, and clickable **Suggested Question Pills** above input (e.g. "What is the attendance rule?", "Show exam timetable", "Hostel fee structure").

Apply smooth spring transitions (using Framer Motion where appropriate) and maintain strict adherence to our Glassmorphic Design Token System.
```

---

## 3. Expected Outputs of This Step
- `student/layout.tsx`: Responsive Glassmorphic layout with floating sidebar navigation and user profile header.
- `student/dashboard/page.tsx`: Interactive student dashboard with stats grid, quick actions bar, and notice highlights.
- `student/chat/page.tsx`: Advanced AI chat interface supporting message streaming, markdown rendering, chat session sidebar, and interactive source citation modals.
- Glassmorphic chat components (`ChatMessage`, `CitationModal`, `SuggestedPrompts`, `ChatSidebar`).

---

## 4. Step Connectivity & Dependencies

- **Previous Connection**: Connects to `/api/v1/chat` streaming endpoint and citation payloads built in **Step 05**, protected by AuthContext from **Step 03**.
- **Next Connection**: Sets up the student dashboard framework that integrates **Step 07** (AI Summarizer & Quiz Generator) and **Step 10** (Notifications & Telemetry).
