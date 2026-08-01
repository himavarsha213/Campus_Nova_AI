'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import GlassSidebar from '@/components/student/GlassSidebar';
import HeaderNavbar from '@/components/student/HeaderNavbar';
import AmbientBackground from '@/components/ui/AmbientBackground';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#060913] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center animate-bounce shadow-[0_0_30px_rgba(99,102,241,0.4)]">
            <span className="text-xl font-bold text-cyan-400 font-heading">CN</span>
          </div>
          <p className="text-sm font-medium text-slate-300 tracking-wide animate-pulse">
            Loading CampusNova Portal...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-color)] transition-colors duration-300 relative font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Floating Frosted Glass Sidebar Navigation */}
      <GlassSidebar
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-col min-h-screen">
        {/* Sticky Header Navbar */}
        <HeaderNavbar onMobileMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

        {/* Page View Container */}
        <main className="flex-1 px-4 md:ml-72 md:mr-6 pb-10">
          {children}
        </main>
      </div>
    </div>
  );
}
