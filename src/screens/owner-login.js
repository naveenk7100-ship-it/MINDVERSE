/**
 * MINDVERSE Private Owner Authentication Gate
 */

import { i18n } from '../i18n/index.js';
import { db } from '../services/db.js';
import { sound } from '../services/audio.js';
import { CONFIG } from '../config.js';

export function renderOwnerLogin(navigate, onAuthSuccess) {
  const container = document.createElement('div');
  container.className = 'screen owner-login-screen';

  container.innerHTML = `
    <div class="dashboard-container" style="margin-top: 20px;">
      <div class="glass-panel auth-card">
        <div style="font-size: 3rem; margin-bottom: 12px;">🛡️</div>

        <h2 class="text-gradient-cyan" style="font-size: 1.8rem; font-weight: 800; margin-bottom: 6px;">
          ${i18n.t('owner.portalTitle')}
        </h2>
        <p style="font-size: 0.88rem; color: var(--text-dim); margin-bottom: 24px;">
          ${i18n.t('owner.portalSubtitle')}
        </p>

        <form id="owner-pin-form">
          <label style="display: block; font-size: 0.82rem; font-weight: 600; color: var(--text-main); margin-bottom: 8px;">
            ${i18n.t('owner.pinLabel')}
          </label>

          <div class="pin-input-group">
            <input type="password" maxlength="4" pattern="[0-9]*" inputmode="numeric" id="owner-pin-input" class="pin-digit-input" placeholder="••••" autofocus style="width: 160px; letter-spacing: 0.3em; font-size: 1.8rem;" />
          </div>

          <p id="pin-error-msg" style="color: #f43f5e; font-size: 0.82rem; margin-bottom: 14px; display: none;">
            ${i18n.t('owner.invalidPin')}
          </p>

          <button type="submit" class="btn-primary" style="width: 100%; padding: 15px; font-size: 1rem;">
            ${i18n.t('owner.loginBtn')}
          </button>
        </form>
      </div>
    </div>
  `;

  const form = container.querySelector('#owner-pin-form');
  const pinInput = container.querySelector('#owner-pin-input');
  const errorMsg = container.querySelector('#pin-error-msg');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const enteredPin = pinInput.value.trim();

    // Check stored PIN
    const savedPin = await db.getSetting(CONFIG.STORAGE_KEYS.OWNER_PIN_HASH, null);

    if (savedPin && enteredPin === savedPin) {
      sound.playSuccess();
      sessionStorage.setItem('mv_owner_auth', 'true');
      if (onAuthSuccess) {
        onAuthSuccess();
      } else {
        navigate('owner-dashboard');
      }
    } else {
      sound.playError();
      errorMsg.style.display = 'block';
      pinInput.value = '';
      pinInput.focus();
    }
  });

  return container;
}
