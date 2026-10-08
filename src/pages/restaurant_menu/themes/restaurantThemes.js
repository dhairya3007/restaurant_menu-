/**
 * RESTAURANT MENU THEMES
 * ─────────────────────────────────────────────────────────────
 * To add a new theme in the future:
 *   1. Add a CSS block in index.css for  body.theme-<id>
 *   2. Push a new object to this array below.
 *   Nothing else needs to change.
 * ─────────────────────────────────────────────────────────────
 */

export const RESTAURANT_THEMES = [
  {
    id: 'modern',
    name: 'Modern Dark',
    emoji: '🌙',
    description: 'Sleek dark UI with pink accents',
    layout: 'list',
    preview: {
      headerBg: 'linear-gradient(135deg, #ec4899, #f472b6)',
      pageBg: '#111827',
      cardBg: 'rgba(31,41,55,0.8)',
      textColor: '#f3f4f6',
      accentColor: '#ec4899',
    },
  },
  {
    id: 'light',
    name: 'Light & Clean',
    emoji: '☀️',
    description: 'Bright white with blue accents',
    layout: 'list',
    preview: {
      headerBg: 'linear-gradient(135deg, #3b82f6, #93c5fd)',
      pageBg: '#ffffff',
      cardBg: '#f3f4f6',
      textColor: '#1f2937',
      accentColor: '#3b82f6',
    },
  },
  {
    id: 'classic',
    name: 'Classic Elegance',
    emoji: '🍂',
    description: 'Warm browns with circular dish images',
    layout: 'list',
    preview: {
      headerBg: 'linear-gradient(135deg, #8b5a2b, #d2b48c)',
      pageBg: '#fff8dc',
      cardBg: '#ffffff',
      textColor: '#3e2723',
      accentColor: '#8b5a2b',
    },
  },
  {
    id: 'luxury',
    name: 'Luxury Navy & Gold',
    emoji: '👑',
    description: 'Dark navy with gold accents — tab layout',
    layout: 'tabs',
    preview: {
      headerBg: 'linear-gradient(135deg, #020617, #0f172a)',
      pageBg: '#0f172a',
      cardBg: '#1e293b',
      textColor: '#fef3c7',
      accentColor: '#fbbf24',
    },
  },
  {
    id: 'elegant',
    name: 'Monochrome Minimal',
    emoji: '🖤',
    description: 'Black & white minimalist — tab layout',
    layout: 'tabs',
    preview: {
      headerBg: '#000000',
      pageBg: '#ffffff',
      cardBg: 'transparent',
      textColor: '#000000',
      accentColor: '#000000',
    },
  },
  {
    id: 'neon',
    name: 'Cyberpunk Neon',
    emoji: '⚡',
    description: 'Black background with electric green accents',
    layout: 'list',
    preview: {
      headerBg: 'linear-gradient(135deg, #000000, #111111)',
      pageBg: '#000000',
      cardBg: 'rgba(57,255,20,0.06)',
      textColor: '#ffffff',
      accentColor: '#39ff14',
    },
  },
  {
    id: 'nature',
    name: 'Organic Nature',
    emoji: '🌿',
    description: 'Fresh greens with rounded leaf shapes',
    layout: 'list',
    preview: {
      headerBg: 'linear-gradient(135deg, #15803d, #22c55e)',
      pageBg: '#f0fdf4',
      cardBg: '#ffffff',
      textColor: '#14532d',
      accentColor: '#15803d',
    },
  },
  {
    id: 'sunset',
    name: 'Sunset Gradient',
    emoji: '🌅',
    description: 'Warm orange-red with ticket-style cards',
    layout: 'list',
    preview: {
      headerBg: 'linear-gradient(135deg, #f97316, #e11d48)',
      pageBg: '#fff7ed',
      cardBg: 'linear-gradient(135deg, #ffffff, #ffedd5)',
      textColor: '#7c2d12',
      accentColor: '#f97316',
    },
  },
  {
    id: 'retro',
    name: 'Retro Blocky',
    emoji: '🎮',
    description: 'Bold comic-style cards on blue background',
    layout: 'list',
    preview: {
      headerBg: '#eab308',
      pageBg: '#3b82f6',
      cardBg: '#ffffff',
      textColor: '#000000',
      accentColor: '#eab308',
    },
  },
  {
    id: 'compact',
    name: 'Compact List',
    emoji: '📋',
    description: 'Image-left compact rows — great for long menus',
    layout: 'list',
    preview: {
      headerBg: 'linear-gradient(135deg, #6366f1, #4f46e5)',
      pageBg: '#f8fafc',
      cardBg: '#ffffff',
      textColor: '#334155',
      accentColor: '#6366f1',
    },
  },
];
