'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  BookOpen,
  Calendar,
  Users,
  Clock,
  GraduationCap,
  Sparkles,
  MapPin,
  ChevronRight,
  BarChart3,
  Award,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import GlassCard from '@/components/ui/GlassCard';
import GlassBadge from '@/components/ui/GlassBadge';

// ── Static mock data (replace with API calls when backend is ready) ──────────

const DEPARTMENT = {
  name: 'Computer Science & Engineering',
  short: 'CSE',
  totalFaculty: 18,
  totalStudents: 420,
  establishedYear: 1998,
  location: 'Block A, 3rd Floor',
};

const SUBJECTS = [
  { code: 'CS601', name: 'Artificial Intelligence', credits: 4, type: 'Core', students: 62, semester: 6 },
  { code: 'CS603', name: 'Machine Learning', credits: 3, type: 'Elective', students: 48, semester: 6 },
  { code: 'CS501', name: 'Theory of Computation', credits: 4, type: 'Core', students: 70, semester: 5 },
];

const CLASSES = [
  { section: '6A', branch: 'CSE', semester: 6, students: 62, room: 'A-301', subject: 'Artificial Intelligence' },
  { section: '6B', branch: 'CSE', semester: 6, students: 58, room: 'A-302', subject: 'Machine Learning (Elective)' },
  { section: '5A', branch: 'CSE', semester: 5, students: 70, room: 'A-201', subject: 'Theory of Computation' },
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const TIMETABLE: Record<string, { time: string; subject: string; room: string; section: string; color: string }[]> = {
  Monday:    [
    { time: '09:00 – 10:00', subject: 'Artificial Intelligence', room: 'A-301', section: '6A', color: 'violet' },
    { time: '11:00 – 12:00', subject: 'Theory of Computation',   room: 'A-201', section: '5A', color: 'cyan'   },
    { time: '14:00 – 15:00', subject: 'Machine Learning',        room: 'A-302', section: '6B', color: 'fuchsia'},
  ],
  Tuesday:   [
    { time: '10:00 – 11:00', subject: 'Artificial Intelligence', room: 'A-301', section: '6A', color: 'violet' },
    { time: '13:00 – 14:00', subject: 'Theory of Computation',   room: 'A-201', section: '5A', color: 'cyan'   },
  ],
  Wednesday: [
    { time: '09:00 – 10:00', subject: 'Machine Learning',        room: 'A-302', section: '6B', color: 'fuchsia'},
    { time: '11:00 – 12:00', subject: 'Artificial Intelligence', room: 'A-301', section: '6A', color: 'violet' },
  ],
  Thursday:  [
    { time: '10:00 – 11:00', subject: 'Theory of Computation',   room: 'A-201', section: '5A', color: 'cyan'   },
    { time: '14:00 – 15:00', subject: 'Machine Learning',        room: 'A-302', section: '6B', color: 'fuchsia'},
  ],
  Friday:    [
    { time: '09:00 – 10:00', subject: 'Artificial Intelligence', room: 'A-301', section: '6A', color: 'violet' },
    { time: '11:00 – 12:00', subject: 'Theory of Computation',   room: 'A-201', section: '5A', color: 'cyan'   },
  ],
  Saturday:  [],
};

const COLOR_MAP: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  violet:  { bg: 'bg-violet-500/15',  border: 'border-violet-500/30',  text: 'text-violet-300',  badge: 'bg-violet-500/20 text-violet-200'  },
  cyan:    { bg: 'bg-cyan-500/15',    border: 'border-cyan-500/30',    text: 'text-cyan-300',    badge: 'bg-cyan-500/20 text-cyan-200'    },
  fuchsia: { bg: 'bg-fuchsia-500/15', border: 'border-fuchsia-500/30', text: 'text-fuchsia-300', badge: 'bg-fuchsia-500/20 text-fuchsia-200'},
};

const item = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };
const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

