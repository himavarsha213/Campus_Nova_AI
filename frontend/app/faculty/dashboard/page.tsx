'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Upload,
  FileText,
  Bell,
  HelpCircle,
  Users,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  Sparkles,
  BookOpen,
  BarChart3,
  ChevronRight,
  Activity
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import GlassCard from '@/components/ui/GlassCard';
import GlassButton from '@/components/ui/GlassButton';
import GlassBadge from '@/components/ui/GlassBadge';

import { API_BASE_URL as API } from '@/lib/api';

interface DashboardStats {
  total_documents: number;
  active_notices: number;
  pending_queries: number;
  resolved_queries: number;
}

export default function FacultyDashboardPage() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    total_documents: 0,
    active_notices: 0,
    pending_queries: 0,
    resolved_queries: 0,
  });
  const [recentDocs, setRecentDocs] = useState<any[]>([]);
  const [recentNotices, setRecentNotices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetchDashboardData();
  }, [token]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const [docsRes, noticesRes, queriesRes] = await Promise.allSettled([
        fetch(`${API}/api/v1/documents`, { headers }),
        fetch(`${API}/api/v1/notices?limit=5`, { headers }),
        fetch(`${API}/api/v1/notices/queries/unanswered?status_filter=pending&limit=5`, { headers }),
      ]);

      let docCount = 0;
      let docs: any[] = [];
      if (docsRes.status === 'fulfilled' && docsRes.value.ok) {
        const d = await docsRes.value.json();
        docs = Array.isArray(d) ? d.slice(0, 5) : [];
        docCount = docs.length;
      }

      let noticeCount = 0;
      let notices: any[] = [];
      if (noticesRes.status === 'fulfilled' && noticesRes.value.ok) {
        const d = await noticesRes.value.json();
        notices = d.data || [];
        noticeCount = d.count || 0;
      }

      let pendingQ = 0;
      let resolvedQ = 0;
      if (queriesRes.status === 'fulfilled' && queriesRes.value.ok) {
        const d = await queriesRes.value.json();
        pendingQ = d.count || 0;
      }

      setStats({ total_documents: docCount, active_notices: noticeCount, pending_queries: pendingQ, resolved_queries: resolvedQ });
      setRecentDocs(docs);
      setRecentNotices(notices.slice(0, 3));
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      label: 'Uploaded Documents',
      value: isLoading ? '—' : stats.total_documents,
      icon: BookOpen,
      color: 'violet',
      glow: 'shadow-[0_0_24px_rgba(139,92,246,0.3)]',
      bg: 'bg-violet-500/15',
      border: 'border-violet-500/30',
      text: 'text-violet-300',
      desc: 'Indexed in knowledge base',
    },
    {
      label: 'Active Notices',
      value: isLoading ? '—' : stats.active_notices,
      icon: Bell,
      color: 'cyan',
      glow: 'shadow-[0_0_24px_rgba(6,182,212,0.3)]',
      bg: 'bg-cyan-500/15',
      border: 'border-cyan-500/30',
      text: 'text-cyan-300',
      desc: 'Published & visible',
    },
    {
      label: 'Pending Queries',
      value: isLoading ? '—' : stats.pending_queries,
      icon: HelpCircle,
      color: 'amber',
      glow: 'shadow-[0_0_24px_rgba(245,158,11,0.3)]',
      bg: 'bg-amber-500/15',
      border: 'border-amber-500/30',
      text: 'text-amber-300',
      desc: 'Need faculty review',
    },
    {
      label: 'Queries Resolved',
      value: isLoading ? '—' : stats.resolved_queries,
      icon: CheckCircle2,
      color: 'emerald',
      glow: 'shadow-[0_0_24px_rgba(16,185,129,0.3)]',
      bg: 'bg-emerald-500/15',
      border: 'border-emerald-500/30',
      text: 'text-emerald-300',
      desc: 'Closed knowledge gaps',
    },
  ];

  const quickActions = [
    { label: 'Upload Document', icon: Upload, href: '/faculty/documents', color: 'bg-violet-600 hover:bg-violet-500', desc: 'Add to knowledge base' },
    { label: 'Publish Notice', icon: Bell, href: '/faculty/notices', color: 'bg-cyan-600 hover:bg-cyan-500', desc: 'Broadcast to students' },
    { label: 'Review Queries', icon: HelpCircle, href: '/faculty/queries', color: 'bg-amber-600 hover:bg-amber-500', desc: 'Unanswered questions' },
    { label: 'View Analytics', icon: BarChart3, href: '/faculty/analytics', color: 'bg-emerald-600 hover:bg-emerald-500', desc: 'Department insights' },
  ];

  const containerVariants = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="space-y-8 py-6">

      {/* ── Header ── */}
      <motion.div variants={itemVariants} initial="hidden" animate="show" className="flex flex-col gap-1">
        <div className="flex items-center gap-2 mb-1">
          <GlassBadge variant="active" size="sm">Faculty Portal</GlassBadge>
        </div>
        <h1 className="text-3xl font-heading font-bold text-white">
          Welcome back, <span className="text-gradient">{user?.full_name?.split(' ')[0] || 'Professor'}</span> 👋
        </h1>
        <p className="text-slate-400 text-sm">
          Manage your department documents, publish notices, and review student queries from one place.
        </p>
      </motion.div>

      {/* ── Stat Grid ── */}
      <motion.div
        variants={containerVariants} initial="hidden" animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.label} variants={itemVariants}>
              <GlassCard className={`p-5 ${card.glow}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-xl ${card.bg} border ${card.border}`}>
                    <Icon className={`h-5 w-5 ${card.text}`} />
                  </div>
                  <Activity className="h-4 w-4 text-slate-600" />
                </div>
                <p className="text-3xl font-heading font-bold text-white mb-0.5">{card.value}</p>
                <p className="text-xs font-semibold text-slate-300">{card.label}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{card.desc}</p>
              </GlassCard>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── Quick Actions ── */}
      <motion.div variants={containerVariants} initial="hidden" animate="show">
        <h2 className="text-base font-heading font-bold text-white mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-violet-400" /> Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <motion.div key={action.label} variants={itemVariants}>
                <Link href={action.href}>
                  <GlassCard hoverEffect className="p-5 cursor-pointer group">
                    <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center mb-3 transition-all group-hover:scale-110`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-sm font-bold text-white">{action.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{action.desc}</p>
                  </GlassCard>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ── Recent Uploads & Notices ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Uploads */}
        <motion.div variants={itemVariants} initial="hidden" animate="show">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-heading font-bold text-white flex items-center gap-2">
                <FileText className="h-4 w-4 text-violet-400" /> Recent Uploads
              </h2>
              <Link href="/faculty/documents">
                <button className="text-xs text-violet-300 hover:text-violet-200 flex items-center gap-1 transition-colors">
                  View all <ChevronRight className="h-3 w-3" />
                </button>
              </Link>
            </div>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-14 rounded-xl bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : recentDocs.length === 0 ? (
              <div className="text-center py-8">
                <Upload className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-400">No documents uploaded yet</p>
                <Link href="/faculty/documents">
                  <button className="mt-3 text-xs text-violet-400 hover:text-violet-300 underline underline-offset-2">Upload your first document →</button>
                </Link>
              </div>
            ) : (
              <div className="space-y-2.5">
                {recentDocs.map((doc: any, i) => (
                  <div key={doc.id || i} className="flex items-center gap-3 p-3 rounded-xl bg-white/4 border border-white/8 hover:bg-white/7 transition-colors">
                    <div className="p-2 rounded-lg bg-violet-500/15 border border-violet-500/25">
                      <FileText className="h-4 w-4 text-violet-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{doc.original_filename || doc.title}</p>
                      <p className="text-[11px] text-slate-400">{doc.category || 'General'}</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 font-semibold">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </motion.div>

        {/* Recent Notices */}
        <motion.div variants={itemVariants} initial="hidden" animate="show">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-heading font-bold text-white flex items-center gap-2">
                <Bell className="h-4 w-4 text-cyan-400" /> Published Notices
              </h2>
              <Link href="/faculty/notices">
                <button className="text-xs text-cyan-300 hover:text-cyan-200 flex items-center gap-1 transition-colors">
                  Manage <ChevronRight className="h-3 w-3" />
                </button>
              </Link>
            </div>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-14 rounded-xl bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : recentNotices.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-400">No notices published yet</p>
                <Link href="/faculty/notices">
                  <button className="mt-3 text-xs text-cyan-400 hover:text-cyan-300 underline underline-offset-2">Publish your first notice →</button>
                </Link>
              </div>
            ) : (
              <div className="space-y-2.5">
                {recentNotices.map((notice: any, i) => (
                  <div key={notice.id || i} className="flex items-start gap-3 p-3 rounded-xl bg-white/4 border border-white/8 hover:bg-white/7 transition-colors">
                    <div className="p-2 rounded-lg bg-cyan-500/15 border border-cyan-500/25 mt-0.5">
                      {notice.is_pinned
                        ? <AlertCircle className="h-4 w-4 text-amber-300" />
                        : <Bell className="h-4 w-4 text-cyan-300" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{notice.title}</p>
                      <p className="text-[11px] text-slate-400">{notice.category || 'General'}</p>
                    </div>
                    {notice.is_pinned && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/25 font-semibold shrink-0">
                        Pinned
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </motion.div>
      </div>

      {/* ── Department Activity Strip ── */}
      <motion.div variants={itemVariants} initial="hidden" animate="show">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-heading font-bold text-white flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-fuchsia-400" /> Department at a Glance
              </h2>
              <p className="text-xs text-slate-400">Your knowledge base is powering student AI queries in real-time.</p>
            </div>
            <Link href="/faculty/analytics">
              <GlassButton size="sm" variant="ghost" className="hidden md:flex items-center gap-1">
                Full Analytics <ArrowRight className="h-3.5 w-3.5" />
              </GlassButton>
            </Link>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-4">
            {[
              { label: 'AI Queries Today', value: '—', icon: Sparkles, color: 'text-violet-300' },
              { label: 'Avg. Response Time', value: '1.2s', icon: Clock, color: 'text-cyan-300' },
              { label: 'Student Satisfaction', value: '94%', icon: Users, color: 'text-emerald-300' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="text-center p-4 rounded-xl bg-white/4 border border-white/8">
                  <Icon className={`h-5 w-5 ${item.color} mx-auto mb-2`} />
                  <p className="text-xl font-heading font-bold text-white">{item.value}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.label}</p>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </motion.div>

    </div>
  );
}
