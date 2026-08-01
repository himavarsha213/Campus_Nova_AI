'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  MessageSquare,
  Search,
  Trash2,
  Edit2,
  Check,
  X,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export interface ChatSession {
  id: string;
  title: string;
  updated_at?: string;
  created_at?: string;
}

interface ChatSidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
  onRenameSession: (id: string, newTitle: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onRenameSession,
  isOpen,
  onToggle,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startRename = (session: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(session.id);
    setEditingTitle(session.title);
  };

  const saveRename = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (editingTitle.trim()) {
      onRenameSession(id, editingTitle.trim());
    }
    setEditingId(null);
  };

  const cancelRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
  };

  return (
    <>
      {/* Sidebar Container */}
      <aside
        className={`
          flex flex-col h-full transition-all duration-300 z-30 shrink-0
          bg-slate-900/80 backdrop-blur-[20px] border-r border-white/12
          ${isOpen ? 'w-80' : 'w-0 hidden md:flex md:w-16'}
        `}
      >
        <div className="p-3 flex items-center justify-between border-b border-white/10">
          {isOpen ? (
            <button
              onClick={onNewChat}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-medium text-sm shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all"
            >
              <Plus className="h-4.5 w-4.5" />
              <span>New Conversation</span>
            </button>
          ) : (
            <button
              onClick={onNewChat}
              className="p-3 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-cyan-300 border border-indigo-500/40 mx-auto transition-all"
              title="New Chat"
            >
              <Plus className="h-5 w-5" />
            </button>
          )}

          <button
            onClick={onToggle}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors ml-2 shrink-0 hidden md:block"
            title={isOpen ? 'Collapse history' : 'Expand history'}
          >
            {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </div>

        {isOpen && (
          <>
            {/* Search sessions filter */}
            <div className="p-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search history..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-800/50 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Sessions List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {filteredSessions.length === 0 ? (
                <div className="py-8 text-center px-4">
                  <MessageSquare className="h-8 w-8 text-slate-600 mx-auto mb-2 opacity-50" />
                  <p className="text-xs text-slate-400">No chat sessions found</p>
                </div>
              ) : (
                filteredSessions.map((session) => {
                  const isActive = session.id === activeSessionId;
                  const isEditing = editingId === session.id;

                  return (
                    <div
                      key={session.id}
                      onClick={() => onSelectSession(session.id)}
                      className={`
                        group relative flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all cursor-pointer border
                        ${
                          isActive
                            ? 'bg-indigo-600/25 border-indigo-500/40 text-white shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                            : 'bg-slate-800/30 border-transparent hover:bg-slate-800/70 hover:border-white/10 text-slate-300'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <MessageSquare
                          className={`h-4 w-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`}
                        />

                        {isEditing ? (
                          <input
                            type="text"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full bg-slate-900 border border-indigo-500 rounded px-1.5 py-0.5 text-xs text-white focus:outline-none"
                            autoFocus
                          />
                        ) : (
                          <span className="truncate font-medium">{session.title}</span>
                        )}
                      </div>

                      {/* Edit / Delete option actions */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
                        {isEditing ? (
                          <>
                            <button
                              onClick={(e) => saveRename(session.id, e)}
                              className="p-1 hover:text-emerald-400 text-slate-400"
                              title="Save"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={cancelRename}
                              className="p-1 hover:text-rose-400 text-slate-400"
                              title="Cancel"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={(e) => startRename(session, e)}
                              className="p-1 hover:text-indigo-300 text-slate-400"
                              title="Rename"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteSession(session.id);
                              }}
                              className="p-1 hover:text-rose-400 text-slate-400"
                              title="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </aside>
    </>
  );
};

export default ChatSidebar;
