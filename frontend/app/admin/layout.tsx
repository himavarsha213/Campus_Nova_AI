'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  Users,
  Building2,
  Database,
  Sliders,
  FileCode2,
  Activity,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Menu,
  X,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import AmbientBackground from '@/components/ui/AmbientBackground';

const adminNavItems = [
  { name: 'Overview', href: '/admin/dashboard', icon: Activity },
  { name: 'User Management', href: '/admin/users', icon: Users },
  { name: 'Departments', href: '/admin/departments', icon: Building2 },
  { name: 'Knowledge Base', href: '/admin/knowledge-base', icon: Database },
  { name: 'AI Parameter Config', href: '/admin/ai-config', icon: Sliders },
  { name: 'Audit Logs', href: '/admin/logs', icon: FileCode2 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    } else if (!isLoading && isAuthenticated && user?.role !== 'admin') {
      const target = user?.role === 'faculty' ? '/faculty/dashboard' : '/student/dashboard';
      router.push(target);
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#060913] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-rose-600/30 border border-rose-500/50 flex items-center justify-center animate-bounce shadow-[0_0_30px_rgba(244,63,94,0.4)]">
            <ShieldAlert className="h-6 w-6 text-rose-400" />
          </div>
          <p className="text-sm font-medium text-slate-300 tracking-wide animate-pulse">
            Verifying Admin Security Clearance...
          </p>
        </div>
      </div>
    );
  }

  const sidebarContent = (
    <div
      className={`
        relative h-full flex flex-col justify-between p-4 transition-all duration-300
        bg-slate-900/80 backdrop-blur-[24px]
        border border-rose-500/20 rounded-3xl
        shadow-[0_8px_32px_0_rgba(0,0,0,0.55)]
        ${collapsed ? 'w-20' : 'w-64'}
      `}
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-36 bg-rose-500/15 blur-3xl pointer-events-none rounded-full" />

      {/* Header & Navigation */}
      <div>
        <div className="flex items-center justify-between pb-5 mb-4 border-b border-white/10 px-2">
          <Link href="/admin/dashboard" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-400 p-0.5 shadow-[0_0_20px_rgba(244,63,94,0.4)] group-hover:scale-105 transition-transform duration-300">
              <div className="h-full w-full bg-slate-950/80 rounded-[10px] flex items-center justify-center backdrop-blur-sm">
                <ShieldAlert className="h-5 w-5 text-rose-400" />
              </div>
            </div>
            {!collapsed && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
                <span className="font-heading font-bold text-lg text-white tracking-wide leading-none flex items-center gap-1">
                  Campus<span className="text-rose-400">Nova</span>
                  <Sparkles className="h-3.5 w-3.5 text-rose-400 animate-pulse" />
                </span>
                <span className="text-[10px] text-rose-300/80 uppercase tracking-widest font-mono font-bold mt-1">
                  Admin Control Center
                </span>
              </motion.div>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex items-center justify-center h-8 w-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Security Level Indicator */}
        {!collapsed && (
          <div className="mb-4 px-2">
            <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/25">
              <span className="text-[10px] font-mono uppercase text-rose-300 font-bold tracking-wider">
                Root Admin Clearance
              </span>
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {adminNavItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`
                  relative flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-sm transition-all duration-200 group
                  ${isActive
                    ? 'text-white bg-rose-600/30 border border-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.25)]'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent'
                  }
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="adminActivePill"
                    className="absolute left-0 w-1 h-6 bg-gradient-to-b from-rose-400 to-amber-400 rounded-r-full shadow-[0_0_12px_#f43f5e]"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <div className={`p-1.5 rounded-lg transition-colors ${isActive ? 'bg-rose-500/20 text-rose-300' : 'text-slate-400 group-hover:text-white'}`}>
                  <Icon className="h-5 w-5" />
                </div>
                {!collapsed && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 truncate">
                    {item.name}
                  </motion.span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Info Footer */}
      <div className="pt-4 mt-auto border-t border-white/10">
        <div className={`flex items-center gap-3 p-2.5 rounded-2xl bg-slate-800/40 border border-white/8 backdrop-blur-md ${collapsed ? 'justify-center' : ''}`}>
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-rose-500 to-amber-500 p-0.5 shrink-0 shadow-md">
            <div className="h-full w-full bg-slate-900 rounded-[10px] flex items-center justify-center text-rose-300 font-bold text-xs">
              {user?.full_name?.charAt(0).toUpperCase() || 'A'}
            </div>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.full_name || 'System Admin'}</p>
              <p className="text-[11px] text-slate-400 truncate">{user?.email || 'admin@campusnova.edu'}</p>
            </div>
          )}
          {!collapsed && (
            <button onClick={logout} className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors" title="Sign out">
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 relative font-sans antialiased selection:bg-rose-500 selection:text-white">
      <AmbientBackground variant="subtle" />

      {/* Desktop Sidebar */}
      <aside className="hidden md:block fixed left-4 top-4 bottom-4 z-40">
        {sidebarContent}
      </aside>

      {/* Mobile Top Navbar */}
      <div className="md:hidden sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-rose-600 to-amber-400 flex items-center justify-center">
            <ShieldAlert className="h-4 w-4 text-white" />
          </div>
          <span className="font-heading font-bold text-white">CampusNova <span className="text-rose-400">Admin</span></span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-slate-300 hover:text-white">
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-3 top-3 bottom-3 z-50 md:hidden w-72"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 px-4 md:ml-72 md:mr-6 pb-12 pt-6 md:pt-0">
        <div className="md:pt-6">
          {children}
        </div>
      </main>
    </div>
  );
}
