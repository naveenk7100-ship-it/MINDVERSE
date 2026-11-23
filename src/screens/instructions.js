/**
 * MINDVERSE Game Instructions & Level Select Screen
 */

import { i18n } from '../i18n/index.js';
import { db } from '../services/db.js';
import { sound } from '../services/audio.js';

export async function renderInstructions(navigate, params = {}) {
  const gameId = params.gameId || 'observation-master';
  const container = document.createElement('div');
  container.className = 'screen instructions-screen';

  const progress = await db.getGameProgress(gameId);
  const levelScores = await db.getGameLevelScores(gameId);
  const scoreMap = {};
  levelScores.forEach(ls => {
    scoreMap[ls.level] = ls;
  });

  const gameMeta = {
    'observation-master': {
      title: i18n.t('games.observation.title'),
      desc: i18n.t('games.observation.howToPlay'),
      icon: '👁️',
      color: '#38bdf8'
    },
    'memory-match': {
      title: i18n.t('games.memory.title'),
      desc: i18n.t('games.memory.howToPlay'),
      icon: '🧠',
      color: '#c084fc'
    },
    'logic-detective': {
      title: i18n.t('games.logic.title'),
      desc: i18n.t('games.logic.howToPlay'),
      icon: '🔍',
      color: '#34d399'
    },
    'knowledge-quest': {
      title: i18n.t('games.knowledge.title'),
      desc: i18n.t('games.knowledge.howToPlay'),
      icon: '⚡',
      color: '#fbbf24'
    },
    'mind-reset': {
      title: i18n.t('games.reset.title'),
      desc: i18n.t('games.reset.howToPlay'),
      icon: '🌌',
      color: '#f472b6'
    }
  }[gameId] || { title: gameId, desc: '', icon: '🎮', color: '#38bdf8' };

  let selectedLevel = Math.min(progress.unlockedLevel || 1, 5);

  container.innerHTML = `
    <!-- Top Back Row -->
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
      <button id="instr-back-btn" class="icon-btn" title="Back">
        ←
      </button>
      <span style="font-size: 0.82rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em;">
        ${i18n.t('instructions.title')}
      </span>
      <div style="width: 38px;"></div>
    </div>

    <!-- Hero Card -->
    <div class="glass-panel" style="padding: 24px; text-align: center; margin-bottom: 20px;">
      <div style="font-size: 3.2rem; margin-bottom: 10px;">${gameMeta.icon}</div>
      <h2 style="font-size: 1.6rem; font-weight: 800; color: #ffffff; margin-bottom: 8px;">${gameMeta.title}</h2>
      <p style="font-size: 0.88rem; color: var(--text-dim); line-height: 1.55; max-width: 440px; margin: 0 auto;">
        ${gameMeta.desc}
      </p>
    </div>

    <!-- Star Criteria Card -->
    <div class="glass-card" style="padding: 16px 20px; margin-bottom: 20px;">
      <h4 style="font-size: 0.85rem; font-weight: 700; color: var(--accent-cyan); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 10px;">
        ${i18n.t('instructions.starCriteria')}
      </h4>
      <div style="display: flex; flex-direction: column; gap: 6px; font-size: 0.82rem; color: var(--text-dim);">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="color: var(--accent-gold);">⭐⭐⭐</span>
          <span>${i18n.t('instructions.star3')}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="color: var(--accent-gold);">⭐⭐</span>
          <span>${i18n.t('instructions.star2')}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="color: var(--accent-gold);">⭐</span>
          <span>${i18n.t('instructions.star1')}</span>
        </div>
      </div>
    </div>

    <!-- Level Selector -->
    <div style="margin-bottom: 24px;">
      <h4 style="font-size: 0.85rem; font-weight: 700; color: var(--text-main); margin-bottom: 12px;">
        ${i18n.t('instructions.selectLevel')}
      </h4>
      <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px;">
        ${[1, 2, 3, 4, 5].map(lvl => {
          const isUnlocked = lvl <= progress.unlockedLevel;
          const isSelected = lvl === selectedLevel;
          const scoreData = scoreMap[lvl];
          const starCount = scoreData ? scoreData.stars : 0;

          return `
            <button class="level-select-btn glass-card" data-level="${lvl}" ${!isUnlocked ? 'disabled' : ''} style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 12px 6px; min-height: 70px; cursor: ${isUnlocked ? 'pointer' : 'not-allowed'}; opacity: ${isUnlocked ? 1 : 0.4}; border-color: ${isSelected ? 'var(--accent-cyan)' : 'var(--border-subtle)'}; background: ${isSelected ? 'rgba(56, 189, 248, 0.16)' : 'var(--bg-glass-card)'};">
              <span style="font-size: 1.15rem; font-weight: 800; color: ${isSelected ? 'var(--accent-cyan)' : '#ffffff'};">
                ${lvl}
              </span>
              <div style="display: flex; gap: 1px; font-size: 0.65rem; margin-top: 4px;">
                ${isUnlocked ? (
                  starCount > 0
                    ? `<span style="color: var(--accent-gold);">${'⭐'.repeat(starCount)}</span>`
                    : `<span style="color: var(--text-muted);">---</span>`
                ) : '🔒'}
              </div>
            </button>
          `;
        }).join('')}
      </div>
    </div>

    <!-- Action Button -->
    <button id="start-game-btn" class="btn-primary" style="width: 100%; padding: 16px; font-size: 1.05rem;">
      <span>▶</span>
      <span>${i18n.t('instructions.startBtn')} (${i18n.t('games.level')} ${selectedLevel})</span>
    </button>
  `;

  // Attach handlers
  const backBtn = container.querySelector('#instr-back-btn');
  backBtn.addEventListener('click', () => {
    sound.playClick();
    navigate('game-select');
  });

  const startBtn = container.querySelector('#start-game-btn');
  startBtn.addEventListener('click', () => {
    sound.playClick();
    navigate('gameplay', { gameId, level: selectedLevel });
  });

  container.querySelectorAll('.level-select-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.disabled) return;
      sound.playClick();
      selectedLevel = parseInt(btn.getAttribute('data-level'), 10);
      container.querySelectorAll('.level-select-btn').forEach(b => {
        b.style.borderColor = 'var(--border-subtle)';
        b.style.background = 'var(--bg-glass-card)';
      });
      btn.style.borderColor = 'var(--accent-cyan)';
      btn.style.background = 'rgba(56, 189, 248, 0.16)';
      startBtn.innerHTML = `<span>▶</span><span>${i18n.t('instructions.startBtn')} (${i18n.t('games.level')} ${selectedLevel})</span>`;
    });
  });

  return container;
}
