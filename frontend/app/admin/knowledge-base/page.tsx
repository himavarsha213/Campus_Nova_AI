'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Database,
  RefreshCw,
  Cpu,
  Layers,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Zap,
  Activity,
  HardDrive
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import GlassCard from '@/components/ui/GlassCard';
import GlassButton from '@/components/ui/GlassButton';
import GlassBadge from '@/components/ui/GlassBadge';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function AdminKnowledgeBasePage() {
  const { token } = useAuth();
  const [telemetry, setTelemetry] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRebuilding, setIsRebuilding] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

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
        setTelemetry(data.metrics);
      }
    } catch (err) {
      console.error('Failed to fetch KB telemetry:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRebuild = async () => {
    setIsRebuilding(true);
    setMessage(null);
    try {
      const res = await fetch(`${API}/api/v1/admin/rag/rebuild`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setMessage('Background vector store rebuild initiated successfully! Document chunks are being re-indexed into Pinecone.');
        fetchTelemetry();
      }
    } catch (err) {
      console.error('Rebuild error:', err);
    } finally {
      setIsRebuilding(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setMessage(null);
    try {
      const res = await fetch(`${API}/api/v1/admin/rag/refresh`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setMessage('Stale vectors cleared and index synchronized with database.');
        fetchTelemetry();
      }
    } catch (err) {
      console.error('Refresh error:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div>
        <GlassBadge variant="cyan" size="sm">Vector Index Manager</GlassBadge>
        <h1 className="text-3xl font-heading font-bold text-white mt-2">
          Knowledge Base <span className="text-gradient">Rebuilder</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Monitor Pinecone vector embedding telemetry, refresh index chunks, and trigger full index rebuilds.
        </p>
      </div>

      {/* Telemetry Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <GlassCard className="p-6 border-cyan-500/30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-300">Total Vectors in Index</span>
            <Database className="h-5 w-5 text-cyan-400" />
          </div>
          <p className="text-3xl font-heading font-bold text-white mb-1">
            {isLoading ? '—' : telemetry?.vector_count || 0}
          </p>
          <p className="text-xs text-slate-400">All-MiniLM-L6-v2 (384 Dimensions)</p>
        </GlassCard>

        <GlassCard className="p-6 border-violet-500/30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-300">Supabase Document Chunks</span>
            <Layers className="h-5 w-5 text-violet-400" />
          </div>
          <p className="text-3xl font-heading font-bold text-white mb-1">
            {isLoading ? '—' : telemetry?.total_chunks || 0}
          </p>
          <p className="text-xs text-slate-400">Extracted & chunked text segments</p>
        </GlassCard>

        <GlassCard className="p-6 border-rose-500/30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-300">Indexed Source Documents</span>
            <FileCheck className="h-5 w-5 text-rose-400" />
          </div>
          <p className="text-3xl font-heading font-bold text-white mb-1">
            {isLoading ? '—' : telemetry?.total_documents || 0}
          </p>
          <p className="text-xs text-slate-400">Syllabi, circulars & academic files</p>
        </GlassCard>
      </div>

      {/* Operations Panel */}
      <GlassCard className="p-6 border-rose-500/25">
        <h2 className="text-lg font-heading font-bold text-white mb-2 flex items-center gap-2">
          <Cpu className="h-5 w-5 text-rose-400" /> Administrative Reindex Controls
        </h2>
        <p className="text-slate-400 text-xs mb-6">
          Triggering an index rebuild will read all chunked documents from Supabase and re-upsert their embeddings into the Pinecone vector database.
        </p>

        {message && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-white/4 border border-white/10 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
                <RefreshCw className="h-4 w-4 text-cyan-400" /> Rebuild Global Vector Index
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Executes background embedding generation for all stored document chunks and updates vector coordinates.
              </p>
            </div>
            <GlassButton
              onClick={handleRebuild}
              disabled={isRebuilding}
              variant="primary"
              className="mt-4 flex items-center justify-center gap-2"
            >
              {isRebuilding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {isRebuilding ? 'Rebuilding Index...' : 'Trigger Full Rebuild'}
            </GlassButton>
          </div>

          <div className="p-5 rounded-2xl bg-white/4 border border-white/10 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
                <Zap className="h-4 w-4 text-amber-400" /> Clear Stale Vector Chunks
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Synchronizes the vector index by removing orphaned embeddings whose parent documents were deleted.
              </p>
            </div>
            <GlassButton
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="ghost"
              className="mt-4 flex items-center justify-center gap-2 border-amber-500/40 hover:bg-amber-500/15"
            >
              {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4 text-amber-400" />}
              {isRefreshing ? 'Cleaning Index...' : 'Clear Stale Chunks'}
            </GlassButton>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
