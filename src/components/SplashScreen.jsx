import { motion } from 'framer-motion';
import { Cloud } from 'lucide-react';

export default function SplashScreen() {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-b from-[#FCFAFF] via-indigo-50/30 to-pink-50/20 overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.div
        className="z-10 flex flex-col items-center justify-center"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          animate={{
            y: [-12, 12, -12],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative mb-6"
        >
          <Cloud
            size={100}
            strokeWidth={1}
            color="#A78BFA"
            fill="#F3F0FF"
            className="drop-shadow-[0_10px_20px_rgba(167,139,250,0.25)]"
          />
        </motion.div>

        <h1
          className="text-4xl font-light text-slate-500 tracking-[0.25em] mb-10"
          style={{ fontFamily: "'Quicksand', sans-serif" }}
        >
          MyDay
        </h1>

        {/* Smooth Straight Progress Bar */}
        <div className="w-52 h-[3px] bg-slate-200/80 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-violet-400 via-pink-300 to-indigo-300 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
