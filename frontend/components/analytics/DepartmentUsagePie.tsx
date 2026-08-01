'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import GlassCard from '@/components/ui/GlassCard';

interface DepartmentUsagePieProps {
  data?: Array<{ name: string; value: number }>;
}

const defaultData = [
  { name: 'Computer Science', value: 420 },
  { name: 'Electronics & Comm.', value: 210 },
  { name: 'Mechanical Eng.', value: 145 },
  { name: 'Civil Engineering', value: 95 },
  { name: 'Management / MBA', value: 160 },
];

const COLORS = ['#6366f1', '#06b6d4', '#f43f5e', '#f59e0b', '#10b981'];

export default function DepartmentUsagePie({ data = defaultData }: DepartmentUsagePieProps) {
  return (
    <GlassCard className="p-6 border-violet-500/25">
      <div className="mb-2">
        <h3 className="text-base font-bold text-white">Department Usage Share</h3>
        <p className="text-xs text-slate-400">Distribution of query traffic across departments</p>
      </div>

      <div className="h-64 w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
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
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(255,255,255,0.1)" />
              ))}
            </Pie>
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value: string) => <span className="text-xs text-slate-300 font-medium">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
