/**
 * MINDVERSE Main Application Entrypoint
 * Offline-first, Mobile-first Arcade
 */

import { i18n } from './i18n/index.js';
import { pwa } from './services/pwa.js';
import { sound } from './services/audio.js';
import { db } from './services/db.js';
import { CONFIG } from './config.js';

// Screens
import { renderWelcome } from './screens/welcome.js';
import { renderLanguageSelect } from './screens/language-select.js';
import { renderGameSelect } from './screens/game-select.js';
import { renderInstructions } from './screens/instructions.js';
import { renderGamePlay } from './screens/game-play.js';
import { renderResults } from './screens/results.js';
import { renderProgress } from './screens/progress.js';
import { renderOwnerLogin } from './screens/owner-login.js';
import { renderOwnerDashboard } from './screens/owner-dashboard.js';

class MindverseApp {
  constructor() {
    this.currentScreen = 'welcome';
    this.screenParams = {};
    this.mainContainer = document.getElementById('main-container');
    this.init();
  }

  async init() {
    // 1. Initialize DB & Audio Settings
    const sfxSaved = await db.getSetting(CONFIG.STORAGE_KEYS.AUDIO_SFX, true);
    sound.setSfxEnabled(sfxSaved);
    this.updateSoundButtonUI(sfxSaved);

    // 2. Connectivity Listeners
    pwa.subscribe((status) => {
      this.updateConnectivityUI(status.isOnline);
    });

    // 3. Header Controls
    this.setupHeaderControls();

    // 4. Bottom Navigation Controls
    this.setupBottomNav();

    // 5. First visit check
    const hasVisited = localStorage.getItem(CONFIG.STORAGE_KEYS.FIRST_VISIT);
    if (!hasVisited) {
      localStorage.setItem(CONFIG.STORAGE_KEYS.FIRST_VISIT, 'true');
      this.navigate('welcome');
    } else {
      this.navigate('game-select');
    }
  }

  navigate(screenName, params = {}) {
    this.currentScreen = screenName;
    this.screenParams = params;
    this.render();
    this.updateBottomNavUI();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  async render() {
    this.mainContainer.innerHTML = '';
    let screenEl = null;

    const nav = (name, p) => this.navigate(name, p);

    switch (this.currentScreen) {
      case 'welcome':
        screenEl = renderWelcome(nav);
        break;
      case 'language-select':
        screenEl = renderLanguageSelect(nav, () => {
          this.updateTexts();
          this.render();
        });
        break;
      case 'game-select':
        screenEl = await renderGameSelect(nav);
        break;
      case 'instructions':
        screenEl = await renderInstructions(nav, this.screenParams);
        break;
      case 'gameplay':
        screenEl = renderGamePlay(nav, this.screenParams);
        break;
      case 'results':
        screenEl = await renderResults(nav, this.screenParams);
        break;
      case 'progress':
        screenEl = await renderProgress(nav);
        break;
      case 'owner':
      case 'owner-login':
      case 'owner-dashboard':
        // Disabled in public static build for security; requires server-side authentication
        this.navigate('game-select');
        break;
      default:
        screenEl = renderWelcome(nav);
    }

    if (screenEl) {
      this.mainContainer.appendChild(screenEl);
    }
  }

  setupHeaderControls() {
    // Brand home click
    const brandBtn = document.getElementById('brand-home-btn');
    if (brandBtn) {
      brandBtn.addEventListener('click', () => {
        sound.playClick();
        this.navigate('welcome');
      });
    }

    // Language switcher button
    const langBtn = document.getElementById('lang-btn');
    if (langBtn) {
      langBtn.addEventListener('click', () => {
        sound.playClick();
        this.navigate('language-select');
      });
    }

    // Sound toggle button
    const soundBtn = document.getElementById('sound-toggle-btn');
    if (soundBtn) {
      soundBtn.addEventListener('click', async () => {
        sound.playClick();
        const nextState = !sound.sfxEnabled;
        sound.setSfxEnabled(nextState);
        await db.setSetting(CONFIG.STORAGE_KEYS.AUDIO_SFX, nextState);
        this.updateSoundButtonUI(nextState);
      });
    }
  }

  setupBottomNav() {
    document.querySelectorAll('.bottom-nav .nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        sound.playClick();
        const screen = btn.getAttribute('data-screen');
        this.navigate(screen);
      });
    });
  }

  updateBottomNavUI() {
    document.querySelectorAll('.bottom-nav .nav-item').forEach(btn => {
      const screen = btn.getAttribute('data-screen');
      if (screen === this.currentScreen) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  updateSoundButtonUI(enabled) {
    const icon = document.getElementById('sound-icon');
    if (icon) {
      icon.textContent = enabled ? '🔊' : '🔇';
    }
  }

  updateConnectivityUI(isOnline) {
    const dot = document.getElementById('status-dot');
    const text = document.getElementById('status-text');
    const banner = document.getElementById('offline-banner');
    const bannerText = document.getElementById('offline-banner-text');

    if (dot && text) {
      if (isOnline) {
        dot.className = 'status-dot online';
        text.textContent = i18n.t('app.online');
        if (banner) banner.style.display = 'none';
      } else {
        dot.className = 'status-dot offline';
        text.textContent = i18n.t('app.offline');
        if (banner) {
          banner.style.display = 'flex';
          if (bannerText) bannerText.textContent = i18n.t('app.offlineNotice');
        }
      }
    }
  }

  updateTexts() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key) el.textContent = i18n.t(key);
    });
  }
}

// Bootstrap on DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
  window.mindverseApp = new MindverseApp();
});
