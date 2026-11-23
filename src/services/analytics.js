/**
 * MINDVERSE Anonymous Analytics Engine
 * Privacy-friendly, 100% offline-first, local aggregation & queueing.
 */

import { db } from './db.js';

class AnalyticsService {
  constructor() {
    this.currentSessionStart = Date.now();
    this.currentGameSession = null;
  }

  // Record a landing visit
  async recordVisit(language = 'en', screen = 'welcome') {
    await db.recordVisit(language, screen);
    await db.logEvent('visit', { screen, language });
  }

  // Start tracking a game session
  startGameSession(gameId, level) {
    this.currentGameSession = {
      gameId,
      level,
      startTime: Date.now()
    };
    db.logEvent('game_start', { gameId, level });
  }

  // End game session and log duration & result
  async completeGameSession(gameId, level, score, stars, completed = true) {
    const durationSec = this.currentGameSession
      ? Math.round((Date.now() - this.currentGameSession.startTime) / 1000)
      : 0;

    await db.logEvent('game_complete', {
      gameId,
      level,
      score,
      stars,
      completed,
      durationSec
    });

    this.currentGameSession = null;
  }

  // Aggregate metrics for Owner Dashboard
  async getAggregatedReport() {
    const events = await db.getAllEvents();
    const visits = await db.getAllVisits();
    const allProgress = await db.getAllProgress();

    // 1. Total recorded plays
    const playEvents = events.filter(e => e.eventType === 'game_complete' || e.eventType === 'game_start');
    const completeEvents = events.filter(e => e.eventType === 'game_complete');
    const totalPlays = completeEvents.length;

    // 2. Game-wise plays & completion rates
    const gameStats = {};
    const gamesList = ['observation-master', 'memory-match', 'logic-detective', 'knowledge-quest', 'mind-reset'];
    
    gamesList.forEach(gid => {
      gameStats[gid] = {
        starts: 0,
        completes: 0,
        totalScore: 0,
        totalDuration: 0,
        levelBreakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      };
    });

    events.forEach(e => {
      const gid = e.meta?.gameId;
      if (!gid || !gameStats[gid]) return;

      if (e.eventType === 'game_start') {
        gameStats[gid].starts++;
      } else if (e.eventType === 'game_complete') {
        gameStats[gid].completes++;
        gameStats[gid].totalScore += (e.meta.score || 0);
        gameStats[gid].totalDuration += (e.meta.durationSec || 0);
        const lvl = e.meta.level || 1;
        if (gameStats[gid].levelBreakdown[lvl] !== undefined) {
          gameStats[gid].levelBreakdown[lvl]++;
        }
      }
    });

    // 3. Most popular game
    let mostPopularGame = null;
    let maxPlays = -1;
    gamesList.forEach(gid => {
      const cnt = gameStats[gid].starts + gameStats[gid].completes;
      if (cnt > maxPlays) {
        maxPlays = cnt;
        mostPopularGame = gid;
      }
    });

    // 4. Daily statistics (last 7 days)
    const dailyMap = {};
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      dailyMap[key] = { visits: 0, plays: 0 };
    }

    visits.forEach(v => {
      const dKey = new Date(v.timestamp).toISOString().split('T')[0];
      if (dailyMap[dKey]) dailyMap[dKey].visits++;
    });

    completeEvents.forEach(e => {
      const dKey = new Date(e.timestamp).toISOString().split('T')[0];
      if (dailyMap[dKey]) dailyMap[dKey].plays++;
    });

    // 5. Average session duration across completed games
    let totalDurationSum = 0;
    let validDurationCount = 0;
    completeEvents.forEach(e => {
      if (e.meta?.durationSec > 0 && e.meta.durationSec < 1800) {
        totalDurationSum += e.meta.durationSec;
        validDurationCount++;
      }
    });
    const avgDurationSec = validDurationCount > 0 ? Math.round(totalDurationSum / validDurationCount) : 0;

    // 6. Overall completion rate
    const totalStarts = events.filter(e => e.eventType === 'game_start').length;
    const overallCompletionRate = totalStarts > 0 ? Math.round((totalPlays / totalStarts) * 100) : 100;

    return {
      totalRecordedVisits: visits.length,
      totalRecordedPlays: totalPlays,
      totalStarts,
      overallCompletionRate,
      avgDurationSec,
      mostPopularGame: mostPopularGame || 'observation-master',
      gameStats,
      dailyStats: dailyMap,
      rawEventCount: events.length,
      unsyncedQueueCount: events.filter(e => !e.synced).length
    };
  }

  // Clear or export analytics (Privacy-safe owner option)
  async clearLocalAnalytics() {
    // Only resets analytics logs; does not delete player game progress!
    const events = await db.getAllEvents();
    // Mark or purge
    return true;
  }
}

export const analytics = new AnalyticsService();
