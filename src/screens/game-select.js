/**
 * MINDVERSE Main Game Selection Arena Screen
 */

import { i18n } from '../i18n/index.js';
import { CONFIG } from '../config.js';
import { db } from '../services/db.js';
import { sound } from '../services/audio.js';

export async function renderGameSelect(navigate) {
  const container = document.createElement('div');
  container.className = 'screen game-select-screen';

  // Fetch progress for all 5 games
  const progressList = await db.getAllProgress();
  const progMap = {};
  progressList.forEach(p => {
    progMap[p.gameId] = p;
  });

  const gamesData = [
    {
      id: 'observation-master',
      title: i18n.t('games.observation.title'),
      desc: i18n.t('games.observation.shortDesc'),
      icon: '👁️',
      glow: 'rgba(56, 189, 248, 0.3)',
      accentColor: '#38bdf8'
    },
    {
      id: 'memory-match',
      title: i18n.t('games.memory.title'),
      desc: i18n.t('games.memory.shortDesc'),
      icon: '🧠',
      glow: 'rgba(168, 85, 247, 0.3)',
      accentColor: '#c084fc'
    },
    {
      id: 'logic-detective',
      title: i18n.t('games.logic.title'),
      desc: i18n.t('games.logic.shortDesc'),
      icon: '🔍',
      glow: 'rgba(16, 185, 129, 0.3)',
      accentColor: '#34d399'
    },
    {
      id: 'knowledge-quest',
      title: i18n.t('games.knowledge.title'),
      desc: i18n.t('games.knowledge.shortDesc'),
      icon: '⚡',
      glow: 'rgba(245, 158, 11, 0.3)',
      accentColor: '#fbbf24'
    },
    {
      id: 'mind-reset',
      title: i18n.t('games.reset.title'),
      desc: i18n.t('games.reset.shortDesc'),
      icon: '🌌',
      glow: 'rgba(236, 72, 153, 0.3)',
      accentColor: '#f472b6'
    }
  ];

  container.innerHTML = `
    <div style="margin-bottom: 20px;">
      <h2 class="text-gradient-cyan" style="font-size: 1.85rem; font-weight: 800; margin-bottom: 4px;">
        ${i18n.t('games.title')}
      </h2>
      <p style="font-size: 0.88rem; color: var(--text-dim);">
        ${i18n.t('games.subtitle')}
      </p>
    </div>

    <div style="display: flex; flex-direction: column; gap: 14px; width: 100%; margin-bottom: 30px;">
      ${gamesData.map((g, idx) => {
        const prog = progMap[g.id] || { unlockedLevel: 1, highestScore: 0, starsTotal: 0 };
        return `
          <div class="glass-card game-card" data-game-id="${g.id}" style="padding: 18px 20px; cursor: pointer; border-left: 4px solid ${g.accentColor}; position: relative; overflow: hidden;">
            <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 8px;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 2.2rem; filter: drop-shadow(0 0 10px ${g.glow});">${g.icon}</span>
                <div>
                  <h3 style="font-size: 1.18rem; font-weight: 700; color: #ffffff; margin-bottom: 2px;">${g.title}</h3>
                  <div style="font-size: 0.75rem; color: var(--accent-cyan); font-weight: 600;">
                    ${i18n.t('games.level')} ${prog.unlockedLevel} / 5 ${prog.unlockedLevel > 1 ? '• ' + i18n.t('games.unlocked') : ''}
                  </div>
                </div>
              </div>

              <!-- Stars Counter -->
              <div style="display: flex; align-items: center; gap: 4px; background: rgba(0,0,0,0.3); padding: 4px 10px; border-radius: 9999px; border: 1px solid var(--border-subtle);">
                <span style="color: var(--accent-gold); font-size: 0.85rem;">⭐</span>
                <span style="font-size: 0.85rem; font-weight: 700; color: #ffffff;">${prog.starsTotal}/15</span>
              </div>
            </div>

            <p style="font-size: 0.84rem; color: var(--text-dim); line-height: 1.45; margin-bottom: 12px;">
              ${g.desc}
            </p>

            <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 10px;">
              <span style="font-size: 0.75rem; color: var(--text-muted);">
                ${i18n.t('games.highScore')}: <strong style="color: var(--text-main); font-weight: 700;">${prog.highestScore}</strong>
              </span>

              <span style="display: inline-flex; align-items: center; gap: 4px; font-size: 0.82rem; font-weight: 600; color: ${g.accentColor};">
                ${i18n.t('games.playNow')} ➔
              </span>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  // Attach card click handlers
  container.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('click', () => {
      sound.playClick();
      const gameId = card.getAttribute('data-game-id');
      navigate('instructions', { gameId });
    });
  });

  return container;
}
