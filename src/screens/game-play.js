/**
 * MINDVERSE Game Play Viewport Screen
 */

import { i18n } from '../i18n/index.js';
import { sound } from '../services/audio.js';
import { analytics } from '../services/analytics.js';
import { ObservationMasterGame } from '../games/observation-master.js';
import { MemoryMatchGame } from '../games/memory-match.js';
import { LogicDetectiveGame } from '../games/logic-detective.js';
import { KnowledgeQuestGame } from '../games/knowledge-quest.js';
import { MindResetGame } from '../games/mind-reset.js';

export function renderGamePlay(navigate, params = {}) {
  const gameId = params.gameId || 'observation-master';
  const level = parseInt(params.level || 1, 10);

  const container = document.createElement('div');
  container.className = 'screen gameplay-screen';

  // Start anonymous analytics session
  analytics.startGameSession(gameId, level);

  container.innerHTML = `
    <div class="game-shell">
      <!-- Top HUD -->
      <div class="game-hud glass-card">
        <button id="game-back-btn" class="icon-btn" title="Exit Game">
          ←
        </button>

        <div class="hud-stat">
          <span class="hud-label">${i18n.t('games.level')}</span>
          <span class="hud-val highlight">${level}</span>
        </div>

        <div class="hud-stat">
          <span class="hud-label">${i18n.t('gameplay.score')}</span>
          <span class="hud-val" id="hud-score">0</span>
        </div>

        <div class="hud-stat">
          <span class="hud-label">${i18n.t('gameplay.time')}</span>
          <span class="hud-val" id="hud-time">--</span>
        </div>

        <button id="game-pause-btn" class="icon-btn" title="Pause Game">
          ⏸️
        </button>
      </div>

      <!-- Linear Timer Bar -->
      <div class="timer-bar-wrapper">
        <div class="timer-bar-fill" id="hud-timer-bar"></div>
      </div>

      <!-- Active Game Viewport -->
      <div id="game-play-area" style="flex: 1; display: flex; flex-direction: column; justify-content: center;">
      </div>
    </div>

    <!-- Pause Modal Overlay -->
    <div id="pause-modal" class="modal-overlay" style="display: none;">
      <div class="glass-panel modal-content" style="text-align: center;">
        <h3 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 20px;">
          ${i18n.t('gameplay.paused')}
        </h3>

        <div style="display: flex; flex-direction: column; gap: 12px;">
          <button id="pause-resume-btn" class="btn-primary" style="padding: 14px;">
            ▶ ${i18n.t('gameplay.resume')}
          </button>
          <button id="pause-restart-btn" class="btn-secondary" style="padding: 14px;">
            🔄 ${i18n.t('gameplay.restart')}
          </button>
          <button id="pause-exit-btn" class="btn-secondary" style="padding: 14px; color: #f43f5e; border-color: rgba(244,63,94,0.3);">
            ✕ ${i18n.t('gameplay.exit')}
          </button>
        </div>
      </div>
    </div>
  `;

  let activeGameInstance = null;

  const handleFinish = (resultData) => {
    navigate('results', resultData);
  };

  // Instantiate the specific game class
  switch (gameId) {
    case 'observation-master':
      activeGameInstance = new ObservationMasterGame(level, container, handleFinish);
      break;
    case 'memory-match':
      activeGameInstance = new MemoryMatchGame(level, container, handleFinish);
      break;
    case 'logic-detective':
      activeGameInstance = new LogicDetectiveGame(level, container, handleFinish);
      break;
    case 'knowledge-quest':
      activeGameInstance = new KnowledgeQuestGame(level, container, handleFinish);
      break;
    case 'mind-reset':
      activeGameInstance = new MindResetGame(level, container, handleFinish);
      break;
    default:
      activeGameInstance = new ObservationMasterGame(level, container, handleFinish);
  }

  // Start after DOM attachment
  setTimeout(() => {
    if (activeGameInstance) {
      activeGameInstance.start();
    }
  }, 50);

  // Pause Controls
  const pauseModal = container.querySelector('#pause-modal');
  const pauseBtn = container.querySelector('#game-pause-btn');
  pauseBtn.addEventListener('click', () => {
    if (activeGameInstance) {
      activeGameInstance.pause();
      pauseModal.style.display = 'flex';
    }
  });

  const resumeBtn = container.querySelector('#pause-resume-btn');
  resumeBtn.addEventListener('click', () => {
    pauseModal.style.display = 'none';
    if (activeGameInstance) activeGameInstance.resume();
  });

  const restartBtn = container.querySelector('#pause-restart-btn');
  restartBtn.addEventListener('click', () => {
    if (activeGameInstance) activeGameInstance.cleanup();
    navigate('gameplay', { gameId, level });
  });

  const exitBtn = container.querySelector('#pause-exit-btn');
  exitBtn.addEventListener('click', () => {
    if (activeGameInstance) activeGameInstance.cleanup();
    navigate('game-select');
  });

  const backBtn = container.querySelector('#game-back-btn');
  backBtn.addEventListener('click', () => {
    if (activeGameInstance) activeGameInstance.cleanup();
    navigate('game-select');
  });

  return container;
}
