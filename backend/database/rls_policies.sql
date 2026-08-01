-- ==========================================
-- CampusNova AI — Row-Level Security (RLS) Policies
-- Description: Security isolation for Students, Faculty, and Administrators (Idempotent safe re-execution)
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Clean existing policies for safe re-execution
DROP POLICY IF EXISTS "Public read departments" ON departments;
DROP POLICY IF EXISTS "Admin write departments" ON departments;
DROP POLICY IF EXISTS "Users view self profile" ON users;
DROP POLICY IF EXISTS "Users update self profile" ON users;
DROP POLICY IF EXISTS "Students read active documents" ON documents;
DROP POLICY IF EXISTS "Faculty manage department documents" ON documents;
DROP POLICY IF EXISTS "Read document chunks" ON document_chunks;
DROP POLICY IF EXISTS "User manage own conversations" ON conversations;
DROP POLICY IF EXISTS "User manage own messages" ON messages;
DROP POLICY IF EXISTS "Public read active notices" ON notices;
DROP POLICY IF EXISTS "Faculty/Admin write notices" ON notices;
DROP POLICY IF EXISTS "Faculty/Admin update notices" ON notices;
DROP POLICY IF EXISTS "User manage own feedback" ON feedback;
DROP POLICY IF EXISTS "User manage own quiz history" ON quiz_history;
DROP POLICY IF EXISTS "User manage own summaries" ON summaries;
DROP POLICY IF EXISTS "User manage own notifications" ON notifications;

-- 1. Departments Policies
CREATE POLICY "Public read departments" ON departments FOR SELECT USING (true);
CREATE POLICY "Admin write departments" ON departments FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- 2. Users Policies
CREATE POLICY "Users view self profile" ON users FOR SELECT USING (auth.uid() = id OR auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Users update self profile" ON users FOR UPDATE USING (auth.uid() = id);

-- 3. Documents Policies
CREATE POLICY "Students read active documents" ON documents FOR SELECT USING (
    status = 'active' AND (
        department_id IS NULL OR 
        department_id = (SELECT department_id FROM users WHERE id = auth.uid()) OR 
        auth.jwt() ->> 'role' IN ('faculty', 'admin')
    )
);
CREATE POLICY "Faculty manage department documents" ON documents FOR ALL USING (auth.jwt() ->> 'role' IN ('faculty', 'admin'));

-- 4. Document Chunks Policies
CREATE POLICY "Read document chunks" ON document_chunks FOR SELECT USING (
    EXISTS (SELECT 1 FROM documents WHERE id = document_chunks.document_id AND status = 'active')
);

-- 5. Conversations & Messages Policies
CREATE POLICY "User manage own conversations" ON conversations FOR ALL USING (user_id = auth.uid());
CREATE POLICY "User manage own messages" ON messages FOR ALL USING (
    EXISTS (SELECT 1 FROM conversations WHERE id = messages.conversation_id AND user_id = auth.uid())
);

-- 6. Notices Policies
CREATE POLICY "Public read active notices" ON notices FOR SELECT USING (true);
CREATE POLICY "Faculty/Admin write notices" ON notices FOR INSERT WITH CHECK (auth.jwt() ->> 'role' IN ('faculty', 'admin'));
CREATE POLICY "Faculty/Admin update notices" ON notices FOR UPDATE USING (auth.jwt() ->> 'role' IN ('faculty', 'admin'));

-- 7. Feedback & Study Tools Policies
CREATE POLICY "User manage own feedback" ON feedback FOR ALL USING (user_id = auth.uid() OR auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "User manage own quiz history" ON quiz_history FOR ALL USING (user_id = auth.uid());
CREATE POLICY "User manage own summaries" ON summaries FOR ALL USING (user_id = auth.uid());
CREATE POLICY "User manage own notifications" ON notifications FOR ALL USING (user_id = auth.uid());
