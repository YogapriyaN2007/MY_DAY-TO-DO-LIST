import { useState, useRef, useEffect } from 'react';
import { Plus, ChevronDown, ChevronUp, Sparkles, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';

const PRIORITY_STYLES = {
  High:   'text-rose-500   bg-rose-50   border-rose-200',
  Medium: 'text-amber-500  bg-amber-50  border-amber-200',
  Low:    'text-sky-500    bg-sky-50    border-sky-200',
};

export default function QuickInput({ onAddTask }) {
  const [taskText, setTaskText]     = useState('');
  const [category, setCategory]     = useState('Personal');
  const [priority, setPriority]     = useState('Medium');
  const [dueDate, setDueDate]       = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency]     = useState('daily');
  const [expanded, setExpanded]     = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const parseSmartInput = (text) => {
    let cleanedText = text;
    let smartDate = '';
    let smartCategory = '';
    let smartPriority = '';

    const textLower = text.toLowerCase();

    // 1. Keyword-based AI Brain
    const BRAIN = {
      categories: {
        Work: ['meeting', 'email', 'code', 'report', 'office', 'project', 'client', 'boss', 'deadline', 'presentation', 'zoom'],
        Health: ['gym', 'doctor', 'workout', 'medicine', 'pill', 'dentist', 'run', 'exercise', 'water', 'health', 'yoga', 'hospital'],
        Personal: ['buy', 'call', 'party', 'grocery', 'travel', 'home', 'family', 'friend', 'gift', 'movie', 'dinner']
      },
      priorities: {
        High: ['urgent', 'asap', 'important', 'emergency', 'must', 'deadline', 'boss', 'doctor', 'alert'],
        Low: ['maybe', 'later', 'anytime', 'whenever', 'someday', 'eventually']
      }
    };

    // Auto-detect category
    for (const [cat, keywords] of Object.entries(BRAIN.categories)) {
      if (keywords.some(k => textLower.includes(k))) {
        smartCategory = cat;
        break;
      }
    }

    // Auto-detect priority
    for (const [prio, keywords] of Object.entries(BRAIN.priorities)) {
      if (keywords.some(k => textLower.includes(k))) {
        smartPriority = prio;
        break;
      }
    }

    // 2. Explicit Override (Hashtags)
    const catMatch = text.match(/#(\w+)/);
    if (catMatch) {
      const cat = catMatch[1].charAt(0).toUpperCase() + catMatch[1].slice(1).toLowerCase();
      const validCats = ['Work', 'Health', 'Personal'];
      if (validCats.includes(cat)) {
        smartCategory = cat;
      }
      cleanedText = cleanedText.replace(catMatch[0], '').trim();
    }

    // 3. Date parsing
    const today = new Date();
    
    const setDateToDay = (dayIndex) => {
      const d = new Date(today);
      d.setDate(today.getDate() + (dayIndex + 7 - today.getDay()) % 7);
      if (d <= today) d.setDate(d.getDate() + 7);
      return d.toISOString().split('T')[0];
    };

    if (textLower.includes('tomorrow')) {
      const d = new Date(today);
      d.setDate(today.getDate() + 1);
      smartDate = d.toISOString().split('T')[0];
      cleanedText = cleanedText.replace(/tomorrow/i, '').trim();
    } else if (textLower.includes('today')) {
      smartDate = today.toISOString().split('T')[0];
      cleanedText = cleanedText.replace(/today/i, '').trim();
    } else if (textLower.includes('next week')) {
      const d = new Date(today);
      d.setDate(today.getDate() + 7);
      smartDate = d.toISOString().split('T')[0];
      cleanedText = cleanedText.replace(/next week/i, '').trim();
    } else {
      const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      for (let i = 0; i < days.length; i++) {
        if (textLower.includes(days[i])) {
          smartDate = setDateToDay(i);
          cleanedText = cleanedText.replace(new RegExp(days[i], 'i'), '').trim();
          break;
        }
      }
    }

    return { cleanedText, smartDate, smartCategory, smartPriority };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskText.trim()) return;

    const { cleanedText, smartDate, smartCategory, smartPriority } = parseSmartInput(taskText);

    onAddTask({
      id: crypto.randomUUID(),
      text: cleanedText || taskText.trim(),
      category: smartCategory || category,
      priority: smartPriority || priority,
      dueDate: smartDate || dueDate || null,
      isRecurring,
      frequency: isRecurring ? frequency : null,
      completed: false,
      createdAt: new Date().toISOString(),
    });

    setTaskText('');
    setDueDate('');
    setPriority('Medium');
    setIsRecurring(false);
    setExpanded(false);
  };

  const today = new Date().toISOString().split('T')[0];
  const { smartDate, smartCategory, smartPriority } = parseSmartInput(taskText);

  return (
    <div className="flex flex-col gap-2 relative w-full">
      <form onSubmit={handleSubmit} className="glass-card p-1.5 sm:p-2 flex items-center gap-1.5 sm:gap-2 rounded-[2rem] relative group border-theme/10 w-full overflow-hidden">
        <div className={`absolute left-5 top-1/2 -translate-y-1/2 transition-all duration-500 ${taskText ? 'text-theme scale-125 opacity-100' : 'text-theme/30 opacity-60'}`}>
          <Sparkles size={18} />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          placeholder="New task? (Try 'Gym tomorrow')"
          className="flex-1 min-w-0 bg-transparent border-none text-body placeholder:text-sub pl-11 pr-2 py-2.5 focus:outline-none focus:ring-0 text-base sm:text-lg font-medium"
        />
        
        <button
          type="button"
          onClick={() => setExpanded(v => !v)}
          className={`p-2 rounded-xl transition-all duration-300 ${expanded ? 'bg-theme text-white shadow-lg' : 'text-sub hover:text-theme hover:bg-theme/10'} shrink-0`}
          title="More options"
        >
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        <button
          type="submit"
          disabled={!taskText.trim()}
          className="bg-theme hover:brightness-110 active:scale-95 disabled:opacity-20 text-white rounded-2xl transition-all duration-300 shadow-theme-btn flex items-center justify-center shrink-0 w-11 h-11"
        >
          <Plus size={22} strokeWidth={3} />
        </button>
      </form>

      {/* Smart Preview (Positioned below input to avoid collision) */}
      {taskText && (smartDate || smartCategory || smartPriority) && (
        <div className="flex flex-wrap gap-2 px-4 py-1 animate-pop-up-bounce pointer-events-none">
          {smartDate && (
            <span className="bg-theme text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
              <span className="text-[14px]">📅</span> {smartDate === today ? 'Today' : smartDate}
            </span>
          )}
          {smartCategory && (
            <span className="bg-card border-2 border-theme/30 text-theme text-[10px] font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
              <span className="text-[14px]">🏷️</span> {smartCategory}
            </span>
          )}
          {smartPriority && (
            <span className={`${smartPriority === 'High' ? 'bg-rose-500' : 'bg-sky-500'} text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1`}>
              <span className="text-[14px]">⚡</span> {smartPriority}
            </span>
          )}
        </div>
      )}

      {/* Expandable options row */}
      {expanded && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card px-5 py-4 rounded-[2rem] flex flex-wrap gap-5 items-center z-20 border-theme/20 shadow-xl"
        >
          {/* Category */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider font-bold text-sub">Category</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-card text-xs font-bold text-body border-2 border-card rounded-full px-3 py-1.5 outline-none focus:border-theme cursor-pointer"
            >
              <option value="Personal">Personal</option>
              <option value="Work">Work</option>
              <option value="Health">Health</option>
            </select>
          </div>

          {/* Priority */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider font-bold text-sub">Level</span>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className={`text-xs font-bold border-2 rounded-full px-3 py-1.5 outline-none cursor-pointer ${PRIORITY_STYLES[priority]}`}
            >
              <option value="High">🔴 High</option>
              <option value="Medium">🟡 Medium</option>
              <option value="Low">🔵 Low</option>
            </select>
          </div>

          {/* Due Date */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider font-bold text-sub">When</span>
            <input
              type="date"
              value={dueDate}
              min={today}
              onChange={(e) => setDueDate(e.target.value)}
              className="bg-card text-xs font-bold text-body border-2 border-card rounded-full px-3 py-1.5 outline-none focus:border-theme cursor-pointer"
            />
          </div>

          {/* Recurring Toggle */}
          <div className="flex items-center gap-2 ml-auto">
             <button
              type="button"
              onClick={() => setIsRecurring(!isRecurring)}
              className={`p-2 rounded-xl border-2 transition-all flex items-center gap-2 ${isRecurring ? 'border-theme bg-theme/10 text-theme' : 'border-card bg-card text-sub'}`}
             >
               <RefreshCcw size={14} className={isRecurring ? 'animate-spin-slow' : ''} />
               <span className="text-xs font-bold">Repeat</span>
             </button>
             {isRecurring && (
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="bg-theme text-white text-[10px] font-bold rounded-lg px-2 py-1 outline-none"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
             )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
