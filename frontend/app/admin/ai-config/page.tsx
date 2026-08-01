'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Sliders,
  Cpu,
  Zap,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  FileText,
  Thermometer,
  Layers
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import GlassCard from '@/components/ui/GlassCard';
import GlassButton from '@/components/ui/GlassButton';
import GlassBadge from '@/components/ui/GlassBadge';

import { API_BASE_URL as API } from '@/lib/api';

export default function AdminAIConfigPage() {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [config, setConfig] = useState({
    llm_model: 'groq-llama-3.3-70b',
    temperature: 0.1,
    max_tokens: 1024,
    top_k: 5,
    similarity_threshold: 0.70,
    system_prompt: `You are CampusNova AI, an expert academic document analyst and knowledge assistant for college students and faculty.
Ground all answers strictly in the provided document text. If information is not in the context, explicitly state that it is not in official campus records.`
  });

  useEffect(() => {
    if (token) fetchConfig();
  }, [token]);

  const fetchConfig = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API}/api/v1/admin/ai-config`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.config) {
          setConfig(prev => ({ ...prev, ...data.config }));
        }
      }
    } catch (err) {
      console.error('Failed to load AI config:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const res = await fetch(`${API}/api/v1/admin/ai-settings`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.detail || 'Failed to save configuration.');
      }

      setSuccessMsg('AI parameters and prompt template updated successfully!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error updating settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 py-4 max-w-5xl">
      {/* Header */}
      <div>
        <GlassBadge variant="purple" size="sm">RAG Hyperparameters</GlassBadge>
        <h1 className="text-3xl font-heading font-bold text-white mt-2">
          AI Parameter <span className="text-gradient">Configuration</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Tune temperature, model selection, top-K retrieval depth, similarity cutoff thresholds, and system prompt templates.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Model Selection & Core Parameters */}
        <GlassCard className="p-6 border-amber-500/25 space-y-6">
          <h2 className="text-base font-heading font-bold text-white flex items-center gap-2">
            <Cpu className="h-5 w-5 text-amber-400" /> Model Architecture & Retrieval Hyperparameters
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LLM Model Selector */}
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-2 block">LLM Inference Model</label>
              <select
                value={config.llm_model}
                onChange={(e) => setConfig({ ...config, llm_model: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/15 text-white text-sm focus:outline-none focus:border-amber-500/60"
              >
                <option value="groq-llama-3.3-70b">Groq Llama-3.3-70b (Recommended - Ultra Fast)</option>
                <option value="gpt-4o-mini">OpenAI GPT-4o-Mini (Balanced)</option>
                <option value="gpt-4o">OpenAI GPT-4o (High Reasoning)</option>
                <option value="xai-grok-beta">xAI Grok-Beta</option>
              </select>
              <p className="text-[11px] text-slate-500 mt-1">Model used for generating RAG grounded answers.</p>
            </div>

            {/* Max Tokens */}
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-2 block">
                Max Output Tokens: <span className="text-amber-400 font-mono">{config.max_tokens}</span>
              </label>
              <input
                type="number"
                min={256}
                max={4096}
                step={128}
                value={config.max_tokens}
                onChange={(e) => setConfig({ ...config, max_tokens: parseInt(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-amber-500/60"
              />
              <p className="text-[11px] text-slate-500 mt-1">Maximum token limit for output responses (256-4096).</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-white/10">
            {/* Temperature Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                  <Thermometer className="h-4 w-4 text-rose-400" /> Temperature
                </label>
                <span className="text-xs font-mono font-bold text-rose-400">{config.temperature}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={config.temperature}
                onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
                className="w-full accent-rose-500 bg-white/10 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>0.0 (Grounded)</span>
                <span>1.0 (Creative)</span>
              </div>
            </div>

            {/* Retrieval Top-K */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                  <Layers className="h-4 w-4 text-cyan-400" /> Retrieval Top-K
                </label>
                <span className="text-xs font-mono font-bold text-cyan-400">{config.top_k} Chunks</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={config.top_k}
                onChange={(e) => setConfig({ ...config, top_k: parseInt(e.target.value) })}
                className="w-full accent-cyan-500 bg-white/10 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>1 Chunk</span>
                <span>10 Chunks</span>
              </div>
            </div>

            {/* Vector Similarity Threshold */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                  <Zap className="h-4 w-4 text-emerald-400" /> Similarity Cutoff
                </label>
                <span className="text-xs font-mono font-bold text-emerald-400">{config.similarity_threshold}</span>
              </div>
              <input
                type="range"
                min="0.50"
                max="0.95"
                step="0.05"
                value={config.similarity_threshold}
                onChange={(e) => setConfig({ ...config, similarity_threshold: parseFloat(e.target.value) })}
                className="w-full accent-emerald-500 bg-white/10 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>0.50 (Relaxed)</span>
                <span>0.95 (Strict)</span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* System Prompt Template Editor */}
        <GlassCard className="p-6 border-rose-500/25">
          <h2 className="text-base font-heading font-bold text-white mb-2 flex items-center gap-2">
            <FileText className="h-5 w-5 text-rose-400" /> System Prompt Guardrail Template
          </h2>
          <p className="text-xs text-slate-400 mb-4">
            Available template tokens: <code className="text-rose-300 bg-white/5 px-1.5 py-0.5 rounded">{'{context_chunks}'}</code>, <code className="text-rose-300 bg-white/5 px-1.5 py-0.5 rounded">{'{chat_history}'}</code>, <code className="text-rose-300 bg-white/5 px-1.5 py-0.5 rounded">{'{user_question}'}</code>
          </p>

          <textarea
            rows={5}
            value={config.system_prompt}
            onChange={(e) => setConfig({ ...config, system_prompt: e.target.value })}
            className="w-full p-4 rounded-xl bg-white/5 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-rose-500/60 leading-relaxed resize-none"
          />
        </GlassCard>

        {/* Alerts & Actions */}
        {errorMsg && (
          <div className="flex items-center gap-2 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0" /> {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="flex items-center gap-2 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300">
            <CheckCircle2 className="h-4 w-4 shrink-0" /> {successMsg}
          </div>
        )}

        <div className="flex justify-end">
          <GlassButton
            type="submit"
            disabled={isSaving}
            variant="primary"
            className="flex items-center gap-2 px-8"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isSaving ? 'Saving Configuration...' : 'Save AI Settings'}
          </GlassButton>
        </div>
      </form>
    </div>
  );
}
