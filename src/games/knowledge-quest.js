/**
 * GAME 4 — KNOWLEDGE QUEST
 * Engaging trivia and verified riddles across Science, Tech, Geography & Nature.
 */

import { GameEngine } from './game-engine.js';
import { sound } from '../services/audio.js';
import { i18n } from '../i18n/index.js';

export class KnowledgeQuestGame extends GameEngine {
  constructor(level, container, onFinish) {
    super('knowledge-quest', level, container, onFinish);
    this.questions = [];
    this.currentQIdx = 0;
  }

  start() {
    this.setupLevelConfig();
    this.renderCurrentQuestion();
    this.initTimer(this.timeLimit);
  }

  setupLevelConfig() {
    // Verified 5-level trilingual question bank
    const questionsByLevel = {
      1: [
        {
          category: 'Astronomy',
          q: {
            en: 'Which planet in our solar system is known as the Red Planet?',
            te: 'మన సౌర వ్యవస్థలో "ఎరుపు గ్రహం" అని ఏ గ్రహాన్ని పిలుస్తారు?',
            hi: 'हमारे सौर मंडल में किस ग्रह को "लाल ग्रह" कहा जाता है?'
          },
          options: [
            { id: 'a', en: 'Mars', te: 'అంగారకుడు (కుజుడు)', hi: 'मंगल' },
            { id: 'b', en: 'Venus', te: 'శుక్రుడు', hi: 'शुक्र' },
            { id: 'c', en: 'Jupiter', te: 'బృహస్పతి', hi: 'बृहस्पति' },
            { id: 'd', en: 'Saturn', te: 'శని', hi: 'शनि' }
          ],
          correct: 'a'
        },
        {
          category: 'Biology',
          q: {
            en: 'What process do green plants use to convert sunlight into food energy?',
            te: 'ఆకుపచ్చని మొక్కలు సూర్యరశ్మిని ఆహారంగా మార్చడానికి ఏ ప్రక్రియను ఉపయోగిస్తాయి?',
            hi: 'हरे पौधे सूर्य के प्रकाश को भोजन ऊर्जा में बदलने के लिए किस प्रक्रिया का उपयोग करते हैं?'
          },
          options: [
            { id: 'a', en: 'Respiration', te: 'శ్వాసక్రియ', hi: 'श्वसन' },
            { id: 'b', en: 'Photosynthesis', te: 'కిరణజన్య సంయోగక్రియ', hi: 'प्रकाश संश्लेषण' },
            { id: 'c', en: 'Transpiration', te: 'భాష్పోత్సేకం', hi: 'वाष्पोत्सर्जन' },
            { id: 'd', en: 'Fermentation', te: 'కిణ్వ ప్రక్రియ', hi: 'किण्वन' }
          ],
          correct: 'b'
        },
        {
          category: 'Earth Science',
          q: {
            en: 'What is the hardest naturally occurring substance on Earth?',
            te: 'భూమిపై సహజంగా లభించే అత్యంత కఠినమైన పదార్థం ఏది?',
            hi: 'पृथ्वी पर प्राकृतिक रूप से पाया जाने वाला सबसे कठोर पदार्थ कौन सा है?'
          },
          options: [
            { id: 'a', en: 'Gold', te: 'బంగారం', hi: 'सोना' },
            { id: 'b', en: 'Quartz', te: 'క్వార్ట్జ్', hi: 'क्वार्ट्ज' },
            { id: 'c', en: 'Diamond', te: 'వజ్రం', hi: 'हीरा' },
            { id: 'd', en: 'Iron', te: 'ఇనుము', hi: 'लोहा' }
          ],
          correct: 'c'
        }
      ],
      2: [
        {
          category: 'Geography',
          q: {
            en: 'Which is the longest river in the world?',
            te: 'ప్రపంచంలోనే అత్యంత పొడవైన నది ఏది?',
            hi: 'विश्व की सबसे लंबी नदी कौन सी है?'
          },
          options: [
            { id: 'a', en: 'Amazon', te: 'అమెజాన్', hi: 'अमेज़न' },
            { id: 'b', en: 'Nile', te: 'నైలు నది', hi: 'नील नदी' },
            { id: 'c', en: 'Yangtze', te: 'యాంగ్ట్జే', hi: 'यांग्त्ज़ी' },
            { id: 'd', en: 'Ganges', te: 'గంగా నది', hi: 'गंगा नदी' }
          ],
          correct: 'b'
        },
        {
          category: 'Geography',
          q: {
            en: 'What is the capital city of India?',
            te: 'భారతదేశ రాజధాని నగరం ఏది?',
            hi: 'भारत की राजधानी कौन सी है?'
          },
          options: [
            { id: 'a', en: 'Mumbai', te: 'ముంబై', hi: 'मुंबई' },
            { id: 'b', en: 'Kolkata', te: 'కోల్‌కతా', hi: 'कोलकाता' },
            { id: 'c', en: 'New Delhi', te: 'న్యూఢిల్లీ', hi: 'नई दिल्ली' },
            { id: 'd', en: 'Chennai', te: 'చెన్నై', hi: 'चेन्नई' }
          ],
          correct: 'c'
        },
        {
          category: 'Geography',
          q: {
            en: 'On which continent is the Amazon Rainforest located?',
            te: 'అమెజాన్ వర్షారణ్యం ఏ ఖండంలో ఉంది?',
            hi: 'अमेज़न वर्षावन किस महाद्वीप पर स्थित है?'
          },
          options: [
            { id: 'a', en: 'Africa', te: 'ఆఫ్రికా', hi: 'अफ्रीका' },
            { id: 'b', en: 'South America', te: 'దక్షిణ అమెరికా', hi: 'दक्षिण अमेरिका' },
            { id: 'c', en: 'Asia', te: 'ఆసియా', hi: 'एशिया' },
            { id: 'd', en: 'Australia', te: 'ఆస్ట్రేలియా', hi: 'ऑस्ट्रेलिया' }
          ],
          correct: 'b'
        }
      ],
      3: [
        {
          category: 'Technology',
          q: {
            en: 'Who is recognized as the inventor of the World Wide Web in 1989?',
            te: '1989లో వరల్డ్ వైడ్ వెబ్ (WWW)ను కనుగొన్నది ఎవరు?',
            hi: '1989 में वर्ल्ड वाइड वेब (WWW) का आविष्कार किसने किया था?'
          },
          options: [
            { id: 'a', en: 'Bill Gates', te: 'బిల్ గేట్స్', hi: 'बिल गेट्स' },
            { id: 'b', en: 'Steve Jobs', te: 'స్టీవ్ జాబ్స్', hi: 'स्टीव जॉब्स' },
            { id: 'c', en: 'Tim Berners-Lee', te: 'టిమ్ బెర్నర్స్-లీ', hi: 'टिम बर्नर्स-ली' },
            { id: 'd', en: 'Alan Turing', te: 'అలన్ ట్యూరింగ్', hi: 'एलन ट्यूरिंग' }
          ],
          correct: 'c'
        },
        {
          category: 'Computing',
          q: {
            en: 'In computer science, what does the acronym "RAM" stand for?',
            te: 'కంప్యూటర్ పరిభాషలో "RAM" అంటే ఏమిటి?',
            hi: 'कंप्यूटर विज्ञान में "RAM" का पूर्ण रूप क्या है?'
          },
          options: [
            { id: 'a', en: 'Rapid Action Module', te: 'రాపిడ్ యాక్షన్ మాడ్యూల్', hi: 'रैपिड एक्शन मॉड्यूल' },
            { id: 'b', en: 'Random Access Memory', te: 'రాండమ్ యాక్సెస్ మెమరీ', hi: 'रैंडम एक्सेस मेमोरी' },
            { id: 'c', en: 'Read Access Memory', te: 'రీడ్ యాక్సెస్ మెమరీ', hi: 'रीड एक्सेस मेमोरी' },
            { id: 'd', en: 'Real Array Module', te: 'రియల్ అర్రే మాడ్యూల్', hi: 'रियल एरे मॉड्यूल' }
          ],
          correct: 'b'
        },
        {
          category: 'Science',
          q: {
            en: 'Which gas constitutes approximately 78% of Earth’s atmosphere?',
            te: 'భూమి వాతావరణంలో దాదాపు 78% ఉండే వాయువు ఏది?',
            hi: 'पृथ्वी के वायुमंडल में लगभग 78% कौन सी गैस पाई जाती है?'
          },
          options: [
            { id: 'a', en: 'Oxygen', te: 'ఆక్సిజన్ (ప్రాణవాయువు)', hi: 'ऑक्सीजन' },
            { id: 'b', en: 'Carbon Dioxide', te: 'కార్బన్ డయాక్సైడ్', hi: 'कार्बन डाइऑक्साइड' },
            { id: 'c', en: 'Nitrogen', te: 'నైట్రోజన్', hi: 'नाइट्रोजन' },
            { id: 'd', en: 'Argon', te: 'ఆర్గాన్', hi: 'आर्गन' }
          ],
          correct: 'c'
        }
      ],
      4: [
        {
          category: 'History',
          q: {
            en: 'In which year did the Apollo 11 mission land humans on the Moon?',
            te: 'అపోలో 11 ద్వారా మానవుడు చంద్రునిపై మొదటిసారి అడుగుపెట్టిన సంవత్సరం ఏది?',
            hi: 'अपोलो 11 मिशन के तहत चंद्रमा पर पहली बार मानव किस वर्ष उतरा था?'
          },
          options: [
            { id: 'a', en: '1965', te: '1965', hi: '1965' },
            { id: 'b', en: '1969', te: '1969', hi: '1969' },
            { id: 'c', en: '1972', te: '1972', hi: '1972' },
            { id: 'd', en: '1981', te: '1981', hi: '1981' }
          ],
          correct: 'b'
        },
        {
          category: 'Physics',
          q: {
            en: 'What is the approximate speed of light in a vacuum?',
            te: 'శూన్యంలో కాంతి వేగం సుమారు ఎంత?',
            hi: 'निर्वात में प्रकाश की अनुमानित गति कितनी होती है?'
          },
          options: [
            { id: 'a', en: '30,000 km/s', te: 'సెకనుకు 30,000 కి.మీ', hi: '30,000 किमी/सेकंड' },
            { id: 'b', en: '150,000 km/s', te: 'సెకనుకు 1,50,000 కి.మీ', hi: '1,50,000 किमी/सेकंड' },
            { id: 'c', en: '300,000 km/s', te: 'సెకనుకు 3,00,000 కి.మీ', hi: '3,00,000 किमी/सेकंड' },
            { id: 'd', en: '1,000,000 km/s', te: 'సెకనుకు 10,00,000 కి.మీ', hi: '10,00,000 किमी/सेकंड' }
          ],
          correct: 'c'
        },
        {
          category: 'Ancient Wonders',
          q: {
            en: 'Which ancient wonder of the world remains largely intact today?',
            te: 'పురాతన ప్రపంచ వింతలలో నేటికీ చెక్కుచెదరకుండా నిలిచి ఉన్నది ఏది?',
            hi: 'प्राचीन विश्व के सात अजूबों में से कौन सा आज भी अधिकांशतः सुरक्षित है?'
          },
          options: [
            { id: 'a', en: 'Great Pyramid of Giza', te: 'గిజా మహా పిరమిడ్', hi: 'गीज़ा का महान पिरामिड' },
            { id: 'b', en: 'Colossus of Rhodes', te: 'రోడ్స్ కాంస్య విగ్రహం', hi: 'रोड्स का कोलोसस' },
            { id: 'c', en: 'Lighthouse of Alexandria', te: 'అలెగ్జాండ్రియా లైట్‌హౌస్', hi: 'सिकंदरिया का प्रकाशस्तंभ' },
            { id: 'd', en: 'Hanging Gardens of Babylon', te: 'బాబిలోన్ వేలాడే తోటలు', hi: 'बेबीलोन के झूलते बगीचे' }
          ],
          correct: 'a'
        }
      ],
      5: [
        {
          category: 'Riddle',
          q: {
            en: 'Riddle: What has keys but cannot open locks, has space but no room, and allows you to enter but not walk in?',
            te: 'పొడుపుకథ: కీలు ఉంటాయి కానీ తాళాలు తెరవలేవు, స్పేస్ ఉంటుంది కానీ గది కాదు, ఎంటర్ చేయవచ్చు కానీ నడవలేము. అది ఏమిటి?',
            hi: 'पहेली: जिसके पास कुंजियाँ हैं पर ताले नहीं खोल सकती, स्पेस है पर कमरा नहीं, एंटर कर सकते हैं पर अंदर जा नहीं सकते?'
          },
          options: [
            { id: 'a', en: 'Piano', te: 'పియానో', hi: 'पियानो' },
            { id: 'b', en: 'Keyboard', te: 'కీబోర్డ్ (Keyboard)', hi: 'कीबोर्ड' },
            { id: 'c', en: 'Treasure Chest', te: 'నిధుల పెట్టె', hi: 'खजाने की पेटी' },
            { id: 'd', en: 'Smartphone', te: 'స్మార్ట్‌ఫోన్', hi: 'स्मार्टफोन' }
          ],
          correct: 'b'
        },
        {
          category: 'Human Biology',
          q: {
            en: 'Which human organ uses approximately 20% of the body’s total energy despite being 2% of body mass?',
            te: 'శరీర బరువులో కేవలం 2% మాత్రమే ఉంటూ మొత్తం శక్తిలో దాదాపు 20% వినియోగించే అవయవం ఏది?',
            hi: 'मानव शरीर का वह अंग जो कुल वजन का केवल 2% होकर भी शरीर की लगभग 20% ऊर्जा की खपत करता है?'
          },
          options: [
            { id: 'a', en: 'Heart', te: 'గుండె', hi: 'हृदय' },
            { id: 'b', en: 'Brain', te: 'మెదడు', hi: 'मस्तिष्क' },
            { id: 'c', en: 'Liver', te: 'కాలేయం', hi: 'यकृत' },
            { id: 'd', en: 'Lungs', te: 'ఊపిరితిత్తులు', hi: 'फेफड़े' }
          ],
          correct: 'b'
        },
        {
          category: 'Riddle',
          q: {
            en: 'Riddle: I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?',
            te: 'పొడుపుకథ: నోరు లేకుండా మాట్లాడతాను, చెవులు లేకుండా వింటాను. శరీరం లేదు కానీ గాలితో జీవిస్తాను. నేను ఎవరిని?',
            hi: 'पहेली: बिना मुँह के बोलता हूँ, बिना कान के सुनता हूँ। कोई शरीर नहीं, पर हवा के साथ जीवित हो जाता हूँ। मैं क्या हूँ?'
          },
          options: [
            { id: 'a', en: 'Echo', te: 'ప్రతిధ్వని', hi: 'गूँज (Echo)' },
            { id: 'b', en: 'Shadow', te: 'నీడ', hi: 'परछाईं' },
            { id: 'c', en: 'Cloud', te: 'మేఘం', hi: 'बादल' },
            { id: 'd', en: 'Whistle', te: 'ఈల', hi: 'सीटी' }
          ],
          correct: 'a'
        }
      ]
    };

    this.questions = questionsByLevel[this.level] || questionsByLevel[1];
    this.currentQIdx = 0;
    this.timeLimit = 45;
    this.maxScore = 1000;
  }

