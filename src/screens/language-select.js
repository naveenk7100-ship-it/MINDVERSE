/**
 * MINDVERSE Language Selection Screen
 */

import { i18n } from '../i18n/index.js';
import { sound } from '../services/audio.js';

export function renderLanguageSelect(navigate, onLangChange) {
  const container = document.createElement('div');
  container.className = 'screen language-screen';

  const currentLang = i18n.getLanguage();

  const languages = [
    { code: 'en', label: 'English', native: 'English', flag: '🇬🇧' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' }
  ];

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; width: 100%; max-width: 440px; margin: 20px auto;">
      <div style="font-size: 2.8rem; margin-bottom: 12px;">🌐</div>
      <h2 class="text-gradient-cyan" style="font-size: 1.8rem; font-weight: 800; margin-bottom: 6px; text-align: center;">
        ${i18n.t('language.title')}
      </h2>
      <p style="font-size: 0.88rem; color: var(--text-dim); margin-bottom: 24px; text-align: center;">
        ${i18n.t('language.subtitle')}
      </p>

      <div style="display: flex; flex-direction: column; gap: 14px; width: 100%; margin-bottom: 28px;">
        ${languages.map(lang => `
          <button class="glass-card lang-card-btn" data-lang="${lang.code}" style="display: flex; align-items: center; justify-content: space-between; padding: 18px 20px; cursor: pointer; text-align: left; width: 100%; border-color: ${currentLang === lang.code ? 'var(--accent-cyan)' : 'var(--border-subtle)'}; background: ${currentLang === lang.code ? 'rgba(56, 189, 248, 0.12)' : 'var(--bg-glass-card)'};">
            <div style="display: flex; align-items: center; gap: 14px;">
              <span style="font-size: 1.6rem;">${lang.flag}</span>
              <div>
                <div style="font-size: 1.15rem; font-weight: 700; color: #ffffff;">${lang.native}</div>
                <div style="font-size: 0.8rem; color: var(--text-muted);">${lang.label}</div>
              </div>
            </div>
            ${currentLang === lang.code ? `<span style="color: var(--accent-cyan); font-size: 1.4rem;">✓</span>` : ''}
          </button>
        `).join('')}
      </div>

      <button id="lang-confirm-btn" class="btn-primary" style="width: 100%; padding: 16px;">
        ${i18n.t('language.confirm')}
      </button>
    </div>
  `;

  // Attach selection handlers
  container.querySelectorAll('.lang-card-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sound.playClick();
      const code = btn.getAttribute('data-lang');
      i18n.setLanguage(code);
      if (onLangChange) onLangChange(code);
      navigate('game-select');
    });
  });

  const confirmBtn = container.querySelector('#lang-confirm-btn');
  confirmBtn.addEventListener('click', () => {
    sound.playClick();
    navigate('game-select');
  });

  return container;
}
