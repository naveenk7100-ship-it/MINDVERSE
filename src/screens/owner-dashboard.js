/**
 * MINDVERSE Private Owner Dashboard & Operations Center
 */

import { i18n } from '../i18n/index.js';
import { db } from '../services/db.js';
import { analytics } from '../services/analytics.js';
import { QRService } from '../services/qr-service.js';
import { sound } from '../services/audio.js';
import { CONFIG } from '../config.js';

export async function renderOwnerDashboard(navigate) {
  // Guard authentication
  if (sessionStorage.getItem('mv_owner_auth') !== 'true') {
    navigate('owner-login');
    return document.createElement('div');
  }

  const container = document.createElement('div');
  container.className = 'screen owner-dashboard-screen';

  const report = await analytics.getAggregatedReport();
  let destinationUrl = await QRService.getDestinationUrl();

  const gameNames = {
    'observation-master': i18n.t('games.observation.title'),
    'memory-match': i18n.t('games.memory.title'),
    'logic-detective': i18n.t('games.logic.title'),
    'knowledge-quest': i18n.t('games.knowledge.title'),
    'mind-reset': i18n.t('games.reset.title')
  };

  container.innerHTML = `
    <div class="dashboard-container">
      <!-- Owner Header -->
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
        <div>
          <h2 class="text-gradient-cyan" style="font-size: 1.6rem; font-weight: 800; margin-bottom: 2px;">
            ${i18n.t('owner.dashboard')}
          </h2>
          <span style="font-size: 0.75rem; color: var(--accent-emerald); font-weight: 600;">
            ● Authenticated Owner Session
          </span>
        </div>

        <div style="display: flex; gap: 8px;">
          <button id="owner-change-pin-btn" class="icon-btn" title="${i18n.t('owner.changePinTitle')}">
            🔑
          </button>
          <button id="owner-logout-btn" class="icon-btn" title="${i18n.t('owner.logout')}" style="color: #f43f5e;">
            🚪
          </button>
        </div>
      </div>

      <!-- Core Metrics Grid -->
      <div class="metrics-grid">
        <div class="glass-card metric-card">
          <div class="metric-header">${i18n.t('owner.metrics.recordedVisits')}</div>
          <div class="metric-value text-gradient-cyan">${report.totalRecordedVisits}</div>
          <div class="metric-sub">${i18n.t('owner.metrics.recordedVisitsNote')}</div>
        </div>

        <div class="glass-card metric-card">
          <div class="metric-header">${i18n.t('owner.metrics.totalPlays')}</div>
          <div class="metric-value text-gradient-gold">${report.totalRecordedPlays}</div>
          <div class="metric-sub">Completed game sessions</div>
        </div>

        <div class="glass-card metric-card">
          <div class="metric-header">${i18n.t('owner.metrics.completionRate')}</div>
          <div class="metric-value" style="color: #34d399;">${report.overallCompletionRate}%</div>
          <div class="metric-sub">${report.totalPlays} finished / ${report.totalStarts} started</div>
        </div>

        <div class="glass-card metric-card">
          <div class="metric-header">${i18n.t('owner.metrics.avgDuration')}</div>
          <div class="metric-value">${report.avgDurationSec}s</div>
          <div class="metric-sub">Average gameplay time</div>
        </div>
      </div>

      <!-- Most Popular Game Spotlight -->
      <div class="glass-panel" style="padding: 16px 20px; display: flex; align-items: center; justify-content: space-between;">
        <div>
          <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">
            ${i18n.t('owner.metrics.popularGame')}
          </div>
          <div style="font-size: 1.15rem; font-weight: 700; color: #ffffff; margin-top: 2px;">
            ${gameNames[report.mostPopularGame] || report.mostPopularGame}
          </div>
        </div>
        <div style="font-size: 2rem;">🏆</div>
      </div>

      <!-- Permanent QR Code Generation & Exports -->
      <div class="glass-panel qr-preview-card">
        <h3 style="font-size: 1.25rem; font-weight: 800; color: #ffffff; margin-bottom: 4px;">
          ${i18n.t('owner.qrSection.title')}
        </h3>
        <p style="font-size: 0.8rem; color: var(--text-dim); max-width: 440px;">
          ${i18n.t('owner.qrSection.urlHint')}
        </p>

        <!-- Destination URL Input -->
        <div class="qr-url-box">
          <input type="url" id="dest-url-input" class="url-input" value="${destinationUrl}" placeholder="https://mindverse.app" />
          <button id="save-url-btn" class="btn-primary" style="padding: 8px 16px; font-size: 0.85rem; min-height: 40px;">
            Save
          </button>
        </div>

        <!-- Live QR Code Preview Container -->
        <div class="qr-canvas-wrapper" id="qr-display-container">
          <!-- QR SVG / Canvas inserted here -->
        </div>

        <div style="font-size: 0.75rem; color: var(--accent-emerald); font-weight: 600; margin-bottom: 16px;">
          ✓ ${i18n.t('owner.qrSection.statusReady')}
        </div>

        <!-- Download Buttons -->
        <div class="qr-action-buttons">
          <button id="download-qr-png-btn" class="btn-primary" style="padding: 12px 18px; font-size: 0.9rem;">
            <span>📥</span>
            <span>${i18n.t('owner.qrSection.downloadPng')}</span>
          </button>

          <button id="download-qr-pdf-btn" class="btn-secondary" style="padding: 12px 18px; font-size: 0.9rem;">
            <span>📄</span>
            <span>${i18n.t('owner.qrSection.downloadPdf')}</span>
          </button>
        </div>
      </div>

      <!-- Game-Wise Breakdown -->
      <div class="glass-card" style="padding: 20px;">
        <h3 style="font-size: 1.1rem; font-weight: 700; color: #ffffff; margin-bottom: 16px;">
          ${i18n.t('owner.gamesBreakdown')}
        </h3>

        ${Object.keys(report.gameStats).map(gid => {
          const st = report.gameStats[gid];
          const name = gameNames[gid] || gid;
          const pct = report.totalRecordedPlays > 0
            ? Math.round((st.completes / report.totalRecordedPlays) * 100)
            : 0;

          return `
            <div class="breakdown-row">
              <div class="breakdown-header">
                <span style="font-weight: 600; color: var(--text-main);">${name}</span>
                <span style="color: var(--text-dim);">${st.completes} plays (${pct}%)</span>
              </div>
              <div class="breakdown-bar-bg">
                <div class="breakdown-bar-fill" style="width: ${pct}%;"></div>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Daily Activity Trends (Last 7 Days) -->
      <div class="glass-card" style="padding: 20px;">
        <h3 style="font-size: 1.1rem; font-weight: 700; color: #ffffff; margin-bottom: 16px;">
          ${i18n.t('owner.dailyTrends')}
        </h3>

        <div style="display: flex; justify-content: space-between; align-items: flex-end; height: 110px; padding-top: 10px; gap: 8px;">
          ${Object.keys(report.dailyStats).map(day => {
            const d = report.dailyStats[day];
            const maxVal = Math.max(1, ...Object.values(report.dailyStats).map(x => x.plays + x.visits));
            const barHeight = Math.max(15, Math.round(((d.plays + d.visits) / maxVal) * 85));
            const dayLabel = day.slice(5); // MM-DD

            return `
              <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px;">
                <span style="font-size: 0.65rem; color: var(--accent-cyan); font-weight: 700;">${d.plays}</span>
                <div style="width: 100%; max-width: 28px; height: ${barHeight}px; background: linear-gradient(180deg, #38bdf8, #4f46e5); border-radius: 4px;"></div>
                <span style="font-size: 0.65rem; color: var(--text-muted);">${dayLabel}</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Sync Architecture & Offline Queue Status -->
      <div class="glass-card" style="padding: 20px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
          <h3 style="font-size: 1.05rem; font-weight: 700; color: #ffffff;">
            ${i18n.t('owner.syncArchitecture')}
          </h3>
          <span class="status-badge">
            <span class="status-dot online"></span>
            Queue: ${report.unsyncedQueueCount} events
          </span>
        </div>
        <p style="font-size: 0.8rem; color: var(--text-dim); line-height: 1.55;">
          ${i18n.t('owner.syncNote')}
        </p>
      </div>
    </div>

    <!-- Change PIN Modal -->
    <div id="change-pin-modal" class="modal-overlay" style="display: none;">
      <div class="glass-panel modal-content" style="text-align: center;">
        <h3 style="font-size: 1.3rem; font-weight: 800; margin-bottom: 14px;">
          ${i18n.t('owner.changePinTitle')}
        </h3>
        <p style="font-size: 0.82rem; color: var(--text-dim); margin-bottom: 16px;">
          Enter a new 4-digit numeric PIN:
        </p>

        <input type="password" maxlength="4" pattern="[0-9]*" id="new-pin-input" class="pin-digit-input" placeholder="••••" style="width: 140px; margin: 0 auto 18px; display: block;" />

        <div style="display: flex; gap: 10px; justify-content: center;">
          <button id="save-new-pin-btn" class="btn-primary" style="padding: 10px 20px; font-size: 0.9rem;">
            ${i18n.t('owner.savePin')}
          </button>
          <button id="cancel-pin-btn" class="btn-secondary" style="padding: 10px 20px; font-size: 0.9rem;">
            Cancel
          </button>
        </div>
      </div>
    </div>
  `;

  // Render QR Code preview
  const qrDisplay = container.querySelector('#qr-display-container');
  const updateQrPreview = async (url) => {
    try {
      const svg = await QRService.generateQrSvg(url);
      qrDisplay.innerHTML = svg;
      const svgEl = qrDisplay.querySelector('svg');
      if (svgEl) {
        svgEl.setAttribute('width', '180');
        svgEl.setAttribute('height', '180');
      }
    } catch (e) {
      console.warn('QR render error:', e);
    }
  };

  updateQrPreview(destinationUrl);

  // Attach Save Destination URL
  const saveUrlBtn = container.querySelector('#save-url-btn');
  const destInput = container.querySelector('#dest-url-input');

  saveUrlBtn.addEventListener('click', async () => {
    sound.playClick();
    const newUrl = destInput.value.trim();
    if (newUrl) {
      const saved = await QRService.setDestinationUrl(newUrl);
      destinationUrl = saved;
      destInput.value = saved;
      await updateQrPreview(saved);
      alert('Destination URL updated successfully: ' + saved);
    }
  });

  // Attach QR Downloads
  const pngBtn = container.querySelector('#download-qr-png-btn');
  pngBtn.addEventListener('click', async () => {
    sound.playClick();
    await QRService.downloadQrPng(destinationUrl);
  });

  const pdfBtn = container.querySelector('#download-qr-pdf-btn');
  pdfBtn.addEventListener('click', async () => {
    sound.playClick();
    await QRService.downloadQrPdf(destinationUrl);
  });

  // Attach Logout
  const logoutBtn = container.querySelector('#owner-logout-btn');
  logoutBtn.addEventListener('click', () => {
    sound.playClick();
    sessionStorage.removeItem('mv_owner_auth');
    navigate('welcome');
  });

  // Attach Change PIN Modal
  const changePinModal = container.querySelector('#change-pin-modal');
  const changePinBtn = container.querySelector('#owner-change-pin-btn');
  const cancelPinBtn = container.querySelector('#cancel-pin-btn');
  const saveNewPinBtn = container.querySelector('#save-new-pin-btn');
  const newPinInput = container.querySelector('#new-pin-input');

  changePinBtn.addEventListener('click', () => {
    sound.playClick();
    changePinModal.style.display = 'flex';
    newPinInput.value = '';
    newPinInput.focus();
  });

  cancelPinBtn.addEventListener('click', () => {
    changePinModal.style.display = 'none';
  });

  saveNewPinBtn.addEventListener('click', async () => {
    const val = newPinInput.value.trim();
    if (val.length === 4 && /^\d+$/.test(val)) {
      sound.playSuccess();
      await db.setSetting(CONFIG.STORAGE_KEYS.OWNER_PIN_HASH, val);
      changePinModal.style.display = 'none';
      alert(i18n.t('owner.pinUpdated'));
    } else {
      sound.playError();
      alert('Please enter a valid 4-digit numeric PIN.');
    }
  });

  return container;
}