  renderCurrentQuestion() {
    const playArea = this.container.querySelector('#game-play-area');
    const qData = this.questions[this.currentQIdx];
    const lang = i18n.getLanguage();

    const questionText = qData.q[lang] || qData.q['en'];

    playArea.innerHTML = `
      <div class="knowledge-container">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span class="question-badge">${qData.category}</span>
          <span style="font-size: 0.8rem; color: var(--text-dim); font-weight: 600;">
            ${this.currentQIdx + 1} / ${this.questions.length}
          </span>
        </div>

        <div class="glass-card" style="padding: 20px;">
          <h3 class="question-text">${questionText}</h3>
        </div>

        <div class="quiz-options">
          ${qData.options.map(opt => {
            const optText = opt[lang] || opt['en'];
            return `
              <button class="quiz-option" data-option-id="${opt.id}">
                <span class="quiz-letter">${opt.id.toUpperCase()}</span>
                <span>${optText}</span>
              </button>
            `;
          }).join('')}
        </div>
      </div>
    `;

    // Attach option handlers
    playArea.querySelectorAll('.quiz-option').forEach(btn => {
      btn.addEventListener('click', () => {
        const selectedId = btn.getAttribute('data-option-id');
        this.handleOptionSelect(selectedId, btn);
      });
    });
  }

