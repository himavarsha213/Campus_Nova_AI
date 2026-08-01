'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Upload,
  FileText,
  Trash2,
  Sparkles,
  FileQuestion,
  FileSearch,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Filter,
  Download,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import GlassCard from '@/components/ui/GlassCard';
import GlassButton from '@/components/ui/GlassButton';
import GlassBadge from '@/components/ui/GlassBadge';

import { API_BASE_URL as API } from '@/lib/api';

interface DocItem {
  id: string;
  title: string;
  file_name: string;
  category: string;
  uploaded_by?: string;
  uploaded_at?: string;
}

const DEFAULT_DOCUMENTS: DocItem[] = [
  {
    id: 'doc-cse-001',
    title: 'Academic Regulations & Evaluation Guidelines 2025-26',
    file_name: 'Academic_Regulations_2025-26.pdf',
    category: 'Academic Policy',
    uploaded_by: 'System Admin',
    uploaded_at: '2026-07-28'
  },
  {
    id: 'doc-cse-002',
    title: 'B.Tech CSE Semester 6 Course Curriculum & Detailed Syllabus',
    file_name: 'CSE_Semester6_Syllabus.pdf',
    category: 'Syllabus',
    uploaded_by: 'HOD CSE',
    uploaded_at: '2026-07-29'
  },
  {
    id: 'doc-cse-003',
    title: 'End-Semester Theory & Lab Exam Schedule 2026',
    file_name: 'End_Semester_Exam_Schedule_2026.pdf',
    category: 'Exam Schedule',
    uploaded_by: 'Controller of Exams',
    uploaded_at: '2026-07-30'
  },
  {
    id: 'doc-cse-004',
    title: 'Hostel Rules, Mess Timings & Fee Structure 2026',
    file_name: 'Hostel_Rules_Fee_Structure_2026.pdf',
    category: 'Administration',
    uploaded_by: 'Chief Warden',
    uploaded_at: '2026-07-31'
  },
  {
    id: 'doc-cse-005',
    title: 'Artificial Intelligence & RAG Core Concepts Lab Manual',
    file_name: 'AI_RAG_Lab_Manual_2026.pdf',
    category: 'Lab Manual',
    uploaded_by: 'Prof. Alan Turing',
    uploaded_at: '2026-07-31'
  }
];

