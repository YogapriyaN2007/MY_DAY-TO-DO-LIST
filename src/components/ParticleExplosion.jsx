import { motion, AnimatePresence } from 'framer-motion';

const PARTICLES = ['✨', '❤️', '✨', '🌸', '⭐', '✨', '💛', '✨'];

export default function ParticleExplosion({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50 overflow-visible">
          {PARTICLES.map((emoji, i) => {
            const angle = (360 / PARTICLES.length) * i;
            const rad = (angle * Math.PI) / 180;
            const distance = 60 + Math.random() * 30;
            const x = Math.cos(rad) * distance;
            const y = Math.sin(rad) * distance;

            return (
              <motion.span
                key={i}
                className="absolute text-lg select-none"
                initial={{ x: 0, y: 0, opacity: 1, scale: 0.5 }}
                animate={{ x, y, opacity: 0, scale: 1.3 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: "easeOut", delay: i * 0.03 }}
              >
                {emoji}
              </motion.span>
            );
          })}
        </div>
      )}
    </AnimatePresence>
  );
}
