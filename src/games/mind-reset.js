/**
 * GAME 5 — MIND RESET
 * Focus rhythms, reaction time tests, impulse control & cognitive agility.
 */

import { GameEngine } from './game-engine.js';
import { sound } from '../services/audio.js';
import { i18n } from '../i18n/index.js';

export class MindResetGame extends GameEngine {
  constructor(level, container, onFinish) {
    super('mind-reset', level, container, onFinish);
    this.roundsCompleted = 0;
    this.targetRounds = 4;
    this.activeTimer = null;
    this.flashStartTime = null;
    this.isAwaitingReaction = false;
    this.isRedTrap = false;
  }

  start() {
    this.setupLevelConfig();
    this.renderExercise();
    this.initTimer(this.timeLimit);
  }

  setupLevelConfig() {
    switch (this.level) {
      case 1:
        this.targetRounds = 4; // Rhythm pulse
        this.timeLimit = 40;
        this.maxScore = 800;
        break;
      case 2:
        this.targetRounds = 4; // Reaction speed
        this.timeLimit = 40;
        this.maxScore = 900;
        break;
      case 3:
        this.targetRounds = 5; // Go / No-Go impulse control
        this.timeLimit = 40;
        this.maxScore = 1000;
        break;
      case 4:
        this.targetRounds = 4; // Harmonic equilibrium
        this.timeLimit = 45;
        this.maxScore = 1000;
        break;
      case 5:
        this.targetRounds = 5; // Multi-node sequence agility
        this.timeLimit = 40;
        this.maxScore = 1200;
        break;
      default:
        this.targetRounds = 4;
        this.timeLimit = 40;
        this.maxScore = 1000;
    }
    this.roundsCompleted = 0;
  }

  renderExercise() {
    const playArea = this.container.querySelector('#game-play-area');

    if (this.level === 2 || this.level === 3) {
      // Reaction Time & Go / No-Go
      playArea.innerHTML = `
        <div class="reset-container">
          <p class="reset-instruction" id="reset-msg">
            ${this.level === 2 ? i18n.t('gameplay.reactionInstructionGreen') : i18n.t('gameplay.reactionInstructionRed')}
          </p>

          <div class="reset-pulse-arena" id="reaction-arena">
            <div class="reset-core-orb" id="reaction-orb" style="width: 140px; height: 140px; background: #334155; box-shadow: none;">
              <span id="orb-text">⏳</span>
            </div>
          </div>

          <div style="font-size: 0.85rem; color: var(--text-dim);" id="round-indicator-box">
            ${i18n.t('gameplay.roundOf', { current: this.roundsCompleted + 1, total: this.targetRounds })}
          </div>
        </div>
      `;

      const arena = playArea.querySelector('#reaction-arena');
      arena.addEventListener('click', () => this.handleReactionClick());
      this.triggerNextReactionRound();
    } else {
      // Harmonic Rhythm & Agility Pulse (Level 1, 4, 5)
      playArea.innerHTML = `
        <div class="reset-container">
          <p class="reset-instruction">
            ${i18n.t('gameplay.pulseInstruction')}
          </p>

          <div class="reset-pulse-arena" id="pulse-arena">
            <div class="pulse-ring"></div>
            <div class="pulse-ring"></div>
            <div class="pulse-ring"></div>
            <div class="reset-core-orb" id="core-orb">
              <span>✦</span>
            </div>
          </div>

          <div style="font-size: 0.85rem; color: var(--text-dim);">
            ${i18n.t('gameplay.resonances')} <strong id="reset-round" style="color: var(--accent-cyan);">${this.roundsCompleted}</strong> / ${this.targetRounds}
          </div>
        </div>
      `;

      const orb = playArea.querySelector('#core-orb');
      orb.addEventListener('click', () => this.handlePulseTap());
    }
  }

