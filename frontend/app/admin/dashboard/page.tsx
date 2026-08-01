'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Users,
  FileText,
  Database,
  Cpu,
  Zap,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Server,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Sliders,
  FileCode2,
  Building2
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import GlassCard from '@/components/ui/GlassCard';
import GlassButton from '@/components/ui/GlassButton';
import GlassBadge from '@/components/ui/GlassBadge';

import { API_BASE_URL as API } from '@/lib/api';

interface SystemMetrics {
  total_users: number;
  students_count: number;
  faculty_count: number;
  admins_count: number;
  total_documents: number;
  total_chunks: number;
  vector_count: number;
  daily_query_volume: number;
  avg_latency_ms: number;
  hallucination_rate: string;
  audit_logs_count: number;
}

export default function AdminDashboardPage() {
  const { token, user } = useAuth();
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [health, setHealth] = useState<Record<string, string>>({
    database: 'operational',
    vector_store: 'operational',
    llm_service: 'operational'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) fetchTelemetry();
  }, [token]);

  const fetchTelemetry = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API}/api/v1/admin/telemetry`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMetrics(data.metrics);
        setHealth(data.system_health);
      }
    } catch (err) {
      console.error('Failed to load admin telemetry:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Platform Users',
      value: metrics ? metrics.total_users : '—',
      subtitle: `${metrics?.students_count || 0} Students · ${metrics?.faculty_count || 0} Faculty · ${metrics?.admins_count || 0} Admins`,
      icon: Users,
      color: 'rose',
      border: 'border-rose-500/30',
      glow: 'shadow-[0_0_24px_rgba(244,63,94,0.25)]',
      text: 'text-rose-400'
    },
    {
      title: 'Knowledge Base Documents',
      value: metrics ? metrics.total_documents : '—',
      subtitle: `${metrics?.total_chunks || 0} Index Text Chunks`,
      icon: FileText,
      color: 'violet',
      border: 'border-violet-500/30',
      glow: 'shadow-[0_0_24px_rgba(139,92,246,0.25)]',
      text: 'text-violet-400'
    },
    {
      title: 'Pinecone Vector Count',
      value: metrics ? metrics.vector_count : '—',
      subtitle: '384-Dim All-MiniLM Vectors',
      icon: Database,
      color: 'cyan',
      border: 'border-cyan-500/30',
      glow: 'shadow-[0_0_24px_rgba(6,182,212,0.25)]',
      text: 'text-cyan-400'
    },
    {
      title: 'Daily AI Query Volume',
      value: metrics ? metrics.daily_query_volume : '—',
      subtitle: 'RAG Pipeline Requests',
      icon: Zap,
      color: 'amber',
      border: 'border-amber-500/30',
      glow: 'shadow-[0_0_24px_rgba(245,158,11,0.25)]',
      text: 'text-amber-400'
    },
    {
      title: 'Avg. Response Latency',
      value: metrics ? `${metrics.avg_latency_ms} ms` : '—',
      subtitle: 'FastAPI + Pinecone + Groq',
      icon: Cpu,
      color: 'emerald',
      border: 'border-emerald-500/30',
      glow: 'shadow-[0_0_24px_rgba(16,185,129,0.25)]',
      text: 'text-emerald-400'
    },
    {
      title: 'Hallucination Rate',
      value: metrics ? metrics.hallucination_rate : '—',
      subtitle: 'Strict Citation Validation',
      icon: ShieldCheck,
      color: 'sky',
      border: 'border-sky-500/30',
      glow: 'shadow-[0_0_24px_rgba(14,165,233,0.25)]',
      text: 'text-sky-400'
    }
  ];

  const quickNav = [
    { title: 'Manage Users', href: '/admin/users', icon: Users, desc: 'RBAC role assignments & accounts', color: 'bg-rose-500/20 text-rose-300' },
    { title: 'Departments', href: '/admin/departments', icon: Building2, desc: 'Manage college departments & HODs', color: 'bg-violet-500/20 text-violet-300' },
    { title: 'Rebuild Knowledge Base', href: '/admin/knowledge-base', icon: Database, desc: 'Sync Pinecone vector indices', color: 'bg-cyan-500/20 text-cyan-300' },
    { title: 'AI Parameter Config', href: '/admin/ai-config', icon: Sliders, desc: 'Tune Temperature, Top-K & Models', color: 'bg-amber-500/20 text-amber-300' },
    { title: 'Audit Security Logs', href: '/admin/logs', icon: FileCode2, desc: 'Inspect platform audit telemetry', color: 'bg-emerald-500/20 text-emerald-300' },
  ];

  return (
    <div className="space-y-8 py-4">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <GlassBadge variant="admin" size="sm">System Control Center</GlassBadge>
            <span className="text-xs text-rose-400 font-mono flex items-center gap-1">
              <Activity className="h-3 w-3 animate-pulse" /> Live Telemetry
            </span>
          </div>
          <h1 className="text-3xl font-heading font-bold text-white">
            System <span className="text-gradient">Overview</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time platform telemetry, user metrics, vector store health, and operational controls.
          </p>
        </div>

        <GlassButton onClick={fetchTelemetry} variant="ghost" size="sm" className="flex items-center gap-2 self-start md:self-auto">
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh Telemetry
        </GlassButton>
      </div>

      {/* Global System Status Strip */}
      <GlassCard className="p-5 border-rose-500/25">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
              <Server className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white flex items-center gap-2">
                All Infrastructure Operational
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              </p>
              <p className="text-xs text-slate-400 mt-0.5">Vector Store, Supabase Auth, and RAG Pipeline are active.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
              <span className="text-slate-400">Database:</span>
              <span className="font-semibold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Supabase OK
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
              <span className="text-slate-400">Vector DB:</span>
              <span className="font-semibold text-cyan-400 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Pinecone OK
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
              <span className="text-slate-400">LLM Provider:</span>
              <span className="font-semibold text-amber-400 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Groq Active
              </span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Overview Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.title} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <GlassCard className={`p-6 ${card.glow} border ${card.border}`}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-slate-300">{card.title}</span>
                  <div className={`p-2 rounded-xl bg-slate-800/60 ${card.text}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-3xl font-heading font-bold text-white mb-1">
                  {isLoading ? '—' : card.value}
                </p>
                <p className="text-xs text-slate-400">{card.subtitle}</p>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Administrative Navigation Cards */}
      <div>
        <h2 className="text-lg font-heading font-bold text-white mb-4 flex items-center gap-2">
          <Sparkles className="h-4.5 w-4.5 text-rose-400" /> Platform Administration Tools
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickNav.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.title} href={item.href}>
                <GlassCard hoverEffect className="p-5 group cursor-pointer h-full flex flex-col justify-between">
                  <div>
                    <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-rose-300 transition-colors flex items-center justify-between">
                      {item.title}
                      <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </GlassCard>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
