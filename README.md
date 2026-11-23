# MINDVERSE — Brain & Knowledge Arcade
> **Enter. Observe. Think. Play.**  
> Platform: Mobile-first Web App + PWA | Budget: ₹0 | Architecture: Offline-first | Game Count: 5 | Languages: Telugu, English, Hindi

---

## 1. Product Vision & Architecture

MINDVERSE is an instant, QR-accessible cognitive arcade built for visitors.  
- **Instant Entry:** Visitors scan one permanent QR code and enter directly in their mobile browser.
- **Zero Friction:** No account creation, no registration, no phone numbers, and no personal data collection.
- **Offline-First Resilience:** Once cached on the first visit, the entire app shell, all 5 games, translations, audio effects, and progression persist locally via **Service Worker** and **IndexedDB**.
- **₹0 Budget Tech Stack:** 100% free open-source architecture with zero mandatory paid services, zero external APIs, and procedural Web Audio API synthesis that requires zero audio file downloads.

---

## 2. The 5 Games (25 Progressive Levels)

| # | Arena | Focus & Mechanics | Levels | Progression |
|---|---|---|---|---|
| **1** | **Observation Master** | Visual attention, difference detection, subtle geometric anomaly hunting. | 5 Levels | 1 anomaly (45s) → 4 anomalies with fine visual nuances (25s) |
| **2** | **Memory Match** | Spatial card pairing, 3D card flips, combo multiplier. | 5 Levels | 3 pairs (3x2 grid, 40s) → 10 pairs (4x5 grid, 60s) |
| **3** | **Logic Detective** | Pattern sequences, mathematical logic, prime squares, Fibonacci & alternating series. | 5 Levels | Basic step additions → Two-step multiplicative & exponential logic |
| **4** | **Knowledge Quest** | Interactive science, tech, astronomy, geography, history & brain riddles. | 5 Levels | Everyday nature & astronomy → Thought-provoking riddles & bio-mechanics |
| **5** | **Mind Reset** | Focus rhythms, reaction time latency test (<350ms), Go/No-Go inhibitory control. | 5 Levels | Harmonic rhythm tap → Reaction speed → Red trap inhibition → Rhythmic equilibrium |

---

## 3. Trilingual Localization

Full human-accurate language coverage across all screens, buttons, game instructions, options, and results:
- **English** (`en`)
- **Telugu (తెలుగు)** (`te`) — e.g., "ప్రవేశించండి. గమనించండి. ఆలోచించండి. ఆడండి."
- **Hindi (हिन्दी)** (`hi`) — e.g., "प्रवेश करें। ध्यान दें। सोचें। खेलें।"

Language selection is available on the welcome screen, via the top header button at any time, or in settings.

---

## 4. Private Owner Portal & Anonymous Analytics

- **Protected Access:** Accessible via the bottom navigation bar or top header with an owner PIN (Default: `2026`, changeable inside the dashboard).
- **Privacy-Safe Metrics:**
  - **Recorded Visits:** Landing page visits logged locally and queued.
  - **Total Recorded Plays:** Completed game sessions.
  - **Completion Rate:** Percentage of started sessions that were completed.
  - **Average Session Duration:** Duration calculated in seconds.
  - **Most Popular Arena:** Real-time calculation of highest played game.
  - **Daily Statistics (Last 7 Days):** Activity trend histogram.
  - **Game-Wise Performance:** Level breakdown bars.
- **Offline Queue & Sync Architecture:** All anonymous analytics records are queued in IndexedDB store `analyticsQueue`. When online, records can sync to any designated webhook/endpoint without transmitting personal identifiers.

---

## 5. Permanent QR Code Deliverables

Pre-generated high-resolution QR assets are stored in `qr-codes/`:
- **High-Resolution PNG:** [`qr-codes/mindverse-qr.png`](file:///C:/Users/navee/AI-Workspaces/MINDVERSE/qr-codes/mindverse-qr.png) (1200x1200px, crisp white background, black modules, quiet zone, error correction level H).
- **Print-Ready A4 Poster (PDF):** [`qr-codes/mindverse-qr-print.pdf`](file:///C:/Users/navee/AI-Workspaces/MINDVERSE/qr-codes/mindverse-qr-print.pdf) (Centered QR code, MINDVERSE branding, clear margins, print-ready typography).
- **Dynamic In-App Exports:** The Owner Dashboard allows changing the destination URL (e.g. to a production domain like `https://mindverse.app`) and downloading updated PNG and PDF exports on the fly.

---

## 6. How to Run & Deploy

### Development:
```bash
pnpm install
pnpm run dev
```

### Production Build:
```bash
pnpm run build
```
Generates the optimized static PWA in `dist/`.

### Preview Production Build:
```bash
pnpm run preview
```

### Regenerate QR Assets:
```bash
pnpm run generate-qr
```

---

## 7. Permanent ₹0 Hosting Guide

To host MINDVERSE with a stable, permanent URL under ₹0 budget:
1. **GitHub Pages (Free):**
   - Push repository to GitHub.
   - Set GitHub Pages source to `/dist` or GitHub Actions.
   - Custom domain (e.g. `arcade.yourdomain.com`) or free `username.github.io/mindverse`.
2. **Cloudflare Pages (Free, Unlimited Bandwidth):**
   - Connect repository to Cloudflare Pages.
   - Build command: `pnpm run build`, Output directory: `dist`.
   - Free custom SSL and permanent URL.
3. **Configure Permanent Destination URL:**
   - Once deployed, log in to the Private Owner Dashboard (PIN: `2026`), paste the production URL, click **Save**, and download your final permanent QR PNG and print-ready A4 poster PDF!