  triggerNextReactionRound() {
    if (this.isOver) return;

    const orb = this.container.querySelector('#reaction-orb');
    const msg = this.container.querySelector('#reset-msg');
    const orbText = this.container.querySelector('#orb-text');

    if (!orb) return;

    orb.style.background = '#1e293b';
    orb.style.boxShadow = 'none';
    orbText.textContent = '⏳';
    this.isAwaitingReaction = false;

    // Random wait between 1.4s and 3.2s
    const delay = Math.floor(1400 + Math.random() * 1800);

    this.activeTimer = setTimeout(() => {
      if (this.isOver) return;

      if (this.level === 3 && Math.random() < 0.35) {
        // Red trap trial
        this.isRedTrap = true;
        orb.style.background = 'radial-gradient(circle, #f43f5e, #be123c)';
        orb.style.boxShadow = '0 0 35px rgba(244, 63, 94, 0.8)';
        orbText.textContent = '⛔';
        this.isAwaitingReaction = true;

        // Auto-clear after 1.2s without penalty if user resisted
        setTimeout(() => {
          if (this.isAwaitingReaction && this.isRedTrap) {
            // Success in holding back!
            sound.playSuccess();
            this.correctCount++;
            this.addScore(200);
            this.roundsCompleted++;
            this.isAwaitingReaction = false;

            if (this.roundsCompleted >= this.targetRounds) {
              this.endGame(true);
            } else {
              this.updateRoundIndicator();
              this.triggerNextReactionRound();
            }
          }
        }, 1100);
      } else {
        // Green GO signal
        this.isRedTrap = false;
        orb.style.background = 'radial-gradient(circle, #34d399, #059669)';
        orb.style.boxShadow = '0 0 40px rgba(52, 211, 153, 0.85)';
        orbText.textContent = '⚡';
        this.flashStartTime = Date.now();
        this.isAwaitingReaction = true;
      }
    }, delay);
  }

  handleReactionClick() {
    if (this.isPaused || this.isOver) return;

    this.totalAttempts++;

    if (!this.isAwaitingReaction) {
      // Early click false start!
      sound.playError();
      this.resetCombo();
      clearTimeout(this.activeTimer);
      const msg = this.container.querySelector('#reset-msg');
      if (msg) msg.textContent = i18n.t('gameplay.tooEarly');
      setTimeout(() => {
        if (msg) msg.textContent = i18n.t('gameplay.ready');
        this.triggerNextReactionRound();
      }, 800);
      return;
    }

    if (this.isRedTrap) {
      // Failed inhibition!
      sound.playError();
      this.resetCombo();
      this.score = Math.max(0, this.score - 40);
      this.updateHud();
      this.isAwaitingReaction = false;
      const msg = this.container.querySelector('#reset-msg');
      if (msg) msg.textContent = i18n.t('gameplay.inhibitionFailed');
      setTimeout(() => {
        this.triggerNextReactionRound();
      }, 900);
      return;
    }

    // Valid green tap!
    const reactionTimeMs = Date.now() - this.flashStartTime;
    this.isAwaitingReaction = false;
    this.correctCount++;

    sound.playSuccess();
    // Speed scoring: <280ms = 350pts, <400ms = 250pts, else 150pts
    let speedScore = 150;
    if (reactionTimeMs < 280) speedScore = 350;
    else if (reactionTimeMs < 400) speedScore = 250;

    this.addScore(speedScore);

    const msg = this.container.querySelector('#reset-msg');
    if (msg) msg.textContent = i18n.t('gameplay.reactionTimeResult', { ms: reactionTimeMs });

    this.roundsCompleted++;

    if (this.roundsCompleted >= this.targetRounds) {
      setTimeout(() => {
        this.endGame(true);
      }, 500);
    } else {
      this.updateRoundIndicator();
      setTimeout(() => {
        this.triggerNextReactionRound();
      }, 800);
    }
  }

  handlePulseTap() {
    if (this.isPaused || this.isOver) return;

    this.totalAttempts++;
    this.correctCount++;
    this.roundsCompleted++;

    sound.playSuccess();
    this.addScore(250);

    const roundEl = this.container.querySelector('#reset-round');
    if (roundEl) roundEl.textContent = this.roundsCompleted;

    // Visual ripple effect on orb
    const orb = this.container.querySelector('#core-orb');
    if (orb) {
      orb.style.transform = 'scale(1.2)';
      setTimeout(() => {
        orb.style.transform = 'scale(1)';
      }, 150);
    }

    if (this.roundsCompleted >= this.targetRounds) {
      setTimeout(() => {
        this.endGame(true);
      }, 400);
    }
  }

  updateRoundIndicator() {
    const roundBox = this.container.querySelector('#round-indicator-box');
    if (roundBox) {
      roundBox.textContent = i18n.t('gameplay.roundOf', { current: this.roundsCompleted + 1, total: this.targetRounds });
    }
    const roundEl = this.container.querySelector('#reset-round');
    if (roundEl) roundEl.textContent = this.roundsCompleted + 1;
  }

  cleanup() {
    super.cleanup();
    clearTimeout(this.activeTimer);
  }
}
