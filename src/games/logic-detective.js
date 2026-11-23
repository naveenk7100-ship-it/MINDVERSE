/**
 * GAME 3 — LOGIC DETECTIVE
 * Pattern recognition, logical sequences & deductive puzzles.
 */

import { GameEngine } from './game-engine.js';
import { sound } from '../services/audio.js';
import { i18n } from '../i18n/index.js';

export class LogicDetectiveGame extends GameEngine {
  constructor(level, container, onFinish) {
    super('logic-detective', level, container, onFinish);
    this.puzzles = [];
    this.currentPuzzleIdx = 0;
  }

  start() {
    this.setupLevelConfig();
    this.renderCurrentPuzzle();
    this.initTimer(this.timeLimit);
  }

  setupLevelConfig() {
    const lang = i18n.getLanguage();

    // Verified progressive logic puzzles
    const allPuzzlesByLevel = {
      1: [
        {
          tokens: ['2', '4', '8', '16', '?'],
          options: ['32', '24', '30', '64'],
          answer: '32',
          hint: { en: 'Rule: Multiply by 2 each step', te: 'నియమం: ప్రతి దశలో 2తో గుణించండి', hi: 'नियम: प्रत्येक चरण में 2 से गुणा करें' }
        },
        {
          tokens: ['3', '6', '9', '12', '?'],
          options: ['15', '14', '18', '21'],
          answer: '15',
          hint: { en: 'Rule: Add 3 consecutively', te: 'నియమం: వరుసగా 3 కలపండి', hi: 'नियम: लगातार 3 जोड़ें' }
        },
        {
          tokens: ['5', '10', '15', '20', '?'],
          options: ['25', '30', '22', '35'],
          answer: '25',
          hint: { en: 'Rule: Multiples of 5', te: 'నియమం: 5 యొక్క గుణిజాలు', hi: 'नियम: 5 के गुणज' }
        }
      ],
      2: [
        {
          tokens: ['1', '4', '9', '16', '?'],
          options: ['25', '20', '36', '30'],
          answer: '25',
          hint: { en: 'Rule: Square numbers (1², 2², 3², 4², 5²)', te: 'నియమం: వర్గ సంఖ్యలు (1², 2², 3², 4², 5²)', hi: 'नियम: वर्ग संख्याएँ (1², 2², 3², 4², 5²)' }
        },
        {
          tokens: ['2', '3', '5', '7', '11', '?'],
          options: ['13', '15', '17', '12'],
          answer: '13',
          hint: { en: 'Rule: Consecutive prime numbers', te: 'నియమం: వరుస ప్రధాన సంఖ్యలు', hi: 'नियम: लगातार अभाज्य संख्याएँ' }
        },
        {
          tokens: ['100', '95', '85', '70', '?'],
          options: ['50', '55', '60', '45'],
          answer: '50',
          hint: { en: 'Rule: Subtract 5, 10, 15, then 20', te: 'నియమం: 5, 10, 15, తర్వాత 20 తీసివేయండి', hi: 'नियम: 5, 10, 15, फिर 20 घटाएं' }
        }
      ],
      3: [
        {
          tokens: ['1', '1', '2', '3', '5', '8', '?'],
          options: ['13', '11', '15', '21'],
          answer: '13',
          hint: { en: 'Rule: Fibonacci sequence (sum of last two)', te: 'నియమం: ఫిబోనాకి శ్రేణి (మునుపటి రెండు సంఖ్యల మొత్తం)', hi: 'नियम: फाइबोनैचि अनुक्रम (अंतिम दो का योग)' }
        },
        {
          tokens: ['3', '5', '9', '17', '33', '?'],
          options: ['65', '49', '66', '55'],
          answer: '65',
          hint: { en: 'Rule: Differences double each step (+2, +4, +8, +16, +32)', te: 'నియమం: వ్యత్యాసాలు రెట్టింపు అవుతాయి (+2, +4, +8, +16, +32)', hi: 'नियम: अंतर हर कदम पर दोगुना होता है' }
        },
        {
          tokens: ['8', '27', '64', '125', '?'],
          options: ['216', '196', '256', '343'],
          answer: '216',
          hint: { en: 'Rule: Cubes (2³, 3³, 4³, 5³, 6³)', te: 'నియమం: ఘన సంఖ్యలు (2³, 3³, 4³, 5³, 6³)', hi: 'नियम: घन संख्याएँ (2³, 3³, 4³, 5³, 6³)' }
        }
      ],
      4: [
        {
          tokens: ['2', '20', '4', '18', '6', '16', '?'],
          options: ['8', '14', '10', '12'],
          answer: '8',
          hint: { en: 'Rule: Alternating sequence (+2 ascending, -2 descending)', te: 'నియమం: ఏకాంతర శ్రేణి (+2 పెరుగుదల, -2 తగ్గుదల)', hi: 'नियम: एकांतर अनुक्रम (+2 वृद्धि, -2 कमी)' }
        },
        {
          tokens: ['2', '5', '11', '23', '47', '?'],
          options: ['95', '94', '91', '100'],
          answer: '95',
          hint: { en: 'Rule: Multiply by 2 and add 1', te: 'నియమం: 2తో గుణించి 1 కలపండి', hi: 'नियम: 2 से गुणा करें और 1 जोड़ें' }
        },
        {
          tokens: ['1', '6', '15', '28', '45', '?'],
          options: ['66', '60', '72', '58'],
          answer: '66',
          hint: { en: 'Rule: Add 5, 9, 13, 17, 21 (step +4)', te: 'నియమం: 5, 9, 13, 17, 21 కలపండి (స్టెప్ +4)', hi: 'नियम: 5, 9, 13, 17, 21 जोड़ें' }
        }
      ],
      5: [
        {
          tokens: ['7', '14', '17', '34', '37', '74', '?'],
          options: ['77', '148', '75', '80'],
          answer: '77',
          hint: { en: 'Rule: Alternate (×2, +3, ×2, +3, ×2, +3)', te: 'నియమం: మార్పిడి (×2, +3, ×2, +3, ×2, +3)', hi: 'नियम: बारी-बारी (×2, +3, ×2, +3, ×2, +3)' }
        },
        {
          tokens: ['3', '8', '24', '48', '120', '?'],
          options: ['168', '144', '196', '224'],
          answer: '168',
          hint: { en: 'Rule: Prime numbers squared minus 1 (2²-1, 3²-1, 5²-1, 7²-1, 11²-1, 13²-1)', te: 'నియమం: ప్రధాన సంఖ్యల వర్గం మైనస్ 1', hi: 'नियम: अभाज्य संख्याओं का वर्ग घटा 1' }
        },
        {
          tokens: ['1', '3', '7', '15', '31', '63', '?'],
          options: ['127', '126', '125', '128'],
          answer: '127',
          hint: { en: 'Rule: Powers of 2 minus 1 (2ⁿ - 1)', te: 'నియమం: 2 యొక్క ఘాతం మైనస్ 1 (2ⁿ - 1)', hi: 'नियम: 2 की घात घटा 1 (2ⁿ - 1)' }
        }
      ]
    };

    this.puzzles = allPuzzlesByLevel[this.level] || allPuzzlesByLevel[1];
    this.currentPuzzleIdx = 0;
    this.timeLimit = 40 + this.level * 5;
    this.maxScore = 1000;
  }

