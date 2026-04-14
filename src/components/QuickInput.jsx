import { useState, useRef, useEffect } from 'react';
import { Plus, ChevronDown, ChevronUp } from 'lucide-react';

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
  const [expanded, setExpanded]     = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskText.trim()) return;
    onAddTask({
      id: crypto.randomUUID(),
      text: taskText.trim(),
      category,
      priority,
      dueDate: dueDate || null,
      completed: false,
      createdAt: new Date().toISOString(),
    });
    setTaskText('');
    setDueDate('');
    setPriority('Medium');
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="flex flex-col gap-2">
      <form onSubmit={handleSubmit} className="glass-card p-3 flex items-center gap-3 rounded-full">
        <input
          ref={inputRef}
          type="text"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          placeholder="What needs to be done?"
          className="flex-1 bg-transparent border-none text-body placeholder:text-sub px-4 py-2 focus:outline-none focus:ring-0 text-lg font-medium"
        />
        <button
          type="button"
          onClick={() => setExpanded(v => !v)}
          className="p-2 text-sub hover:text-body rounded-full transition-colors"
          title="More options"
        >
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        <button
          type="submit"
          disabled={!taskText.trim()}
          className="bg-theme hover-bg-theme-hover disabled:opacity-50 text-white p-3 rounded-full transition-transform hover:scale-105 duration-200 shadow-theme-btn"
        >
          <Plus size={24} strokeWidth={3} />
        </button>
      </form>

      {/* Expandable options row */}
      {expanded && (
        <div className="glass-card px-4 py-3 rounded-2xl flex flex-wrap gap-3 items-center">
          {/* Category */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-card text-xs font-bold text-body border-2 border-card rounded-full px-3 py-2 outline-none focus:border-theme cursor-pointer"
          >
            <option value="Personal">Personal</option>
            <option value="Work">Work</option>
            <option value="Health">Health</option>
          </select>

          {/* Priority */}
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className={`text-xs font-bold border-2 rounded-full px-3 py-2 outline-none cursor-pointer ${PRIORITY_STYLES[priority]}`}
          >
            <option value="High">🔴 High</option>
            <option value="Medium">🟡 Medium</option>
            <option value="Low">🔵 Low</option>
          </select>

          {/* Due Date */}
          <input
            type="date"
            value={dueDate}
            min={today}
            onChange={(e) => setDueDate(e.target.value)}
            className="bg-card text-xs font-bold text-body border-2 border-card rounded-full px-3 py-2 outline-none focus:border-theme cursor-pointer"
          />
        </div>
      )}
    </div>
  );
}
