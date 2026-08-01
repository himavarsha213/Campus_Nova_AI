'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ThumbsUp, ThumbsDown, MessageSquare, Send, CheckCircle2, X } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import GlassCard from '@/components/ui/GlassCard';
import GlassButton from '@/components/ui/GlassButton';

import { API_BASE_URL as API } from '@/lib/api';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatMessageId?: string;
  queryText?: string;
  aiResponseText?: string;
  initialRating?: number;
}

const CATEGORIES = ['Helpful', 'Inaccurate', 'Incomplete', 'Formatting Issue', 'Other'];

export default function FeedbackModal({
  isOpen,
  onClose,
  chatMessageId,
  queryText,
  aiResponseText,
  initialRating = 5,
}: FeedbackModalProps) {
  const { token } = useAuth();
  const [rating, setRating] = useState<number>(initialRating);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [category, setCategory] = useState<string>('Helpful');
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch(`${API}/api/v1/feedback`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_message_id: chatMessageId,
          rating,
          category,
          comment,
          query_text: queryText,
          ai_response_text: aiResponseText,
        }),
      });

      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Feedback submit error:', err);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative max-w-md w-full"
        >
          <GlassCard className="p-6 border-indigo-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            {isSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto animate-bounce" />
                <h3 className="text-base font-bold text-white">Thank You!</h3>
                <p className="text-xs text-slate-300">Your feedback helps improve CampusNova AI accuracy.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-indigo-400" /> Rate AI Response
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Help us fine-tune retrieval accuracy and groundedness.</p>
                </div>

                {/* Star Rating */}
                <div className="flex items-center justify-center gap-2 py-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star
                        className={`h-7 w-7 transition-colors ${
                          (hoverRating || rating) >= star
                            ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]'
                            : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                {/* Category Pills */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-2 block">Feedback Tag</label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          category === cat
                            ? 'bg-indigo-600/30 border-indigo-500/50 text-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.3)]'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment Box */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">Comment (Optional)</label>
                  <textarea
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us what was missing or incorrect..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500/60 transition-all resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-all"
                  >
                    Cancel
                  </button>
                  <GlassButton
                    type="submit"
                    disabled={isSubmitting}
                    variant="primary"
                    size="sm"
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    <Send className="h-3.5 w-3.5" /> Submit Feedback
                  </GlassButton>
                </div>
              </form>
            )}
          </GlassCard>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
