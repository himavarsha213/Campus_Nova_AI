'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileQuestion,
  Sparkles,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  BarChart3,
  BookOpen,
  Zap,
  Trophy,
  RefreshCw,
  Upload,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import GlassCard from '@/components/ui/GlassCard';
import GlassButton from '@/components/ui/GlassButton';
import GlassBadge from '@/components/ui/GlassBadge';

import { API_BASE_URL as API } from '@/lib/api';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Document { id: string; original_filename: string; category?: string; }
interface QuizQuestion {
  question_text: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  topic: string;
}
interface QuizResult {
  quiz_id: string;
  total_questions: number;
  correct_answers: number;
  score_percent: number;
  performance: string;
  performance_badge: string;
  improvement_suggestions: string[];
  detailed_results: Array<{
    question_index: number;
    question_text: string;
    options: string[];
    user_answer: string;
    correct_answer: string;
    is_correct: boolean;
    explanation: string;
    topic: string;
  }>;
}

type Difficulty = 'easy' | 'medium' | 'hard';
type QuestionType = 'mcq' | 'true_false' | 'short_answer' | 'mixed';
type PageView = 'config' | 'quiz' | 'results';

// ─── Score Dial Component ──────────────────────────────────────────────────

const ScoreDial: React.FC<{ score: number }> = ({ score }) => {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const color = score >= 80 ? '#10B981' : score >= 60 ? '#06B6D4' : score >= 40 ? '#F59E0B' : '#F43F5E';

  return (
    <div className="relative flex items-center justify-center w-40 h-40">
      <svg className="w-40 h-40 -rotate-90" viewBox="0 0 128 128">
        <circle cx="64" cy="64" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
        <motion.circle
          cx="64" cy="64" r={radius} fill="none"
          stroke={color} strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          style={{ filter: `drop-shadow(0 0 12px ${color})` }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-4xl font-heading font-extrabold"
          style={{ color }}
        >
          {Math.round(score)}%
        </motion.span>
        <span className="text-[10px] text-slate-400 uppercase tracking-widest">Score</span>
      </div>
    </div>
  );
};

// ─── Main Page Component ──────────────────────────────────────────────────

export default function QuizPage() {
  const { token } = useAuth();

  const DEFAULT_DOCUMENTS = [
    { id: 'doc-cse-001', original_filename: 'Academic_Regulations_2025-26.pdf', category: 'Academic Policy' },
    { id: 'doc-cse-002', original_filename: 'CSE_Semester6_Syllabus.pdf', category: 'Syllabus' },
    { id: 'doc-cse-003', original_filename: 'End_Semester_Exam_Schedule_2026.pdf', category: 'Exam Schedule' },
    { id: 'doc-cse-004', original_filename: 'Hostel_Rules_Fee_Structure_2026.pdf', category: 'Administration' },
    { id: 'doc-cse-005', original_filename: 'AI_RAG_Lab_Manual_2026.pdf', category: 'Lab Manual' },
  ];

  // Config state
  const [documents, setDocuments] = useState<Document[]>(DEFAULT_DOCUMENTS);
  const [selectedDocId, setSelectedDocId] = useState('doc-cse-001');
  const [view, setView] = useState<PageView>('config');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [questionType, setQuestionType] = useState<QuestionType>('mcq');
  const [docDropdownOpen, setDocDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quizId, setQuizId] = useState<string>('');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectedDoc = documents.find((d) => d.id === selectedDocId) || documents[0];

  // Store uploaded file contents in memory map
  const [fileContents, setFileContents] = useState<Record<string, string>>({});

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    // Read text content from file
    let extractedText = '';
    try {
      extractedText = await file.text();
    } catch {
      extractedText = '';
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', file.name.replace(/\.[^/.]+$/, ""));
      formData.append('category', 'Quiz Document');

      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('${API}/api/v1/documents/upload', {
        method: 'POST',
        headers,
        body: formData,
      });

      const docId = 'doc-' + Date.now();
      if (res.ok) {
        const data = await res.json();
        const newDoc: Document = {
          id: data.document_id || docId,
          original_filename: file.name,
          category: 'Quiz Document',
        };
        setDocuments((prev) => [newDoc, ...prev]);
        setSelectedDocId(newDoc.id);
        if (extractedText) {
          setFileContents((prev) => ({ ...prev, [newDoc.id]: extractedText }));
        }
      } else {
        throw new Error('Upload server error');
      }
    } catch {
      // Local fallback
      const newDocId = 'doc-upload-' + Date.now();
      const newDoc: Document = {
        id: newDocId,
        original_filename: file.name,
        category: 'Uploaded Document',
      };
      setDocuments((prev) => [newDoc, ...prev]);
      setSelectedDocId(newDoc.id);
      if (extractedText) {
        setFileContents((prev) => ({ ...prev, [newDocId]: extractedText }));
      }
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(userAnswers).length;

  // Fetch documents
  useEffect(() => {
    const fetchDocs = async () => {
      if (!token) {
        setDocuments(DEFAULT_DOCUMENTS);
        return;
      }
      try {
        const res = await fetch('${API}/api/v1/documents', { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : data?.documents || [];
          if (list.length > 0) {
            setDocuments(list);
            if (!selectedDocId) setSelectedDocId(list[0].id);
          } else {
            setDocuments(DEFAULT_DOCUMENTS);
          }
        } else {
          setDocuments(DEFAULT_DOCUMENTS);
        }
      } catch {
        setDocuments(DEFAULT_DOCUMENTS);
      }
    };
    fetchDocs();
  }, [token]);

  // Helper to extract sentences / concepts from text content with full questionType support
  const extractQuestionsFromText = (rawText: string, docName: string, count: number, qType: QuestionType): QuizQuestion[] => {
    // Filter out PDF internal syntax and stream keywords (obj, FlateDecode, endobj, stream, etc)
    const cleanedText = rawText
      .replace(/\/[\w\d]+/g, ' ')
      .replace(/\b(obj|endobj|stream|endstream|xref|trailer|startxref|FlateDecode|Catalog|Pages|Font|Metadata)\b/gi, ' ')
      .replace(/[^\x20-\x7E\n\r]/g, ' ')
      .replace(/\s+/g, ' ');

    // Extract valid English sentences
    const sentences = cleanedText
      .split(/(?<=[.?!])\s+/)
      .map((s) => s.trim().replace(/[^a-zA-Z0-9\s.,-]/g, ''))
      .filter((s) => {
        const validEnglishWords = s.split(/\s+/).filter((w) => /^[a-zA-Z]{3,15}$/.test(w) && /[aeiouAEIOU]/.test(w));
        return s.length >= 35 && s.length <= 180 && validEnglishWords.length >= 5;
      });

    const topicName = docName.replace(/\.[^/.]+$/, "").replace(/_/g, " ");
    const questionsList: QuizQuestion[] = [];

    for (let i = 0; i < count; i++) {
      const sentence = sentences[i % sentences.length];
      const isTF = qType === 'true_false' || (qType === 'mixed' && i % 2 === 1);
      const isShort = qType === 'short_answer';

      if (sentence) {
        const words = sentence.split(/\s+/).filter((w) => /^[a-zA-Z]{4,}$/.test(w));
        const targetWord = words.length > 0 ? words[Math.floor(words.length / 2)] : 'system';

        if (isTF) {
          const isTrueStatement = i % 2 === 0;
          const statementText = isTrueStatement
            ? sentence
            : sentence.replace(targetWord, 'opposite_' + targetWord);

          questionsList.push({
            question_text: `True or False according to "${topicName}": ${statementText}`,
            options: ['True', 'False'],
            correct_answer: isTrueStatement ? 'True' : 'False',
            explanation: `Source text from document: "${sentence}"`,
            topic: topicName.slice(0, 20),
          });
        } else if (isShort) {
          const maskedSentence = sentence.replace(new RegExp(`\\b${targetWord}\\b`, 'i'), '______');
          questionsList.push({
            question_text: `Short Answer: According to "${topicName}", complete the blank: "${maskedSentence}"`,
            options: [targetWord],
            correct_answer: targetWord,
            explanation: `Direct quote: "${sentence}"`,
            topic: topicName.slice(0, 20),
          });
        } else {
          // MCQ
          const maskedSentence = sentence.replace(new RegExp(`\\b${targetWord}\\b`, 'i'), '______');
          questionsList.push({
            question_text: `[${topicName}] Complete the sentence according to the document: "${maskedSentence}"`,
            options: [
              targetWord,
              'Framework architecture',
              'System specification',
              'None of the above'
            ],
            correct_answer: targetWord,
            explanation: `Excerpt from document text: "${sentence}"`,
            topic: topicName.slice(0, 20),
          });
        }
      } else {
        if (isTF) {
          questionsList.push({
            question_text: `True or False: "${topicName}" covers foundational concepts and principles.`,
            options: ['True', 'False'],
            correct_answer: 'True',
            explanation: `Main subject topic of ${docName}.`,
            topic: topicName.slice(0, 20),
          });
        } else {
          questionsList.push({
            question_text: `What is a primary subject area of "${topicName}"?`,
            options: [
              `Core principles and fundamentals of ${topicName}`,
              `Implementation guidelines`,
              `Performance analysis`,
              `All of the above`
            ],
            correct_answer: `All of the above`,
            explanation: `Derived from ${docName}.`,
            topic: topicName.slice(0, 20),
          });
        }
      }
    }
    return questionsList;
  };

  // Generate quiz
  const handleGenerate = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch('${API}/api/v1/quiz/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          document_id: selectedDocId,
          difficulty,
          question_count: questionCount,
          question_type: questionType,
        }),
      });

      if (!res.ok) throw new Error('Quiz generation failed');
      const data = await res.json();
      setQuizId(data.quiz_id);
      setQuestions(data.questions);
      setUserAnswers({});
      setCurrentIndex(0);
      setView('quiz');
    } catch {
      // Safely handle null / undefined selectedDoc and fileContents
      const currentDoc = documents.find((d) => d.id === selectedDocId) || documents[0] || { original_filename: 'Computer Fundamentals Guide.txt' };
      const docTitle = currentDoc?.original_filename || 'Computer Fundamentals Guide.txt';
      const fileText = (selectedDocId && fileContents[selectedDocId]) ? fileContents[selectedDocId] : '';

      let generated: QuizQuestion[] = [];
      if (fileText.trim().length > 30) {
        generated = extractQuestionsFromText(fileText, docTitle, questionCount, questionType);
      } else {
        const cleanTitle = (docTitle || 'Computer Fundamentals Guide').replace(/\.[^/.]+$/, "").replace(/_/g, " ");
        generated = Array.from({ length: questionCount }, (_, i) => ({
          question_text: `[${cleanTitle}] What is a key focus of topic #${i + 1} in ${cleanTitle}?`,
          options: [
            `Understanding the fundamentals of ${cleanTitle}`,
            `Applying section ${i + 1} guidelines`,
            `Evaluating system specifications`,
            `All of the above`
          ],
          correct_answer: `All of the above`,
          explanation: `Derived from topic #${i + 1} in ${docTitle}.`,
          topic: cleanTitle.split(' ')[0] || 'General',
        }));
      }

      setQuizId('quiz-' + Date.now());
      setQuestions(generated);
      setUserAnswers({});
      setCurrentIndex(0);
      setView('quiz');
    } finally {
      setIsLoading(false);
    }
  };

  // Submit quiz
  const handleSubmit = async () => {
    setShowConfirmSubmit(false);
    setIsLoading(true);

    const answersPayload = Object.entries(userAnswers).map(([idx, ans]) => ({
      question_index: Number(idx),
      selected_answer: ans,
    }));

    try {
      const res = await fetch('${API}/api/v1/quiz/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ quiz_id: quizId, user_answers: answersPayload }),
      });
      if (!res.ok) throw new Error('Submit failed');
      const data = await res.json();
      setResult(data);
      setView('results');
    } catch {
      // Calculate results locally as fallback
      let correct = 0;
      const detailed = questions.map((q, idx) => {
        const userAns = userAnswers[idx] || '';
        const isCorrect = userAns.trim().toLowerCase() === q.correct_answer.trim().toLowerCase();
        if (isCorrect) correct++;
        return {
          question_index: idx,
          question_text: q.question_text,
          options: q.options,
          user_answer: userAns,
          correct_answer: q.correct_answer,
          is_correct: isCorrect,
          explanation: q.explanation,
          topic: q.topic,
        };
      });

      const total = questions.length;
      const scorePercent = Math.round((correct / total) * 100);
      const performance = scorePercent >= 80 ? 'Excellent' : scorePercent >= 60 ? 'Pass' : scorePercent >= 40 ? 'Needs Improvement' : 'Fail';
      const badge = scorePercent >= 80 ? '🏆 Excellent Performance!' : scorePercent >= 60 ? '✅ Good Job! Keep it up.' : scorePercent >= 40 ? '📚 Keep Studying!' : '❌ Revise the material and retry.';

      setResult({
        quiz_id: quizId || 'local',
        total_questions: total,
        correct_answers: correct,
        score_percent: scorePercent,
        performance,
        performance_badge: badge,
        improvement_suggestions: [],
        detailed_results: detailed,
      });
      setView('results');
    } finally {
      setIsLoading(false);
    }
  };

  const difficultyConfig = {
    easy: { label: 'Easy', color: 'text-emerald-300', bg: 'bg-emerald-500/15', border: 'border-emerald-500/40', shadow: 'shadow-[0_0_15px_rgba(16,185,129,0.3)]' },
    medium: { label: 'Medium', color: 'text-amber-300', bg: 'bg-amber-500/15', border: 'border-amber-500/40', shadow: 'shadow-[0_0_15px_rgba(245,158,11,0.3)]' },
    hard: { label: 'Hard', color: 'text-rose-300', bg: 'bg-rose-500/15', border: 'border-rose-500/40', shadow: 'shadow-[0_0_15px_rgba(244,63,94,0.3)]' },
  };

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <GlassBadge variant="purple" size="sm">AI Quiz Generator</GlassBadge>
          <GlassBadge variant="cyan" size="sm">RAG-Powered</GlassBadge>
        </div>
        <h1 className="text-3xl font-heading font-extrabold text-white">
          Practice <span className="text-gradient">Quiz Suite</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Generate custom quizzes from indexed documents and track your performance.
        </p>
      </div>

      {/* ══════════════════════════ VIEW: CONFIG ══════════════════════════ */}
      <AnimatePresence mode="wait">
        {view === 'config' && (
          <motion.div key="config" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
            <GlassCard className="p-6 space-y-6">
              {/* Document Selector */}
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-medium text-slate-300 tracking-wide uppercase">
                    Select Source Document
                  </label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium bg-cyan-500/10 hover:bg-cyan-500/20 px-3 py-1 rounded-lg border border-cyan-500/20 transition-all disabled:opacity-50"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-3.5 w-3.5" />
                        <span>Upload File</span>
                      </>
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.txt,.docx,.md"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
                <button
                  onClick={() => setDocDropdownOpen(!docDropdownOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-slate-900/70 border border-white/15 hover:border-indigo-500/40 text-sm text-slate-200 transition-all"
                >
                  <span className="flex items-center gap-2.5">
                    <FileText className="h-4 w-4 text-cyan-400 shrink-0" />
                    {selectedDoc ? selectedDoc.original_filename : 'Choose a document from the knowledge base...'}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${docDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {docDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="absolute top-full left-0 right-0 mt-2 rounded-2xl bg-slate-900/95 backdrop-blur-[20px] border border-white/15 shadow-[0_16px_48px_rgba(0,0,0,0.6)] z-20 overflow-hidden max-h-56 overflow-y-auto"
                    >
                      {documents.map((doc) => (
                        <button
                          key={doc.id}
                          onClick={() => { setSelectedDocId(doc.id); setDocDropdownOpen(false); }}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left hover:bg-indigo-500/15 transition-colors border-b border-white/5 last:border-0 ${selectedDocId === doc.id ? 'text-cyan-300 bg-indigo-500/10' : 'text-slate-200'}`}
                        >
                          <FileText className="h-4 w-4 text-cyan-400 shrink-0" />
                          <span className="truncate">{doc.original_filename}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Difficulty Pills */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-3 tracking-wide uppercase">
                  Difficulty Level
                </label>
                <div className="flex gap-3">
                  {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => {
                    const cfg = difficultyConfig[d];
                    const active = difficulty === d;
                    return (
                      <button
                        key={d}
                        onClick={() => setDifficulty(d)}
                        className={`flex-1 py-2.5 px-4 rounded-2xl text-sm font-semibold border transition-all ${
                          active ? `${cfg.bg} ${cfg.border} ${cfg.color} ${cfg.shadow}` : 'bg-slate-800/40 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        {cfg.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question Type */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-3 tracking-wide uppercase">
                  Question Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {([
                    { id: 'mcq', label: 'Multiple Choice' },
                    { id: 'true_false', label: 'True / False' },
                    { id: 'short_answer', label: 'Short Answer' },
                    { id: 'mixed', label: 'Mixed Types' },
                  ] as const).map(({ id, label }) => (
                    <button
                      key={id}
                      onClick={() => setQuestionType(id)}
                      className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all text-center ${
                        questionType === id
                          ? 'bg-indigo-600/30 border-indigo-500/50 text-white'
                          : 'bg-slate-800/40 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Count Slider */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-medium text-slate-300 tracking-wide uppercase">
                    Number of Questions
                  </label>
                  <span className="text-sm font-bold text-white bg-indigo-500/20 border border-indigo-500/30 px-3 py-1 rounded-xl">
                    {questionCount} Questions
                  </span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={15}
                  step={1}
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer accent-indigo-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1.5">
                  <span>5 (Quick)</span>
                  <span>15 (Full)</span>
                </div>
              </div>

              {/* Generate Button */}
              <GlassButton
                onClick={handleGenerate}
                disabled={!selectedDocId || isLoading}
                isLoading={isLoading}
                variant="primary"
                size="lg"
                icon={<Zap className="h-5 w-5 text-cyan-300" />}
                className="w-full shadow-[0_0_30px_rgba(99,102,241,0.4)]"
              >
                {isLoading ? 'Generating Quiz...' : 'Generate AI-Powered Quiz'}
              </GlassButton>
            </GlassCard>
          </motion.div>
        )}

        {/* ══════════════════════════ VIEW: QUIZ ══════════════════════════ */}
        {view === 'quiz' && currentQuestion && (
          <motion.div key="quiz" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
            {/* Progress Bar */}
            <GlassCard className="p-4">
              <div className="flex items-center justify-between text-sm mb-3">
                <span className="font-heading font-bold text-white flex items-center gap-2">
                  <FileQuestion className="h-4.5 w-4.5 text-indigo-400" />
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span className="text-xs text-slate-400">
                  {answeredCount} of {questions.length} answered
                </span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                  transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                />
              </div>
            </GlassCard>

            {/* Question Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
              >
                <GlassCard className="p-6 space-y-5">
                  {/* Topic badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-indigo-300 bg-indigo-500/15 px-3 py-1 rounded-full border border-indigo-500/25">
                      {currentQuestion.topic}
                    </span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${difficultyConfig[difficulty].bg} ${difficultyConfig[difficulty].border} ${difficultyConfig[difficulty].color}`}>
                      {difficultyConfig[difficulty].label}
                    </span>
                  </div>

                  {/* Question Text */}
                  <h2 className="text-lg font-heading font-bold text-white leading-snug">
                    {currentQuestion.question_text}
                  </h2>

                  {/* Options */}
                  <div className="space-y-3">
                    {currentQuestion.options.map((opt, oIdx) => {
                      const selected = userAnswers[currentIndex] === opt;
                      return (
                        <motion.button
                          key={oIdx}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => setUserAnswers((prev) => ({ ...prev, [currentIndex]: opt }))}
                          className={`w-full flex items-center gap-3 p-4 rounded-2xl border text-sm font-medium text-left transition-all ${
                            selected
                              ? 'bg-indigo-600/30 border-indigo-500/60 text-white shadow-[0_0_20px_rgba(99,102,241,0.35)]'
                              : 'bg-slate-800/40 border-white/10 text-slate-300 hover:border-white/25 hover:bg-slate-800/70 hover:text-white'
                          }`}
                        >
                          <span className={`h-7 w-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 border ${
                            selected ? 'bg-indigo-500 border-indigo-400 text-white' : 'bg-slate-700 border-white/10 text-slate-300'
                          }`}>
                            {['A', 'B', 'C', 'D'][oIdx] || (oIdx + 1)}
                          </span>
                          <span>{opt}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </GlassCard>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between gap-4">
              <GlassButton
                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                disabled={currentIndex === 0}
                variant="secondary"
                icon={<ChevronLeft className="h-4.5 w-4.5" />}
              >
                Previous
              </GlassButton>

              {currentIndex < questions.length - 1 ? (
                <GlassButton
                  onClick={() => setCurrentIndex(currentIndex + 1)}
                  variant="secondary"
                  icon={<ChevronRight className="h-4.5 w-4.5" />}
                >
                  Next Question
                </GlassButton>
              ) : (
                <GlassButton
                  onClick={() => setShowConfirmSubmit(true)}
                  variant="primary"
                  icon={<CheckCircle2 className="h-4.5 w-4.5" />}
                  className="shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                >
                  Submit Quiz
                </GlassButton>
              )}
            </div>

            {/* Submit Confirmation Modal */}
            <AnimatePresence>
              {showConfirmSubmit && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
                    onClick={() => setShowConfirmSubmit(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative w-full max-w-sm rounded-3xl bg-slate-900/90 backdrop-blur-[24px] border border-white/15 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.7)] z-10 text-center space-y-4"
                  >
                    <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 w-fit mx-auto">
                      <AlertCircle className="h-8 w-8" />
                    </div>
                    <h3 className="font-heading font-bold text-xl text-white">Submit Quiz?</h3>
                    <p className="text-sm text-slate-300">
                      You have answered <strong className="text-white">{answeredCount}</strong> of <strong className="text-white">{questions.length}</strong> questions. Unanswered questions will be marked incorrect.
                    </p>
                    <div className="flex gap-3">
                      <GlassButton onClick={() => setShowConfirmSubmit(false)} variant="secondary" className="flex-1">
                        Review Answers
                      </GlassButton>
                      <GlassButton onClick={handleSubmit} isLoading={isLoading} variant="primary" className="flex-1">
                        Submit Now
                      </GlassButton>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ══════════════════════════ VIEW: RESULTS ══════════════════════════ */}
        {view === 'results' && result && (
          <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            {/* Score Scorecard */}
            <GlassCard className="p-8 relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/15 rounded-full blur-[80px] pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-cyan-500/15 rounded-full blur-[80px] pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex flex-col items-center text-center gap-4">
                  <ScoreDial score={result.score_percent} />
                  <div className="space-y-1">
                    <h2 className="text-2xl font-heading font-extrabold text-white">{result.performance}</h2>
                    <p className="text-base">{result.performance_badge}</p>
                  </div>
                </div>

                <div className="flex-1 w-full space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Total Questions', value: result.total_questions, color: 'text-indigo-300' },
                      { label: 'Correct Answers', value: result.correct_answers, color: 'text-emerald-300' },
                      { label: 'Incorrect', value: result.total_questions - result.correct_answers, color: 'text-rose-300' },
                      { label: 'Score', value: `${result.score_percent}%`, color: 'text-cyan-300' },
                    ].map((stat) => (
                      <div key={stat.label} className="p-4 rounded-2xl bg-slate-800/50 border border-white/10 text-center">
                        <div className={`text-2xl font-heading font-extrabold ${stat.color}`}>{stat.value}</div>
                        <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {result.improvement_suggestions.length > 0 && (
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                      <h4 className="text-xs font-semibold text-amber-300 flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Improvement Suggestions
                      </h4>
                      {result.improvement_suggestions.map((s, i) => (
                        <p key={i} className="text-xs text-slate-300 leading-relaxed">• {s}</p>
                      ))}
                    </div>
                  )}

                  <GlassButton
                    onClick={() => { setView('config'); setResult(null); setQuestions([]); }}
                    variant="secondary"
                    icon={<RefreshCw className="h-4 w-4" />}
                    className="w-full"
                  >
                    Generate New Quiz
                  </GlassButton>
                </div>
              </div>
            </GlassCard>

            {/* Question-by-Question Breakdown */}
            <div>
              <h2 className="text-xl font-heading font-bold text-white flex items-center gap-2 mb-4">
                <BarChart3 className="h-5 w-5 text-indigo-400" />
                Question Breakdown
              </h2>

              <div className="space-y-4">
                {result.detailed_results.map((res, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <GlassCard
                      glowColor={res.is_correct ? 'emerald' : 'none'}
                      className={`p-5 space-y-3 border ${res.is_correct ? 'border-emerald-500/30' : 'border-rose-500/20'}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          {res.is_correct
                            ? <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                            : <XCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                          }
                          <h4 className="text-sm font-semibold text-white leading-snug">{res.question_text}</h4>
                        </div>
                        <span className="text-[10px] font-mono shrink-0 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                          {res.topic}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className={`p-2.5 rounded-xl border ${res.is_correct ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300' : 'bg-rose-500/10 border-rose-500/25 text-rose-300'}`}>
                          <span className="font-semibold block mb-0.5">Your Answer:</span>
                          <span className="text-slate-200">{res.user_answer || '(Not answered)'}</span>
                        </div>
                        <div className="p-2.5 rounded-xl border bg-emerald-500/10 border-emerald-500/25 text-emerald-300">
                          <span className="font-semibold block mb-0.5">Correct Answer:</span>
                          <span className="text-slate-200">{res.correct_answer}</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-slate-300 leading-relaxed flex gap-2">
                        <Sparkles className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{res.explanation}</span>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
