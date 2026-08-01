'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  User,
  ShieldCheck,
  FileText,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  Bot,
  ExternalLink
} from 'lucide-react';
import { Citation } from './CitationModal';

export interface Message {
  id: string;
  sender: 'user' | 'assistant';
  message: string;
  confidence_score?: number;
  citations?: Citation[];
  created_at?: string;
  isStreaming?: boolean;
}

interface ChatMessageProps {
  message: Message;
  onSelectCitation: (citation: Citation) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onSelectCitation }) => {
  const isUser = message.sender === 'user';
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState<boolean | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple Markdown parsing for clean glass presentation without heavy external bundle
  const renderMarkdownContent = (text: string) => {
    if (!text) return null;

    // Split paragraphs
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeContent = '';
    let listItems: string[] = [];

    const flushList = (keyPrefix: string) => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`ul-${keyPrefix}`} className="list-disc list-inside space-y-1 my-2 pl-2 text-slate-200">
            {listItems.map((item, idx) => (
              <li key={idx} className="leading-relaxed">
                {parseInlineFormatting(item)}
              </li>
            ))}
          </ul>
        );
        listItems = [];
      }
    };

    lines.forEach((line, index) => {
      // Code block start/end
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <div key={`code-${index}`} className="my-3 rounded-xl bg-slate-950/90 border border-indigo-500/30 p-3 overflow-x-auto text-xs font-mono text-cyan-300">
              <pre>{codeContent.trim()}</pre>
            </div>
          );
          codeContent = '';
          inCodeBlock = false;
        } else {
          flushList(`before-code-${index}`);
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeContent += line + '\n';
        return;
      }

      // Headers
      if (line.startsWith('### ')) {
        flushList(`h3-${index}`);
        elements.push(
          <h4 key={`h3-${index}`} className="font-heading font-bold text-base text-white mt-3 mb-1">
            {parseInlineFormatting(line.replace('### ', ''))}
          </h4>
        );
        return;
      }
      if (line.startsWith('## ')) {
        flushList(`h2-${index}`);
        elements.push(
          <h3 key={`h2-${index}`} className="font-heading font-bold text-lg text-cyan-300 mt-4 mb-2">
            {parseInlineFormatting(line.replace('## ', ''))}
          </h3>
        );
        return;
      }

      // Bullet lists
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        listItems.push(line.trim().substring(2));
        return;
      }

      // Numbered lists
      if (/^\d+\.\s/.test(line.trim())) {
        listItems.push(line.trim().replace(/^\d+\.\s/, ''));
        return;
      }

      // Standard text line
      flushList(`text-${index}`);
      if (line.trim() !== '') {
        elements.push(
          <p key={`p-${index}`} className="my-1.5 leading-relaxed">
            {parseInlineFormatting(line)}
          </p>
        );
      }
    });

    flushList('final');
    return elements;
  };

  // Inline formatting for **bold** and `code`
  const parseInlineFormatting = (text: string): React.ReactNode => {
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={i} className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono text-[11px] border border-white/10">{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  // Confidence color score badge
  const confidence = message.confidence_score !== undefined ? Math.round(message.confidence_score) : 95;
  const getConfidenceBadge = (score: number) => {
    if (score >= 90) return { bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', label: `${score}% Confidence` };
    if (score >= 75) return { bg: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30', label: `${score}% Confidence` };
    return { bg: 'bg-amber-500/15 text-amber-300 border-amber-500/30', label: `${score}% Confidence` };
  };

  const badgeStyle = getConfidenceBadge(confidence);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {/* AI Assistant Avatar */}
      {!isUser && (
        <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shrink-0 shadow-[0_0_20px_rgba(99,102,241,0.4)] mt-1">
          <div className="h-full w-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-300">
            <Bot className="h-5 w-5" />
          </div>
        </div>
      )}

      {/* Message Content Container */}
      <div className={`max-w-[85%] sm:max-w-[78%] ${isUser ? 'items-end' : 'items-start'}`}>
        
        {/* User Message Bubble */}
        {isUser ? (
          <div className="p-4 rounded-2xl bg-indigo-600/30 backdrop-blur-[16px] border border-indigo-500/40 text-slate-100 shadow-[0_4px_20px_rgba(99,102,241,0.25)] rounded-tr-none text-sm leading-relaxed">
            {message.message}
          </div>
        ) : (
          /* AI Assistant Message Panel */
          <div className="p-5 rounded-3xl bg-slate-900/80 backdrop-blur-[20px] border border-white/12 text-slate-200 shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-tl-none space-y-4">
            
            {/* Header: AI Badge & Confidence percentage pill */}
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/8 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-white flex items-center gap-1.5">
                  CampusNova AI
                  <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Pinecone RAG</span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-mono font-bold flex items-center gap-1 ${badgeStyle.bg}`}>
                  <ShieldCheck className="h-3 w-3" />
                  {badgeStyle.label}
                </span>
              </div>
            </div>

            {/* Markdown Message Body */}
            <div className="text-sm text-slate-200 space-y-2 select-text">
              {renderMarkdownContent(message.message)}

              {/* Streaming typing indicator dot */}
              {message.isStreaming && (
                <span className="inline-block w-2 h-4 ml-1 bg-cyan-400 animate-pulse rounded-sm" />
              )}
            </div>

            {/* Source Citation Badges Section */}
            {message.citations && message.citations.length > 0 && (
              <div className="pt-3 border-t border-white/8 space-y-2">
                <span className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-cyan-400" />
                  Source Citations ({message.citations.length}):
                </span>

                <div className="flex flex-wrap gap-2">
                  {message.citations.map((cite, idx) => {
                    const title = cite.document_title || cite.filename || `Document #${idx + 1}`;
                    const page = cite.page_number ? `p. ${cite.page_number}` : '';

                    return (
                      <button
                        key={idx}
                        onClick={() => onSelectCitation(cite)}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/30 border border-indigo-500/30 hover:border-indigo-400 text-xs font-medium text-cyan-300 hover:text-white transition-all shadow-sm group"
                      >
                        <FileText className="h-3.5 w-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                        <span className="truncate max-w-[200px]">{title}</span>
                        {page && <span className="text-[10px] text-slate-400 font-mono">({page})</span>}
                        <ExternalLink className="h-3 w-3 opacity-60 group-hover:opacity-100" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Bottom Actions Bar */}
            <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
              <span className="text-[10px] text-slate-500">Verified against college repository</span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                  title="Copy response"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
                <button
                  onClick={() => setLiked(true)}
                  className={`p-1.5 rounded-lg hover:bg-white/10 transition-colors ${liked === true ? 'text-emerald-400' : 'text-slate-400 hover:text-white'}`}
                  title="Helpful"
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setLiked(false)}
                  className={`p-1.5 rounded-lg hover:bg-white/10 transition-colors ${liked === false ? 'text-rose-400' : 'text-slate-400 hover:text-white'}`}
                  title="Not helpful"
                >
                  <ThumbsDown className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 p-0.5 shrink-0 shadow-md mt-1">
          <div className="h-full w-full bg-slate-900 rounded-[14px] flex items-center justify-center text-cyan-300 text-xs font-bold">
            <User className="h-5 w-5" />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ChatMessage;
