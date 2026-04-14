import { useMemo } from 'react';
import { motion } from 'framer-motion';

export default function ZenGreeting({ tasks = [] }) {
  const message = useMemo(() => {
    const hour = new Date().getHours();
    const activeTasks = tasks.filter(t => !t.completed).length;
    
    let greeting = "Good morning";
    if (hour >= 12 && hour < 17) greeting = "Good afternoon";
    else if (hour >= 17 && hour < 22) greeting = "Good evening";
    else if (hour >= 22 || hour < 5) greeting = "Night owl";

    if (activeTasks === 0) {
      return `${greeting}! You've cleared your plate. Enjoy the peace! ✨`;
    }
    
    if (activeTasks === 1) {
      return `${greeting}. Just 1 task left to conquer! You got this! 🚀`;
    }

    if (activeTasks > 5) {
      return `${greeting}. A busy day ahead! Let's take it one step at a time! 🦾`;
    }

    return `${greeting}! You have ${activeTasks} goals waiting for you. Let's grow! 🌱`;
  }, [tasks]);

  return (
    <motion.p 
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      key={message}
      className="text-xs sm:text-sm font-bold text-theme tracking-widest uppercase opacity-80"
    >
      {message}
    </motion.p>
  );
}
