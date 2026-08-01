'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, X, ShieldCheck, BookOpen, Building, Sparkles } from 'lucide-react';
import GlassButton from '@/components/ui/GlassButton';
import GlassBadge from '@/components/ui/GlassBadge';

export interface Citation {
  document_title?: string;
  filename?: string;
  page_number?: number | string;
  department?: string;
  score?: number;
  text_snippet?: string;
  context?: string;
}

interface CitationModalProps {
  citation: Citation | null;
  onClose: () => void;
}

export const CitationModal: React.FC<CitationModalProps> = ({ citation, onClose }) => {
  if (!citation) return null;

  const docTitle = citation.document_title || citation.filename || 'Department Knowledge Document';
  const pageNum = citation.page_number ? `Page ${citation.page_number}` : 'Full Document';
  const scorePercent = citation.score ? Math.round(citation.score * 100) : 92;
  const snippet = citation.text_snippet || citation.context || 'No preview text snippet available for this citation vector segment.';
  const department = citation.department || 'Computer Science & Engineering';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Glass Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Floating Glass Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-xl rounded-3xl bg-slate-900/90 backdrop-blur-[24px] border border-white/15 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.7)] z-10 space-y-5"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 text-cyan-300 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <GlassBadge variant="cyan" size="sm">
                    Pinecone Citation Vector
                  </GlassBadge>
                  <span className="text-xs font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {scorePercent}% Vector Match
                  </span>
                </div>
                <h3 className="text-lg font-heading font-bold text-white mt-1 leading-snug">
                  {docTitle}
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Details Meta Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-800/40 border border-white/8 flex items-center gap-2.5">
              <BookOpen className="h-4 w-4 text-indigo-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Location</span>
                <span className="font-semibold text-slate-200">{pageNum}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/40 border border-white/8 flex items-center gap-2.5">
              <Building className="h-4 w-4 text-cyan-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Department Scope</span>
                <span className="font-semibold text-slate-200 truncate block">{department}</span>
              </div>
            </div>
          </div>

          {/* Verbatim Context Snippet Block */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              <span>Extracted Document Chunk Text:</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-indigo-500/20 text-xs font-mono text-slate-200 leading-relaxed max-h-56 overflow-y-auto whitespace-pre-wrap select-text">
              "{snippet}"
            </div>
          </div>

          {/* Footer Action */}
          <div className="pt-2 flex justify-end">
            <GlassButton onClick={onClose} variant="secondary" size="md">
              Close Preview
            </GlassButton>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CitationModal;
