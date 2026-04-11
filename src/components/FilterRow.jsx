import { Search } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const STATUS_FILTERS   = ['All', 'Active', 'Completed'];
const PRIORITY_FILTERS = ['Any', 'High', 'Medium', 'Low'];

const PRIORITY_ACTIVE = {
  High:   'bg-rose-100  text-rose-500  border-rose-300',
  Medium: 'bg-amber-100 text-amber-500 border-amber-300',
  Low:    'bg-sky-100   text-sky-500   border-sky-300',
  Any:    'bg-theme-glow text-theme-light border-theme-strong shadow-theme-glow',
};

export default function FilterRow({ currentFilter, onFilterChange, search, onSearchChange, priorityFilter, onPriorityChange }) {
  return (
    <div className="flex flex-col gap-3 mb-4">
      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sub pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Search tasks..."
          className="w-full bg-card border-2 border-card rounded-full pl-9 pr-4 py-2 text-sm text-body placeholder:text-sub outline-none focus:border-theme transition-colors"
        />
      </div>

      {/* Status filter */}
      <div className="flex items-center gap-2 flex-wrap">
        {STATUS_FILTERS.map(f => (
          <button key={f} onClick={() => onFilterChange(f)}
            className={twMerge(clsx(
              "px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border",
              currentFilter === f
                ? "bg-theme-glow text-theme-light border-theme-strong shadow-theme-glow"
                : "bg-card text-sub border-transparent hover:border-card hover:text-body opacity-80 hover:opacity-100"
            ))}>
            {f}
          </button>
        ))}
      </div>

      {/* Priority filter */}
      <div className="flex items-center gap-2 flex-wrap">
        {PRIORITY_FILTERS.map(p => (
          <button key={p} onClick={() => onPriorityChange(p)}
            className={twMerge(clsx(
              "px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border",
              priorityFilter === p
                ? (PRIORITY_ACTIVE[p] || PRIORITY_ACTIVE.Any)
                : "bg-card text-sub border-transparent hover:border-card hover:text-body opacity-80 hover:opacity-100"
            ))}>
            {p === 'Any' ? 'Any Priority' : p}
          </button>
        ))}
      </div>
    </div>
  );
}
