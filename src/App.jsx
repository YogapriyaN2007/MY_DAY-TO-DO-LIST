import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header';
import QuickInput from './components/QuickInput';
import FilterRow from './components/FilterRow';
import TaskCard from './components/TaskCard';
import ThemePicker, { CUTE_THEMES } from './components/ThemePicker';
import CalendarWidget from './components/CalendarWidget';
import NotificationToast from './components/NotificationToast';
import SplashScreen from './components/SplashScreen';
import MemoryLane from './components/MemoryLane';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('lift-tasks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [
      { id: '1', text: 'Define the God-Level architecture', category: 'Work', completed: true, createdAt: new Date().toISOString() },
      { id: '2', text: 'Build Bento Box layout', category: 'Work', completed: false, createdAt: new Date().toISOString() },
    ];
  });
  const [filter, setFilter]               = useState('All');
  const [search, setSearch]               = useState('');
  const [priorityFilter, setPriorityFilter] = useState('Any');
  const [activeReminders, setActiveReminders] = useState([]);
  
  // Schedule state
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('myday-events');
    if (saved) return JSON.parse(saved);
    return [];
  });
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  const [currentTheme, setCurrentTheme] = useState(() => {
    const saved = localStorage.getItem('lift-theme-v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return CUTE_THEMES[0];
  });

  const [wins, setWins] = useState(() => {
    const saved = localStorage.getItem('myday-wins');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('lift-tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('myday-wins', JSON.stringify(wins));
  }, [wins]);

  useEffect(() => {
    localStorage.setItem('myday-events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('lift-theme-v2', JSON.stringify(currentTheme));
    
    // Apply full theme variables to DOM
    const root = document.documentElement.style;
    root.setProperty('--theme-color', currentTheme.accent);
    root.setProperty('--bg-color', currentTheme.bg);
    root.setProperty('--text-h', currentTheme.text);
    root.setProperty('--text-main', currentTheme.textMain);
    root.setProperty('--text-muted', currentTheme.textMuted);
    root.setProperty('--panel-bg', currentTheme.panel);
    root.setProperty('--card-bg', currentTheme.card);
    root.setProperty('--border-color', currentTheme.border);
  }, [currentTheme]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const addTask = (newTask) => {
    setTasks([newTask, ...tasks]);
  };

  const toggleTask = (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    if (!task.completed) {
      setTasks(prev => prev.filter(t => t.id !== id));
      setWins(prev => [...prev, { ...task, completed: true, completedAt: new Date().toISOString() }]);
    } else {
      setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    }
  };

  const editTask = (id, updates) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const clearWins = () => setWins([]);

  useEffect(() => {
    // Request notification permission on load
    if (window.Notification && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      let hasChanges = false;
      const updatedEvents = events.map(event => {
        if (event.notified) return event;
        
        // Parse event time locally
        const [y, mo, d] = event.date.split('-');
        const [h, m] = event.time.split(':');
        const eventDate = new Date(y, mo - 1, d, h, m, 0);
        
        const offset = event.reminderOffset !== undefined ? event.reminderOffset : 30;
        const triggerTime = eventDate.getTime() - (offset * 60000);
        
        // If trigger time has passed recently (within past 2 hours), alert
        if (now.getTime() >= triggerTime && now.getTime() < eventDate.getTime() + 7200000) {
          hasChanges = true;
          
          const format12Hour = (time24h) => {
            const [hh, mm] = time24h.split(':');
            const hr = parseInt(hh, 10);
            return `${hr % 12 || 12}:${mm} ${hr >= 12 ? 'PM' : 'AM'}`;
          };

          const newReminder = {
            id: event.id + '-' + Date.now(),
            text: event.text,
            timeFormat: format12Hour(event.time),
            reminderOffset: offset
          };

          setActiveReminders(prev => [...prev, newReminder]);

          // Trigger OS Notification
          if (window.Notification && Notification.permission === 'granted') {
            new Notification('MyDay Reminder', {
              body: `${event.text} is happening ${offset === 0 ? 'now' : `in ${offset} minutes`}! (${format12Hour(event.time)})`,
            });
          }

          return { ...event, notified: true };
        }
        return event;
      });

      if (hasChanges) {
        setEvents(updatedEvents);
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [events]);

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const addEvent = (newEvent) => {
    setEvents([...events, newEvent]);
  };

  const deleteEvent = (id) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const handleTaskComplete = () => {
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 2500);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'Active'    && task.completed)  return false;
    if (filter === 'Completed' && !task.completed) return false;
    if (priorityFilter !== 'Any' && task.priority !== priorityFilter) return false;
    if (search.trim() && !task.text.toLowerCase().includes(search.trim().toLowerCase())) return false;
    return true;
  });

  return (
    <>
      <AnimatePresence mode="wait">
        {showSplash && <SplashScreen key="splash" />}
      </AnimatePresence>
      
      {!showSplash && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div 
            className="min-h-screen p-4 md:p-8 flex justify-center items-start pt-8 md:pt-12 bg-cover bg-center bg-no-repeat bg-fixed transition-all duration-700"
            style={{ 
              backgroundImage: currentTheme.bgImage ? currentTheme.bgImage : `radial-gradient(ellipse at top, color-mix(in srgb, var(--bg-color) 85%, white), var(--bg-color) 60%)`,
              backgroundColor: 'var(--bg-color)'
            }}
          >
            <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
              <div className="lg:col-span-12 flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4 mb-0 sm:mb-2 w-full">
                 <ThemePicker currentTheme={currentTheme} onThemeChange={setCurrentTheme} />
              </div>
              
              <div className="lg:col-span-12">
                <Header />
              </div>
              
              {/* Left Column: Tasks & Focus */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                 <div className="glass-panel p-6 rounded-3xl h-[100%] flex flex-col justify-start relative overflow-hidden">
                    <div className="absolute -right-16 -top-16 w-32 h-32 bg-theme-glow-faint rounded-full blur-3xl pointer-events-none transition-colors duration-500"></div>
                    
                    <h2 className="text-xl font-semibold text-title mb-4 z-10">Add Task</h2>
                    <QuickInput onAddTask={addTask} />
                    
                    <div className="mt-10 z-10">
                       <h2 className="text-xl font-semibold text-title mb-4">Focus</h2>
                        <FilterRow
                          currentFilter={filter}   onFilterChange={setFilter}
                          search={search}           onSearchChange={setSearch}
                          priorityFilter={priorityFilter} onPriorityChange={setPriorityFilter}
                        />
                    </div>
                 </div>
              </div>

              {/* Middle Column: Your List */}
              <div className="lg:col-span-4">
                <div className="glass-panel p-6 sm:p-8 rounded-3xl min-h-[500px] flex flex-col relative overflow-hidden h-full">
                  <div className="absolute -left-32 top-1/2 -translate-y-1/2 w-64 h-64 bg-theme-glow-faint rounded-full blur-3xl pointer-events-none transition-colors duration-500"></div>
                  
                  <h2 className="text-xl font-semibold text-title mb-6 flex items-center justify-between z-10">
                    <span>Your List</span>
                    <span className="text-sm font-medium text-sub bg-card px-3 py-1 rounded-full border border-card">
                      {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
                    </span>
                  </h2>
                  
                  <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-2 z-10 nice-scrollbar">
                    {filteredTasks.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-sub font-medium py-12 gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-card flex items-center justify-center border border-card shadow-sm">
                           <span className="text-2xl">✨</span>
                        </div>
                        <p>{filter === 'All' ? "No tasks yet. Let's get things done!" : `No ${filter.toLowerCase()} tasks.`}</p>
                      </div>
                    ) : (
                      filteredTasks.map(task => (
                        <TaskCard 
                          key={task.id} 
                          task={task} 
                          onToggle={toggleTask} 
                          onDelete={deleteTask}
                          onEdit={editTask}
                          onComplete={handleTaskComplete}
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Memory Lane — Full Width Below */}
              <div className="lg:col-span-4">
                <MemoryLane wins={wins} onClear={clearWins} />
              </div>

              {/* Right Column: Calendar & Schedule */}
              <div className="lg:col-span-4">
                <CalendarWidget 
                  selectedDate={selectedDate}
                  onDateChange={setSelectedDate}
                  events={events}
                  onAddEvent={addEvent}
                  onDeleteEvent={deleteEvent}
                />
              </div>
            </div>
            
            <NotificationToast 
              activeReminders={activeReminders} 
              onDismiss={(id) => setActiveReminders(prev => prev.filter(r => r.id !== id))} 
            />

            {/* Celebration Success Toast */}
            <AnimatePresence>
              {showCelebration && (
                <motion.div
                  key="celebration-toast"
                  initial={{ opacity: 0, y: 40, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] px-6 py-3.5 rounded-2xl shadow-lg border border-pink-100"
                  style={{ background: '#FDF2F8', fontFamily: "'Quicksand', sans-serif" }}
                >
                  <p className="text-pink-500 font-semibold text-sm tracking-wide whitespace-nowrap">
                    Yay! You completed a task! ✨
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </>
  );
}

