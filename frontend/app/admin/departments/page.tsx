'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Plus,
  Edit,
  Trash2,
  Users,
  FileText,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import GlassCard from '@/components/ui/GlassCard';
import GlassButton from '@/components/ui/GlassButton';
import GlassBadge from '@/components/ui/GlassBadge';

import { API_BASE_URL as API } from '@/lib/api';

interface Department {
  id: string;
  department_name: string;
  department_code: string;
  hod_name?: string;
  created_at: string;
}

export default function AdminDepartmentsPage() {
  const { token } = useAuth();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [newDept, setNewDept] = useState({
    department_name: '',
    department_code: '',
    hod_name: '',
  });

  useEffect(() => {
    if (token) fetchDepartments();
  }, [token]);

  const fetchDepartments = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API}/api/v1/admin/departments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDepartments(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch departments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDept.department_name || !newDept.department_code) {
      setError('Department Name and Code are required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/v1/admin/departments`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newDept)
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.detail || 'Failed to create department.');
      }

      setSuccessMsg('Department created successfully!');
      setNewDept({ department_name: '', department_code: '', hod_name: '' });
      setTimeout(() => {
        setSuccessMsg(null);
        setShowAddModal(false);
      }, 1200);
      fetchDepartments();
    } catch (err: any) {
      setError(err.message || 'Error creating department');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <GlassBadge variant="violet" size="sm">Academic Units</GlassBadge>
          <h1 className="text-3xl font-heading font-bold text-white mt-2">
            Department <span className="text-gradient">Management</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Configure academic departments, assign HOD leadership, and manage organizational units.
          </p>
        </div>

        <GlassButton
          onClick={() => { setShowAddModal(true); setError(null); }}
          variant="primary"
          className="flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" /> Add Department
        </GlassButton>
      </div>

      {/* Grid of Department Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 rounded-3xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : departments.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <Building2 className="h-12 w-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 font-medium">No departments created yet</p>
          <p className="text-xs text-slate-500 mt-1">Click "Add Department" to register your first college unit.</p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {departments.map((dept) => (
            <motion.div key={dept.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <GlassCard className="p-6 border-violet-500/25 hover:border-violet-500/40 transition-all flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-violet-500/20 text-violet-300 border border-violet-500/30">
                      {dept.department_code}
                    </span>
                    <Building2 className="h-5 w-5 text-slate-500" />
                  </div>

                  <h3 className="text-lg font-heading font-bold text-white mb-2 leading-snug">
                    {dept.department_name}
                  </h3>

                  <div className="space-y-2 mt-4 text-xs text-slate-300">
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/4 border border-white/8">
                      <UserCheck className="h-4 w-4 text-violet-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">Head of Department (HOD)</span>
                        <span className="font-semibold text-white">{dept.hod_name || 'Unassigned'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                  <span>Created {new Date(dept.created_at).toLocaleDateString()}</span>
                  <GlassBadge variant="active" size="sm">Active Unit</GlassBadge>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Department Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-violet-500/30 rounded-3xl p-6 max-w-md w-full shadow-2xl relative"
            >
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="p-2.5 rounded-xl bg-violet-500/20 text-violet-300">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-heading font-bold text-white">Create Department</h3>
                  <p className="text-xs text-slate-400">Register a new academic department in CampusNova.</p>
                </div>
              </div>

              <form onSubmit={handleCreateDepartment} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">Department Name *</label>
                  <input
                    type="text"
                    required
                    value={newDept.department_name}
                    onChange={(e) => setNewDept({ ...newDept, department_name: e.target.value })}
                    placeholder="e.g. Computer Science & Engineering"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500/60"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">Department Code *</label>
                  <input
                    type="text"
                    required
                    value={newDept.department_code}
                    onChange={(e) => setNewDept({ ...newDept, department_code: e.target.value })}
                    placeholder="e.g. CSE"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500/60 uppercase"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">Head of Department (HOD) Name</label>
                  <input
                    type="text"
                    value={newDept.hod_name}
                    onChange={(e) => setNewDept({ ...newDept, hod_name: e.target.value })}
                    placeholder="e.g. Dr. Alan Turing"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500/60"
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
                    <AlertCircle className="h-4 w-4 shrink-0" /> {error}
                  </div>
                )}
                {successMsg && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300">
                    <CheckCircle2 className="h-4 w-4 shrink-0" /> {successMsg}
                  </div>
                )}

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-semibold transition-all"
                  >
                    Cancel
                  </button>
                  <GlassButton
                    type="submit"
                    disabled={isSubmitting}
                    variant="primary"
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Unit'}
                  </GlassButton>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
