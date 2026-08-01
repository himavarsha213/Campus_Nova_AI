'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import GlassCard from '@/components/ui/GlassCard';
import GlassButton from '@/components/ui/GlassButton';
import GlassInput from '@/components/ui/GlassInput';
import GlassBadge from '@/components/ui/GlassBadge';
import { Bot, Mail, Lock, LogIn, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';

import { API_BASE_URL as API } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'faculty' | 'admin'>('student');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      let data: any = null;
      try {
        data = await response.json();
      } catch {
        // Non-JSON response fallback
      }

      if (!response.ok) {
        throw new Error((data && data.detail) || 'Login failed. Invalid credentials or server error.');
      }

      login(data.access_token, data.user);

      // Route user based on their role
      if (data.user.role === 'admin') {
        router.push('/admin/dashboard');
      } else if (data.user.role === 'faculty') {
        router.push('/faculty/dashboard');
      } else {
        router.push('/student/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Server error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Header */}
        <div className="flex flex-col items-center gap-2 mb-8 text-center">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.6)]">
            <Bot className="h-7 w-7 text-white" />
          </div>
          <h1 className="font-heading text-3xl font-extrabold text-white tracking-tight">
            CampusNova<span className="text-cyan-400">.AI</span>
          </h1>
          <p className="text-sm text-slate-400">Institutional AI Knowledge Assistant</p>
        </div>

        {/* Login Glass Card */}
        <GlassCard glowColor="indigo" className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-xl font-bold text-slate-100">Portal Login</h2>
            <GlassBadge variant="cyan" size="sm">Grounded RAG</GlassBadge>
          </div>

          {/* Role Switcher Pills */}
          <div className="grid grid-cols-3 gap-2 p-1 bg-slate-950/40 rounded-xl border border-white/10 mb-6">
            {(['student', 'faculty', 'admin'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`py-1.5 text-xs font-semibold rounded-lg capitalize transition-all duration-200 ${
                  role === r
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center gap-2 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <GlassInput
              label="Email Address"
              type="email"
              placeholder="e.g. student@college.edu"
              icon={<Mail className="h-4 w-4" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <GlassInput
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={<Lock className="h-4 w-4" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex items-center justify-between text-xs text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded bg-slate-900 border-white/20 text-indigo-500 focus:ring-0" />
                <span>Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-cyan-400 hover:underline">
                Forgot Password?
              </Link>
            </div>

            <GlassButton
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading}
              icon={<LogIn className="h-4 w-4" />}
            >
              Sign In to {role.toUpperCase()}
            </GlassButton>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400 border-t border-white/10 pt-4">
            Don't have an account?{' '}
            <Link href="/register" className="text-cyan-400 font-semibold hover:underline">
              Create Account
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
