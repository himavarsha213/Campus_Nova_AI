'use client';

import React from 'react';
import GlassCard from '@/components/ui/GlassCard';
import GlassBadge from '@/components/ui/GlassBadge';
import GlassButton from '@/components/ui/GlassButton';
import { Settings, User, Bell, Shield, Key } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <GlassCard className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300">
            <Settings className="h-6 w-6" />
          </div>
          <div>
            <GlassBadge variant="cyan" size="sm">Account Preferences</GlassBadge>
            <h1 className="text-2xl font-heading font-bold text-white mt-1">
              Student Settings
            </h1>
          </div>
        </div>

        <div className="space-y-6 max-w-2xl">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <User className="h-4.5 w-4.5 text-cyan-400" />
              Profile Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={user?.full_name || 'Alex Morgan'}
                  readOnly
                  className="w-full p-2.5 rounded-xl bg-slate-800/80 border border-white/10 text-white font-medium"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Email Address</label>
                <input
                  type="text"
                  value={user?.email || 'alex.morgan@campusnova.edu'}
                  readOnly
                  className="w-full p-2.5 rounded-xl bg-slate-800/80 border border-white/10 text-white font-medium"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Department</label>
                <input
                  type="text"
                  value="Computer Science & Engineering"
                  readOnly
                  className="w-full p-2.5 rounded-xl bg-slate-800/80 border border-white/10 text-white font-medium"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Semester</label>
                <input
                  type="text"
                  value={`Semester ${user?.semester || 6}`}
                  readOnly
                  className="w-full p-2.5 rounded-xl bg-slate-800/80 border border-white/10 text-white font-medium"
                />
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
