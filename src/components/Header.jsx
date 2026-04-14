import { Calendar, ListTodo } from 'lucide-react';
import ZenGreeting from './ZenGreeting';

export default function Header({ tasks }) {
  const today = new Date();
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  const dateString = today.toLocaleDateString('en-US', options);

  return (
    <header className="col-span-full glass-panel p-6 flex flex-col sm:flex-row items-center justify-between rounded-[2.5rem] gap-4">
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <div className="bg-theme-glow p-4 rounded-full border border-theme-glow">
          <ListTodo size={32} className="text-theme" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-3xl font-extrabold tracking-tight text-title mb-0.5">MyDay</h1>
          <ZenGreeting tasks={tasks} />
        </div>
      </div>
      
      <div className="flex items-center justify-center w-full sm:w-auto gap-3 bg-card px-6 py-4 rounded-full border-2 border-card shadow-sm">
        <Calendar size={20} className="text-theme-light" />
        <span className="text-body font-medium">{dateString}</span>
      </div>
    </header>
  );
}