export default function FacultyAnalyticsPage() {
  const { user } = useAuth();
  const [activeDay, setActiveDay] = useState('Monday');

  const today = DAYS[new Date().getDay() - 1] ?? 'Monday';
  const todaySlots = TIMETABLE[today] ?? [];

  return (
    <div className="space-y-8 py-6">

      {/* ── Page Header ── */}
      <motion.div variants={item} initial="hidden" animate="show" className="flex flex-col gap-1">
        <div className="flex items-center gap-2 mb-1">
          <GlassBadge variant="active" size="sm">Faculty Overview</GlassBadge>
        </div>
        <h1 className="text-3xl font-heading font-bold text-white">
          {user?.full_name ? (
            <><span className="text-gradient">{user.full_name}</span>'s Schedule</>
          ) : (
            <>Department &amp; <span className="text-gradient">Schedule</span></>
          )}
        </h1>
        <p className="text-slate-400 text-sm">
          Your department info, subjects you teach, classes you visit, and your weekly timetable.
        </p>
      </motion.div>

      {/* ── Department Card ── */}
      <motion.div variants={item} initial="hidden" animate="show">
        <GlassCard className="p-6 shadow-[0_0_40px_rgba(139,92,246,0.15)]">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Icon */}
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 p-0.5 shadow-[0_0_30px_rgba(139,92,246,0.4)] shrink-0">
              <div className="h-full w-full bg-slate-900/80 rounded-[14px] flex items-center justify-center">
                <Building2 className="h-8 w-8 text-violet-300" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h2 className="text-xl font-heading font-bold text-white">{DEPARTMENT.name}</h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 font-bold">
                  {DEPARTMENT.short}
                </span>
              </div>
              <p className="text-sm text-slate-400 mb-3">Faculty In-Charge: <span className="text-slate-200 font-medium">{user?.full_name || 'Faculty Member'}</span></p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Faculty Members', value: DEPARTMENT.totalFaculty, icon: GraduationCap },
                  { label: 'Total Students',  value: DEPARTMENT.totalStudents, icon: Users         },
                  { label: 'Est. Year',        value: DEPARTMENT.establishedYear, icon: Award      },
                  { label: 'Location',         value: DEPARTMENT.location, icon: MapPin            },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex items-center gap-2 p-3 rounded-xl bg-white/4 border border-white/8">
                    <Icon className="h-4 w-4 text-violet-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-slate-400 truncate">{label}</p>
                      <p className="text-sm font-bold text-white truncate">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* ── Subjects + Classes Grid ── */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Subjects */}
        <motion.div variants={item}>
          <GlassCard className="p-6 h-full">
            <h2 className="text-base font-heading font-bold text-white flex items-center gap-2 mb-4">
              <BookOpen className="h-4 w-4 text-cyan-400" /> Subjects You Teach
            </h2>
            <div className="space-y-3">
              {SUBJECTS.map((sub) => (
                <div key={sub.code} className="flex items-center gap-3 p-3.5 rounded-xl bg-white/4 border border-white/8 hover:bg-white/7 transition-colors group">
                  <div className="h-9 w-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0">
                    <BookOpen className="h-4 w-4 text-cyan-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">{sub.name}</p>
                    <p className="text-[11px] text-slate-400">{sub.code} &bull; Sem {sub.semester} &bull; {sub.credits} Credits</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${sub.type === 'Core' ? 'bg-violet-500/15 text-violet-300 border border-violet-500/25' : 'bg-amber-500/15 text-amber-300 border border-amber-500/25'}`}>
                      {sub.type}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-1">{sub.students} students</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Classes */}
        <motion.div variants={item}>
          <GlassCard className="p-6 h-full">
            <h2 className="text-base font-heading font-bold text-white flex items-center gap-2 mb-4">
              <Users className="h-4 w-4 text-fuchsia-400" /> Classes You Handle
            </h2>
            <div className="space-y-3">
              {CLASSES.map((cls) => (
                <div key={`${cls.section}-${cls.subject}`} className="flex items-center gap-3 p-3.5 rounded-xl bg-white/4 border border-white/8 hover:bg-white/7 transition-colors">
                  <div className="h-9 w-9 rounded-xl bg-fuchsia-500/15 border border-fuchsia-500/30 flex items-center justify-center shrink-0">
                    <GraduationCap className="h-4 w-4 text-fuchsia-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white">{cls.branch} – Section {cls.section}</p>
                    <p className="text-[11px] text-slate-400 truncate">{cls.subject}</p>
                  </div>
                  <div className="text-right shrink-0 space-y-1">
                    <div className="flex items-center gap-1 justify-end">
                      <MapPin className="h-3 w-3 text-slate-500" />
                      <span className="text-[11px] text-slate-300">{cls.room}</span>
                    </div>
                    <div className="flex items-center gap-1 justify-end">
                      <Users className="h-3 w-3 text-slate-500" />
                      <span className="text-[11px] text-slate-300">{cls.students} students</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total summary */}
            <div className="mt-4 p-3 rounded-xl bg-fuchsia-500/8 border border-fuchsia-500/20 flex items-center justify-between">
              <span className="text-xs text-slate-400">Total students across all classes</span>
              <span className="text-sm font-bold text-fuchsia-300">
                {CLASSES.reduce((a, c) => a + c.students, 0)}
              </span>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>

      {/* ── Today's Schedule Strip ── */}
      <motion.div variants={item} initial="hidden" animate="show">
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-4 w-4 text-amber-400" />
            <h2 className="text-base font-heading font-bold text-white">Today's Schedule</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/25 text-amber-300 font-semibold">{today}</span>
          </div>
          {todaySlots.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">No classes scheduled today 🎉</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {todaySlots.map((slot, i) => {
                const c = COLOR_MAP[slot.color];
                return (
                  <div key={i} className={`p-4 rounded-xl ${c.bg} border ${c.border}`}>
                    <p className={`text-xs font-bold ${c.text} mb-1`}>{slot.time}</p>
                    <p className="text-sm font-semibold text-white">{slot.subject}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="flex items-center gap-1 text-[11px] text-slate-400"><MapPin className="h-3 w-3" />{slot.room}</span>
                      <span className="flex items-center gap-1 text-[11px] text-slate-400"><Users className="h-3 w-3" />Sec {slot.section}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </GlassCard>
      </motion.div>

      {/* ── Full Weekly Timetable ── */}
      <motion.div variants={item} initial="hidden" animate="show">
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <Calendar className="h-4 w-4 text-violet-400" />
            <h2 className="text-base font-heading font-bold text-white">Weekly Timetable</h2>
          </div>

          {/* Day Tabs */}
          <div className="flex gap-2 flex-wrap mb-5">
            {DAYS.map((day) => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeDay === day
                    ? 'bg-violet-600/40 border border-violet-500/50 text-violet-200 shadow-[0_0_14px_rgba(139,92,246,0.3)]'
                    : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {day}
                {day === today && (
                  <span className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 align-middle" />
                )}
              </button>
            ))}
          </div>

          {/* Slots for selected day */}
          {(TIMETABLE[activeDay] ?? []).length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-sm">No classes on {activeDay}</div>
          ) : (
            <div className="space-y-3">
              {(TIMETABLE[activeDay] ?? []).map((slot, i) => {
                const c = COLOR_MAP[slot.color];
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className={`flex items-center gap-4 p-4 rounded-xl ${c.bg} border ${c.border}`}
                  >
                    <div className="flex flex-col items-center justify-center min-w-[80px]">
                      <Clock className={`h-4 w-4 ${c.text} mb-1`} />
                      <span className={`text-[11px] font-bold ${c.text} text-center leading-tight`}>{slot.time}</span>
                    </div>
                    <div className="w-px h-10 bg-white/10" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white">{slot.subject}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Section {slot.section}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold ${c.badge}`}>
                        {slot.room}
                      </span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <MapPin className="h-2.5 w-2.5" /> Room
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </GlassCard>
      </motion.div>

    </div>
  );
}
