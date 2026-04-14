import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { supabase } from './supabaseClient';
import Header from './components/Header';
import QuickInput from './components/QuickInput';
import FilterRow from './components/FilterRow';
import TaskCard from './components/TaskCard';
import ThemePicker, { CUTE_THEMES } from './components/ThemePicker';
import CalendarWidget from './components/CalendarWidget';
import NotificationToast from './components/NotificationToast';
import SplashScreen from './components/SplashScreen';
import MemoryLane from './components/MemoryLane';
import StatsBento from './components/StatsBento';
import ZenGreeting from './components/ZenGreeting';
import SortableTask from './components/SortableTask';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);

  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [wins, setWins] = useState([]);
  const [filter, setFilter]               = useState('All');
  const [search, setSearch]               = useState('');
  const [priorityFilter, setPriorityFilter] = useState('Any');
  const [activeReminders, setActiveReminders] = useState([]);
  
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



  // Load initial data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      // Fetch all tasks
      const { data: tasksData } = await supabase
        .from('tasks')
        .select('*')
        .order('completed', { ascending: true })
        .order('order_index', { ascending: true });
      
      if (tasksData) {
        const mappedTasks = tasksData.map(t => ({
          ...t,
          createdAt: t.created_at,
          dueDate: t.due_date,
          completedAt: t.completed_at,
          isRecurring: t.is_recurring,
          frequency: t.frequency
        }));
        setTasks(mappedTasks.filter(t => !t.completed));
        setWins(mappedTasks.filter(t => t.completed));
      }

      // Fetch all events
      const { data: eventsData } = await supabase
        .from('events')
        .select('*');
      
      if (eventsData) {
        setEvents(eventsData.map(e => ({
          ...e,
          reminderOffset: e.reminder_offset
        })));
      }
    };

    fetchData();
  }, []);

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

  const addTask = async (newTask) => {
    // New task at Top (index 0)
    const newWithIndex = { ...newTask, order_index: 0 };
    const updatedTasks = [newWithIndex, ...tasks].map((t, idx) => ({ ...t, order_index: idx }));
    
    setTasks(updatedTasks);
    
    // Save new task
    const { error } = await supabase
      .from('tasks')
      .insert({
        id: newTask.id,
        text: newTask.text,
        category: newTask.category,
        priority: newTask.priority,
        completed: newTask.completed,
        created_at: newTask.createdAt,
        due_date: newTask.dueDate,
        is_recurring: newTask.isRecurring,
        frequency: newTask.frequency,
        subtasks: newTask.subtasks || [],
        order_index: 0
      });

    // Sync other tasks' indices in background
    if (updatedTasks.length > 1) {
       const updates = updatedTasks.slice(1).map(t => ({ 
         id: t.id, 
         order_index: t.order_index, 
         completed: false 
       }));
       supabase.from('tasks').upsert(updates).then(({ error }) => {
         if (error) console.error('Tasks re-index error:', error);
       });
    }
    
    if (error) console.error('Error adding task:', error);
  };

  const calculateNextOccurrence = (currentDate, frequency) => {
    if (!currentDate) return null;
    const date = new Date(currentDate + 'T00:00:00');
    if (frequency === 'daily') date.setDate(date.getDate() + 1);
    else if (frequency === 'weekly') date.setDate(date.getDate() + 7);
    else if (frequency === 'monthly') date.setMonth(date.getMonth() + 1);
    return date.toISOString().split('T')[0];
  };

  const toggleTask = async (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    if (!task.completed) {
      // Completing a task
      const completedAt = new Date().toISOString();
      const updatedTask = { ...task, completed: true, completedAt };

      if (task.isRecurring) {
        // Create a separate Win record for recurring tasks to keep history
        const winId = crypto.randomUUID();
        const winRecord = { ...task, id: winId, completed: true, completedAt, isRecurring: false };
        setWins(prev => [winRecord, ...prev]);
        
        await supabase.from('tasks').insert({
          id: winId,
          text: task.text,
          category: task.category,
          priority: task.priority,
          completed: true,
          completed_at: completedAt,
          is_recurring: false
        });

        // Update original task to next occurrence
        const nextDate = calculateNextOccurrence(task.dueDate || new Date().toISOString().split('T')[0], task.frequency);
        setTasks(prev => prev.map(t => t.id === id ? { ...t, dueDate: nextDate } : t));
        await supabase.from('tasks').update({ due_date: nextDate }).eq('id', id);
        
        return; // Skip the default behavior for recurring
      }

      setTasks(prev => prev.filter(t => t.id !== id));
      setWins(prev => [updatedTask, ...prev]);

      await supabase
        .from('tasks')
        .update({ completed: true, completed_at: completedAt })
        .eq('id', id);
    } else {
      // Moving back from wins (if needed, though UI doesn't explicitly support yet)
      const updatedTask = { ...task, completed: false, completedAt: null };
      setWins(prev => prev.filter(t => t.id !== id));
      setTasks(prev => [updatedTask, ...prev]);

      await supabase
        .from('tasks')
        .update({ completed: false, completed_at: null })
        .eq('id', id);
    }
  };

  const editTask = async (id, updates) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    
    await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id);
  };

  const clearWins = async () => {
    const winIds = wins.map(w => w.id);
    setWins([]);
    
    await supabase
      .from('tasks')
      .delete()
      .in('id', winIds);
  };

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

  const deleteTask = async (id) => {
    setTasks(tasks.filter(task => task.id !== id));
    await supabase.from('tasks').delete().eq('id', id);
  };

  const addEvent = async (newEvent) => {
    setEvents([...events, newEvent]);
    await supabase.from('events').insert({
      id: newEvent.id,
      text: newEvent.text,
      date: newEvent.date,
      time: newEvent.time,
      notified: newEvent.notified,
      reminder_offset: newEvent.reminderOffset
    });
  };

  const deleteEvent = async (id) => {
    setEvents(events.filter(e => e.id !== id));
    await supabase.from('events').delete().eq('id', id);
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

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
       setTasks((items) => {
         const oldIndex = items.findIndex((t) => t.id === active.id);
         const newIndex = items.findIndex((t) => t.id === over.id);
         const newOrder = arrayMove(items, oldIndex, newIndex);
         
         // Update Supabase with new indices
         const updates = newOrder.map((task, index) => ({
           id: task.id,
           order_index: index,
           completed: false // Ensure we're only indexing active tasks correctly
         }));

         // Perform batch update
         supabase.from('tasks').upsert(updates).then(({ error }) => {
           if (error) console.error('Persistence Error:', error);
         });

         return newOrder;
       });
    }
  };

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
                <Header tasks={tasks} />
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
                 
                 {/* Stats Bento inside Left Column */}
                 <div className="mt-4 h-[280px]">
                    <StatsBento tasks={tasks} wins={wins} />
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
                    <DndContext 
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext 
                        items={filteredTasks.map(t => t.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <AnimatePresence mode="popLayout">
                          {filteredTasks.length === 0 ? (
                            <motion.div 
                              key="empty"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="flex-1 flex flex-col items-center justify-center text-sub font-medium py-12 gap-4"
                            >
                              <div className="w-16 h-16 rounded-2xl bg-card flex items-center justify-center border border-card shadow-sm">
                                <span className="text-2xl">✨</span>
                              </div>
                              <p>{filter === 'All' ? "No tasks yet. Let's get things done!" : `No ${filter.toLowerCase()} tasks.`}</p>
                            </motion.div>
                          ) : (
                            filteredTasks.map(task => (
                              <motion.div
                                key={task.id}
                                layout
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                              >
                                <SortableTask 
                                  key={task.id}
                                  task={task} 
                                  onToggle={toggleTask} 
                                  onDelete={deleteTask}
                                  onEdit={editTask}
                                  onComplete={handleTaskComplete}
                                />
                              </motion.div>
                            ))
                          )}
                        </AnimatePresence>
                      </SortableContext>
                    </DndContext>
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