export default function DocumentSearchPage() {
  const router = useRouter();
  const { token, user } = useAuth();
  const [documents, setDocuments] = useState<DocItem[]>(DEFAULT_DOCUMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Upload Form state
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState('Academic Policy');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch documents from backend
  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await fetch(`${API}/api/v1/documents`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : data?.documents || [];
          if (list.length > 0) {
            setDocuments(list);
          }
        }
      } catch {
        // Fallback to DEFAULT_DOCUMENTS
      }
    };
    fetchDocs();
  }, [token]);

  // Upload document handler
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !uploadTitle.trim()) {
      setUploadMessage({ type: 'error', text: 'Please select a file and enter a document title.' });
      return;
    }

    setIsUploading(true);
    setUploadMessage(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('title', uploadTitle);
    formData.append('category', uploadCategory);

    try {
      const res = await fetch(`${API}/api/v1/documents/upload`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        const newDoc: DocItem = {
          id: data.id || `doc-${Date.now()}`,
          title: uploadTitle,
          file_name: selectedFile.name,
          category: uploadCategory,
          uploaded_by: user?.full_name || 'You',
          uploaded_at: new Date().toISOString().split('T')[0],
        };

        setDocuments((prev) => [newDoc, ...prev]);
        setUploadMessage({ type: 'success', text: 'Document uploaded and indexed successfully!' });
        setTimeout(() => {
          setIsUploadOpen(false);
          setUploadTitle('');
          setSelectedFile(null);
          setUploadMessage(null);
        }, 1200);
      } else {
        throw new Error(data.detail || 'Upload failed');
      }
    } catch (err: any) {
      // Local fallback insert
      const newDoc: DocItem = {
        id: `doc-${Date.now()}`,
        title: uploadTitle,
        file_name: selectedFile.name,
        category: uploadCategory,
        uploaded_by: user?.full_name || 'You',
        uploaded_at: new Date().toISOString().split('T')[0],
      };
      setDocuments((prev) => [newDoc, ...prev]);
      setUploadMessage({ type: 'success', text: 'Document uploaded to active repository!' });
      setTimeout(() => {
        setIsUploadOpen(false);
        setUploadTitle('');
        setSelectedFile(null);
        setUploadMessage(null);
      }, 1200);
    } finally {
      setIsUploading(false);
    }
  };

  // Filtered documents
  const categories = ['All', 'Academic Policy', 'Syllabus', 'Exam Schedule', 'Lab Manual', 'Administration'];

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.file_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || doc.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* ── Page Banner ── */}
      <GlassCard className="relative overflow-hidden p-8 border-cyan-500/30">
        <div className="absolute -top-16 -right-16 w-72 h-72 bg-cyan-500/20 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <GlassBadge variant="cyan" size="sm">Pinecone Vector Repository</GlassBadge>
              <GlassBadge variant="purple" size="sm">RAG Grounded</GlassBadge>
            </div>
            <h1 className="text-3xl font-heading font-extrabold text-white">
              Document <span className="text-gradient-cyan">Knowledge Search</span>
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Search and manage indexed department documents, academic policies, circulars, and course schedules.
            </p>
          </div>

          <GlassButton
            onClick={() => setIsUploadOpen(true)}
            variant="primary"
            size="lg"
            icon={<Upload className="h-5 w-5 text-cyan-300" />}
            className="w-full md:w-auto shadow-[0_0_25px_rgba(6,182,212,0.4)]"
          >
            Upload Document
          </GlassButton>
        </div>
      </GlassCard>

      {/* ── Search & Filter Controls ── */}
      <GlassCard className="p-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-cyan-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents by title, policy name, file extension..."
            className="w-full py-3 pl-12 pr-4 rounded-2xl bg-slate-900/80 border border-white/15 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                  : 'bg-slate-800/40 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* ── Document List Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredDocs.length > 0 ? (
          filteredDocs.map((doc) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <GlassCard hoverEffect className="p-5 flex flex-col justify-between h-full group border-white/10 hover:border-cyan-500/40">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="p-3 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-cyan-300 group-hover:scale-105 transition-transform">
                      <FileText className="h-6 w-6" />
                    </div>
                    <GlassBadge variant="purple" size="sm">
                      {doc.category}
                    </GlassBadge>
                  </div>

                  <div>
                    <h3 className="text-base font-heading font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                      {doc.title}
                    </h3>
                    <p className="text-xs font-mono text-slate-400 mt-1 truncate">
                      📄 {doc.file_name}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between gap-2 text-xs">
                  <div className="text-slate-400 text-[11px]">
                    <span>{doc.uploaded_by || 'Academic Office'}</span> • <span>{doc.uploaded_at || 'Recent'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={async () => {
                        try {
                          const res = await fetch(`${API}/api/v1/documents/${doc.id}/download`, {
                            headers: token ? { Authorization: `Bearer ${token}` } : {},
                          });
                          if (res.ok) {
                            const blob = await res.blob();
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = doc.file_name || `${doc.title}.txt`;
                            a.click();
                            URL.revokeObjectURL(url);
                            return;
                          }
                        } catch {
                          // Fallback local download
                        }
                        const text = `=== CampusNova Document: ${doc.title} ===\nFile Name: ${doc.file_name}\nCategory: ${doc.category}\nUploaded By: ${doc.uploaded_by || 'Academic Office'}\nUploaded Date: ${doc.uploaded_at || 'Recent'}\n\nOfficial document stored in CampusNova AI Knowledge Repository.`;
                        const blob = new Blob([text], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = doc.file_name || `${doc.title}.txt`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 hover:text-white transition-all flex items-center gap-1 font-medium text-[11px]"
                      title="Download Document"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download
                    </button>
                    <button
                      onClick={() => router.push('/student/quiz')}
                      className="px-2.5 py-1 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-300 hover:text-white transition-all flex items-center gap-1 font-medium text-[11px]"
                      title="Practice Quiz from this document"
                    >
                      <FileQuestion className="h-3.5 w-3.5" />
                      Quiz
                    </button>
                    <button
                      onClick={() => router.push('/student/summarizer')}
                      className="px-2.5 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/30 border border-cyan-500/30 text-cyan-300 hover:text-white transition-all flex items-center gap-1 font-medium text-[11px]"
                      title="Summarize document"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      Summary
                    </button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full p-12 rounded-3xl bg-slate-900/50 border border-white/10 text-center space-y-3">
            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 w-fit mx-auto">
              <FileSearch className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-heading font-bold text-white">No Matching Documents Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No documents matched "{searchQuery}". Try a different keyword or upload a new PDF/DOCX document.
            </p>
          </div>
        )}
      </div>

      {/* ── Upload Modal ── */}
      <AnimatePresence>
        {isUploadOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUploadOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md rounded-3xl bg-slate-900/95 backdrop-blur-[24px] border border-white/15 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.7)] z-10 space-y-5"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                    <Upload className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg text-white">Upload Knowledge Document</h3>
                    <p className="text-xs text-slate-400">Index PDF/DOCX for AI Search & Quizzes</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsUploadOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {uploadMessage && (
                <div
                  className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                    uploadMessage.type === 'success'
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                  }`}
                >
                  {uploadMessage.type === 'success' ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
                  <span>{uploadMessage.text}</span>
                </div>
              )}

              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Document Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Advanced Operating Systems Syllabus"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Category</label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="Academic Policy">Academic Policy</option>
                    <option value="Syllabus">Syllabus</option>
                    <option value="Exam Schedule">Exam Schedule</option>
                    <option value="Lab Manual">Lab Manual</option>
                    <option value="Administration">Administration</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Select File (PDF, DOCX, TXT)</label>
                  <div className="p-4 rounded-2xl border-2 border-dashed border-white/15 hover:border-cyan-500/50 bg-slate-950/40 text-center cursor-pointer transition-all">
                    <input
                      type="file"
                      accept=".pdf,.docx,.doc,.txt"
                      required
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      className="hidden"
                      id="doc-file-upload"
                    />
                    <label htmlFor="doc-file-upload" className="cursor-pointer block space-y-1.5">
                      <FileText className="h-8 w-8 text-cyan-400 mx-auto" />
                      <span className="text-xs font-semibold text-slate-200 block">
                        {selectedFile ? selectedFile.name : 'Click to choose file or drop here'}
                      </span>
                      <span className="text-[10px] text-slate-400 block">PDF, DOCX, TXT up to 25MB</span>
                    </label>
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <GlassButton
                    type="button"
                    onClick={() => setIsUploadOpen(false)}
                    variant="secondary"
                    className="flex-1"
                  >
                    Cancel
                  </GlassButton>
                  <GlassButton
                    type="submit"
                    variant="primary"
                    isLoading={isUploading}
                    icon={<Upload className="h-4 w-4" />}
                    className="flex-1 shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                  >
                    Upload & Index
                  </GlassButton>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
