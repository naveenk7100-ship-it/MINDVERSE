/**
 * MINDVERSE Welcome / Landing Screen
 */

import { i18n } from '../i18n/index.js';
import { analytics } from '../services/analytics.js';
import { sound } from '../services/audio.js';

export function renderWelcome(navigate) {
  // Record anonymous landing visit
  analytics.recordVisit(i18n.getLanguage(), 'welcome');

  const container = document.createElement('div');
  container.className = 'screen welcome-screen';
  container.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; text-align: center; padding: 20px 0 10px;">
      <!-- Emblem Radiance -->
      <div style="position: relative; width: 110px; height: 110px; margin-bottom: 24px;">
        <div style="position: absolute; inset: -10px; background: radial-gradient(circle, rgba(56, 189, 248, 0.35) 0%, transparent 70%); border-radius: 50%; filter: blur(12px);"></div>
        <img src="./favicon.svg" alt="MINDVERSE" style="width: 100%; height: 100%; position: relative; z-index: 2; filter: drop-shadow(0 0 15px rgba(56,189,248,0.5));" />
      </div>

      <!-- Tagline & Badge -->
      <div style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.25); border-radius: 9999px; margin-bottom: 16px;">
        <span style="font-size: 0.8rem;">⚡</span>
        <span style="font-size: 0.75rem; font-weight: 700; color: var(--accent-cyan); text-transform: uppercase; letter-spacing: 0.08em;" data-i18n="welcome.offlineReadyBadge">
          ${i18n.t('welcome.offlineReadyBadge')}
        </span>
      </div>

      <h1 class="text-gradient-cyan" style="font-size: 2.2rem; font-weight: 900; line-height: 1.15; margin-bottom: 14px; letter-spacing: -0.02em;">
        ${i18n.t('welcome.heroTitle')}
      </h1>

      <p style="font-size: 0.95rem; color: var(--text-dim); max-width: 440px; line-height: 1.55; margin-bottom: 30px;">
        ${i18n.t('welcome.heroSubtitle')}
      </p>

      <!-- Action Buttons -->
      <div style="display: flex; flex-direction: column; gap: 12px; width: 100%; max-width: 340px; margin-bottom: 36px;">
        <button id="welcome-enter-btn" class="btn-primary" style="font-size: 1.05rem; padding: 16px 24px;">
          <span>🎮</span>
          <span>${i18n.t('welcome.enterBtn')}</span>
        </button>

        <button id="welcome-lang-btn" class="btn-secondary" style="font-size: 0.92rem;">
          <span>🌐</span>
          <span>${i18n.t('welcome.selectLanguage')}</span>
        </button>
      </div>

      <!-- Mini Feature Highlights -->
      <div class="glass-panel" style="width: 100%; max-width: 460px; padding: 18px 16px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; text-align: center;">
        <div>
          <div style="font-size: 1.4rem; margin-bottom: 4px;">⚡</div>
          <div style="font-size: 0.72rem; font-weight: 700; color: var(--text-main);">${i18n.t('welcome.instantQr')}</div>
          <div style="font-size: 0.65rem; color: var(--text-muted);">${i18n.t('welcome.noLogin')}</div>
        </div>
        <div>
          <div style="font-size: 1.4rem; margin-bottom: 4px;">📦</div>
          <div style="font-size: 0.72rem; font-weight: 700; color: var(--text-main);">${i18n.t('welcome.offlineReadyBadge')}</div>
          <div style="font-size: 0.65rem; color: var(--text-muted);">${i18n.t('welcome.zeroLatency')}</div>
        </div>
        <div>
          <div style="font-size: 1.4rem; margin-bottom: 4px;">🧠</div>
          <div style="font-size: 0.72rem; font-weight: 700; color: var(--text-main);">${i18n.t('welcome.arenasCount')}</div>
          <div style="font-size: 0.65rem; color: var(--text-muted);">${i18n.t('welcome.levelsCount')}</div>
        </div>
      </div>
    </div>
  `;

  // Attach button events
  const enterBtn = container.querySelector('#welcome-enter-btn');
  enterBtn.addEventListener('click', () => {
    sound.playClick();
    navigate('game-select');
  });

  const langBtn = container.querySelector('#welcome-lang-btn');
  langBtn.addEventListener('click', () => {
    sound.playClick();
    navigate('language-select');
  });

  return container;
}
