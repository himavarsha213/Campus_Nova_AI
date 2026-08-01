-- ================================================================
-- Step 08 Migration: unanswered_queries table
-- Run in Supabase Dashboard > SQL Editor
-- NOTE: quiz_sessions already exists from Step 07.
--       This only creates the unanswered_queries table.
-- ================================================================

-- unanswered_queries: AI responses with low confidence for faculty review
CREATE TABLE IF NOT EXISTS unanswered_queries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES users(id) ON DELETE SET NULL,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    query_text TEXT NOT NULL,
    ai_response TEXT,
    confidence_score FLOAT DEFAULT 0.0,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
    faculty_notes TEXT,
    resolved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_unanswered_queries_dept ON unanswered_queries(department_id);
CREATE INDEX IF NOT EXISTS idx_unanswered_queries_status ON unanswered_queries(status);

ALTER TABLE unanswered_queries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "unanswered_queries_faculty_select" ON unanswered_queries
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('faculty', 'admin'))
    );

CREATE POLICY "unanswered_queries_student_insert" ON unanswered_queries
    FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "unanswered_queries_faculty_update" ON unanswered_queries
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('faculty', 'admin'))
    );
