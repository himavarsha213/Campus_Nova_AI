'use client';

import React from 'react';
import GlassCard from '@/components/ui/GlassCard';
import GlassButton from '@/components/ui/GlassButton';
import GlassBadge from '@/components/ui/GlassBadge';
import Link from 'next/link';
import { Sparkles, Bot, ShieldCheck, FileText, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 md:p-16">
      {/* Header Bar */}
      <header className="w-full max-w-6xl flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.5)]">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <span className="font-heading text-2xl font-bold tracking-tight text-white">
            CampusNova<span className="text-cyan-400">.AI</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <GlassBadge variant="cyan" size="md">v1.0.0 Online</GlassBadge>
          <Link href="/login" passHref legacyBehavior>
            <GlassButton variant="outline" size="sm">System Login</GlassButton>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full max-w-4xl flex flex-col items-center text-center my-16 gap-6">
        <GlassBadge variant="purple" size="md" className="gap-2">
          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
          Retrieval-Augmented Generation (RAG) Architecture
        </GlassBadge>
        
        <h1 className="font-heading text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-100 max-w-3xl leading-tight">
          Instant College Intelligence Grounded in <span className="text-gradient">Official Knowledge</span>
        </h1>
        
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
          Zero hallucinations. CampusNova AI indexes verified institutional handbooks, circulars, and departmental PDFs to deliver instant answers backed by document source citations.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
          <Link href="/login" passHref legacyBehavior>
            <GlassButton variant="primary" size="lg" icon={<ArrowRight className="h-5 w-5" />}>
              Launch Student Portal
            </GlassButton>
          </Link>
          <Link href="/login" passHref legacyBehavior>
            <GlassButton variant="secondary" size="lg">
              Faculty Upload Center
            </GlassButton>
          </Link>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
        <GlassCard glowColor="indigo">
          <div className="h-12 w-12 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center mb-4">
            <Bot className="h-6 w-6 text-indigo-400" />
          </div>
          <h3 className="font-heading text-xl font-bold text-slate-100 mb-2">Grounded AI Chat</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Ask complex queries about exam schedules, attendance policies, and hostel fees with streaming answers and confidence scores.
          </p>
        </GlassCard>

        <GlassCard glowColor="cyan">
          <div className="h-12 w-12 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center mb-4">
            <ShieldCheck className="h-6 w-6 text-cyan-400" />
          </div>
          <h3 className="font-heading text-xl font-bold text-slate-100 mb-2">Source Citations</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Every AI answer cites the exact PDF file, department, and page number, ensuring complete transparency and institutional trust.
          </p>
        </GlassCard>

        <GlassCard glowColor="purple">
          <div className="h-12 w-12 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center mb-4">
            <FileText className="h-6 w-6 text-purple-400" />
          </div>
          <h3 className="font-heading text-xl font-bold text-slate-100 mb-2">Study Tools & Quizzes</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Summarize lengthy regulations into key takeaways or generate interactive MCQs and practice quizzes directly from study notes.
          </p>
        </GlassCard>
      </section>

      {/* Footer */}
      <footer className="w-full max-w-6xl border-t border-white/10 pt-8 mt-12 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>© 2026 CampusNova AI. Academic Major Project.</p>
        <div className="flex items-center gap-6">
          <span className="hover:text-slate-300 cursor-pointer">FastAPI</span>
          <span className="hover:text-slate-300 cursor-pointer">Next.js 14</span>
          <span className="hover:text-slate-300 cursor-pointer">Supabase</span>
          <span className="hover:text-slate-300 cursor-pointer">Pinecone</span>
        </div>
      </footer>
    </main>
  );
}
