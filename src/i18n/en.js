/**
 * MINDVERSE English Locale
 */
export default {
  app: {
    title: 'MINDVERSE',
    tagline: 'Enter. Observe. Think. Play.',
    subtitle: 'Brain & Knowledge Arcade',
    pwaInstall: 'Install App',
    online: 'Online',
    offline: 'Offline Mode',
    offlineNotice: 'Playing in offline mode. Your scores & progress are safely saved on this device.'
  },
  nav: {
    home: 'Home',
    games: 'Games',
    progress: 'Progress',
    owner: 'Owner',
    back: 'Back',
    close: 'Close',
    settings: 'Settings'
  },
  welcome: {
    heroTitle: 'Test Your Mind In Five Arenas',
    heroSubtitle: 'No registration. No personal data. Pure cognitive challenge directly in your browser.',
    enterBtn: 'Enter Arcade',
    selectLanguage: 'Choose Language',
    quickStart: 'Instant Play',
    offlineReadyBadge: '100% Offline Ready',
    instantQr: 'Instant QR',
    noLogin: 'No login required',
    zeroLatency: 'Zero latency',
    arenasCount: '5 Arenas',
    levelsCount: '25 Levels'
  },
  language: {
    title: 'Select Language',
    subtitle: 'You can change this anytime from settings',
    confirm: 'Continue'
  },
  games: {
    title: 'Choose Your Arena',
    subtitle: '5 specialized cognitive challenges',
    level: 'Level',
    locked: 'Locked',
    unlocked: 'Unlocked',
    highScore: 'Best Score',
    stars: 'Stars',
    playNow: 'Play Now',
    observation: {
      title: 'Observation Master',
      shortDesc: 'Visual attention, difference detection & hidden object hunting.',
      howToPlay: 'Carefully observe the scene. Detect subtle differences, odd elements or patterns before the timer expires. Speed and accuracy give bonus points.'
    },
    memory: {
      title: 'Memory Match',
      shortDesc: 'Card pairing, spatial recall & visual sequence challenges.',
      howToPlay: 'Cards will flip briefly. Remember their positions and match identical pairs. Consecutive matches create multiplier combos.'
    },
    logic: {
      title: 'Logic Detective',
      shortDesc: 'Pattern puzzles, sequence deductions & deductive reasoning.',
      howToPlay: 'Analyze the clues, number patterns and logical flows. Select the verified correct solution to solve the case.'
    },
    knowledge: {
      title: 'Knowledge Quest',
      shortDesc: 'Science, technology, world trivia & thought-provoking riddles.',
      howToPlay: 'Read the question carefully. Choose the correct answer from four options. Answer quickly to earn maximum points and stars.'
    },
    reset: {
      title: 'Mind Reset',
      shortDesc: 'Lightweight focus exercises, reaction time & soothing agility.',
      howToPlay: 'Relax your mind. Tap the pulsing nodes at peak resonance, test your reaction speed, and find your cognitive equilibrium.'
    }
  },
  instructions: {
    title: 'How to Play',
    objective: 'Objective',
    rules: 'Rules & Scoring',
    starCriteria: 'Star Criteria',
    star3: '3 Stars: 90%+ score with time bonus',
    star2: '2 Stars: 70%+ score',
    star1: '1 Star: 50%+ score (Pass & Unlock Next)',
    startBtn: 'Start Level',
    selectLevel: 'Select Level'
  },
  gameplay: {
    score: 'Score',
    time: 'Time',
    combo: 'Combo',
    pause: 'Pause',
    paused: 'Game Paused',
    resume: 'Resume',
    restart: 'Restart',
    exit: 'Exit',
    correct: 'Correct!',
    incorrect: 'Incorrect',
    tryAgain: 'Try Again',
    findDifferences: 'Differences remaining:',
    findItem: 'Find the target element',
    sequencePrompt: 'Watch the sequence carefully...',
    repeatPrompt: 'Your turn: repeat the sequence',
    identifyMissing: 'Identify The Missing Token',
    puzzleOf: 'Puzzle {current} of {total}',
    pulseInstruction: 'Tap the core orb at peak resonance when the ring aligns!',
    reactionInstructionGreen: 'Wait for the orb to turn GREEN, then tap as fast as you can!',
    reactionInstructionRed: 'Tap on GREEN or CYAN. DO NOT tap if it turns RED!',
    tooEarly: 'Too early! Wait for the signal.',
    ready: 'Ready...',
    inhibitionFailed: 'Inhibition failed: Do not tap on RED!',
    resonances: 'Harmonic Resonances:',
    roundOf: 'Round {current} of {total}',
    reactionTimeResult: 'Reaction: {ms}ms!'
  },
  results: {
    victory: 'Arena Cleared!',
    mastery: 'Perfection Achieved!',
    wellDone: 'Well Done!',
    tryAgain: 'Level Incomplete',
    finalScore: 'Final Score',
    bestScore: 'Personal Best',
    starsEarned: 'Stars Earned',
    timeTaken: 'Time Taken',
    accuracy: 'Accuracy',
    nextLevel: 'Next Level',
    retry: 'Play Again',
    backToGames: 'Game Menu'
  },
  progress: {
    title: 'Your Progress',
    subtitle: 'Stored privately on this device',
    totalStars: 'Total Stars',
    totalScore: 'Total Score',
    unlockedBadges: 'Achievements Unlocked',
    gamesPlayed: 'Sessions Played',
    badges: {
      first_play: 'First Step (First Game Played)',
      eagle_eye: 'Eagle Eye (Observation Master 9+ Stars)',
      memory_virtuoso: 'Memory Virtuoso (Memory Match 9+ Stars)',
      logic_sherlock: 'Logic Sherlock (Logic Detective 9+ Stars)',
      polymath: 'Polymath (Knowledge Quest 9+ Stars)',
      zen_master: 'Zen Master (Mind Reset 9+ Stars)',
      grand_master: 'Grand Master (40+ Stars Across All Games)'
    }
  },
  owner: {
    portalTitle: 'Owner Portal',
    portalSubtitle: 'Private arcade operations & anonymous usage analytics',
    pinLabel: 'Enter Owner PIN',
    pinPlaceholder: 'Enter 4-digit PIN (Default: 2026)',
    loginBtn: 'Access Dashboard',
    invalidPin: 'Incorrect PIN. Please try again.',
    changePinTitle: 'Change Owner PIN',
    savePin: 'Update PIN',
    pinUpdated: 'PIN updated successfully.',
    dashboard: 'Arcade Dashboard',
    metrics: {
      recordedVisits: 'Recorded Visits',
      recordedVisitsNote: 'Landing page visits recorded locally & queued',
      totalPlays: 'Total Recorded Plays',
      completionRate: 'Completion Rate',
      avgDuration: 'Avg Session Duration',
      popularGame: 'Most Popular Arena',
      unsyncedQueue: 'Queued Offline Events'
    },
    qrSection: {
      title: 'Permanent Destination & QR Codes',
      destUrlLabel: 'Current Destination URL',
      urlHint: 'Never points to localhost. Keep this stable so printed QR codes work permanently.',
      updateUrlBtn: 'Save New Destination URL',
      downloadPng: 'Download High-Res PNG (1200px)',
      downloadPdf: 'Download Print-Ready A4 Poster (PDF)',
      regenerate: 'Regenerate QR Assets',
      statusReady: 'QR Code verified & ready for printing'
    },
    gamesBreakdown: 'Game-Wise Performance',
    dailyTrends: 'Daily Activity Trends (Last 7 Days)',
    syncArchitecture: 'Sync Architecture (Offline-First)',
    syncNote: 'All events are stored locally in IndexedDB. When online synchronization is enabled, queued anonymous records sync to your designated endpoint without transmitting any personal data.',
    logout: 'Exit Portal'
  },
  settings: {
    title: 'Preferences',
    sfx: 'Sound Effects',
    music: 'Ambient Focus Tone',
    lang: 'Language',
    about: 'About MINDVERSE',
    aboutText: 'A ₹0 budget, 100% offline-ready mobile brain arcade built for visitors to enjoy instantaneously via QR scan.'
  }
};
