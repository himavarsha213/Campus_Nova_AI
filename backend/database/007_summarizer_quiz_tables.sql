-- Step 07: AI Summarizer & Quiz Generator Tables
-- Migration: 007_summarizer_quiz_tables.sql

-- ─────────────────────────────────────────────────────────────────
-- 1. summaries: Stores AI-generated document summaries
-- ─────────────────────────────────────────────────────────────────
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

-- ─────────────────────────────────────────────────────────────────
-- 2. quiz_sessions: Stores generated quiz question sets
-- ─────────────────────────────────────────────────────────────────
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

-- ─────────────────────────────────────────────────────────────────
-- 3. quiz_history: Stores submitted quiz results & performance
-- ─────────────────────────────────────────────────────────────────
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

-- ─────────────────────────────────────────────────────────────────
-- 4. Row Level Security (RLS) Policies
-- ─────────────────────────────────────────────────────────────────
ALTER TABLE summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_history ENABLE ROW LEVEL SECURITY;

-- summaries: Users own their summaries
CREATE POLICY "summaries_select_own" ON summaries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "summaries_insert_own" ON summaries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "summaries_delete_own" ON summaries FOR DELETE USING (auth.uid() = user_id);

-- quiz_sessions: Users own their quiz sessions
CREATE POLICY "quiz_sessions_select_own" ON quiz_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "quiz_sessions_insert_own" ON quiz_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "quiz_sessions_update_own" ON quiz_sessions FOR UPDATE USING (auth.uid() = user_id);

-- quiz_history: Users own their quiz history
CREATE POLICY "quiz_history_select_own" ON quiz_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "quiz_history_insert_own" ON quiz_history FOR INSERT WITH CHECK (auth.uid() = user_id);
