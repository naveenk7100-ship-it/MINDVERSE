/**
 * MINDVERSE Persistent Storage Engine
 * Offline-first IndexedDB wrapper with transparent fallback.
 */

const DB_NAME = 'MINDVERSE_DB';
const DB_VERSION = 1;

class MindverseDB {
  constructor() {
    this.db = null;
    this.readyPromise = this.init();
  }

  async init() {
    if (typeof window === 'undefined' || !window.indexedDB) {
      console.warn('[DB] IndexedDB not supported; using localStorage fallback.');
      return null;
    }

    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Progress store: per-game overall progress
        if (!db.objectStoreNames.contains('progress')) {
          db.createObjectStore('progress', { keyPath: 'gameId' });
        }

        // Level-specific score and stars store
        if (!db.objectStoreNames.contains('levelScores')) {
          db.createObjectStore('levelScores', { keyPath: 'id' });
        }

        // Unlocked achievements
        if (!db.objectStoreNames.contains('achievements')) {
          db.createObjectStore('achievements', { keyPath: 'id' });
        }

        // Anonymous analytics events queue
        if (!db.objectStoreNames.contains('analyticsQueue')) {
          const queueStore = db.createObjectStore('analyticsQueue', { keyPath: 'id', autoIncrement: true });
          queueStore.createIndex('synced', 'synced', { unique: false });
          queueStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Key-value settings store
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }

        // Recorded visits store
        if (!db.objectStoreNames.contains('visits')) {
          const visitStore = db.createObjectStore('visits', { keyPath: 'id', autoIncrement: true });
          visitStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onerror = (event) => {
        console.error('[DB] Open error:', event.target.error);
        resolve(null);
      };
    });
  }

  async getStore(storeName, mode = 'readonly') {
    await this.readyPromise;
    if (!this.db) return null;
    const tx = this.db.transaction(storeName, mode);
    return tx.objectStore(storeName);
  }

  // --- Game Progress Methods ---

  async getGameProgress(gameId) {
    const defaultProgress = {
      gameId,
      unlockedLevel: 1,
      highestScore: 0,
      starsTotal: 0,
      playsCount: 0,
      lastPlayed: null
    };

    try {
      const store = await this.getStore('progress', 'readonly');
      if (!store) {
        const local = localStorage.getItem(`mv_prog_${gameId}`);
        return local ? JSON.parse(local) : defaultProgress;
      }
      return new Promise((resolve) => {
        const req = store.get(gameId);
        req.onsuccess = () => resolve(req.result || defaultProgress);
        req.onerror = () => resolve(defaultProgress);
      });
    } catch (e) {
      return defaultProgress;
    }
  }

  async saveGameProgress(progressData) {
    try {
      const store = await this.getStore('progress', 'readwrite');
      if (!store) {
        localStorage.setItem(`mv_prog_${progressData.gameId}`, JSON.stringify(progressData));
        return true;
      }
      return new Promise((resolve) => {
        const req = store.put(progressData);
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      });
    } catch (e) {
      localStorage.setItem(`mv_prog_${progressData.gameId}`, JSON.stringify(progressData));
      return true;
    }
  }

  async getAllProgress() {
    try {
      const store = await this.getStore('progress', 'readonly');
      if (!store) return [];
      return new Promise((resolve) => {
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      });
    } catch (e) {
      return [];
    }
  }

  // --- Level Scores ---

  async saveLevelResult(gameId, level, stars, score, maxScore, timeSeconds) {
    const id = `${gameId}_lvl_${level}`;
    const record = {
      id,
      gameId,
      level,
      stars: Math.max(0, Math.min(3, stars)),
      score,
      maxScore,
      timeSeconds,
      timestamp: Date.now()
    };

    try {
      const store = await this.getStore('levelScores', 'readwrite');
      if (store) {
        store.put(record);
      } else {
        localStorage.setItem(`mv_lvl_${id}`, JSON.stringify(record));
      }
    } catch (e) {
      localStorage.setItem(`mv_lvl_${id}`, JSON.stringify(record));
    }

    // Update aggregate game progress
    const curProg = await this.getGameProgress(gameId);
    curProg.playsCount = (curProg.playsCount || 0) + 1;
    curProg.highestScore = Math.max(curProg.highestScore || 0, score);
    curProg.lastPlayed = Date.now();
    
    // Unlock next level if passed with at least 1 star
    if (stars > 0 && curProg.unlockedLevel <= level && level < 5) {
      curProg.unlockedLevel = level + 1;
    }

    // Recompute total stars for this game
    const allGameLevelScores = await this.getGameLevelScores(gameId);
    let totalStars = 0;
    const starMap = {};
    allGameLevelScores.forEach(item => {
      starMap[item.level] = Math.max(starMap[item.level] || 0, item.stars);
    });
    // Ensure current level's stars are included
    starMap[level] = Math.max(starMap[level] || 0, record.stars);
    for (const lvl in starMap) {
      totalStars += starMap[lvl];
    }
    curProg.starsTotal = totalStars;

    await this.saveGameProgress(curProg);
    return { record, progress: curProg };
  }

  async getGameLevelScores(gameId) {
    try {
      const store = await this.getStore('levelScores', 'readonly');
      if (!store) return [];
      return new Promise((resolve) => {
        const req = store.getAll();
        req.onsuccess = () => {
          const list = (req.result || []).filter(item => item.gameId === gameId);
          resolve(list);
        };
        req.onerror = () => resolve([]);
      });
    } catch (e) {
      return [];
    }
  }

  // --- Achievements ---

  async getAchievements() {
    try {
      const store = await this.getStore('achievements', 'readonly');
      if (!store) {
        const local = localStorage.getItem('mv_achievements');
        return local ? JSON.parse(local) : [];
      }
      return new Promise((resolve) => {
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      });
    } catch (e) {
      return [];
    }
  }

  async unlockAchievement(id) {
    const record = { id, unlockedAt: Date.now() };
    try {
      const store = await this.getStore('achievements', 'readwrite');
      if (store) {
        store.put(record);
      } else {
        const list = await this.getAchievements();
        if (!list.find(a => a.id === id)) {
          list.push(record);
          localStorage.setItem('mv_achievements', JSON.stringify(list));
        }
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  // --- Key-Value Settings ---

  async getSetting(key, defaultValue = null) {
    try {
      const store = await this.getStore('settings', 'readonly');
      if (!store) {
        const val = localStorage.getItem(`mv_set_${key}`);
        return val !== null ? JSON.parse(val) : defaultValue;
      }
      return new Promise((resolve) => {
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result ? req.result.value : defaultValue);
        req.onerror = () => resolve(defaultValue);
      });
    } catch (e) {
      return defaultValue;
    }
  }

  async setSetting(key, value) {
    try {
      const store = await this.getStore('settings', 'readwrite');
      if (store) {
        store.put({ key, value });
      } else {
        localStorage.setItem(`mv_set_${key}`, JSON.stringify(value));
      }
      return true;
    } catch (e) {
      localStorage.setItem(`mv_set_${key}`, JSON.stringify(value));
      return true;
    }
  }

  // --- Anonymous Analytics Queue ---

  async logEvent(eventType, meta = {}) {
    const record = {
      eventType,
      meta,
      timestamp: Date.now(),
      synced: false
    };
    try {
      const store = await this.getStore('analyticsQueue', 'readwrite');
      if (store) {
        store.add(record);
      } else {
        const q = JSON.parse(localStorage.getItem('mv_analytics_queue') || '[]');
        q.push(record);
        localStorage.setItem('mv_analytics_queue', JSON.stringify(q));
      }
    } catch (e) {
      console.warn('[Analytics] Log error:', e);
    }
  }

  async getAllEvents() {
    try {
      const store = await this.getStore('analyticsQueue', 'readonly');
      if (!store) {
        return JSON.parse(localStorage.getItem('mv_analytics_queue') || '[]');
      }
      return new Promise((resolve) => {
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      });
    } catch (e) {
      return [];
    }
  }

  async recordVisit(language = 'en', screen = 'welcome') {
    const record = {
      timestamp: Date.now(),
      language,
      screen,
      userAgent: navigator.userAgent.substring(0, 80)
    };
    try {
      const store = await this.getStore('visits', 'readwrite');
      if (store) {
        store.add(record);
      }
    } catch (e) {
      // ignore
    }
  }

  async getAllVisits() {
    try {
      const store = await this.getStore('visits', 'readonly');
      if (!store) return [];
      return new Promise((resolve) => {
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      });
    } catch (e) {
      return [];
    }
  }
}

export const db = new MindverseDB();
