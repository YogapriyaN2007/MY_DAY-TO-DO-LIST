import { motion, AnimatePresence } from 'framer-motion';
import { Check, Trash2 } from 'lucide-react';

function formatCompletedAt(iso) {
  const d = new Date(iso);
  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const date = d.toLocaleDateString([], { month: 'long', day: 'numeric' });
  return { time, date };
}

export default function MemoryLane({ wins, onClear }) {
  return (
    <div className="glass-panel p-6 rounded-3xl flex flex-col relative overflow-hidden h-full">
      <div className="absolute -right-16 -bottom-16 w-40 h-40 bg-emerald-400/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-5 z-10">
        <h2 className="text-xl font-semibold text-title flex items-center gap-2">
          My Wins ✨
        </h2>
        <span className="text-sm font-medium text-sub bg-card px-3 py-1 rounded-full border border-card">
          {wins.length} {wins.length === 1 ? 'task' : 'tasks'} done!
        </span>
      </div>

      {/* Wins List */}
      <div className="flex flex-col gap-2 flex-1 overflow-y-auto pr-1 nice-scrollbar z-10">
        <AnimatePresence initial={false}>
          {wins.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-sub font-medium py-12 gap-3">
              <div className="w-14 h-14 rounded-2xl bg-card flex items-center justify-center border border-card shadow-sm">
                <span className="text-2xl">🌱</span>
              </div>
              <p className="text-sm text-center">Complete tasks to see your wins here!</p>
            </div>
          ) : (
            [...wins].reverse().map((win) => {
              const { time, date } = formatCompletedAt(win.completedAt);
              return (
                <motion.div
                  key={win.id}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="flex items-start gap-3 py-2.5 px-3 rounded-2xl bg-emerald-50/30 border border-emerald-100/50"
                >
                  {/* Mint check */}
                  <div className="mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: '#D1FAE5' }}>
                    <Check size={13} strokeWidth={3} className="text-emerald-500" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-sub line-through truncate opacity-70">
                      {win.text}
                    </p>
                    <p className="text-xs text-sub/60 mt-0.5">
                      {date} · {time}
                    </p>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Clear History Button */}
      {wins.length > 0 && (
        <button
          onClick={onClear}
          className="mt-5 w-full text-xs font-medium text-sub/50 hover:text-rose-400 transition-colors duration-200 py-2 rounded-xl hover:bg-rose-50/50 z-10"
        >
          Clear History
        </button>
      )}
    </div>
  );
}