  handleOptionSelect(selectedId, btnEl) {
    if (this.isPaused || this.isOver) return;

    this.totalAttempts++;
    const qData = this.questions[this.currentQIdx];
    const isCorrect = selectedId === qData.correct;

    // Disable all options temporarily
    const playArea = this.container.querySelector('#game-play-area');
    playArea.querySelectorAll('.quiz-option').forEach(b => {
      b.style.pointerEvents = 'none';
      if (b.getAttribute('data-option-id') === qData.correct) {
        b.classList.add('correct');
      }
    });

    if (isCorrect) {
      sound.playSuccess();
      this.correctCount++;
      this.addScore(300);

      setTimeout(() => {
        this.currentQIdx++;
        if (this.currentQIdx < this.questions.length) {
          this.renderCurrentQuestion();
        } else {
          this.endGame(true);
        }
      }, 700);
    } else {
      sound.playError();
      btnEl.classList.add('incorrect');
      this.resetCombo();
      this.score = Math.max(0, this.score - 50);
      this.updateHud();

      setTimeout(() => {
        this.currentQIdx++;
        if (this.currentQIdx < this.questions.length) {
          this.renderCurrentQuestion();
        } else {
          this.endGame(this.correctCount >= 2);
        }
      }, 900);
    }
  }
}