  renderCurrentPuzzle() {
    const playArea = this.container.querySelector('#game-play-area');
    const puzzle = this.puzzles[this.currentPuzzleIdx];
    const lang = i18n.getLanguage();

    playArea.innerHTML = `
      <div class="logic-container">
        <!-- Progress bar above puzzle -->
        <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-dim); margin-bottom: 4px;">
          <span>${i18n.t('gameplay.puzzleOf', { current: this.currentPuzzleIdx + 1, total: this.puzzles.length })}</span>
          <span>${i18n.t('games.level')} ${this.level}</span>
        </div>

        <div class="glass-card logic-question-card">
          <div style="font-size: 0.85rem; color: var(--accent-cyan); font-weight: 600; text-transform: uppercase; margin-bottom: 8px;">
            ${i18n.t('gameplay.identifyMissing')}
          </div>

          <div class="logic-sequence-display">
            ${puzzle.tokens.map(tok => `
              <div class="logic-token ${tok === '?' ? 'missing' : ''}">
                ${tok}
              </div>
            `).join('')}
          </div>

          <p style="font-size: 0.82rem; color: var(--text-muted); font-style: italic;">
            ${puzzle.hint[lang] || puzzle.hint['en']}
          </p>
        </div>

        <div class="logic-options-grid">
          ${puzzle.options.map(opt => `
            <button class="logic-option-btn" data-option="${opt}">
              <span>${opt}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    // Attach option buttons
    playArea.querySelectorAll('.logic-option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const selected = btn.getAttribute('data-option');
        this.handleAnswer(selected, btn);
      });
    });
  }

  handleAnswer(selected, btnEl) {
    if (this.isPaused || this.isOver) return;

    this.totalAttempts++;
    const puzzle = this.puzzles[this.currentPuzzleIdx];

    if (selected === puzzle.answer) {
      // CORRECT
      sound.playSuccess();
      this.correctCount++;
      this.addScore(300);
      btnEl.style.background = 'rgba(16, 185, 129, 0.25)';
      btnEl.style.borderColor = '#10b981';
      btnEl.style.color = '#a7f3d0';

      setTimeout(() => {
        this.currentPuzzleIdx++;
        if (this.currentPuzzleIdx < this.puzzles.length) {
          this.renderCurrentPuzzle();
        } else {
          // Finished all puzzles in this level
          this.endGame(true);
        }
      }, 500);
    } else {
      // INCORRECT
      sound.playError();
      this.resetCombo();
      this.score = Math.max(0, this.score - 50);
      this.updateHud();

      btnEl.style.background = 'rgba(244, 63, 94, 0.25)';
      btnEl.style.borderColor = '#f43f5e';
      btnEl.style.color = '#fecdd3';

      setTimeout(() => {
        btnEl.style.background = 'var(--bg-glass-card)';
        btnEl.style.borderColor = 'var(--border-subtle)';
        btnEl.style.color = 'var(--text-main)';
      }, 600);
    }
  }
}
