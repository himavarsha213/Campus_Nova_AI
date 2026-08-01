'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Sun,
  Moon,
  Menu,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  ChevronDown,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import GlassBadge from '@/components/ui/GlassBadge';
import NotificationCenter from '@/components/notifications/NotificationCenter';

interface HeaderNavbarProps {
  onMobileMenuToggle: () => void;
}

export const HeaderNavbar: React.FC<HeaderNavbarProps> = ({ onMobileMenuToggle }) => {
  const { user, logout } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  }, []);

  // Sample notices / notifications state
  const notifications = [
    { id: '1', title: 'End Semester Exam Schedule Released', time: '10m ago', type: 'urgent', read: false },
    { id: '2', title: 'New RAG Knowledge Base Update (CS Dept)', time: '2h ago', type: 'info', read: false },
    { id: '3', title: 'AI Quiz #4 completed with 95% score', time: '1d ago', type: 'success', read: true },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-4 z-30 mb-6 mx-4 md:ml-72 md:mr-6">
      <div className="flex items-center justify-between h-16 px-5 rounded-2xl bg-slate-900/65 dark:bg-slate-900/65 bg-white/80 backdrop-blur-[16px] border border-white/12 dark:border-white/12 border-slate-900/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.15)]">
        
        {/* Left Side: Mobile Menu Button & Context Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMobileMenuToggle}
            className="md:hidden p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 border border-white/10 text-slate-300 hover:text-white transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Department Chip */}
          <div className="flex items-center gap-2">
            <GlassBadge variant="student" size="sm">
              CSE • Semester {user?.semester || 6}
            </GlassBadge>
            <span className="hidden sm:inline-block text-xs text-slate-400 font-medium">
              CampusNova Knowledge Assistant
            </span>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button (Light/Dark Mode) */}
          <button
            onClick={() => {
              const newMode = !darkMode;
              setDarkMode(newMode);
              if (newMode) {
                document.documentElement.classList.add('dark');
                document.documentElement.classList.remove('light');
                localStorage.setItem('theme', 'dark');
              } else {
                document.documentElement.classList.remove('dark');
                document.documentElement.classList.add('light');
                localStorage.setItem('theme', 'light');
              }
            }}
            className="p-2.5 rounded-xl bg-slate-800/50 dark:bg-slate-800/50 bg-slate-200/80 hover:bg-slate-300 border border-white/10 dark:border-white/10 border-slate-300 text-slate-300 dark:text-slate-300 text-slate-700 hover:text-cyan-600 transition-all shadow-inner"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? <Moon className="h-4.5 w-4.5 text-indigo-300" /> : <Sun className="h-4.5 w-4.5 text-amber-500" />}
          </button>

          {/* Real-Time Glassmorphic Notification Center */}
          <NotificationCenter />

          {/* User Profile Badge Dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-700/70 border border-white/10 transition-all"
            >
              <div className="h-7 w-7 rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-500 p-0.5 shrink-0">
                <div className="h-full w-full bg-slate-900 rounded-[6px] flex items-center justify-center text-xs font-bold text-cyan-300">
                  {user?.full_name?.charAt(0).toUpperCase() || 'S'}
                </div>
              </div>
              <span className="hidden sm:block text-xs font-semibold text-slate-200 truncate max-w-[120px]">
                {user?.full_name || 'Student'}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {/* Profile Dropdown */}
            <AnimatePresence>
              {userDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-56 rounded-2xl bg-slate-900/90 backdrop-blur-[24px] border border-white/15 p-3 shadow-[0_16px_48px_0_rgba(0,0,0,0.6)] z-50 space-y-1"
                >
                  <div className="px-3 py-2 border-b border-white/10 mb-1">
                    <p className="text-xs font-semibold text-white truncate">{user?.full_name || 'Student Name'}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user?.email || 'student@campusnova.edu'}</p>
                  </div>

                  <div className="px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[11px] text-indigo-300 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Role: Student (CSE)</span>
                  </div>

                  <button
                    onClick={logout}
                    className="w-full mt-2 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-300 hover:bg-rose-500/15 hover:text-rose-200 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </header>
  );
};

export default HeaderNavbar;
