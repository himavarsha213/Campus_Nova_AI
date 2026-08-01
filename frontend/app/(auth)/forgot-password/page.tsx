'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import GlassCard from '@/components/ui/GlassCard';
import GlassButton from '@/components/ui/GlassButton';
import GlassInput from '@/components/ui/GlassInput';
import { Bot, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await fetch('http://localhost:8000/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setIsSent(true);
    } catch (err) {
      setIsSent(true); // Always show success to prevent email enumeration
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center gap-2 mb-8 text-center">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.6)]">
            <Bot className="h-7 w-7 text-white" />
          </div>
          <h1 className="font-heading text-3xl font-extrabold text-white tracking-tight">
            CampusNova<span className="text-cyan-400">.AI</span>
          </h1>
          <p className="text-sm text-slate-400">Account Recovery</p>
        </div>

        <GlassCard glowColor="cyan" className="p-8">
          <h2 className="font-heading text-xl font-bold text-slate-100 mb-2">Reset Password</h2>
          <p className="text-xs text-slate-400 mb-6">
            Enter your registered institutional email address and we'll send you recovery instructions.
          </p>

          {isSent ? (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="h-12 w-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <p className="text-sm text-slate-200">
                If an account exists for <span className="text-cyan-400 font-semibold">{email}</span>, you will receive password reset instructions shortly.
              </p>
              <Link href="/login" className="w-full">
                <GlassButton variant="secondary" size="md" className="w-full">
                  Return to Login
                </GlassButton>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <GlassInput
                label="Institutional Email"
                type="email"
                placeholder="your.email@college.edu"
                icon={<Mail className="h-4 w-4" />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <GlassButton
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-2"
                isLoading={isLoading}
              >
                Send Reset Link
              </GlassButton>

              <div className="mt-4 text-center">
                <Link href="/login" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
                  <ArrowLeft className="h-3.5 w-3.5" /> Back to Login
                </Link>
              </div>
            </form>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
