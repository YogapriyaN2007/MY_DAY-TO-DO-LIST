import { Palette } from 'lucide-react';

export const CUTE_THEMES = [
  {
    id: 'cozy-sage',
    name: 'Cozy Sage',
    accent: '#059669', // Emerald 600
    bg: '#9ca3af', // Gray 400 (Middle)
    bgImage: 'none',
    panel: 'rgba(255, 255, 255, 0.5)', 
    card: 'rgba(255, 255, 255, 0.6)', 
    text: '#111827', // Gray 900
    textMain: '#374151', // Gray 700
    textMuted: '#4b5563', // Gray 600
    border: 'rgba(255, 255, 255, 0.5)' 
  },
  {
    id: 'dusty-rose',
    name: 'Dusty Rose',
    accent: '#be123c', // Rose 700
    bg: '#d4a5a5', // Muted Rose (Middle)
    bgImage: 'none',
    panel: 'rgba(255, 255, 255, 0.5)',
    card: 'rgba(255, 255, 255, 0.6)',
    text: '#4c0519', // Rose 950
    textMain: '#881337', // Rose 900
    textMuted: '#9f1239', // Rose 800
    border: 'rgba(255, 255, 255, 0.5)'
  },
  {
    id: 'warm-oatmeal',
    name: 'Warm Oatmeal',
    accent: '#ea580c', // Orange 600
    bg: '#d6d3d1', // Stone 300 (Middle)
    bgImage: 'none',
    panel: 'rgba(255, 255, 255, 0.5)',
    card: 'rgba(255, 255, 255, 0.6)',
    text: '#1c1917', // Stone 900
    textMain: '#44403c', // Stone 700
    textMuted: '#57534e', // Stone 600
    border: 'rgba(255, 255, 255, 0.5)'
  },
  {
    id: 'cloudy-slate',
    name: 'Cloudy Slate',
    accent: '#4f46e5', // Indigo 600
    bg: '#94a3b8', // Slate 400 (Middle)
    bgImage: 'none',
    panel: 'rgba(255, 255, 255, 0.5)',
    card: 'rgba(255, 255, 255, 0.6)',
    text: '#0f172a', // Slate 900
    textMain: '#334155', // Slate 700
    textMuted: '#475569', // Slate 600
    border: 'rgba(255, 255, 255, 0.5)'
  },
  {
    id: 'twilight',
    name: 'Twilight Shadows',
    accent: '#c084fc', // Purple 400 
    bg: '#475569', // Slate 600 (Mid-Dark)
    bgImage: 'none',
    panel: 'rgba(30, 41, 59, 0.6)',
    card: 'rgba(15, 23, 42, 0.5)',
    text: '#f8fafc',
    textMain: '#e2e8f0',
    textMuted: '#cbd5e1',
    border: 'rgba(255, 255, 255, 0.1)'
  }
];

export default function ThemePicker({ currentTheme, onThemeChange }) {
  return (
    <div className="flex items-center gap-4 bg-card px-4 py-3 rounded-full border-2 border-card w-full sm:w-auto shadow-sm backdrop-blur-md">
      <div className="flex items-center gap-3">
        <Palette size={18} className="text-sub" />
        <span className="text-sm font-bold text-body hidden sm:inline-block mr-2 uppercase tracking-widest">Vibe</span>
        <div className="flex items-center gap-3">
          {CUTE_THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => onThemeChange(theme)}
              className="w-7 h-7 rounded-full transition-transform hover:scale-110 shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.1),_inset_2px_2px_4px_rgba(255,255,255,0.9)] relative overflow-hidden flex items-center justify-center border-2"
              style={{ 
                backgroundColor: theme.accent,
                borderColor: currentTheme?.id === theme.id ? '#ffffff' : 'transparent',
                outline: currentTheme?.id === theme.id ? `2px solid ${theme.accent}` : 'none'
              }}
              title={theme.name}
            >
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
