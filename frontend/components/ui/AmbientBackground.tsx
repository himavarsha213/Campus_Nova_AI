'use client';

import React from 'react';

interface AmbientBackgroundProps {
  className?: string;
  variant?: 'default' | 'subtle';
}

export const AmbientBackground: React.FC<AmbientBackgroundProps> = ({
  className = '',
  variant = 'default',
}) => {
  return (
    <div className={`fixed inset-0 pointer-events-none -z-10 overflow-hidden transition-colors duration-500 bg-[var(--bg-color)] ${className}`}>
      {/* Radial Gradient Mesh Lights */}
      <div
        className={`pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-indigo-600/20 blur-[140px] animate-pulse-glow ${
          variant === 'subtle' ? 'opacity-50' : ''
        }`}
      />
      <div
        className={`pointer-events-none absolute top-1/3 -right-40 h-[600px] w-[600px] rounded-full bg-cyan-500/15 blur-[160px] animate-pulse-glow ${
          variant === 'subtle' ? 'opacity-40' : ''
        }`}
        style={{ animationDelay: '2s' }}
      />
      <div
        className={`pointer-events-none absolute -bottom-40 left-1/4 h-[550px] w-[550px] rounded-full bg-purple-600/15 blur-[150px] animate-pulse-glow ${
          variant === 'subtle' ? 'opacity-40' : ''
        }`}
        style={{ animationDelay: '4s' }}
      />

      {/* Grid Overlay for subtle tech aesthetic */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  );
};

export default AmbientBackground;
