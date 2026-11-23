/**
 * GAME 2 — MEMORY MATCH
 * Spatial card pairing, sequence recall and memory acuity challenge.
 */

import { GameEngine } from './game-engine.js';
import { sound } from '../services/audio.js';

export class MemoryMatchGame extends GameEngine {
  constructor(level, container, onFinish) {
    super('memory-match', level, container, onFinish);
    this.cards = [];
    this.flippedIndices = [];
    this.matchedPairs = 0;
    this.totalPairs = 3;
    this.isLockBoard = false;
  }

  start() {
    this.setupLevelConfig();
    this.renderBoard();
    this.initTimer(this.timeLimit);
  }

  setupLevelConfig() {
    switch (this.level) {
      case 1:
        this.totalPairs = 3; // 6 cards (3x2)
        this.timeLimit = 40;
        this.maxScore = 800;
        break;
      case 2:
        this.totalPairs = 4; // 8 cards (4x2)
        this.timeLimit = 45;
        this.maxScore = 900;
        break;
      case 3:
        this.totalPairs = 6; // 12 cards (4x3)
        this.timeLimit = 50;
        this.maxScore = 1000;
        break;
      case 4:
        this.totalPairs = 8; // 16 cards (4x4)
        this.timeLimit = 55;
        this.maxScore = 1100;
        break;
      case 5:
        this.totalPairs = 10; // 20 cards (4x5)
        this.timeLimit = 60;
        this.maxScore = 1200;
        break;
      default:
        this.totalPairs = 6;
        this.timeLimit = 50;
        this.maxScore = 1000;
    }
    this.matchedPairs = 0;
    this.flippedIndices = [];
  }

  renderBoard() {
    const playArea = this.container.querySelector('#game-play-area');

    const symbolPool = ['🔮', '⚡', '🌌', '💎', '🪐', '👁️', '✨', '🛸', '🧭', '🗝️', '🧬', '🌠'];
    const chosenSymbols = symbolPool.slice(0, this.totalPairs);
    const deck = [...chosenSymbols, ...chosenSymbols];

    // Fisher-Yates shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    this.cards = deck.map((symbol, idx) => ({
      id: idx,
      symbol,
      isFlipped: false,
      isMatched: false
    }));

    const colClass = this.totalPairs <= 3 ? 'cols-3' : 'cols-4';

    playArea.innerHTML = `
      <div class="memory-grid ${colClass}" id="memory-grid">
        ${this.cards.map(c => `
          <div class="memory-card" data-card-id="${c.id}">
            <div class="card-face card-front">
              <span>✦</span>
            </div>
            <div class="card-face card-back">
              <span>${c.symbol}</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // Attach card flip click handlers
    playArea.querySelectorAll('.memory-card').forEach(cardEl => {
      cardEl.addEventListener('click', () => {
        const id = parseInt(cardEl.getAttribute('data-card-id'), 10);
        this.handleCardClick(id, cardEl);
      });
    });
  }

  handleCardClick(cardId, cardEl) {
    if (this.isLockBoard || this.isPaused || this.isOver) return;

    const card = this.cards[cardId];
    if (card.isFlipped || card.isMatched) return;

    // Flip card
    sound.playFlip();
    card.isFlipped = true;
    cardEl.classList.add('flipped');
    this.flippedIndices.push(cardId);

    if (this.flippedIndices.length === 2) {
      this.totalAttempts++;
      this.isLockBoard = true;
      const [firstId, secondId] = this.flippedIndices;
      const firstCard = this.cards[firstId];
      const secondCard = this.cards[secondId];

      const grid = this.container.querySelector('#memory-grid');
      const firstEl = grid.querySelector(`[data-card-id="${firstId}"]`);
      const secondEl = grid.querySelector(`[data-card-id="${secondId}"]`);

      if (firstCard.symbol === secondCard.symbol) {
        // MATCH!
        this.correctCount++;
        firstCard.isMatched = true;
        secondCard.isMatched = true;
        this.matchedPairs++;

        setTimeout(() => {
          sound.playSuccess();
          firstEl.classList.add('matched');
          secondEl.classList.add('matched');
          this.addScore(150);
          this.flippedIndices = [];
          this.isLockBoard = false;

          // Check win
          if (this.matchedPairs >= this.totalPairs) {
            setTimeout(() => {
              this.endGame(true);
            }, 500);
          }
        }, 300);
      } else {
        // MISMATCH
        setTimeout(() => {
          sound.playError();
          this.resetCombo();
          firstCard.isFlipped = false;
          secondCard.isFlipped = false;
          firstEl.classList.remove('flipped');
          secondEl.classList.remove('flipped');
          this.flippedIndices = [];
          this.isLockBoard = false;
        }, 850);
      }
    }
  }
}
