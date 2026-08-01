# Step 07: AI Summarizer & Quiz Generator Suite

## 1. What We Did Up To Now
- Built the full backend RAG engine with citation generation and hallucination prevention in **Step 05**.
- Constructed the glassmorphic student portal, dashboard, and AI chat interface in **Step 06**.

---

## 2. Step Master Execution Prompt

```text
You are an expert AI product developer and frontend engineer. Execute STEP 07 of CampusNova AI by implementing the AI Document Summarizer and AI Quiz Generator modules across the backend FastAPI service and Next.js Glassmorphic UI.

### Requirements:
1. Backend AI Summarizer Service & API (`backend/app/api/v1/summarizer.py`):
   - `POST /api/v1/summary`: Accepts `document_id` or raw text content.
     - Fetches document text chunks from Supabase `document_chunks`.
     - Calls LLM with structured JSON output instructions:
       - `executive_summary`: 2-3 paragraph overview.
       - `key_takeaways`: Bullet point array.
       - `important_dates_deadlines`: Extracted dates/deadlines array.
       - `action_items`: Required student/faculty steps array.
     - Saves generated summary record into Supabase `summaries` table.
   - `GET /api/v1/summary/history`: Fetches past generated summaries for current user.

2. Backend AI Quiz Generator Service & API (`backend/app/api/v1/quiz.py`):
   - `POST /api/v1/quiz/generate`: Accepts `document_id`, `difficulty` ('easy'|'medium'|'hard'), `question_count` (5-15), `question_type` ('mcq'|'true_false'|'short_answer'|'mixed').
     - Uses LLM structured output to generate quiz JSON array containing: `question_text`, `options` (array for MCQ), `correct_answer`, `explanation`, `topic`.
   - `POST /api/v1/quiz/submit`: Accepts `quiz_id`, `user_answers` array. Evaluates score, saves result to Supabase `quiz_history` table, returns score breakdown and improvement suggestions.
   - `GET /api/v1/quiz/history`: Fetches past quiz performance scores.

3. Frontend Glassmorphic Summarizer Page (`frontend/app/student/summarizer/page.tsx`):
   - Document Selector Dropdown & File Upload trigger (`GlassInput`).
   - Summary Generation Trigger Button with glowing spinner loading state.
   - Glass Output Card Displaying:
     - Executive Summary frosted glass card.
     - Glowing bullet point list of Key Takeaways.
     - Highlighted "Important Dates & Deadlines" calendar badge pill list.
     - Action Items checklist card with copy/download options.

4. Frontend Glassmorphic Quiz Suite Page (`frontend/app/student/quiz/page.tsx`):
   - Quiz Configuration Drawer: Document picker, difficulty pills (Easy green glow, Medium amber glow, Hard red glow), slider for question count.
   - Interactive Quiz Workspace (`GlassCard`):
     - Progress bar showing current question (e.g. `Question 3 of 10`).
     - Animated question card with glass radio options for MCQs / True-False buttons.
     - Next/Previous navigation & Submit Quiz button with confirmation modal.
   - Quiz Results Glass Scorecard (`GlassCard`):
     - Animated Score Dial (e.g., `80%`), performance badge ("Pass - Great Job!").
     - Question-by-question breakdown: Correct/Incorrect badges, detailed explanation glass callouts.

Apply modern glassmorphism styling, clean animations, and responsive card layouts.
```

---

## 3. Expected Outputs of This Step
- Backend summarizer endpoint `/api/v1/summary` producing structured executive summaries, key takeaways, and deadlines.
- Backend quiz engine `/api/v1/quiz/generate` and `/submit` producing dynamic tests with score tracking.
- `student/summarizer/page.tsx`: Glassmorphic document summary workspace.
- `student/quiz/page.tsx`: Interactive glass quiz interface with question navigation, score dials, and explanation callouts.

---

## 4. Step Connectivity & Dependencies

- **Previous Connection**: Consumes document text chunks from Supabase `document_chunks` table created in **Step 04** and links to student dashboard framework from **Step 06**.
- **Next Connection**: Summaries and quiz performance stats feed into **Step 08** (Faculty analytics) and **Step 10** (Student telemetry dashboard).
