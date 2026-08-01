'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import GlassCard from '@/components/ui/GlassCard';
import GlassButton from '@/components/ui/GlassButton';
import GlassInput from '@/components/ui/GlassInput';
import GlassBadge from '@/components/ui/GlassBadge';
import { Bot, User, Mail, Lock, Phone, UserPlus, AlertCircle, BookOpen } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';

const DEFAULT_DEPARTMENTS = [
  { id: 'a0000000-0000-0000-0000-000000000001', department_name: 'Computer Science & Engineering', department_code: 'CSE' },
  { id: 'a0000000-0000-0000-0000-000000000002', department_name: 'Information Technology', department_code: 'IT' },
  { id: 'a0000000-0000-0000-0000-000000000003', department_name: 'Electronics & Communication', department_code: 'ECE' },
  { id: 'a0000000-0000-0000-0000-000000000004', department_name: 'Electrical & Electronics', department_code: 'EEE' },
  { id: 'a0000000-0000-0000-0000-000000000005', department_name: 'Mechanical Engineering', department_code: 'MECH' },
  { id: 'a0000000-0000-0000-0000-000000000006', department_name: 'Civil Engineering', department_code: 'CIVIL' },
  { id: 'a0000000-0000-0000-0000-000000000007', department_name: 'Artificial Intelligence & Data Science', department_code: 'AI-DS' },
];

import { API_BASE_URL as API } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'student' | 'faculty' | 'admin'>('student');
  const [semester, setSemester] = useState<number>(1);
  const [departmentId, setDepartmentId] = useState('');
  const [departments, setDepartments] = useState<{ id: string; department_name: string; department_code: string }[]>(DEFAULT_DEPARTMENTS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API}/api/v1/auth/departments`)
      .then((r) => r.json())
      .then((data) => {
        if (data.departments && data.departments.length > 0) {
          setDepartments(data.departments);
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          email,
          password,
          role,
          semester: Number(semester),
          phone,
          department_id: departmentId || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Registration failed');
      }

      login(data.access_token, data.user);

      if (data.user.role === 'faculty') {
        router.push('/faculty/dashboard');
      } else {
        router.push('/student/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Server error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo Header */}
        <div className="flex flex-col items-center gap-2 mb-6 text-center">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.6)]">
            <Bot className="h-7 w-7 text-white" />
          </div>
          <h1 className="font-heading text-3xl font-extrabold text-white tracking-tight">
            CampusNova<span className="text-cyan-400">.AI</span>
          </h1>
          <p className="text-sm text-slate-400">Create Academic Account</p>
        </div>

        {/* Register Glass Card */}
        <GlassCard glowColor="purple" className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-xl font-bold text-slate-100">Register Account</h2>
            <GlassBadge variant="purple" size="sm">Step 1 of 1</GlassBadge>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center gap-2 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Role Picker */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-300">Account Type</label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950/40 rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`py-2 text-xs font-semibold rounded-lg capitalize transition-all ${
                    role === 'student'
                      ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  🎓 Student Account
                </button>
                <button
                  type="button"
                  onClick={() => setRole('faculty')}
                  className={`py-2 text-xs font-semibold rounded-lg capitalize transition-all ${
                    role === 'faculty'
                      ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  👩‍🏫 Faculty Member
                </button>
              </div>
            </div>

            <GlassInput
              label="Full Name"
              type="text"
              placeholder="John Doe"
              icon={<User className="h-4 w-4" />}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <GlassInput
              label="Institutional Email"
              type="email"
              placeholder="john@college.edu"
              icon={<Mail className="h-4 w-4" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <GlassInput
              label="Password"
              type="password"
              placeholder="Minimum 6 characters"
              icon={<Lock className="h-4 w-4" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {role === 'student' && (
              <>
                {/* Department Picker */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5 text-indigo-400" />
                      Department
                    </span>
                  </label>
                  <div className="relative">
                    <select
                      value={departmentId}
                      onChange={(e) => setDepartmentId(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-slate-100 text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/60 transition-all"
                    >
                      <option value="" disabled className="bg-slate-900 text-slate-400">
                        Select your department
                      </option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id} className="bg-slate-900 text-slate-100">
                          {dept.department_name} ({dept.department_code})
                        </option>
                      ))}
                    </select>
                    {/* Custom chevron */}
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">▾</span>
                  </div>
                </div>

                {/* Semester Selection */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-300">
                    Current Semester: <span className="font-bold text-cyan-400">Semester {semester}</span>
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <button
                        key={sem}
                        type="button"
                        onClick={() => setSemester(sem)}
                        className={`py-2 text-xs font-semibold rounded-xl transition-all border ${
                          semester === sem
                            ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 border-cyan-400/50 text-white shadow-[0_0_12px_rgba(99,102,241,0.5)]'
                            : 'bg-slate-950/50 border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20'
                        }`}
                      >
                        Sem {sem}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <GlassInput
              label="Phone Number (Optional)"
              type="tel"
              placeholder="+1 (555) 000-0000"
              icon={<Phone className="h-4 w-4" />}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <GlassButton
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading}
              icon={<UserPlus className="h-4 w-4" />}
            >
              Create Account
            </GlassButton>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400 border-t border-white/10 pt-4">
            Already registered?{' '}
            <Link href="/login" className="text-cyan-400 font-semibold hover:underline">
              Sign In
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
