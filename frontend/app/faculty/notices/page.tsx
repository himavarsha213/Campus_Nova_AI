'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Plus,
  Pin,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Calendar,
  Tag,
  X,
  Loader2,
  Clock,
  Filter
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import GlassCard from '@/components/ui/GlassCard';
import GlassButton from '@/components/ui/GlassButton';
import GlassBadge from '@/components/ui/GlassBadge';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const CATEGORIES = ['General', 'Exam', 'Event', 'Placement', 'Urgent', 'Research', 'Holiday'];

const categoryColors: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  General:   { bg: 'bg-slate-500/15',  border: 'border-slate-500/30',  text: 'text-slate-300',  dot: 'bg-slate-400' },
  Exam:      { bg: 'bg-rose-500/15',   border: 'border-rose-500/30',   text: 'text-rose-300',   dot: 'bg-rose-400' },
  Event:     { bg: 'bg-violet-500/15', border: 'border-violet-500/30', text: 'text-violet-300', dot: 'bg-violet-400' },
  Placement: { bg: 'bg-cyan-500/15',   border: 'border-cyan-500/30',   text: 'text-cyan-300',   dot: 'bg-cyan-400' },
  Urgent:    { bg: 'bg-amber-500/15',  border: 'border-amber-500/30',  text: 'text-amber-300',  dot: 'bg-amber-400' },
  Research:  { bg: 'bg-emerald-500/15',border: 'border-emerald-500/30',text: 'text-emerald-300',dot: 'bg-emerald-400' },
  Holiday:   { bg: 'bg-fuchsia-500/15',border: 'border-fuchsia-500/30',text: 'text-fuchsia-300',dot: 'bg-fuchsia-400' },
};

interface Notice {
  id: string;
  title: string;
  description: string;
  category: string;
  is_pinned: boolean;
  expiry_date?: string;
  created_at: string;
  department_id?: string;
}

