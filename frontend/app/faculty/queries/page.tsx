'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle,
  MessageSquare,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Upload,
  ChevronDown,
  ChevronUp,
  Loader2,
  Clock,
  User,
  Filter,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import GlassCard from '@/components/ui/GlassCard';
import GlassButton from '@/components/ui/GlassButton';
import GlassBadge from '@/components/ui/GlassBadge';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface UnansweredQuery {
  id: string;
  query_text: string;
  ai_response?: string;
  confidence_score?: number;
  status: 'pending' | 'resolved' | 'dismissed';
  faculty_notes?: string;
  created_at: string;
  student_id?: string;
}

export default function FacultyQueriesPage() {
  const { token } = useAuth();
  const [queries, setQueries] = useState<UnansweredQuery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'pending' | 'resolved' | 'dismissed'>('pending');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [resolving, setResolving] = useState<string | null>(null);

  useEffect(() => {
    if (token) fetchQueries();
  }, [token, statusFilter]);

  const fetchQueries = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API}/api/v1/notices/queries/unanswered?status_filter=${statusFilter}&limit=50`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setQueries(data.data || []);
      }
    } catch (err) {
      console.error('Fetch queries error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResolve = async (queryId: string) => {
    const note = notes[queryId]?.trim();
    if (!note) return;
    setResolving(queryId);
    try {
      const res = await fetch(`${API}/api/v1/notices/queries/${queryId}/resolve?faculty_notes=${encodeURIComponent(note)}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setQueries(prev => prev.filter(q => q.id !== queryId));
        setExpandedId(null);
      }
    } catch (err) {
      console.error('Resolve error:', err);
    } finally {
      setResolving(null);
    }
  };

  const confidenceColor = (score?: number) => {
    if (!score) return { text: 'text-slate-400', bg: 'bg-slate-500/15', border: 'border-slate-500/25' };
    if (score >= 0.7) return { text: 'text-emerald-300', bg: 'bg-emerald-500/15', border: 'border-emerald-500/25' };
    if (score >= 0.4) return { text: 'text-amber-300', bg: 'bg-amber-500/15', border: 'border-amber-500/25' };
    return { text: 'text-rose-300', bg: 'bg-rose-500/15', border: 'border-rose-500/25' };
  };

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  const statusTabs = [
    { key: 'pending',   label: 'Pending Review',  icon: AlertTriangle, color: 'text-amber-300' },
    { key: 'resolved',  label: 'Resolved',         icon: CheckCircle2,  color: 'text-emerald-300' },
    { key: 'dismissed', label: 'Dismissed',         icon: XCircle,       color: 'text-slate-400' },
  ] as const;

  return (
    <div className="space-y-8 py-6">

      {/* Header */}
      <div>
        <GlassBadge variant="warning" size="sm">Knowledge Gap Review</GlassBadge>
        <h1 className="text-3xl font-heading font-bold text-white mt-2">
          Unanswered <span className="text-gradient">Student Queries</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Review student questions where the AI returned low-confidence answers. Resolve gaps to strengthen the knowledge base.
        </p>
      </div>

      {/* Info Banner */}
      <GlassCard className="p-5 border-amber-500/20 bg-amber-500/5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-200">Why are queries flagged here?</p>
            <p className="text-xs text-amber-200/70 mt-1 leading-relaxed">
              When CampusNova AI has a confidence score below 70% or cannot find an answer in indexed documents,
              the query is automatically routed here for faculty review. Uploading the missing document or adding
              faculty notes helps close these gaps permanently.
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Status Tabs */}
      <div className="flex items-center gap-2">
        {statusTabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all
                ${statusFilter === tab.key
                  ? 'bg-violet-600/25 border-violet-500/40 text-white'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
                }`}
            >
              <Icon className={`h-3.5 w-3.5 ${statusFilter === tab.key ? tab.color : ''}`} />
              {tab.label}
              {statusFilter === tab.key && queries.length > 0 && (
                <span className="bg-violet-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{queries.length}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Query List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-24 rounded-2xl bg-white/5 animate-pulse" />)}
        </div>
      ) : queries.length === 0 ? (
        <GlassCard className="p-12 text-center">
          {statusFilter === 'pending' ? (
            <>
              <CheckCircle2 className="h-12 w-12 text-emerald-500/50 mx-auto mb-3" />
              <p className="text-slate-300 font-semibold">All queries resolved!</p>
              <p className="text-xs text-slate-500 mt-1">No pending student queries need your attention right now.</p>
            </>
          ) : (
            <>
              <HelpCircle className="h-12 w-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 font-medium">No {statusFilter} queries found.</p>
            </>
          )}
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {queries.map((query) => {
            const isExpanded = expandedId === query.id;
            const c = confidenceColor(query.confidence_score);
            return (
              <motion.div key={query.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <GlassCard className="overflow-hidden">
                  {/* Summary Row */}
                  <div
                    className="flex items-start gap-4 p-5 cursor-pointer hover:bg-white/3 transition-colors"
                    onClick={() => setExpandedId(isExpanded ? null : query.id)}
                  >
                    <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/25 shrink-0 mt-0.5">
                      <HelpCircle className="h-4 w-4 text-amber-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white leading-snug line-clamp-2">{query.query_text}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="flex items-center gap-1 text-[11px] text-slate-500">
                          <Clock className="h-3 w-3" /> {formatDate(query.created_at)}
                        </span>
                        {query.confidence_score !== undefined && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${c.bg} ${c.border} ${c.text}`}>
                            Confidence: {Math.round((query.confidence_score || 0) * 100)}%
                          </span>
                        )}
                        {query.status === 'resolved' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-300">
                            ✓ Resolved
                          </span>
                        )}
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-slate-400 shrink-0 mt-1" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-400 shrink-0 mt-1" />
                    )}
                  </div>

                  {/* Expanded Panel */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 space-y-4 border-t border-white/8 pt-4">

                          {/* AI Response */}
                          {query.ai_response && (
                            <div>
                              <p className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
                                <Sparkles className="h-3.5 w-3.5 text-violet-400" /> AI Response Given
                              </p>
                              <div className="p-3.5 rounded-xl bg-violet-500/8 border border-violet-500/20 text-xs text-slate-300 leading-relaxed">
                                {query.ai_response}
                              </div>
                            </div>
                          )}

                          {/* Faculty resolved notes */}
                          {query.status === 'resolved' && query.faculty_notes && (
                            <div>
                              <p className="text-xs font-semibold text-emerald-400 mb-2 flex items-center gap-1.5">
                                <CheckCircle2 className="h-3.5 w-3.5" /> Faculty Resolution Note
                              </p>
                              <div className="p-3.5 rounded-xl bg-emerald-500/8 border border-emerald-500/20 text-xs text-emerald-200 leading-relaxed">
                                {query.faculty_notes}
                              </div>
                            </div>
                          )}

                          {/* Resolve Actions (for pending queries) */}
                          {query.status === 'pending' && (
                            <div className="space-y-3">
                              <p className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                                <MessageSquare className="h-3.5 w-3.5 text-cyan-400" /> Add Resolution Note
                              </p>
                              <textarea
                                value={notes[query.id] || ''}
                                onChange={e => setNotes(prev => ({ ...prev, [query.id]: e.target.value }))}
                                placeholder="Provide the correct information or explain where students can find it. This note helps train the AI."
                                rows={3}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-violet-500/60 transition-all resize-none"
                              />
                              <div className="flex gap-3">
                                <GlassButton
                                  onClick={() => handleResolve(query.id)}
                                  disabled={resolving === query.id || !notes[query.id]?.trim()}
                                  variant="primary"
                                  size="sm"
                                  className="flex items-center gap-2"
                                >
                                  {resolving === query.id
                                    ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Resolving...</>
                                    : <><CheckCircle2 className="h-3.5 w-3.5" /> Mark Resolved</>
                                  }
                                </GlassButton>
                                <GlassButton
                                  variant="ghost"
                                  size="sm"
                                  className="flex items-center gap-1.5"
                                  onClick={() => {
                                    // Navigate to upload in a new tab
                                    window.location.href = '/faculty/documents';
                                  }}
                                >
                                  <Upload className="h-3.5 w-3.5" /> Upload Missing Doc
                                </GlassButton>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
