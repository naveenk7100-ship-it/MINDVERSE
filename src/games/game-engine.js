/**
 * MINDVERSE Base Game Engine Lifecycle
 */

import { i18n } from '../i18n/index.js';
import { db } from '../services/db.js';
import { sound } from '../services/audio.js';
import { analytics } from '../services/analytics.js';

export class GameEngine {
  constructor(gameId, level, container, onFinish) {
    this.gameId = gameId;
    this.level = level;
    this.container = container;
    this.onFinish = onFinish;

    this.score = 0;
    this.maxScore = 1000;
    this.timeLimit = 60; // default seconds
    this.timeRemaining = 60;
    this.timerInterval = null;
    this.isPaused = false;
    this.isOver = false;
    this.startTime = Date.now();
    this.correctCount = 0;
    this.totalAttempts = 0;
    this.combo = 0;
  }

  initTimer(seconds) {
    this.timeLimit = seconds;
    this.timeRemaining = seconds;
    this.updateHud();

    this.timerInterval = setInterval(() => {
      if (this.isPaused || this.isOver) return;

      this.timeRemaining -= 0.1;
      if (this.timeRemaining <= 0) {
        this.timeRemaining = 0;
        this.updateHud();
        this.endGame(false);
      } else {
        if (Math.floor(this.timeRemaining * 10) % 10 === 0) {
          // Every full second
          if (this.timeRemaining <= 5) {
            sound.playTick();
          }
        }
        this.updateHud();
      }
    }, 100);
  }

  updateHud() {
    const scoreVal = this.container.querySelector('#hud-score');
    if (scoreVal) scoreVal.textContent = Math.round(this.score);

    const timeVal = this.container.querySelector('#hud-time');
    if (timeVal) timeVal.textContent = `${Math.ceil(this.timeRemaining)}s`;

    const barFill = this.container.querySelector('#hud-timer-bar');
    if (barFill) {
      const pct = Math.max(0, Math.min(100, (this.timeRemaining / this.timeLimit) * 100));
      barFill.style.width = `${pct}%`;
      if (pct < 25) {
        barFill.classList.add('urgent');
      } else {
        barFill.classList.remove('urgent');
      }
    }
  }

  addScore(points) {
    this.combo++;
    const multiplier = 1 + (this.combo - 1) * 0.1;
    this.score += Math.round(points * multiplier);
    this.updateHud();
  }

  resetCombo() {
    this.combo = 0;
  }

  pause() {
    this.isPaused = true;
    sound.playClick();
  }

  resume() {
    this.isPaused = false;
    sound.playClick();
  }

  async endGame(passed) {
    if (this.isOver) return;
    this.isOver = true;
    clearInterval(this.timerInterval);

    const elapsedSeconds = Math.round((Date.now() - this.startTime) / 1000);

    // Compute star rating (0 to 3)
    let stars = 0;
    if (passed) {
      const scoreRatio = this.score / this.maxScore;
      if (scoreRatio >= 0.85 || this.score >= 850) {
        stars = 3;
      } else if (scoreRatio >= 0.60 || this.score >= 550) {
        stars = 2;
      } else {
        stars = 1;
      }
    }

    if (stars > 0) {
      sound.playLevelUp();
    } else {
      sound.playGameOver();
    }

    // Save to IndexedDB
    const { record, progress } = await db.saveLevelResult(
      this.gameId,
      this.level,
      stars,
      this.score,
      this.maxScore,
      elapsedSeconds
    );

    // Check achievement unlock
    await db.unlockAchievement('first_play');
    if (progress.starsTotal >= 9) {
      const achMap = {
        'observation-master': 'eagle_eye',
        'memory-match': 'memory_virtuoso',
        'logic-detective': 'logic_sherlock',
        'knowledge-quest': 'polymath',
        'mind-reset': 'zen_master'
      };
      if (achMap[this.gameId]) {
        await db.unlockAchievement(achMap[this.gameId]);
      }
    }

    // Check grand master (40+ total stars)
    const allProg = await db.getAllProgress();
    const grandStars = allProg.reduce((acc, p) => acc + (p.starsTotal || 0), 0);
    if (grandStars >= 40) {
      await db.unlockAchievement('grand_master');
    }

    // Anonymous analytics session completion
    await analytics.completeGameSession(this.gameId, this.level, this.score, stars, passed);

    const accuracy = this.totalAttempts > 0
      ? Math.round((this.correctCount / this.totalAttempts) * 100)
      : 100;

    // Handoff to results screen
    if (this.onFinish) {
      this.onFinish({
        gameId: this.gameId,
        level: this.level,
        score: this.score,
        maxScore: this.maxScore,
        stars,
        timeSeconds: elapsedSeconds,
        accuracy,
        passed,
        unlockedLevel: progress.unlockedLevel
      });
    }
  }

  cleanup() {
    clearInterval(this.timerInterval);
    this.isOver = true;
  }
}
