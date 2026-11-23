/**
 * MINDVERSE Global Configuration
 * Offline-first, Mobile-first Arcade
 */
export const CONFIG = {
  APP_NAME: 'MINDVERSE',
  TAGLINE: 'Enter. Observe. Think. Play.',
  VERSION: '1.0.0',
  DEFAULT_LANG: 'en',
  SUPPORTED_LANGUAGES: ['te', 'en', 'hi'],
  
  // Configurable permanent destination URL for QR codes.
  // Verified live production destination on GitHub Pages.
  DEFAULT_DESTINATION_URL: 'https://naveenk7100-ship-it.github.io/MINDVERSE/',
  
  // Storage keys
  STORAGE_KEYS: {
    DESTINATION_URL: 'mindverse_destination_url',
    OWNER_PIN_HASH: 'mindverse_owner_pin_hash',
    LANG: 'mindverse_selected_lang',
    AUDIO_SFX: 'mindverse_sfx_enabled',
    AUDIO_MUSIC: 'mindverse_music_enabled',
    FIRST_VISIT: 'mindverse_first_visit'
  },
  
  // Games registry
  GAMES: [
    {
      id: 'observation-master',
      icon: '👁️',
      color: 'from-cyan-500 to-blue-600',
      accent: '#38bdf8',
      levels: 5
    },
    {
      id: 'memory-match',
      icon: '🧠',
      color: 'from-purple-500 to-indigo-600',
      accent: '#a855f7',
      levels: 5
    },
    {
      id: 'logic-detective',
      icon: '🔍',
      color: 'from-emerald-500 to-teal-600',
      accent: '#10b981',
      levels: 5
    },
    {
      id: 'knowledge-quest',
      icon: '⚡',
      color: 'from-amber-500 to-orange-600',
      accent: '#f59e0b',
      levels: 5
    },
    {
      id: 'mind-reset',
      icon: '🌌',
      color: 'from-pink-500 to-rose-600',
      accent: '#ec4899',
      levels: 5
    }
  ],

  // Achievements definition
  ACHIEVEMENTS: [
    { id: 'first_play', icon: '🎮', reqPlays: 1 },
    { id: 'eagle_eye', icon: '🦅', gameId: 'observation-master', minStars: 9 },
    { id: 'memory_virtuoso', icon: '💎', gameId: 'memory-match', minStars: 9 },
    { id: 'logic_sherlock', icon: '🕵️', gameId: 'logic-detective', minStars: 9 },
    { id: 'polymath', icon: '📚', gameId: 'knowledge-quest', minStars: 9 },
    { id: 'zen_master', icon: '🧘', gameId: 'mind-reset', minStars: 9 },
    { id: 'grand_master', icon: '👑', minTotalStars: 40 }
  ]
};
