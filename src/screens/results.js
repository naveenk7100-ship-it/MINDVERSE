/**
 * MINDVERSE Level Results & Celebration Screen
 */

import { i18n } from '../i18n/index.js';
import { db } from '../services/db.js';
import { sound } from '../services/audio.js';

export async function renderResults(navigate, params = {}) {
  const {
    gameId = 'observation-master',
    level = 1,
    score = 0,
    maxScore = 1000,
    stars = 0,
    timeSeconds = 0,
    accuracy = 100,
    passed = false,
    unlockedLevel = 1
  } = params;

  const container = document.createElement('div');
  container.className = 'screen results-screen';

  const progress = await db.getGameProgress(gameId);

  const isMastery = stars === 3;
  let resultHeadline = i18n.t('results.victory');
  if (isMastery) resultHeadline = i18n.t('results.mastery');
  else if (!passed) resultHeadline = i18n.t('results.tryAgain');

  container.innerHTML = `
    <div style="width: 100%; max-width: 440px; margin: 10px auto;">
      <div class="glass-panel results-card">
        <div class="results-badge-icon">
          ${passed ? (isMastery ? '👑' : '🏆') : '💫'}
        </div>

        <h2 style="font-size: 1.7rem; font-weight: 800; color: #ffffff; margin-bottom: 6px;">
          ${resultHeadline}
        </h2>
        <div style="font-size: 0.85rem; color: var(--accent-cyan); font-weight: 600; margin-bottom: 18px;">
          ${i18n.t('games.level')} ${level}
        </div>

        <!-- Star Rating Showcase -->
        <div style="display: flex; justify-content: center; gap: 10px; margin-bottom: 24px;">
          ${[1, 2, 3].map(s => `
            <span style="font-size: 2.4rem; color: ${s <= stars ? 'var(--accent-gold)' : 'rgba(255,255,255,0.15)'}; filter: ${s <= stars ? 'drop-shadow(0 0 12px rgba(251, 191, 36, 0.75))' : 'none'};">
              ★
            </span>
          `).join('')}
        </div>

        <!-- Stats Grid -->
        <div class="results-stats-grid">
          <div class="results-stat-box">
            <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">
              ${i18n.t('results.finalScore')}
            </div>
            <div style="font-size: 1.4rem; font-weight: 800; color: var(--text-main); margin-top: 2px;">
              ${score}
            </div>
          </div>

          <div class="results-stat-box">
            <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">
              ${i18n.t('results.bestScore')}
            </div>
            <div style="font-size: 1.4rem; font-weight: 800; color: var(--accent-gold); margin-top: 2px;">
              ${progress.highestScore || score}
            </div>
          </div>

          <div class="results-stat-box">
            <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">
              ${i18n.t('results.timeTaken')}
            </div>
            <div style="font-size: 1.25rem; font-weight: 700; color: var(--text-main); margin-top: 2px;">
              ${timeSeconds}s
            </div>
          </div>

          <div class="results-stat-box">
            <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">
              ${i18n.t('results.accuracy')}
            </div>
            <div style="font-size: 1.25rem; font-weight: 700; color: var(--accent-emerald); margin-top: 2px;">
              ${accuracy}%
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 20px;">
          ${passed && level < 5 ? `
            <button id="res-next-btn" class="btn-primary" style="padding: 16px; font-size: 1rem;">
              <span>▶</span>
              <span>${i18n.t('results.nextLevel')} (${level + 1})</span>
            </button>
          ` : ''}

          <button id="res-retry-btn" class="btn-secondary" style="padding: 14px;">
            <span>🔄</span>
            <span>${i18n.t('results.retry')}</span>
          </button>

          <button id="res-menu-btn" class="btn-secondary" style="padding: 14px; border-color: transparent;">
            <span>🎮</span>
            <span>${i18n.t('results.backToGames')}</span>
          </button>
        </div>
      </div>
    </div>
  `;

  // Attach button events
  const nextBtn = container.querySelector('#res-next-btn');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      sound.playClick();
      navigate('gameplay', { gameId, level: level + 1 });
    });
  }

  const retryBtn = container.querySelector('#res-retry-btn');
  retryBtn.addEventListener('click', () => {
    sound.playClick();
    navigate('gameplay', { gameId, level });
  });

  const menuBtn = container.querySelector('#res-menu-btn');
  menuBtn.addEventListener('click', () => {
    sound.playClick();
    navigate('game-select');
  });

  return container;
}
