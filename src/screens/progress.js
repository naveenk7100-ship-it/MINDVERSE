/**
 * MINDVERSE Personal Progress & Achievements Screen
 */

import { i18n } from '../i18n/index.js';
import { db } from '../services/db.js';
import { CONFIG } from '../config.js';
import { sound } from '../services/audio.js';

export async function renderProgress(navigate) {
  const container = document.createElement('div');
  container.className = 'screen progress-screen';

  const allProgress = await db.getAllProgress();
  const unlockedBadges = await db.getAchievements();
  const badgeMap = {};
  unlockedBadges.forEach(b => {
    badgeMap[b.id] = b;
  });

  // Calculate totals
  let totalStars = 0;
  let totalScore = 0;
  let totalPlays = 0;

  const progMap = {};
  allProgress.forEach(p => {
    progMap[p.gameId] = p;
    totalStars += (p.starsTotal || 0);
    totalScore += (p.highestScore || 0);
    totalPlays += (p.playsCount || 0);
  });

  const gamesMeta = [
    { id: 'observation-master', title: i18n.t('games.observation.title'), icon: '👁️', color: '#38bdf8' },
    { id: 'memory-match', title: i18n.t('games.memory.title'), icon: '🧠', color: '#c084fc' },
    { id: 'logic-detective', title: i18n.t('games.logic.title'), icon: '🔍', color: '#34d399' },
    { id: 'knowledge-quest', title: i18n.t('games.knowledge.title'), icon: '⚡', color: '#fbbf24' },
    { id: 'mind-reset', title: i18n.t('games.reset.title'), icon: '🌌', color: '#f472b6' }
  ];

  container.innerHTML = `
    <div style="margin-bottom: 20px;">
      <h2 class="text-gradient-cyan" style="font-size: 1.85rem; font-weight: 800; margin-bottom: 4px;">
        ${i18n.t('progress.title')}
      </h2>
      <p style="font-size: 0.88rem; color: var(--text-dim);">
        ${i18n.t('progress.subtitle')}
      </p>
    </div>

    <!-- Aggregate Stats Header Card -->
    <div class="glass-panel" style="padding: 20px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; text-align: center; margin-bottom: 24px;">
      <div>
        <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">
          ${i18n.t('progress.totalStars')}
        </div>
        <div style="font-size: 1.6rem; font-weight: 800; color: var(--accent-gold); margin-top: 4px;">
          ⭐ ${totalStars}/75
        </div>
      </div>

      <div>
        <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">
          ${i18n.t('progress.totalScore')}
        </div>
        <div style="font-size: 1.6rem; font-weight: 800; color: var(--accent-cyan); margin-top: 4px;">
          ${totalScore}
        </div>
      </div>

      <div>
        <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">
          ${i18n.t('progress.gamesPlayed')}
        </div>
        <div style="font-size: 1.6rem; font-weight: 800; color: var(--text-main); margin-top: 4px;">
          ${totalPlays}
        </div>
      </div>
    </div>

    <!-- Achievements Badges Showcase -->
    <div style="margin-bottom: 28px;">
      <h3 style="font-size: 1.15rem; font-weight: 700; color: #ffffff; margin-bottom: 12px;">
        ${i18n.t('progress.unlockedBadges')} (${unlockedBadges.length} / ${CONFIG.ACHIEVEMENTS.length})
      </h3>

      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
        ${CONFIG.ACHIEVEMENTS.map(ach => {
          const isUnlocked = !!badgeMap[ach.id];
          const badgeTitle = i18n.t(`progress.badges.${ach.id}`);

          return `
            <div class="glass-card" style="padding: 12px 14px; display: flex; align-items: center; gap: 12px; opacity: ${isUnlocked ? 1 : 0.45}; border-color: ${isUnlocked ? 'var(--accent-cyan)' : 'var(--border-subtle)'};">
              <span style="font-size: 1.8rem; filter: ${isUnlocked ? 'drop-shadow(0 0 8px rgba(56,189,248,0.5))' : 'grayscale(100%)'};">
                ${ach.icon}
              </span>
              <div style="flex: 1;">
                <div style="font-size: 0.78rem; font-weight: 700; color: ${isUnlocked ? '#ffffff' : 'var(--text-muted)'}; line-height: 1.25;">
                  ${badgeTitle}
                </div>
                <div style="font-size: 0.68rem; color: ${isUnlocked ? 'var(--accent-emerald)' : 'var(--text-muted)'}; margin-top: 2px;">
                  ${isUnlocked ? '✓ Unlocked' : '🔒 Locked'}
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- Per-Game Detailed Progress -->
    <div>
      <h3 style="font-size: 1.15rem; font-weight: 700; color: #ffffff; margin-bottom: 12px;">
        Arena Standings
      </h3>

      <div style="display: flex; flex-direction: column; gap: 10px;">
        ${gamesMeta.map(gm => {
          const prog = progMap[gm.id] || { unlockedLevel: 1, highestScore: 0, starsTotal: 0, playsCount: 0 };
          const pct = Math.round((prog.starsTotal / 15) * 100);

          return `
            <div class="glass-card" style="padding: 14px 16px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="font-size: 1.5rem;">${gm.icon}</span>
                  <div>
                    <h4 style="font-size: 0.95rem; font-weight: 700; color: #ffffff;">${gm.title}</h4>
                    <span style="font-size: 0.72rem; color: var(--text-muted);">
                      Level ${prog.unlockedLevel}/5 • Best: ${prog.highestScore}
                    </span>
                  </div>
                </div>

                <div style="text-align: right;">
                  <span style="font-size: 0.9rem; font-weight: 700; color: var(--accent-gold);">
                    ⭐ ${prog.starsTotal}/15
                  </span>
                </div>
              </div>

              <!-- Mini Progress bar -->
              <div style="width: 100%; height: 5px; border-radius: 9999px; background: rgba(255,255,255,0.08); overflow: hidden;">
                <div style="width: ${pct}%; height: 100%; background: ${gm.color}; border-radius: 9999px;"></div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  return container;
}
