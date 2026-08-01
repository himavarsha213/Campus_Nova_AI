'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import GlassCard from '@/components/ui/GlassCard';

interface LatencyBarChartProps {
  data?: Array<{ component: string; latency_ms: number }>;
}

const defaultData = [
  { component: 'Pinecone Vector Search', latency_ms: 65 },
  { component: 'Guardrails & Rerank', latency_ms: 45 },
  { component: 'LLM Generation (Groq)', latency_ms: 310 },
];

export default function LatencyBarChart({ data = defaultData }: LatencyBarChartProps) {
  return (
    <GlassCard className="p-6 border-cyan-500/25">
      <div className="mb-4">
        <h3 className="text-base font-bold text-white">Sub-second Latency Breakdown</h3>
        <p className="text-xs text-slate-400">Response timing (ms) across RAG pipeline stages</p>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" horizontal={false} />
            <XAxis type="number" stroke="#94a3b8" fontSize={11} tickLine={false} unit=" ms" />
            <YAxis type="category" dataKey="component" stroke="#94a3b8" fontSize={11} tickLine={false} width={130} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                borderColor: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '16px',
                backdropFilter: 'blur(16px)',
                color: '#fff',
                fontSize: '12px'
              }}
              formatter={(value: any) => [`${value} ms`, 'Latency']}
            />
            <Bar dataKey="latency_ms" fill="#06b6d4" radius={[0, 8, 8, 0]} barSize={24} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
