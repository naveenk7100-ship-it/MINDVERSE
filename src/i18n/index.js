/**
 * MINDVERSE i18n Translation Coordinator
 */

import en from './en.js';
import te from './te.js';
import hi from './hi.js';
import { CONFIG } from '../config.js';

const locales = { en, te, hi };

class I18nManager {
  constructor() {
    this.currentLang = CONFIG.DEFAULT_LANG;
    this.listeners = new Set();
  }

  init() {
    const saved = localStorage.getItem(CONFIG.STORAGE_KEYS.LANG);
    if (saved && locales[saved]) {
      this.currentLang = saved;
    } else {
      // Check browser language
      const navLang = (navigator.language || '').toLowerCase();
      if (navLang.startsWith('te')) this.currentLang = 'te';
      else if (navLang.startsWith('hi')) this.currentLang = 'hi';
      else this.currentLang = 'en';
    }
  }

  setLanguage(lang) {
    if (!locales[lang]) return;
    this.currentLang = lang;
    localStorage.setItem(CONFIG.STORAGE_KEYS.LANG, lang);
    document.documentElement.lang = lang;
    this.listeners.forEach(cb => cb(lang));
  }

  getLanguage() {
    return this.currentLang;
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  t(path, replacements = {}) {
    const parts = path.split('.');
    let cur = locales[this.currentLang];
    
    for (const p of parts) {
      if (cur && cur[p] !== undefined) {
        cur = cur[p];
      } else {
        // Fallback to English
        cur = null;
        break;
      }
    }

    if (cur === null) {
      let fallback = locales['en'];
      for (const p of parts) {
        if (fallback && fallback[p] !== undefined) {
          fallback = fallback[p];
        } else {
          return path; // Key not found
        }
      }
      cur = fallback;
    }

    if (typeof cur !== 'string') return cur;

    // Handle token replacements e.g. {name}
    let res = cur;
    for (const [k, v] of Object.entries(replacements)) {
      res = res.replace(new RegExp(`{${k}}`, 'g'), v);
    }
    return res;
  }
}

export const i18n = new I18nManager();
i18n.init();
