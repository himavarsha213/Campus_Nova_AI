'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileCode2,
  Search,
  Filter,
  Shield,
  Clock,
  User,
  Activity,
  AlertCircle,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import GlassCard from '@/components/ui/GlassCard';
import GlassButton from '@/components/ui/GlassButton';
import GlassBadge from '@/components/ui/GlassBadge';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface AuditLog {
  id: string;
  user_id?: string;
  action: string;
  details?: string;
  created_at: string;
  users?: {
    full_name: string;
    email: string;
    role: string;
  };
}

export default function AdminLogsPage() {
  const { token } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');

  useEffect(() => {
    if (token) fetchLogs();
  }, [token, actionFilter]);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      let url = `${API}/api/v1/admin/logs?limit=100`;
      if (actionFilter !== 'all') url += `&action=${actionFilter}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLogs(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch audit logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLogs = logs.filter(l =>
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    (l.details && l.details.toLowerCase().includes(search.toLowerCase())) ||
    (l.users?.email && l.users.email.toLowerCase().includes(search.toLowerCase()))
  );

  const getActionBadge = (action: string) => {
    if (action.includes('DELETE')) {
      return <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30">{action}</span>;
    }
    if (action.includes('CREATE') || action.includes('REBUILD')) {
      return <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">{action}</span>;
    }
    return <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">{action}</span>;
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <GlassBadge variant="admin" size="sm">Security Telemetry</GlassBadge>
          <h1 className="text-3xl font-heading font-bold text-white mt-2">
            System <span className="text-gradient">Audit Logs</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Track user account creation, security events, document index rebuilds, and administrative actions.
          </p>
        </div>

        <GlassButton onClick={fetchLogs} variant="ghost" size="sm" className="flex items-center gap-2 self-start sm:self-auto">
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh Logs
        </GlassButton>
      </div>

      {/* Filter Bar */}
      <GlassCard className="p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search action or details..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-rose-500/60 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
          <Filter className="h-4 w-4 text-slate-500 mr-1" />
          {['all', 'CREATE_USER', 'UPDATE_USER', 'DELETE_USER', 'UPDATE_AI_CONFIG', 'REBUILD_VECTOR_INDEX'].map((act) => (
            <button
              key={act}
              onClick={() => setActionFilter(act)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-mono font-semibold uppercase border transition-all ${
                actionFilter === act
                  ? 'bg-rose-600/30 border-rose-500/50 text-white shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {act === 'all' ? 'ALL ACTIONS' : act}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Logs Table */}
      <GlassCard className="p-6 overflow-hidden">
        {isLoading ? (
          <div className="space-y-3 py-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-14 rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-12">
            <FileCode2 className="h-12 w-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">No audit logs found</p>
            <p className="text-xs text-slate-500 mt-1">Audit log records will appear here as administrative actions occur.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Admin User</th>
                  <th className="py-3 px-4">Event Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/4 transition-colors font-mono text-xs">
                    <td className="py-3.5 px-4 text-slate-400 shrink-0 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getActionBadge(log.action)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {log.users?.full_name || 'System Admin'}
                      <span className="text-[10px] text-slate-500 block font-sans">{log.users?.email || 'root@campusnova'}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-sans">
                      {log.details || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
