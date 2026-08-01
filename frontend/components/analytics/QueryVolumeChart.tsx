'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import GlassCard from '@/components/ui/GlassCard';

interface QueryVolumeChartProps {
  data?: Array<{ date: string; queries: number; citations: number }>;
}

const defaultData = [
  { date: 'Mon', queries: 142, citations: 128 },
  { date: 'Tue', queries: 198, citations: 175 },
  { date: 'Wed', queries: 245, citations: 220 },
  { date: 'Thu', queries: 210, citations: 190 },
  { date: 'Fri', queries: 320, citations: 295 },
  { date: 'Sat', queries: 180, citations: 160 },
  { date: 'Sun', queries: 155, citations: 140 },
];

export default function QueryVolumeChart({ data = defaultData }: QueryVolumeChartProps) {
  return (
    <GlassCard className="p-6 border-indigo-500/25">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-white">Daily AI Query Volume</h3>
          <p className="text-xs text-slate-400">RAG pipeline queries vs. generated citations</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4]" /> Queries
          </span>
          <span className="flex items-center gap-1.5 text-indigo-400">
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-400 shadow-[0_0_8px_#6366f1]" /> Citations
          </span>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="queryGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="citationGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" />
            <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                borderColor: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '16px',
                backdropFilter: 'blur(16px)',
                color: '#fff',
                fontSize: '12px'
              }}
            />
            <Area type="monotone" dataKey="queries" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#queryGlow)" />
            <Area type="monotone" dataKey="citations" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#citationGlow)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
