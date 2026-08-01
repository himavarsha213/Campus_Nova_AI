'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  MessageSquareText,
  FileText,
  FileQuestion,
  Search,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  LogOut,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';

export interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
  { name: 'AI Chat', href: '/student/chat', icon: MessageSquareText, badge: 'Live' },
  { name: 'Summarizer', href: '/student/summarizer', icon: FileText },
  { name: 'Quiz Generator', href: '/student/quiz', icon: FileQuestion },
  { name: 'Document Search', href: '/student/documents', icon: Search },
  { name: 'Department Notices', href: '/student/notices', icon: Bell, badge: '5 New' },
  { name: 'Settings', href: '/student/settings', icon: Settings },
];

interface GlassSidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const GlassSidebar: React.FC<GlassSidebarProps> = ({
  mobileOpen = false,
  onMobileClose,
}) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const sidebarContent = (
    <div
      className={`
        relative h-full flex flex-col justify-between p-4 transition-all duration-300
        bg-slate-900/70 backdrop-blur-[20px]
        border border-white/12 rounded-3xl
        shadow-[0_8px_32px_0_rgba(0,0,0,0.45)]
        ${collapsed ? 'w-20' : 'w-64'}
      `}
    >
      {/* Glow background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-indigo-500/15 blur-3xl pointer-events-none rounded-full" />

      {/* Top Brand Header */}
      <div>
        <div className="flex items-center justify-between pb-6 mb-4 border-b border-white/10 px-2">
          <Link href="/student/dashboard" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-[0_0_20px_rgba(99,102,241,0.4)] group-hover:scale-105 transition-transform duration-300">
              <div className="h-full w-full bg-slate-950/80 rounded-[10px] flex items-center justify-center backdrop-blur-sm">
                <GraduationCap className="h-5.5 w-5.5 text-cyan-400" />
              </div>
            </div>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col"
              >
                <span className="font-heading font-bold text-lg text-white tracking-wide leading-none flex items-center gap-1.5">
                  Campus<span className="text-gradient">Nova</span>
                  <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
                </span>
                <span className="text-[10px] text-indigo-300/70 uppercase tracking-widest font-mono font-medium mt-1">
                  Student Portal
                </span>
              </motion.div>
            )}
          </Link>

          {/* Desktop Toggle Button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex items-center justify-center h-8 w-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onMobileClose}
                className={`
                  relative flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-sm transition-all duration-200 group
                  ${
                    isActive
                      ? 'text-white bg-indigo-600/30 border border-indigo-500/40 shadow-[0_0_20px_rgba(99,102,241,0.25)]'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent'
                  }
                `}
              >
                {/* Glowing Indicator for active tab */}
                {isActive && (
                  <motion.div
                    layoutId="activePill"
                    className="absolute left-0 w-1 h-6 bg-gradient-to-b from-indigo-400 to-cyan-400 rounded-r-full shadow-[0_0_12px_#6366f1]"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}

                <div
                  className={`
                    p-1.5 rounded-lg transition-colors
                    ${isActive ? 'bg-indigo-500/20 text-cyan-300' : 'text-slate-400 group-hover:text-white'}
                  `}
                >
                  <Icon className="h-5 w-5" />
                </div>

                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex-1 truncate"
                  >
                    {item.name}
                  </motion.span>
                )}

                {!collapsed && item.badge && (
                  <span
                    className={`
                      text-[10px] font-semibold px-2 py-0.5 rounded-full border
                      ${
                        item.badge === 'Live'
                          ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30 animate-pulse'
                          : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                      }
                    `}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Info & Logout Footer */}
      <div className="pt-4 mt-auto border-t border-white/10">
        <div
          className={`
            flex items-center gap-3 p-2.5 rounded-2xl bg-slate-800/40 border border-white/8 backdrop-blur-md
            ${collapsed ? 'justify-center' : ''}
          `}
        >
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 p-0.5 shrink-0 shadow-md">
            <div className="h-full w-full bg-slate-900 rounded-[10px] flex items-center justify-center text-indigo-300 font-bold text-xs">
              {user?.full_name?.charAt(0).toUpperCase() || 'S'}
            </div>
          </div>

          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {user?.full_name || 'Student User'}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                {user?.email || 'student@campusnova.edu'}
              </p>
            </div>
          )}

          {!collapsed && (
            <button
              onClick={logout}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block fixed left-4 top-4 bottom-4 z-40">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop & Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-3 top-3 bottom-3 z-50 md:hidden w-72"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default GlassSidebar;
