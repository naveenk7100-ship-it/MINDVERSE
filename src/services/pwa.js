/**
 * MINDVERSE PWA Registration & Connectivity Handler
 */

class PWAManager {
  constructor() {
    this.isOnline = navigator.onLine;
    this.listeners = new Set();
    this.deferredPrompt = null;
    this.init();
  }

  init() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.notify();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.notify();
    });

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.notify();
    });

    this.registerServiceWorker();
  }

  async registerServiceWorker() {
    if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
      try {
        const registration = await navigator.serviceWorker.register('./sw.js', { scope: './' });
        console.log('[PWA] Service Worker registered:', registration.scope);
      } catch (err) {
        console.warn('[PWA] Service Worker registration failed:', err);
      }
    }
  }

  subscribe(callback) {
    this.listeners.add(callback);
    callback(this.getStatus());
    return () => this.listeners.delete(callback);
  }

  notify() {
    const status = this.getStatus();
    this.listeners.forEach((cb) => cb(status));
  }

  getStatus() {
    return {
      isOnline: this.isOnline,
      canInstall: !!this.deferredPrompt
    };
  }

  async promptInstall() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      const choice = await this.deferredPrompt.userChoice;
      this.deferredPrompt = null;
      this.notify();
      return choice.outcome === 'accepted';
    }
    return false;
  }
}

export const pwa = new PWAManager();
