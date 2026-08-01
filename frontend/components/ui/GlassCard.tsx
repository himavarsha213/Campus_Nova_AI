'use client';

import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  glowColor?: 'indigo' | 'cyan' | 'purple' | 'emerald' | 'none';
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  hoverEffect = true,
  glowColor = 'indigo',
  onClick,
}) => {
  const glowClasses = {
    indigo: 'hover:shadow-[0_0_30px_rgba(99,102,241,0.25)] hover:border-indigo-500/40',
    cyan: 'hover:shadow-[0_0_30px_rgba(6,182,212,0.25)] hover:border-cyan-500/40',
    purple: 'hover:shadow-[0_0_30px_rgba(139,92,246,0.25)] hover:border-purple-500/40',
    emerald: 'hover:shadow-[0_0_30px_rgba(16,185,129,0.25)] hover:border-emerald-500/40',
    none: '',
  };

  return (
    <div
      onClick={onClick}
      className={`
        relative rounded-2xl p-6
        bg-slate-900/65 backdrop-blur-[16px]
        border border-white/12
        shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]
        inset-shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]
        ${hoverEffect ? `transition-all duration-300 hover:-translate-y-1 ${glowClasses[glowColor]}` : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default GlassCard;
