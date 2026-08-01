# Step 02: Database Schema & Supabase Configuration

## 1. What We Did Up To Now
- Initialized the monorepo workspace with FastAPI (`/backend`) and Next.js 14 (`/frontend`).
- Built the foundational **Glassmorphic UI Design System** with dark ambient mesh canvas, blur tokens, and component primitives (`GlassCard`, `GlassButton`, `GlassInput`, `GlassBadge`).
- Verified environment configuration variables for Supabase, Pinecone, and OpenAI.

---

## 2. Step Master Execution Prompt

```text
You are an expert database architect and security specialist. Execute STEP 02 of CampusNova AI by implementing the full relational schema in Supabase PostgreSQL, configuring Row-Level Security (RLS) policies, and setting up the Pinecone vector database index mapping.

### Requirements:
1. PostgreSQL Schema DDL Script (`backend/database/schema.sql`):
   Create SQL DDL scripts to define all 13 core relational tables as specified in PRD Part 9:
   - `departments`: `id` (UUID PK), `department_name`, `department_code`, `hod_name`, `created_at`.
   - `users`: `id` (UUID PK), `full_name`, `email` (UNIQUE), `password_hash`, `role` ('student'|'faculty'|'admin'), `department_id` (FK), `semester`, `phone`, `profile_image`, `created_at`, `updated_at`.
   - `documents`: `id` (UUID PK), `title`, `file_name`, `file_url`, `department_id` (FK), `category`, `uploaded_by` (FK), `version`, `status` ('processing'|'active'|'archived'), `uploaded_at`.
   - `document_chunks`: `id` (UUID PK), `document_id` (FK), `chunk_number`, `chunk_text`, `page_number`, `vector_id` (Text link to Pinecone), `created_at`.
   - `conversations`: `id` (UUID PK), `user_id` (FK), `title`, `created_at`, `updated_at`.
   - `messages`: `id` (UUID PK), `conversation_id` (FK), `sender` ('user'|'assistant'), `message`, `citations` (JSONB), `confidence_score` (Numeric), `created_at`.
   - `notices`: `id` (UUID PK), `title`, `description`, `category`, `department_id` (FK), `created_by` (FK), `expiry_date`, `is_pinned` (Boolean), `created_at`.
   - `feedback`: `id` (UUID PK), `user_id` (FK), `message_id` (FK), `rating` (Integer 1-5), `feedback` (Text), `created_at`.
   - `quiz_history`: `id` (UUID PK), `user_id` (FK), `document_id` (FK), `score`, `total_questions`, `quiz_data` (JSONB), `completed_at`.
   - `summaries`: `id` (UUID PK), `user_id` (FK), `document_id` (FK), `summary` (Text), `key_points` (JSONB), `created_at`.
   - `notifications`: `id` (UUID PK), `user_id` (FK), `title`, `message`, `type`, `is_read` (Boolean), `created_at`.
   - `analytics`: `id` (UUID PK), `user_id` (FK), `event`, `module`, `timestamp`.
   - `audit_logs`: `id` (UUID PK), `user_id` (FK), `action`, `module`, `ip_address`, `timestamp`.

2. Foreign Keys, Triggers & Performance Indexes:
   - Create B-Tree indexes on `users(email)`, `users(department_id)`, `documents(department_id)`, `document_chunks(document_id)`, `conversations(user_id)`, `messages(conversation_id)`, `notices(category, department_id)`.
   - Create SQL trigger to update `updated_at` timestamps automatically.

3. Row-Level Security (RLS) Policies (`backend/database/rls_policies.sql`):
   - Enable RLS on all tables.
   - `users`: Users can read/edit their own profile; Admins have full access.
   - `documents`: Students can read active documents belonging to their department or global; Faculty can manage their department documents; Admins have full access.
   - `conversations` & `messages`: Users can access ONLY their own chat conversations.
   - `notices`: Public read for authenticated users; Faculty/Admin create/edit permissions.

4. Python Supabase Database Client & ORM/Repository Layer (`backend/app/database/`):
   - Implement `supabase_client.py` initializing Supabase SDK with connection pooling and error handling.
   - Implement repository modules: `user_repo.py`, `document_repo.py`, `chat_repo.py`, `notice_repo.py`.

5. Pinecone Vector Database Config (`backend/app/database/vector_store.py`):
   - Python module to initialize Pinecone index (`campusnova-index`, metric: `cosine`, dimension: 768 for Hugging Face or 1536 for OpenAI).
   - Helper functions for upserting vectors with metadata (`document_id`, `chunk_id`, `department_id`, `category`, `page_number`, `chunk_text`) and querying vectors with metadata filters.

Ensure all SQL scripts are syntax-valid for PostgreSQL/Supabase and Python clients include complete typing and error handling.
```

---

## 3. Expected Outputs of This Step
- `schema.sql`: Complete SQL script containing tables, foreign keys, triggers, and performance indexes.
- `rls_policies.sql`: Granular Row-Level Security policies enforcing role isolation in Supabase.
- `backend/app/database/supabase_client.py`: Python module connecting FastAPI to Supabase DB.
- `backend/app/database/vector_store.py`: Pinecone vector store helper managing vector index creation, upserts, and metadata-filtered queries.
- Repository layer (`user_repo.py`, `document_repo.py`, `chat_repo.py`) for abstracting SQL queries.

---

## 4. Step Connectivity & Dependencies

- **Previous Connection**: Relies on backend folder setup and environment variables defined in **Step 01**.
- **Next Connection**: Database schema and repository methods feed directly into **Step 03** (Authentication & Role-Based Access Control) and **Step 04** (Document Processing RAG Pipeline).
