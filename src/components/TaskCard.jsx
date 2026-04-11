import { useState, useRef, useEffect } from 'react';
import { Check, Trash2, Pencil, X, CalendarClock } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import ParticleExplosion from './ParticleExplosion';

const CATEGORY_COLORS = {
  Personal: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  Work:     "text-blue-400   bg-blue-400/10   border-blue-400/20",
  Health:   "text-rose-400   bg-rose-400/10   border-rose-400/20",
};

const PRIORITY_BADGE = {
  High:   { cls: 'text-rose-500  bg-rose-50  border-rose-200',  dot: '🔴' },
  Medium: { cls: 'text-amber-500 bg-amber-50 border-amber-200', dot: '🟡' },
  Low:    { cls: 'text-sky-500   bg-sky-50   border-sky-200',   dot: '🔵' },
};

function formatDueDate(dateStr) {
  if (!dateStr) return null;
  const due  = new Date(dateStr + 'T00:00:00');
  const now  = new Date();
  now.setHours(0,0,0,0);
  const diff = Math.ceil((due - now) / 86400000);
  const label = due.toLocaleDateString([], { month: 'short', day: 'numeric' });
  return { label, diff };
}

export default function TaskCard({ task, onToggle, onDelete, onEdit, onComplete }) {
  const [showParticles, setShowParticles] = useState(false);
  const [editing, setEditing]             = useState(false);
  const [editText, setEditText]           = useState(task.text);
  const [editPriority, setEditPriority]   = useState(task.priority || 'Medium');
  const [editCategory, setEditCategory]   = useState(task.category || 'Personal');
  const editRef = useRef(null);

  useEffect(() => { if (editing) editRef.current?.focus(); }, [editing]);

  const handleToggle = () => {
    if (!task.completed) {
      setShowParticles(true);
      setTimeout(() => {
        setShowParticles(false);
        onToggle(task.id);
        if (onComplete) onComplete();
      }, 600);
    } else {
      onToggle(task.id);
    }
  };

  const saveEdit = () => {
    if (editText.trim() && onEdit) {
      onEdit(task.id, { text: editText.trim(), priority: editPriority, category: editCategory });
    }
    setEditing(false);
  };

  const cancelEdit = () => {
    setEditText(task.text);
    setEditPriority(task.priority || 'Medium');
    setEditCategory(task.category || 'Personal');
    setEditing(false);
  };

  const due = formatDueDate(task.dueDate);
  const priorityBadge = PRIORITY_BADGE[task.priority] || PRIORITY_BADGE.Medium;

  return (
    <div className={twMerge(clsx(
      "glass-card p-4 rounded-2xl flex flex-col gap-2 group relative overflow-visible",
      task.completed && "opacity-60"
    ))}>
      <ParticleExplosion show={showParticles} />

      <div className="flex items-center gap-3">
        {/* Checkbox */}
        <button
          onClick={handleToggle}
          disabled={editing}
          className={twMerge(clsx(
            "w-7 h-7 shrink-0 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 shadow-sm",
            task.completed ? "bg-theme border-theme text-white" : "border-slate-300 hover-border-theme-light bg-card text-transparent"
          ))}
        >
          <Check size={18} strokeWidth={4} className={task.completed ? "opacity-100" : "opacity-0"} />
        </button>

        {/* Text / Edit input */}
        <div className="flex-1 min-w-0">
          {editing ? (
            <input
              ref={editRef}
              value={editText}
              onChange={e => setEditText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') cancelEdit(); }}
              className="w-full bg-card/80 border-2 border-theme rounded-xl px-3 py-1 text-body text-base font-medium outline-none"
            />
          ) : (
            <span className={twMerge(clsx(
              "block text-base font-medium truncate transition-all duration-300",
              task.completed ? "text-sub line-through opacity-70" : "text-body"
            ))}>
              {task.text}
            </span>
          )}
        </div>

        {/* Action buttons */}
        {!editing && !task.completed && (
          <button
            onClick={() => setEditing(true)}
            className="p-2 text-sub hover:text-theme rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"
          >
            <Pencil size={15} />
          </button>
        )}
        {editing && (
          <div className="flex gap-1">
            <button onClick={saveEdit}   className="p-1.5 text-emerald-500 hover:bg-emerald-50 rounded-full transition-colors"><Check size={15} strokeWidth={3}/></button>
            <button onClick={cancelEdit} className="p-1.5 text-rose-400   hover:bg-rose-50   rounded-full transition-colors"><X     size={15} strokeWidth={3}/></button>
          </div>
        )}
        <button
          onClick={() => onDelete(task.id)}
          className="p-2 text-rose-400 hover:text-rose-500 hover:bg-rose-100 rounded-full opacity-60 sm:opacity-0 group-hover:opacity-100 transition-all duration-200"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Edit controls row */}
      {editing && (
        <div className="flex flex-wrap gap-2 pl-10 mt-1">
          <select value={editCategory} onChange={e => setEditCategory(e.target.value)}
            className="bg-card text-xs font-bold text-body border-2 border-card rounded-full px-3 py-1.5 outline-none cursor-pointer">
            <option value="Personal">Personal</option>
            <option value="Work">Work</option>
            <option value="Health">Health</option>
          </select>
          <select value={editPriority} onChange={e => setEditPriority(e.target.value)}
            className={`text-xs font-bold border-2 rounded-full px-3 py-1.5 outline-none cursor-pointer ${PRIORITY_BADGE[editPriority]?.cls}`}>
            <option value="High">🔴 High</option>
            <option value="Medium">🟡 Medium</option>
            <option value="Low">🔵 Low</option>
          </select>
        </div>
      )}

      {/* Meta badges row */}
      {!editing && (
        <div className="flex flex-wrap items-center gap-2 pl-10">
          {/* Category */}
          <span className={twMerge(clsx(
            "text-xs px-2.5 py-1 rounded-full border font-semibold",
            CATEGORY_COLORS[task.category] || "text-sub bg-card border-card"
          ))}>
            {task.category}
          </span>

          {/* Priority */}
          {task.priority && (
            <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${priorityBadge.cls}`}>
              {priorityBadge.dot} {task.priority}
            </span>
          )}

          {/* Due date */}
          {due && (
            <span className={twMerge(clsx(
              "text-xs px-2.5 py-1 rounded-full border font-semibold flex items-center gap-1",
              due.diff < 0  ? "text-rose-500  bg-rose-50   border-rose-200"  :
              due.diff === 0 ? "text-amber-500 bg-amber-50  border-amber-200" :
                              "text-sky-500   bg-sky-50    border-sky-200"
            ))}>
              <CalendarClock size={11} />
              {due.diff < 0 ? `${Math.abs(due.diff)}d overdue` : due.diff === 0 ? 'Today' : due.label}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
