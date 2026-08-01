'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, AlertCircle, Calendar, Clock, Pin, Filter, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import GlassCard from '@/components/ui/GlassCard';
import GlassBadge from '@/components/ui/GlassBadge';

import { API_BASE_URL as API } from '@/lib/api';

interface Notice {
  id: string;
  title: string;
  description: string;
  category: string;
  is_pinned: boolean;
  expiry_date?: string;
  created_at: string;
}

const categoryColors: Record<string, { bg: string; border: string; text: string }> = {
  General:   { bg: 'bg-slate-500/15',  border: 'border-slate-500/30',  text: 'text-slate-300' },
  Exam:      { bg: 'bg-rose-500/15',   border: 'border-rose-500/30',   text: 'text-rose-300' },
  Event:     { bg: 'bg-violet-500/15', border: 'border-violet-500/30', text: 'text-violet-300' },
  Placement: { bg: 'bg-cyan-500/15',   border: 'border-cyan-500/30',   text: 'text-cyan-300' },
  Urgent:    { bg: 'bg-amber-500/15',  border: 'border-amber-500/30',  text: 'text-amber-300' },
  Research:  { bg: 'bg-emerald-500/15',border: 'border-emerald-500/30',text: 'text-emerald-300' },
  Holiday:   { bg: 'bg-fuchsia-500/15',border: 'border-fuchsia-500/30',text: 'text-fuchsia-300' },
};

export default function StudentNoticesPage() {
  const { token } = useAuth();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterCat, setFilterCat] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

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

  const categories = ['All', ...Array.from(new Set(notices.map(n => n.category).filter(Boolean)))];

  const filtered = filterCat === 'All' ? notices : notices.filter(n => n.category === filterCat);
  const sorted = [...filtered.filter(n => n.is_pinned), ...filtered.filter(n => !n.is_pinned)];

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <div>
        <GlassBadge variant="active" size="sm">Official Circulars</GlassBadge>
        <h1 className="text-3xl font-heading font-bold text-white mt-2">
          Department <span className="text-gradient">Notices</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Official departmental circulars, exam notifications, and campus news from faculty.
        </p>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="h-4 w-4 text-slate-500 shrink-0" />
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCat(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all
              ${filterCat === cat
                ? 'bg-indigo-600/25 border-indigo-500/40 text-indigo-300'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notice Feed */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-28 rounded-2xl bg-white/5 animate-pulse" />)}
        </div>
      ) : sorted.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <Bell className="h-12 w-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 font-medium">No notices yet</p>
          <p className="text-xs text-slate-500 mt-1">Faculty will publish notices here. Check back later.</p>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {sorted.map((notice) => {
            const c = categoryColors[notice.category] || categoryColors['General'];
            const isExpanded = expandedId === notice.id;
            return (
              <motion.div key={notice.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <GlassCard
                  hoverEffect
                  className={`overflow-hidden cursor-pointer transition-all ${notice.is_pinned ? 'border-amber-500/25 shadow-[0_0_20px_rgba(245,158,11,0.07)]' : ''}`}
                  onClick={() => setExpandedId(isExpanded ? null : notice.id)}
                >
                  <div className="flex items-start gap-4 p-5">
                    <div className={`mt-0.5 p-2 rounded-xl ${c.bg} border ${c.border} shrink-0`}>
                      {notice.category === 'Urgent'
                        ? <AlertCircle className={`h-4 w-4 ${c.text}`} />
                        : notice.is_pinned
                          ? <Pin className="h-4 w-4 text-amber-300" />
                          : <Bell className={`h-4 w-4 ${c.text}`} />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        {notice.is_pinned && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">📌 Pinned</span>
                        )}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${c.bg} ${c.border} ${c.text}`}>
                          {notice.category}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-white leading-snug">{notice.title}</h3>
                      {isExpanded && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-slate-300 mt-2 leading-relaxed">
                          {notice.description}
                        </motion.p>
                      )}
                      {!isExpanded && (
                        <p className="text-xs text-slate-400 mt-1 line-clamp-1">{notice.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {formatDate(notice.created_at)}</span>
                        {notice.expiry_date && (
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Expires: {formatDate(notice.expiry_date)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
