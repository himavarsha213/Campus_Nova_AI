'use client';

import React from 'react';

export const ShimmerCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`relative overflow-hidden rounded-3xl bg-slate-900/60 border border-white/10 p-6 backdrop-blur-xl ${className}`}>
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    <div className="h-4 w-1/3 rounded-lg bg-white/10 mb-4" />
    <div className="h-8 w-1/2 rounded-xl bg-white/15 mb-3" />
    <div className="h-3 w-2/3 rounded-lg bg-white/5" />
  </div>
);

export const ShimmerTable: React.FC<{ rows?: number }> = ({ rows = 4 }) => (
  <div className="space-y-3 p-4 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="relative overflow-hidden h-14 rounded-2xl bg-white/5 border border-white/5 p-3 flex items-center gap-4">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="h-8 w-8 rounded-xl bg-white/10 shrink-0" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3.5 w-1/3 rounded bg-white/15" />
          <div className="h-2.5 w-1/4 rounded bg-white/5" />
        </div>
        <div className="h-6 w-16 rounded-full bg-white/10" />
      </div>
    ))}
  </div>
);

export const ShimmerChatMessage: React.FC = () => (
  <div className="relative overflow-hidden rounded-2xl bg-indigo-500/10 border border-indigo-500/20 p-4 max-w-xl space-y-2">
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-indigo-400/10 to-transparent" />
    <div className="h-3 w-3/4 rounded bg-white/15" />
    <div className="h-3 w-full rounded bg-white/10" />
    <div className="h-3 w-1/2 rounded bg-white/10" />
  </div>
);
