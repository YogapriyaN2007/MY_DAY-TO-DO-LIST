import React from 'react';
import { Bell, X } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

export default function NotificationToast({ activeReminders, onDismiss }) {
  if (!activeReminders || activeReminders.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
      {activeReminders.map(reminder => (
        <div 
          key={reminder.id}
          className="glass-panel p-4 rounded-[2rem] flex items-center gap-4 shadow-xl border-t border-l pointer-events-auto transform transition-all duration-500 animate-slide-up-fade w-[320px] max-w-[90vw]"
          style={{ animation: 'slide-up 0.5s ease-out forwards' }}
        >
          <div className="bg-theme text-white w-12 h-12 rounded-full flex shrink-0 items-center justify-center shadow-theme-btn border-2 border-white/20">
            <Bell size={20} className="animate-wiggle" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-body text-xs font-bold uppercase tracking-wider mb-0.5">Upcoming Event</h4>
            <p className="text-title text-sm font-extrabold truncate">{reminder.text}</p>
            <p className="text-theme font-bold text-xs mt-0.5">
              {reminder.timeFormat} (in {reminder.reminderOffset}m)
            </p>
          </div>
          
          <button 
            onClick={() => onDismiss(reminder.id)}
            className="p-2 text-sub hover:text-rose-500 hover:bg-rose-100 rounded-full transition-colors self-start opacity-70 hover:opacity-100"
          >
            <X size={16} strokeWidth={3} />
          </button>
        </div>
      ))}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slide-up {
          0% { transform: translateY(100px) scale(0.9); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-10deg); }
          50% { transform: rotate(10deg); }
        }
        .animate-wiggle {
          animation: wiggle 1s ease-in-out infinite;
        }
      `}} />
    </div>
  );
}
