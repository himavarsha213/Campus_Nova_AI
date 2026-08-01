"""
Apply migration 007 - Summarizer & Quiz tables to CampusNova Supabase.
Run from backend directory: python scripts/apply_007_migration.py
"""
import os
import sys

# Add parent dir to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv()

from supabase import create_client

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

sql = """
CREATE TABLE IF NOT EXISTS summaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
    document_title TEXT NOT NULL DEFAULT 'Custom Text',
    executive_summary TEXT NOT NULL,
    key_takeaways JSONB NOT NULL DEFAULT '[]',
    important_dates JSONB NOT NULL DEFAULT '[]',
    action_items JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_summaries_user_id ON summaries(user_id);
CREATE INDEX IF NOT EXISTS idx_summaries_document_id ON summaries(document_id);

CREATE TABLE IF NOT EXISTS quiz_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
    document_title TEXT NOT NULL DEFAULT 'Unknown Document',
    difficulty TEXT NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
    question_type TEXT NOT NULL DEFAULT 'mcq',
    questions JSONB NOT NULL DEFAULT '[]',
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'submitted')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quiz_sessions_user_id ON quiz_sessions(user_id);

CREATE TABLE IF NOT EXISTS quiz_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quiz_session_id UUID REFERENCES quiz_sessions(id) ON DELETE SET NULL,
    document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
    document_title TEXT NOT NULL DEFAULT 'Unknown Document',
    difficulty TEXT NOT NULL DEFAULT 'medium',
    total_questions INTEGER NOT NULL DEFAULT 0,
    correct_answers INTEGER NOT NULL DEFAULT 0,
    score_percent FLOAT NOT NULL DEFAULT 0.0,
    performance TEXT NOT NULL DEFAULT 'Needs Improvement',
    detailed_results JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quiz_history_user_id ON quiz_history(user_id);

ALTER TABLE summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_history ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'summaries' AND policyname = 'summaries_select_own') THEN
    CREATE POLICY "summaries_select_own" ON summaries FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'summaries' AND policyname = 'summaries_insert_own') THEN
    CREATE POLICY "summaries_insert_own" ON summaries FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'summaries' AND policyname = 'summaries_delete_own') THEN
    CREATE POLICY "summaries_delete_own" ON summaries FOR DELETE USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'quiz_sessions' AND policyname = 'quiz_sessions_select_own') THEN
    CREATE POLICY "quiz_sessions_select_own" ON quiz_sessions FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'quiz_sessions' AND policyname = 'quiz_sessions_insert_own') THEN
    CREATE POLICY "quiz_sessions_insert_own" ON quiz_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'quiz_sessions' AND policyname = 'quiz_sessions_update_own') THEN
    CREATE POLICY "quiz_sessions_update_own" ON quiz_sessions FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'quiz_history' AND policyname = 'quiz_history_select_own') THEN
    CREATE POLICY "quiz_history_select_own" ON quiz_history FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'quiz_history' AND policyname = 'quiz_history_insert_own') THEN
    CREATE POLICY "quiz_history_insert_own" ON quiz_history FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;
"""

print("Applying migration 007: Summarizer & Quiz tables...")
try:
    result = client.rpc("exec_sql", {"sql": sql}).execute()
    print("Migration applied successfully!")
except Exception as e:
    print(f"RPC method not available, trying postgrest...")
    # Use direct SQL via postgres REST endpoint
    import httpx
    headers = {
        "apikey": SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
        "Content-Type": "application/json"
    }
    resp = httpx.post(
        f"{SUPABASE_URL}/rest/v1/rpc/exec_sql",
        headers=headers,
        json={"sql": sql},
        timeout=30
    )
    print(f"Status: {resp.status_code}")
    print(resp.text)
