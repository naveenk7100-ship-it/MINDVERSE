/**
 * GAME 1 — OBSERVATION MASTER
 * Flagship visual attention, difference detection & pattern acuity challenge.
 */

import { GameEngine } from './game-engine.js';
import { sound } from '../services/audio.js';
import { i18n } from '../i18n/index.js';

export class ObservationMasterGame extends GameEngine {
  constructor(level, container, onFinish) {
    super('observation-master', level, container, onFinish);
    this.differencesFound = 0;
    this.totalDifferences = 3;
    this.anomalies = [];
    this.canvas = null;
    this.ctx = null;
  }

  start() {
    this.setupLevelConfig();
    this.renderBoard();
    this.initTimer(this.timeLimit);
  }

  setupLevelConfig() {
    // 5 Progressive Levels
    switch (this.level) {
      case 1:
        this.timeLimit = 45;
        this.totalDifferences = 1;
        this.maxScore = 800;
        break;
      case 2:
        this.timeLimit = 40;
        this.totalDifferences = 2;
        this.maxScore = 900;
        break;
      case 3:
        this.timeLimit = 35;
        this.totalDifferences = 3;
        this.maxScore = 1000;
        break;
      case 4:
        this.timeLimit = 30;
        this.totalDifferences = 4;
        this.maxScore = 1100;
        break;
      case 5:
        this.timeLimit = 25;
        this.totalDifferences = 4;
        this.maxScore = 1200;
        break;
      default:
        this.timeLimit = 35;
        this.totalDifferences = 3;
        this.maxScore = 1000;
    }
    this.differencesFound = 0;
  }

  renderBoard() {
    const playArea = this.container.querySelector('#game-play-area');
    playArea.innerHTML = `
      <div class="obs-instruction-bar">
        <span>${i18n.t('gameplay.findDifferences')}</span>
        <strong id="obs-remaining-count" style="color: var(--accent-cyan); font-size: 1.1rem; margin-left: 6px;">
          ${this.totalDifferences - this.differencesFound}
        </strong>
      </div>

      <div class="observation-board" id="obs-board">
        <canvas id="obs-canvas" width="400" height="400" style="width: 100%; height: 100%; display: block;"></canvas>
      </div>
    `;

    this.canvas = playArea.querySelector('#obs-canvas');
    this.ctx = this.canvas.getContext('2d');

    // Generate procedural luxury scene with distinct anomaly coordinates
    this.generateScene();

    // Canvas click/touch detection
    this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
  }

  generateScene() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Draw dark luxury cosmic background
    const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, w / 2);
    bgGrad.addColorStop(0, '#13192f');
    bgGrad.addColorStop(1, '#080a12');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Draw grid of ambient geometric neural nodes
    const rows = 4 + this.level;
    const cols = rows;
    const cellW = w / cols;
    const cellH = h / rows;

    // Pick unique cells as anomalies
    const pickedIndices = new Set();
    this.anomalies = [];

    while (this.anomalies.length < this.totalDifferences) {
      const idx = Math.floor(Math.random() * (rows * cols));
      if (!pickedIndices.has(idx)) {
        pickedIndices.add(idx);
        const r = Math.floor(idx / cols);
        const c = idx % cols;
        const centerX = c * cellW + cellW / 2;
        const centerY = r * cellH + cellH / 2;
        this.anomalies.push({
          x: centerX,
          y: centerY,
          radius: Math.min(cellW, cellH) * 0.45,
          found: false
        });
      }
    }

    // Render nodes
    let currentIdx = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cx = c * cellW + cellW / 2;
        const cy = r * cellH + cellH / 2;
        const isAnomaly = pickedIndices.has(currentIdx);

        ctx.save();
        ctx.translate(cx, cy);

        // Standard nodes vs subtle Anomaly nodes
        if (isAnomaly) {
          // Subtle difference: distinct rotation or inverted internal facet
          ctx.strokeStyle = '#38bdf8';
          ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
          ctx.lineWidth = 2.5;

          // Draw an 8-pointed star / distinct neural flower
          ctx.rotate((Math.PI / 4) * 0.6);
          ctx.beginPath();
          const rad = Math.min(cellW, cellH) * 0.32;
          for (let p = 0; p < 8; p++) {
            const angle = (p * Math.PI) / 4;
            const dist = p % 2 === 0 ? rad : rad * 0.45;
            const px = Math.cos(angle) * dist;
            const py = Math.sin(angle) * dist;
            if (p === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.stroke();
          ctx.fill();

          // Anomaly inner glyph: small golden core
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Standard hexagonal node
          ctx.strokeStyle = '#6366f1';
          ctx.fillStyle = 'rgba(99, 102, 241, 0.08)';
          ctx.lineWidth = 1.8;

          ctx.beginPath();
          const rad = Math.min(cellW, cellH) * 0.3;
          for (let p = 0; p < 6; p++) {
            const angle = (p * Math.PI) / 3;
            const px = Math.cos(angle) * rad;
            const py = Math.sin(angle) * rad;
            if (p === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.stroke();
          ctx.fill();

          // Standard inner glyph: cyan dot
          ctx.fillStyle = '#818cf8';
          ctx.beginPath();
          ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
        currentIdx++;
      }
    }
  }

  handleCanvasClick(e) {
    if (this.isPaused || this.isOver) return;

    this.totalAttempts++;
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;

    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    // Check hit on any anomaly
    let hitFound = false;

    for (const anom of this.anomalies) {
      if (anom.found) continue;

      const dist = Math.hypot(clickX - anom.x, clickY - anom.y);
      if (dist <= anom.radius * 1.3) {
        // Hit!
        hitFound = true;
        anom.found = true;
        this.differencesFound++;
        this.correctCount++;

        sound.playSuccess();
        this.addScore(250);

        // Draw visual marker on board
        this.markHit(anom.x, anom.y);

        // Update remaining counter
        const counter = this.container.querySelector('#obs-remaining-count');
        if (counter) {
          counter.textContent = this.totalDifferences - this.differencesFound;
        }

        // Check level win
        if (this.differencesFound >= this.totalDifferences) {
          setTimeout(() => {
            this.endGame(true);
          }, 400);
        }
        break;
      }
    }

    if (!hitFound) {
      // Miss click penalty
      sound.playError();
      this.resetCombo();
      this.score = Math.max(0, this.score - 30);
      this.updateHud();

      // Show temporary red ripple at click position
      this.markMiss(clickX, clickY);
    }
  }

  markHit(x, y) {
    const board = this.container.querySelector('#obs-board');
    const marker = document.createElement('div');
    marker.className = 'obs-target-marker';

    const rect = this.canvas.getBoundingClientRect();
    const pctX = (x / this.canvas.width) * 100;
    const pctY = (y / this.canvas.height) * 100;

    marker.style.left = `${pctX}%`;
    marker.style.top = `${pctY}%`;
    board.appendChild(marker);
  }

  markMiss(x, y) {
    const board = this.container.querySelector('#obs-board');
    const marker = document.createElement('div');
    marker.style.position = 'absolute';
    marker.style.width = '30px';
    marker.style.height = '30px';
    marker.style.borderRadius = '50%';
    marker.style.border = '2px solid #f43f5e';
    marker.style.transform = 'translate(-50%, -50%)';
    marker.style.pointerEvents = 'none';

    const pctX = (x / this.canvas.width) * 100;
    const pctY = (y / this.canvas.height) * 100;
    marker.style.left = `${pctX}%`;
    marker.style.top = `${pctY}%`;

    board.appendChild(marker);
    setTimeout(() => {
      marker.remove();
    }, 400);
  }
}
