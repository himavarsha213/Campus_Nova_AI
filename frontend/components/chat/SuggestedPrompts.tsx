'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, HelpCircle, FileText, Calendar, DollarSign, BookOpen } from 'lucide-react';

export interface PromptOption {
  label: string;
  query: string;
  icon?: React.ElementType;
}

const defaultPrompts: PromptOption[] = [
  { label: 'Attendance Rule', query: 'What is the minimum attendance requirement for semester exams?', icon: HelpCircle },
  { label: 'Exam Timetable', query: 'Show me the exam timetable for Semester 6 Computer Science', icon: Calendar },
  { label: 'Hostel Fee Structure', query: 'What is the hostel fee structure and payment deadline for this academic year?', icon: DollarSign },
  { label: 'Library Guidelines', query: 'What are the library book issue rules and fine policies?', icon: BookOpen },
  { label: 'Lab Submissions', query: 'What are the guidelines for final year lab project submissions?', icon: FileText },
];

interface SuggestedPromptsProps {
  onSelectPrompt: (promptText: string) => void;
  prompts?: PromptOption[];
}

export const SuggestedPrompts: React.FC<SuggestedPromptsProps> = ({
  onSelectPrompt,
  prompts = defaultPrompts,
}) => {
  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-none">
      <div className="flex items-center gap-2 min-w-max">
        <div className="flex items-center gap-1 text-xs text-indigo-300 font-medium px-2.5 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 shrink-0">
          <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
          <span>Suggested Prompts:</span>
        </div>

        {prompts.map((p, idx) => {
          const Icon = p.icon || HelpCircle;
          return (
            <motion.button
              key={p.label}
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onSelectPrompt(p.query)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 border border-white/12 hover:border-indigo-500/40 text-xs font-medium text-slate-200 hover:text-white transition-all shadow-sm shrink-0"
            >
              <Icon className="h-3.5 w-3.5 text-cyan-400" />
              <span>{p.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default SuggestedPrompts;
