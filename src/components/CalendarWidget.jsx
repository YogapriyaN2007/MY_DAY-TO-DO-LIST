import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Trash2, Clock } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

export default function CalendarWidget({ 
  selectedDate, 
  onDateChange, 
  events, 
  onAddEvent, 
  onDeleteEvent 
}) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date(selectedDate);
    // set to first of month
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [newEventText, setNewEventText] = useState('');
  const [newEventTime, setNewEventTime] = useState('12:00');
  const [newEventReminder, setNewEventReminder] = useState(30);

  const todayStr = new Date().toISOString().split('T')[0];

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  // Generate calendar grid
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayIndex = currentMonth.getDay(); // 0 is Sunday
  
  const days = [];
  for (let i = 0; i < firstDayIndex; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
    // Adjust timezone issue by using local date parts to build string
    const dString = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    days.push(dString);
  }

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newEventText.trim()) return;
    onAddEvent({
      id: Date.now().toString(),
      date: selectedDate,
      time: newEventTime,
      text: newEventText,
      reminderOffset: newEventReminder,
      notified: false
    });
    setNewEventText('');
  };

  const selectedEvents = events.filter(e => e.date === selectedDate).sort((a,b) => a.time.localeCompare(b.time));

  const formatTime = (time24h) => {
    if (!time24h) return '';
    const [h, m] = time24h.split(':');
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${m} ${ampm}`;
  };

  return (
    <div className="glass-panel p-6 sm:p-8 flex flex-col relative overflow-hidden h-full max-h-[800px]">
      <div className="absolute right-0 top-0 w-48 h-48 bg-theme-glow-faint rounded-full blur-3xl pointer-events-none transition-colors duration-500"></div>
      
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6 z-10">
        <h2 className="text-xl font-bold text-title flex items-center gap-2">
          <CalendarIcon size={24} className="text-theme" />
          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 hover:bg-card rounded-full text-sub hover:text-body transition-colors">
            <ChevronLeft size={20} />
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-card rounded-full text-sub hover:text-body transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="z-10 mb-8">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="text-center text-xs font-bold text-sub py-1">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((dateStr, i) => {
            if (!dateStr) return <div key={`empty-${i}`} className="p-2"></div>;
            
            const isSelected = dateStr === selectedDate;
            const isToday = dateStr === todayStr;
            const dateObj = new Date(dateStr + 'T00:00:00'); // Force local midnight
            const dayNum = dateObj.getDate();
            const hasEvents = events.some(e => e.date === dateStr);

            return (
              <button
                key={dateStr}
                onClick={() => onDateChange(dateStr)}
                className={twMerge(
                  clsx(
                    "relative aspect-square flex items-center justify-center rounded-full text-sm font-semibold transition-all duration-200",
                    isSelected ? "bg-theme text-white shadow-theme-btn scale-105" 
                      : "hover:bg-card text-body",
                    isToday && !isSelected && "border-2 border-theme text-theme"
                  )
                )}
              >
                {dayNum}
                {hasEvents && !isSelected && (
                  <span className="absolute bottom-1 w-1 h-1 rounded-full bg-theme opacity-80"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Events Divider */}
      <div className="h-px w-full bg-card mb-6 z-10"></div>

      {/* Daily Events Section */}
      <div className="flex-1 flex flex-col z-10 overflow-hidden">
        <h3 className="text-lg font-bold text-title mb-4 flex justify-between items-center">
          <span>Schedule</span>
          <span className="text-xs px-2.5 py-1 bg-card rounded-full text-sub border border-card">
            {new Date(selectedDate + 'T00:00:00').toLocaleDateString('default', { weekday: 'short', month: 'short', day: 'numeric'})}
          </span>
        </h3>

        <div className="flex-1 overflow-y-auto nice-scrollbar pr-2 flex flex-col gap-3 mb-4">
          {selectedEvents.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-sub font-medium py-6 px-4 text-center">
              <span className="text-2xl mb-2">☕</span>
              <p>Your schedule is clear!</p>
            </div>
          ) : (
            selectedEvents.map(event => (
              <div key={event.id} className="glass-card p-3.5 flex items-center group gap-3 border-2">
                 <div className="bg-theme/20 text-theme text-xs font-bold px-2 py-1.5 rounded-xl flex items-center gap-1 shadow-sm whitespace-nowrap">
                   <Clock size={12} strokeWidth={3} />
                   {formatTime(event.time)}
                 </div>
                 <span className="flex-1 text-base font-semibold text-body truncate">
                   {event.text}
                 </span>
                 <button 
                  onClick={() => onDeleteEvent(event.id)}
                  className="p-1.5 text-rose-400 hover:bg-rose-100 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"
                 >
                   <Trash2 size={16} strokeWidth={2.5} />
                 </button>
              </div>
            ))
          )}
        </div>

        {/* Add Event Input */}
        <form onSubmit={handleAddEvent} className="glass-card p-2 flex flex-col sm:flex-row items-center gap-2 mt-auto border-2 border-theme/20">
          <div className="flex w-full sm:w-auto gap-2">
            <input
              type="time"
              value={newEventTime}
              onChange={(e) => setNewEventTime(e.target.value)}
              className="bg-card text-body px-2 py-2 rounded-xl text-sm font-bold border border-card outline-none focus:border-theme flex-1 sm:flex-none text-center"
            />
            <select
              value={newEventReminder}
              onChange={(e) => setNewEventReminder(Number(e.target.value))}
              className="bg-card text-body px-1 py-2 rounded-xl text-xs font-bold border border-card outline-none focus:border-theme shrink-0"
              title="Reminder"
            >
              <option value={0}>At time</option>
              <option value={5}>5m</option>
              <option value={15}>15m</option>
              <option value={30}>30m</option>
              <option value={60}>1h</option>
            </select>
          </div>
          <div className="flex w-full gap-2">
            <input
              type="text"
              value={newEventText}
              onChange={(e) => setNewEventText(e.target.value)}
              placeholder="New event..."
              className="flex-1 bg-transparent border-none text-body placeholder:text-sub px-2 py-2 focus:outline-none text-sm font-semibold"
            />
            <button
              type="submit"
              disabled={!newEventText.trim()}
              className="bg-theme hover:bg-theme/90 disabled:opacity-50 text-white p-2 rounded-full transition-transform hover:scale-105 shadow-sm shrink-0"
            >
              <Plus size={18} strokeWidth={3} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
