'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Eye,
  RefreshCw,
  ChevronDown,
  Loader2,
  X,
  FilePlus,
  FolderOpen,
  Sparkles,
  Clock
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import GlassCard from '@/components/ui/GlassCard';
import GlassButton from '@/components/ui/GlassButton';
import GlassBadge from '@/components/ui/GlassBadge';

import { API_BASE_URL as API } from '@/lib/api';

const CATEGORIES = ['Syllabus', 'Lab Manual', 'Exam Rules', 'Placement Circular', 'Lecture Notes', 'Assignment', 'Research Paper', 'General'];

interface UploadStep {
  label: string;
  status: 'pending' | 'active' | 'done' | 'error';
}

interface Document {
  id: string;
  original_filename: string;
  title?: string;
  category?: string;
  status?: string;
  created_at?: string;
  file_size?: number;
}

export default function FacultyDocumentsPage() {
  const { token } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(true);

  // Upload state
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Syllabus');
  const [catOpen, setCatOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [uploadSteps, setUploadSteps] = useState<UploadStep[]>([
    { label: 'Uploading file to server', status: 'pending' },
    { label: 'Extracting text content', status: 'pending' },
    { label: 'Generating embeddings', status: 'pending' },
    { label: 'Storing in Pinecone vector DB', status: 'pending' },
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchDocuments();
  }, [token]);

  const fetchDocuments = async () => {
    setIsLoadingDocs(true);
    try {
      const res = await fetch(`${API}/api/v1/documents`, {
        headers: { Authorization: `Bearer ${token || 'demo-faculty-token'}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDocuments(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Fetch docs error:', err);
    } finally {
      setIsLoadingDocs(false);
    }
  };

  const resetUploadSteps = () => {
    setUploadSteps([
      { label: 'Uploading file to server', status: 'pending' },
      { label: 'Extracting text content', status: 'pending' },
      { label: 'Generating embeddings', status: 'pending' },
      { label: 'Storing in Pinecone vector DB', status: 'pending' },
    ]);
  };

  const setStepStatus = (index: number, status: UploadStep['status']) => {
    setUploadSteps(prev => prev.map((s, i) => i === index ? { ...s, status } : s));
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, []);

  const handleFileSelect = (file: File) => {
    const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'text/csv'];
    if (!allowed.includes(file.type) && !file.name.endsWith('.pdf') && !file.name.endsWith('.txt') && !file.name.endsWith('.docx')) {
      setUploadError('Unsupported file type. Please upload PDF, DOCX, TXT, or CSV.');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setUploadError('File exceeds 50MB limit.');
      return;
    }
    setSelectedFile(file);
    setTitle(file.name.replace(/\.[^.]+$/, ''));
    setUploadError(null);
    setUploadSuccess(false);
    resetUploadSteps();
  };

  const handleUpload = async () => {
    if (!selectedFile || !title.trim()) {
      setUploadError('Please select a file and enter a title.');
      return;
    }
    setIsUploading(true);
    setUploadError(null);
    resetUploadSteps();

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('title', title);
    formData.append('category', category);

    try {
      // Step 1: upload
      setStepStatus(0, 'active');
      const res = await fetch(`${API}/api/v1/documents/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token || 'demo-faculty-token'}` },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: 'Upload failed' }));
        throw new Error(err.detail || 'Upload failed');
      }
      setStepStatus(0, 'done');

      // Steps 2-4: simulate processing stages (the backend does these internally)
      for (let i = 1; i <= 3; i++) {
        setStepStatus(i, 'active');
        await new Promise(r => setTimeout(r, 900 + i * 400));
        setStepStatus(i, 'done');
      }

      setUploadSuccess(true);
      setSelectedFile(null);
      setTitle('');
      setCategory('Syllabus');
      await fetchDocuments();

    } catch (err: any) {
      setUploadError(err.message || 'Upload failed. Please try again.');
      // Mark current active step as error
      setUploadSteps(prev => prev.map(s => s.status === 'active' ? { ...s, status: 'error' } : s));
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (docId: string) => {
    try {
      const res = await fetch(`${API}/api/v1/documents/${docId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setDocuments(prev => prev.filter(d => d.id !== docId));
      }
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setDeleteConfirm(null);
    }
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return '—';
    return bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
  };

  const formatDate = (iso?: string) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const stepColors = {
    pending: 'bg-slate-700/50 border-slate-600/40 text-slate-500',
    active: 'bg-violet-500/20 border-violet-500/40 text-violet-300 animate-pulse',
    done: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
    error: 'bg-rose-500/15 border-rose-500/30 text-rose-300',
  };

  return (
    <div className="space-y-8 py-6">

      {/* Header */}
      <div>
        <GlassBadge variant="active" size="sm">Upload Center</GlassBadge>
        <h1 className="text-3xl font-heading font-bold text-white mt-2">
          Document <span className="text-gradient">Management</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">Upload documents to power the student AI knowledge base. Files are automatically indexed into Pinecone.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* ── Upload Dropzone ── */}
        <div className="space-y-4">
          <GlassCard className="p-6">
            <h2 className="text-base font-heading font-bold text-white mb-4 flex items-center gap-2">
              <FilePlus className="h-4 w-4 text-violet-400" /> Upload New Document
            </h2>

            {/* Dropzone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative flex flex-col items-center justify-center p-10 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300
                ${dragOver
                  ? 'border-violet-400 bg-violet-500/10 scale-[1.01]'
                  : selectedFile
                    ? 'border-emerald-500/50 bg-emerald-500/5'
                    : 'border-white/15 bg-white/3 hover:border-violet-500/40 hover:bg-violet-500/5'
                }
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt,.csv"
                className="hidden"
                onChange={e => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              />
              {selectedFile ? (
                <div className="text-center">
                  <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto mb-3" />
                  <p className="text-sm font-bold text-emerald-300">{selectedFile.name}</p>
                  <p className="text-xs text-slate-400 mt-1">{formatSize(selectedFile.size)}</p>
                  <button
                    onClick={e => { e.stopPropagation(); setSelectedFile(null); setTitle(''); setUploadError(null); resetUploadSteps(); }}
                    className="mt-3 text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 mx-auto"
                  >
                    <X className="h-3 w-3" /> Remove
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="h-10 w-10 text-violet-400/70 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-300">Drag & drop or click to upload</p>
                  <p className="text-xs text-slate-500 mt-1">PDF, DOCX, TXT, CSV — up to 50 MB</p>
                </div>
              )}
            </div>

            {/* Form fields */}
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Document Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. CSE 6th Sem Syllabus 2026"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500/60 focus:bg-violet-500/5 transition-all"
                />
              </div>

              <div className="relative">
                <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Category *</label>
                <button
                  type="button"
                  onClick={() => setCatOpen(!catOpen)}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-white hover:border-violet-500/40 transition-all"
                >
                  <span>{category}</span>
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${catOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {catOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                      className="absolute z-20 top-full mt-1.5 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border border-white/15 rounded-xl overflow-hidden shadow-2xl"
                    >
                      {CATEGORIES.map(cat => (
                        <button
                          key={cat}
                          onClick={() => { setCategory(cat); setCatOpen(false); }}
                          className={`w-full text-left px-4 py-2.5 text-sm hover:bg-violet-600/20 transition-colors ${category === cat ? 'text-violet-300 bg-violet-600/15' : 'text-slate-300'}`}
                        >
                          {cat}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Upload Progress */}
            <AnimatePresence>
              {isUploading && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-4 overflow-hidden">
                  <div className="space-y-2">
                    {uploadSteps.map((step, i) => (
                      <div key={i} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border text-xs font-medium ${stepColors[step.status]}`}>
                        {step.status === 'active' ? <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" />
                          : step.status === 'done' ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                          : step.status === 'error' ? <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                          : <Clock className="h-3.5 w-3.5 shrink-0 opacity-40" />
                        }
                        {step.label}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error / Success */}
            {uploadError && (
              <div className="mt-4 flex items-start gap-2 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-xs text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{uploadError}</span>
              </div>
            )}
            {uploadSuccess && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-300">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Document uploaded and indexed successfully! Students can now query it via AI Chat.</span>
              </motion.div>
            )}

            <GlassButton
              onClick={handleUpload}
              disabled={isUploading || !selectedFile}
              variant="primary"
              className="w-full mt-5 flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
              ) : (
                <><Sparkles className="h-4 w-4" /> Upload & Index Document</>
              )}
            </GlassButton>
          </GlassCard>
        </div>

        {/* ── Document Inventory ── */}
        <div>
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-heading font-bold text-white flex items-center gap-2">
                <FolderOpen className="h-4 w-4 text-violet-400" /> Document Inventory
                <span className="text-xs font-normal text-slate-400 ml-1">({documents.length} files)</span>
              </h2>
              <button onClick={fetchDocuments} className="p-1.5 text-slate-400 hover:text-violet-300 transition-colors rounded-lg hover:bg-violet-500/10">
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>

            {isLoadingDocs ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : documents.length === 0 ? (
              <div className="text-center py-12">
                <FolderOpen className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-400">No documents uploaded yet.</p>
                <p className="text-xs text-slate-500 mt-1">Upload your first document to populate the AI knowledge base.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
                {documents.map((doc) => (
                  <motion.div
                    key={doc.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-white/4 border border-white/8 hover:bg-white/7 hover:border-white/12 transition-all group"
                  >
                    <div className="p-2 rounded-lg bg-violet-500/15 border border-violet-500/25 shrink-0">
                      <FileText className="h-4 w-4 text-violet-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{doc.original_filename || doc.title || 'Unnamed'}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-slate-500">{doc.category || 'General'}</span>
                        <span className="text-[10px] text-slate-600">•</span>
                        <span className="text-[10px] text-slate-500">{formatDate(doc.created_at)}</span>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 font-semibold shrink-0">
                      Active
                    </span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setDeleteConfirm(doc.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900/95 border border-rose-500/25 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-rose-500/15 border border-rose-500/25">
                  <Trash2 className="h-5 w-5 text-rose-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Delete Document?</h3>
                  <p className="text-xs text-slate-400 mt-0.5">This will remove it from the AI knowledge base.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-300 hover:bg-white/10 transition-all">
                  Cancel
                </button>
                <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600/80 hover:bg-rose-500 text-sm text-white font-semibold transition-all">
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
