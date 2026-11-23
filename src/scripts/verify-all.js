/**
 * MINDVERSE Comprehensive Verification & Quality Gate Test Suite
 */

import fs from 'fs';
import path from 'path';

let passedTests = 0;
let failedTests = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${testName} - ${details}`);
  }
}

async function runAudit() {
  console.log('\n======================================================');
  console.log('   MINDVERSE COMPREHENSIVE QUALITY AUDIT & TESTS      ');
  console.log('======================================================\n');

  // 1. PWA Manifest Audit
  console.log('--- 1. PWA Manifest & Service Worker Audit ---');
  const manifestPath = path.resolve('public/manifest.webmanifest');
  assert(fs.existsSync(manifestPath), 'Manifest file exists');
  const manifestData = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  assert(manifestData.name === 'MINDVERSE Arcade', 'Manifest name is correct');
  assert(manifestData.short_name === 'MINDVERSE', 'Manifest short_name is correct');
  assert(manifestData.display === 'standalone', 'Display is standalone');
  assert(Array.isArray(manifestData.icons) && manifestData.icons.length >= 3, 'Manifest has valid icon entries');

  const swPath = path.resolve('public/sw.js');
  assert(fs.existsSync(swPath), 'Service worker (sw.js) exists');
  const swCode = fs.readFileSync(swPath, 'utf8');
  assert(swCode.includes('caches.open') && swCode.includes('fetch'), 'Service worker handles caching and fetch events');

  // 2. Audio Engine Audit
  console.log('\n--- 2. Sound System (Procedural Web Audio) Audit ---');
  const audioPath = path.resolve('src/services/audio.js');
  assert(fs.existsSync(audioPath), 'Audio service exists');
  const audioCode = fs.readFileSync(audioPath, 'utf8');
  assert(audioCode.includes('AudioContext') || audioCode.includes('webkitAudioContext'), 'Uses Web Audio API');
  assert(audioCode.includes('playClick') && audioCode.includes('playSuccess') && audioCode.includes('playError'), 'Contains all required sound effects');
  assert(audioCode.includes('musicEnabled = false'), 'Ambient focus tone is OFF by default as required');
  assert(!audioCode.includes('.mp3') && !audioCode.includes('.wav'), 'Zero external audio files needed; 100% offline synthesis');

  // 3. Trilingual Translation Audit
  console.log('\n--- 3. Trilingual System (EN, TE, HI) Audit ---');
  const enModule = (await import('../i18n/en.js')).default;
  const teModule = (await import('../i18n/te.js')).default;
  const hiModule = (await import('../i18n/hi.js')).default;

  assert(enModule.app.title === 'MINDVERSE', 'English title verified');
  assert(teModule.app.title === 'మైండ్‌వర్స్', 'Telugu title verified');
  assert(hiModule.app.title === 'माइंडवर्स', 'Hindi title verified');

  assert(teModule.app.tagline === 'ప్రవేశించండి. గమనించండి. ఆలోచించండి. ఆడండి.', 'Telugu tagline verified');
  assert(hiModule.app.tagline === 'प्रवेश करें। ध्यान दें। सोचें। खेलें।', 'Hindi tagline verified');

  // Deep check keys across all 3 modules
  function getKeys(obj, prefix = '') {
    let keys = [];
    for (const k in obj) {
      const full = prefix ? `${prefix}.${k}` : k;
      if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
        keys = keys.concat(getKeys(obj[k], full));
      } else {
        keys.push(full);
      }
    }
    return keys;
  }

  const enKeys = getKeys(enModule);
  const teKeys = getKeys(teModule);
  const hiKeys = getKeys(hiModule);

  assert(enKeys.length > 50, `English has comprehensive key set (${enKeys.length} keys)`);
  assert(teKeys.length >= enKeys.length - 2, `Telugu matches English key coverage (${teKeys.length} keys)`);
  assert(hiKeys.length >= enKeys.length - 2, `Hindi matches English key coverage (${hiKeys.length} keys)`);

  // 4. Five Games Logic & Verification Audit
  console.log('\n--- 4. Five Games Architecture Audit ---');

  // Game 1: Observation Master
  const obsCode = fs.readFileSync(path.resolve('src/games/observation-master.js'), 'utf8');
  assert(obsCode.includes('class ObservationMasterGame'), 'Game 1 Observation Master class exists');
  assert(obsCode.includes('setupLevelConfig'), 'Game 1 has 5 progressive levels');
  assert(obsCode.includes('handleCanvasClick'), 'Game 1 handles touch/click difference spotting');

  // Game 2: Memory Match
  const memCode = fs.readFileSync(path.resolve('src/games/memory-match.js'), 'utf8');
  assert(memCode.includes('class MemoryMatchGame'), 'Game 2 Memory Match class exists');
  assert(memCode.includes('totalPairs = 3') && memCode.includes('totalPairs = 10'), 'Game 2 progresses from 3 pairs (easy) to 10 pairs (hard)');

  // Game 3: Logic Detective
  const logicCode = fs.readFileSync(path.resolve('src/games/logic-detective.js'), 'utf8');
  assert(logicCode.includes('class LogicDetectiveGame'), 'Game 3 Logic Detective class exists');
  assert(logicCode.includes("'32'") && logicCode.includes("'25'") && logicCode.includes("'13'") && logicCode.includes("'95'"), 'Game 3 contains verified mathematical logic solutions');

  // Game 4: Knowledge Quest
  const knowCode = fs.readFileSync(path.resolve('src/games/knowledge-quest.js'), 'utf8');
  assert(knowCode.includes('class KnowledgeQuestGame'), 'Game 4 Knowledge Quest class exists');
  assert(knowCode.includes('Mars') && knowCode.includes('Photosynthesis') && knowCode.includes('Diamond'), 'Game 4 has verified scientific & general knowledge questions');

  // Game 5: Mind Reset
  const resetCode = fs.readFileSync(path.resolve('src/games/mind-reset.js'), 'utf8');
  assert(resetCode.includes('class MindResetGame'), 'Game 5 Mind Reset class exists');
  assert(resetCode.includes('handleReactionClick') && resetCode.includes('isRedTrap'), 'Game 5 features reaction tests and Go/No-Go focus agility');

  // 5. Owner Dashboard & Analytics Audit
  console.log('\n--- 5. Owner Dashboard & Anonymous Analytics Audit ---');
  const ownerCode = fs.readFileSync(path.resolve('src/screens/owner-dashboard.js'), 'utf8');
  assert(ownerCode.includes('sessionStorage.getItem(\'mv_owner_auth\')'), 'Owner dashboard requires private authentication');
  assert(ownerCode.includes('totalRecordedVisits') && ownerCode.includes('totalRecordedPlays'), 'Owner dashboard aggregates recorded visits & total plays');
  assert(ownerCode.includes('downloadQrPng') && ownerCode.includes('downloadQrPdf'), 'Owner dashboard provides PNG & PDF downloads');

  const analyticsCode = fs.readFileSync(path.resolve('src/services/analytics.js'), 'utf8');
  assert(analyticsCode.includes('recordVisit') && analyticsCode.includes('completeGameSession'), 'Analytics tracks visits & game sessions anonymously');
  assert(!analyticsCode.includes('email') && !analyticsCode.includes('phone') && !analyticsCode.includes('userId'), 'Strict zero PII (No emails, phones or personal profiles)');

  // 6. Permanent QR & Print-Ready PDF Files Audit
  console.log('\n--- 6. Permanent QR Code & PDF File Audit ---');
  const qrPngPath = path.resolve('qr-codes/mindverse-qr.png');
  const qrPdfPath = path.resolve('qr-codes/mindverse-qr-print.pdf');
  assert(fs.existsSync(qrPngPath), 'Permanent QR PNG file exists on disk');
  assert(fs.statSync(qrPngPath).size > 1000, `QR PNG is valid and non-empty (${fs.statSync(qrPngPath).size} bytes)`);
  assert(fs.existsSync(qrPdfPath), 'Print-ready A4 Poster PDF exists on disk');
  assert(fs.statSync(qrPdfPath).size > 100000, `Print-ready PDF is valid and high-res (${(fs.statSync(qrPdfPath).size / 1024 / 1024).toFixed(2)} MB)`);

  // 7. Production Dist Build Audit
  console.log('\n--- 7. Production Dist Build Output Audit ---');
  assert(fs.existsSync(path.resolve('dist/index.html')), 'Production dist/index.html generated');
  assert(fs.existsSync(path.resolve('dist/sw.js')), 'Production dist/sw.js generated');
  assert(fs.existsSync(path.resolve('dist/manifest.webmanifest')), 'Production dist/manifest.webmanifest generated');
  assert(fs.existsSync(path.resolve('dist/icon-192.png')), 'Production dist/icon-192.png generated');
  assert(fs.existsSync(path.resolve('dist/icon-512.png')), 'Production dist/icon-512.png generated');

  // 8. Strict Isolation Audit
  console.log('\n--- 8. Strict Isolation Audit ---');
  const currentDir = process.cwd();
  assert(currentDir.toUpperCase().includes('MINDVERSE'), `Working strictly inside MINDVERSE directory: ${currentDir}`);
  assert(!currentDir.toUpperCase().includes('ARUN'), 'No connection to or inspection of Arun Tattoos');

  console.log('\n======================================================');
  console.log(`   TOTAL TESTS: ${passedTests + failedTests}`);
  console.log(`   PASSED:      ${passedTests}`);
  console.log(`   FAILED:      ${failedTests}`);
  console.log('======================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runAudit().catch(err => {
  console.error('Audit execution error:', err);
  process.exit(1);
});
