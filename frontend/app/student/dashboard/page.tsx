'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Sparkles,
  MessageSquareText,
  FileSearch,
  FileQuestion,
  Bell,
  ArrowRight,
  Clock,
  CheckCircle2,
  BookOpen,
  TrendingUp,
  ShieldCheck,
  Zap,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import GlassCard from '@/components/ui/GlassCard';
import GlassButton from '@/components/ui/GlassButton';
import GlassBadge from '@/components/ui/GlassBadge';

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  const studentName = user?.full_name || 'Alex Morgan';
  const department = 'Computer Science & Engineering';
  const semester = user?.semester || 6;

  // Stat metrics data
  const stats = [
    {
      title: 'Available Documents',
      value: '142',
      change: '+12 this week',
      icon: BookOpen,
      color: 'indigo',
      badge: 'Updated',
    },
    {
      title: 'Department Notices',
      value: '5',
      change: '2 Urgent',
      icon: Bell,
      color: 'cyan',
      badge: 'Active',
    },
    {
      title: 'AI Conversations',
      value: '18',
      change: 'Last: 20m ago',
      icon: MessageSquareText,
      color: 'purple',
      badge: 'Saved',
    },
    {
      title: 'Quizzes Completed',
      value: '8',
      change: 'Avg Score: 92%',
      icon: FileQuestion,
      color: 'emerald',
      badge: '92% Avg',
    },
  ];

  // Quick Action items
  const quickActions = [
    {
      title: 'Ask AI Assistant',
      description: 'Stream vector RAG answers with exact page citations',
      href: '/student/chat',
      icon: Sparkles,
      gradient: 'from-indigo-600 to-cyan-500',
      badge: 'Instant RAG',
    },
    {
      title: 'Search Academic Policy',
      description: 'Query attendance, exam rules, and syllabus documents',
      href: '/student/documents',
      icon: FileSearch,
      gradient: 'from-cyan-600 to-blue-500',
      badge: 'Pinecone Vector',
    },
    {
      title: 'Generate Practice Quiz',
      description: 'Create customized MCQs from lecture PDFs in seconds',
      href: '/student/quiz',
      icon: FileQuestion,
      gradient: 'from-purple-600 to-indigo-500',
      badge: 'AI Powered',
    },
    {
      title: 'View Department Notices',
      description: 'Stay updated on timetables, exams, and circulars',
      href: '/student/notices',
      icon: Bell,
      gradient: 'from-emerald-600 to-teal-500',
      badge: 'Official',
    },
  ];

  // Recent Chat Conversations
  const recentChats = [
    {
      id: '1',
      title: 'Attendance criteria for final lab exam exemption',
      date: 'Today, 2:15 PM',
      messagesCount: 4,
      department: 'CSE Dept',
    },
    {
      id: '2',
      title: 'B.Tech CSE Semester 6 exam schedule & timetable',
      date: 'Yesterday, 6:40 PM',
      messagesCount: 6,
      department: 'Academic Office',
    },
    {
      id: '3',
      title: 'Hostel fee payment deadline and online portal link',
      date: 'Jul 28, 2026',
      messagesCount: 3,
      department: 'Administration',
    },
  ];

  // Latest Department Notices
  const notices = [
    {
      id: 'n1',
      title: 'End-Semester Theory & Practical Exam Schedule Published',
      department: 'Examination Cell',
      date: 'Jul 31, 2026',
      priority: 'Urgent',
      snippet: 'The tentative timetable for B.Tech Semester 6 examinations is now available on the portal.',
    },
    {
      id: 'n2',
      title: 'Campus Hackathon 2026 Registration Open',
      department: 'CSE Department',
      date: 'Jul 30, 2026',
      priority: 'New',
      snippet: 'Register your teams before August 10th for the annual CampusNova Innovation Hackathon.',
    },
    {
      id: 'n3',
      title: 'Library Extended Hours During Mid-Term Preparation',
      department: 'Central Library',
      date: 'Jul 29, 2026',
      priority: 'Info',
      snippet: 'The central library reading rooms will remain open 24/7 until the end of mid-term assessments.',
    },
  ];

  return (
    <div className="space-y-8">
      
      {/* 1. Welcome Banner Card */}
      <GlassCard className="relative overflow-hidden p-8 border-indigo-500/30">
        {/* Glowing Background Radial Orbs */}
        <div className="absolute -top-16 -right-16 w-80 h-80 bg-indigo-500/20 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-cyan-500/20 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <GlassBadge variant="cyan" size="sm">
                Student Portal
              </GlassBadge>
              <GlassBadge variant="purple" size="sm">
                {department}
              </GlassBadge>
              <span className="flex items-center gap-1 text-xs text-emerald-400 font-mono font-medium px-2 py-0.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                <ShieldCheck className="h-3.5 w-3.5" />
                RAG Engine Online
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
              Welcome back, <span className="text-gradient">{studentName}</span>!
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Access real-time AI knowledge retrieval, search verified department documents, and prepare for exams with automated quiz generation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full lg:w-auto">
            <GlassButton
              onClick={() => router.push('/student/chat')}
              variant="primary"
              size="lg"
              icon={<Sparkles className="h-5 w-5 text-cyan-300" />}
              className="w-full sm:w-auto"
            >
              Start AI Chat
            </GlassButton>
            <GlassButton
              onClick={() => router.push('/student/documents')}
              variant="secondary"
              size="lg"
              icon={<FileSearch className="h-5 w-5 text-slate-300" />}
              className="w-full sm:w-auto"
            >
              Search Docs
            </GlassButton>
          </div>
        </div>
      </GlassCard>

      {/* 2. Quick Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.08 }}
            >
              <GlassCard hoverEffect glowColor={stat.color as any} className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-white/10 text-indigo-400">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
                    {stat.badge}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-3xl font-heading font-extrabold text-white">{stat.value}</h3>
                  <p className="text-xs font-medium text-slate-400">{stat.title}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/8 flex items-center gap-1.5 text-[11px] text-cyan-400 font-medium">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>{stat.change}</span>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {/* 3. Quick Actions Bar */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-heading font-bold text-white flex items-center gap-2">
            <Zap className="h-5 w-5 text-indigo-400" />
            Quick AI Actions
          </h2>
          <span className="text-xs text-slate-400">Fast access to tools</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.title}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <GlassCard
                  onClick={() => router.push(action.href)}
                  className="h-full p-5 cursor-pointer hover:border-indigo-500/40 group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${action.gradient} text-white shadow-lg`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] uppercase font-mono font-bold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                        {action.badge}
                      </span>
                    </div>

                    <h3 className="text-base font-heading font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {action.title}
                    </h3>

                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      {action.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-white/8 flex items-center justify-between text-xs font-semibold text-indigo-300 group-hover:text-white transition-colors">
                    <span>Launch</span>
                    <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 4. Recent Conversations & Latest Notices Dual Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Conversations List */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300">
                <MessageSquareText className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-white">Recent Conversations</h3>
                <p className="text-xs text-slate-400">Continue your RAG chat sessions</p>
              </div>
            </div>

            <Link
              href="/student/chat"
              className="text-xs font-semibold text-indigo-300 hover:text-white flex items-center gap-1 transition-colors"
            >
              View All <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => router.push(`/student/chat?id=${chat.id}`)}
                className="p-3.5 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-white/8 hover:border-indigo-500/30 transition-all cursor-pointer group flex items-center justify-between gap-4"
              >
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors truncate">
                    {chat.title}
                  </h4>
                  <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {chat.date}
                    </span>
                    <span>•</span>
                    <span>{chat.messagesCount} turns</span>
                    <span>•</span>
                    <span className="text-indigo-300">{chat.department}</span>
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-indigo-500/20 text-slate-400 group-hover:text-white transition-colors shrink-0">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Latest Department Notices Feed */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-white">Latest Department Notices</h3>
                <p className="text-xs text-slate-400">Official circulars & updates</p>
              </div>
            </div>

            <Link
              href="/student/notices"
              className="text-xs font-semibold text-cyan-300 hover:text-white flex items-center gap-1 transition-colors"
            >
              All Circulars <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className="p-3.5 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-white/8 transition-all"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs font-semibold text-slate-200 truncate">
                    {notice.title}
                  </span>
                  <span
                    className={`
                      text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0
                      ${
                        notice.priority === 'Urgent'
                          ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                          : notice.priority === 'New'
                          ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                          : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                      }
                    `}
                  >
                    {notice.priority}
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-2">
                  {notice.snippet}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>{notice.department}</span>
                  <span>{notice.date}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

      </div>

    </div>
  );
}
