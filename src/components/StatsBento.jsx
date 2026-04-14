import React from 'react';
import { motion } from 'framer-motion';
import { Target, Trophy, Flame, PieChart } from 'lucide-react';

export default function StatsBento({ tasks, wins }) {
  const totalTasks = tasks.length + wins.length;
  const completionRate = totalTasks > 0 ? Math.round((wins.length / totalTasks) * 100) : 0;
  
  // Calculate category breakdown
  const categoryStats = wins.reduce((acc, task) => {
    acc[task.category] = (acc[task.category] || 0) + 1;
    return acc;
  }, {});

  const topCategory = Object.entries(categoryStats).sort((a,b) => b[1] - a[1])[0]?.[0] || 'None yet';

  // Streak logic (pseudo-streak based on recent wins)
  const today = new Date().toISOString().split('T')[0];
  const winDates = new Set(wins.map(w => w.completedAt?.split('T')[0]));
  const streak = winDates.has(today) ? 1 : 0; // Simplified for now

  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      {/* Completion Rate */}
      <motion.div 
        whileHover={{ y: -5 }}
        className="glass-panel p-5 rounded-[2.5rem] flex flex-col justify-between border-2 border-theme/20 bg-theme/5"
      >
        <div className="flex items-center justify-between text-theme">
          <Target size={20} strokeWidth={2.5} />
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Score</span>
        </div>
        <div>
          <h3 className="text-3xl font-black text-title">{completionRate}%</h3>
          <p className="text-xs font-bold text-sub mt-1">Efficiency Rate</p>
        </div>
      </motion.div>

      {/* Streak */}
      <motion.div 
        whileHover={{ y: -5 }}
        className="glass-panel p-5 rounded-[2.5rem] flex flex-col justify-between border-2 border-amber-200/50 bg-amber-50/30"
      >
        <div className="flex items-center justify-between text-amber-500">
          <Flame size={20} strokeWidth={2.5} />
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Flow</span>
        </div>
        <div>
          <h3 className="text-3xl font-black text-title">{streak}d</h3>
          <p className="text-xs font-bold text-sub mt-1">Daily Streak</p>
        </div>
      </motion.div>

      {/* Wins Count */}
      <motion.div 
        whileHover={{ y: -5 }}
        className="glass-panel p-5 rounded-[2.5rem] flex flex-col justify-between border-2 border-emerald-200/50 bg-emerald-50/30"
      >
        <div className="flex items-center justify-between text-emerald-500">
          <Trophy size={20} strokeWidth={2.5} />
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Wins</span>
        </div>
        <div>
          <h3 className="text-3xl font-black text-title">{wins.length}</h3>
          <p className="text-xs font-bold text-sub mt-1">Life Achievements</p>
        </div>
      </motion.div>

      {/* Top Category */}
      <motion.div 
        whileHover={{ y: -5 }}
        className="glass-panel p-5 rounded-[2.5rem] flex flex-col justify-between border-2 border-blue-200/50 bg-blue-50/30"
      >
        <div className="flex items-center justify-between text-blue-500">
          <PieChart size={20} strokeWidth={2.5} />
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Focus</span>
        </div>
        <div>
          <h3 className="text-lg font-black text-title truncate">{topCategory}</h3>
          <p className="text-xs font-bold text-sub mt-1">Major Interest</p>
        </div>
      </motion.div>
    </div>
  );
}