export default function FacultyNoticesPage() {
  const { token } = useAuth();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterCat, setFilterCat] = useState<string>('All');
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'General',
    expiry_date: '',
    is_pinned: false,
  });

  useEffect(() => {
    if (token) fetchNotices();
  }, [token]);

  const fetchNotices = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API}/api/v1/notices?limit=50`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotices(data.data || []);
      }
    } catch (err) {
      console.error('Fetch notices error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      setError('Title and description are required.');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/v1/notices`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          category: form.category,
          expiry_date: form.expiry_date || null,
          is_pinned: form.is_pinned,
        })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: 'Failed to create notice' }));
        throw new Error(err.detail);
      }
      setSubmitSuccess(true);
      setForm({ title: '', description: '', category: 'General', expiry_date: '', is_pinned: false });
      setTimeout(() => { setSubmitSuccess(false); setShowForm(false); }, 1500);
      await fetchNotices();
    } catch (err: any) {
      setError(err.message || 'Failed to create notice');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePin = async (id: string) => {
    try {
      const res = await fetch(`${API}/api/v1/notices/${id}/pin`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setNotices(prev => prev.map(n => n.id === id ? { ...n, is_pinned: !n.is_pinned } : n));
      }
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API}/api/v1/notices/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setNotices(prev => prev.filter(n => n.id !== id));
      }
    } catch (err) { console.error(err); }
    finally { setDeleteConfirm(null); }
  };

  const filteredNotices = filterCat === 'All'
    ? notices
    : notices.filter(n => n.category === filterCat);

  const pinnedNotices = filteredNotices.filter(n => n.is_pinned);
  const unpinnedNotices = filteredNotices.filter(n => !n.is_pinned);
  const sorted = [...pinnedNotices, ...unpinnedNotices];

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const isExpired = (d?: string) => d ? new Date(d) < new Date() : false;

  return (
    <div className="space-y-8 py-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <GlassBadge variant="active" size="sm">Notice Management</GlassBadge>
          <h1 className="text-3xl font-heading font-bold text-white mt-2">
            Notice <span className="text-gradient">Publisher</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Broadcast departmental circulars, exam schedules, and events to all students.</p>
        </div>
        <GlassButton
          onClick={() => { setShowForm(!showForm); setError(null); setSubmitSuccess(false); }}
          variant="primary"
          className="flex items-center gap-2 shrink-0"
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? 'Cancel' : 'New Notice'}
        </GlassButton>
      </div>

      {/* ── Create Form ── */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <GlassCard className="p-6 border-violet-500/20">
              <h2 className="text-base font-heading font-bold text-white mb-5 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-violet-400" /> Create New Notice
              </h2>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Notice Title *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="e.g. End-Semester Exam Schedule Published"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500/60 focus:bg-violet-500/5 transition-all"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Description *</label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Write the full notice content here..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500/60 focus:bg-violet-500/5 transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-2 block">Category</label>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.map(cat => {
                        const c = categoryColors[cat] || categoryColors['General'];
                        return (
                          <button
                            key={cat}
                            onClick={() => setForm(f => ({ ...f, category: cat }))}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all
                              ${form.category === cat ? `${c.bg} ${c.border} ${c.text}` : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'}`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${form.category === cat ? c.dot : 'bg-slate-600'}`} />
                            {cat}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 mb-1.5 block flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" /> Expiry Date (optional)
                      </label>
                      <input
                        type="date"
                        value={form.expiry_date}
                        onChange={e => setForm(f => ({ ...f, expiry_date: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-violet-500/60 transition-all"
                      />
                    </div>
                    <div
                      className="flex items-center justify-between p-3 rounded-xl bg-white/4 border border-white/10 cursor-pointer"
                      onClick={() => setForm(f => ({ ...f, is_pinned: !f.is_pinned }))}
                    >
                      <div className="flex items-center gap-2">
                        <Pin className="h-4 w-4 text-amber-400" />
                        <span className="text-sm text-slate-300 font-medium">Pin to Top</span>
                      </div>
                      <div className={`relative h-5 w-10 rounded-full transition-all ${form.is_pinned ? 'bg-amber-500' : 'bg-slate-700'}`}>
                        <div className={`absolute top-0.5 left-0.5 h-4 w-4 bg-white rounded-full shadow transition-transform ${form.is_pinned ? 'translate-x-5' : ''}`} />
                      </div>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-xs text-rose-300">
                    <AlertCircle className="h-4 w-4 shrink-0" /> {error}
                  </div>
                )}
                {submitSuccess && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-300">
                    <CheckCircle2 className="h-4 w-4 shrink-0" /> Notice published successfully!
                  </div>
                )}

                <GlassButton onClick={handleCreate} disabled={isSubmitting} variant="primary" className="w-full flex items-center justify-center gap-2">
                  {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Publishing...</> : <><Bell className="h-4 w-4" /> Publish Notice</>}
                </GlassButton>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Filter Pills ── */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="h-4 w-4 text-slate-500 shrink-0" />
        {['All', ...CATEGORIES].map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCat(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all
              ${filterCat === cat
                ? 'bg-violet-600/25 border-violet-500/40 text-violet-300'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Notice Feed ── */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-28 rounded-2xl bg-white/5 animate-pulse" />)}
        </div>
      ) : sorted.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <Bell className="h-12 w-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 font-medium">No notices yet</p>
          <p className="text-xs text-slate-500 mt-1">Click "New Notice" to publish your first announcement.</p>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {sorted.map((notice) => {
            const c = categoryColors[notice.category] || categoryColors['General'];
            const expired = isExpired(notice.expiry_date);
            return (
              <motion.div
                key={notice.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <GlassCard className={`p-5 ${notice.is_pinned ? 'border-amber-500/25 shadow-[0_0_20px_rgba(245,158,11,0.08)]' : ''} ${expired ? 'opacity-60' : ''}`}>
                  <div className="flex items-start gap-4">
                    {/* Category dot */}
                    <div className={`mt-1 p-2 rounded-xl ${c.bg} border ${c.border} shrink-0`}>
                      {notice.category === 'Urgent' ? <AlertCircle className={`h-4 w-4 ${c.text}`} />
                        : notice.is_pinned ? <Pin className="h-4 w-4 text-amber-300" />
                        : <Bell className={`h-4 w-4 ${c.text}`} />}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        {notice.is_pinned && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">📌 Pinned</span>
                        )}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${c.bg} ${c.border} ${c.text}`}>{notice.category}</span>
                        {expired && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-400 border border-slate-600/30">Expired</span>}
                      </div>
                      <h3 className="text-sm font-bold text-white leading-snug">{notice.title}</h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">{notice.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {formatDate(notice.created_at)}</span>
                        {notice.expiry_date && (
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Expires: {formatDate(notice.expiry_date)}</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handlePin(notice.id)}
                        className={`p-2 rounded-lg transition-all ${notice.is_pinned ? 'text-amber-400 bg-amber-500/10 border border-amber-500/25' : 'text-slate-500 hover:text-amber-300 hover:bg-amber-500/10'}`}
                        title={notice.is_pinned ? 'Unpin' : 'Pin to top'}
                      >
                        <Pin className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(notice.id)}
                        className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                        title="Delete notice"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900/95 border border-rose-500/25 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-rose-500/15 border border-rose-500/25">
                  <Trash2 className="h-5 w-5 text-rose-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Delete Notice?</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Students will no longer see this notice.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-300 hover:bg-white/10 transition-all">Cancel</button>
                <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600/80 hover:bg-rose-500 text-sm text-white font-semibold transition-all">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
