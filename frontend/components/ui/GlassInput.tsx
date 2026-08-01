'use client';

import React from 'react';

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const GlassInput = React.forwardRef<HTMLInputElement, GlassInputProps>(({
  label,
  error,
  icon,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-medium text-slate-300 tracking-wide">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-3.5 text-slate-400 pointer-events-none">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full rounded-xl py-2.5 px-4 text-sm text-slate-100 placeholder-slate-400
            bg-slate-900/50 backdrop-blur-md
            border border-white/12
            transition-all duration-200
            focus:outline-none focus:border-indigo-500 focus:bg-slate-900/75 focus:shadow-[0_0_20px_rgba(99,102,241,0.35)]
            disabled:opacity-50 disabled:cursor-not-allowed
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-rose-500/80 focus:border-rose-500 focus:shadow-[0_0_20px_rgba(244,63,94,0.35)]' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <span className="text-xs text-rose-400 font-medium tracking-wide">
          {error}
        </span>
      )}
    </div>
  );
});

GlassInput.displayName = 'GlassInput';
export default GlassInput;
