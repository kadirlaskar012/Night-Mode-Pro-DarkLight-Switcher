# Night Mode Pro – Dark/Light Switcher 🌙

[![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue.svg)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![Framework](https://img.shields.io/badge/Framework-WXT%20%2B%20React%2018-indigo.svg)](https://wxt.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-Commercial%20Freemium-emerald.svg)](LICENSE-SETUP.md)

**Night Mode Pro** is a commercial, production-ready Chrome Extension (Manifest V3) that converts any website to a high-contrast dark mode in one click. Features fine eye-comfort controls, warm blue-light circadian filters, smart media re-inversion (keeping photos, videos, and canvas in true colors), astronomical sunrise/sunset solar sync, per-site overrides, and an integrated lifetime licensing system via Lemon Squeezy or Gumroad.

---

## 🚀 Key Features

- **Smart Invert Engine**: Color-inverts backgrounds and text while automatically protecting `<img>`, `<video>`, `<picture>`, `<canvas>`, `<svg>`, `<iframe>`, and elements with CSS background images.
- **Filter-Only Alternative Engine**: Gentle non-inverting dimmer and warm overlay for sites that break under inversion.
- **Zero White Flash**: Pre-paint stylesheet injection at `document_start` eliminates glare during page loads.
- **Warm Circadian Filter**: Amber blue-light barrier to protect melatonin levels and eye health.
- **Astronomical Solar Sync**: Automatically shifts to dark mode at local sunset and returns to daylight mode at sunrise.
- **Presets**: Night (Free), Reading, Deep Night, OLED Black, plus unlimited custom saved presets.
- **Site Rules & Overrides**: Wildcard whitelist and blacklist support (`*.youtube.com`, `github.com/*`) plus per-site brightness and warm overrides.
- **Keyboard Shortcuts**:
  - `Alt + D`: Toggle dark mode on current tab (Free)
  - `Alt + Shift + D`: Global toggle on all open tabs (Pro)
  - `Alt + ↑` / `Alt + ↓`: Increase or decrease brightness by 5% (Pro)
- **Multi-Language (i18n)**: English (`en`), Bangla (`bn`), Hindi (`hi`), Spanish (`es`).
- **Commercial Freemium Model**: Generous 7-day free trial, non-intrusive upgrade modal, one-time lifetime purchase ($2.99), and offline grace period.

---

## 📂 Project Structure

```
.
├── entrypoints/
│   ├── background.ts                 # Service worker: alarms, badge, shortcuts, license revalidation
│   ├── content/index.ts              # Content script: run_at document_start, all_frames, dynamic DOM observer
│   ├── popup/                        # 340px React popup UI
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.html
│   ├── options/                      # 7-tab full-page React options dashboard
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.html
│   └── onboarding/                   # First-install 3-step onboarding page
│       ├── App.tsx
│       ├── main.tsx
│       └── index.html
├── src/
│   ├── components/                   # Modular UI components (Sliders, ModeSelector, Modals, Tabs)
│   ├── constants/
│   │   ├── defaults.ts               # Default settings & built-in presets
│   │   └── pricing.ts                # Single source of truth for pricing, URLs & provider configs
│   ├── lib/
│   │   ├── engine.ts                 # CSS generation, DOM inversion, luminance detection & flash prevention
│   │   ├── license.ts                # Lemon Squeezy & Gumroad adapters, trial & isPro logic
│   │   ├── matcher.ts                # Wildcard pattern matching (*.youtube.com)
│   │   ├── schedule.ts               # Astronomical solar math & time range evaluation
│   │   ├── storage.ts                # chrome.storage.sync & local abstractions
│   │   └── i18n.ts                   # Internationalization helpers
│   ├── public/
│   │   ├── _locales/                 # en, bn, hi, es translation dictionaries
│   │   └── icons/                    # 16, 32, 48, 128 PNGs & SVG logo
│   └── style.css                     # Tailwind CSS entrypoint
├── tests/                            # Vitest unit test suite (matcher, schedule, license)
├── promo/                            # 1280x800 screenshots, 440x280 tile, 1400x560 marquee templates
├── landing/                          # Standalone responsive landing page (Tailwind)
├── STORE-LISTING.md                  # Complete Chrome Web Store copy & metadata
├── PRIVACY-POLICY.html               # Plain HTML Privacy Policy
├── LICENSE-SETUP.md                  # Payment gateway integration guide
├── CHANGELOG.md                      # Version release history
├── ROADMAP.md                        # v1.1 & v1.2 planned features
└── LAUNCH-CHECKLIST.md               # Publishing & customer acquisition guide
```

---

## 🛠️ Development & Build Commands

### 1. Prerequisites
- Node.js `v18+` or `v20+` or `v24+`
- npm `v9+` or `v11+`

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
WXT will automatically launch a clean Chrome profile with hot module reloading (HMR) enabled.

### 4. Run Unit Tests
```bash
npm test
```
Executes the Vitest test suite covering pattern matching, solar calculations, time ranges, and licensing rules.

### 5. Production Build
```bash
npm run build
```
Generates the fully optimized Manifest V3 extension bundle in `.output/chrome-mv3`.

### 6. Create Web Store ZIP
```bash
npm run zip
```
Creates a distribution-ready `.output/night-mode-pro-1.0.0.zip` ready for upload to the Chrome Web Store Developer Console.

---

## 🖥️ How to Load Unpacked in Chrome / Edge / Brave

1. Run `npm run build`.
2. Open your Chromium browser and navigate to:
   - Chrome: `chrome://extensions`
   - Edge: `edge://extensions`
   - Brave: `brave://extensions`
3. Enable **Developer mode** toggle in the top-right corner.
4. Click **Load unpacked**.
5. Select the `.output/chrome-mv3` folder inside this project directory.
6. The extension is now installed! Pin "Night Mode Pro" to your toolbar and click it on any website.

---

## 🔒 Security & Privacy Architecture

- **Zero Remote Code**: Meets 100% of Google Manifest V3 security requirements. No `eval()`, no external script injection.
- **Zero Analytics**: No third-party analytics trackers, no telemetry, no cookies.
- **Provider-Agnostic Licensing**: Public validation endpoints only. No secret API keys are ever bundled in the extension client.

---

## 📄 License

Commercial Freemium software. Developed by the pair programming team for Night Mode Pro.
See [LICENSE-SETUP.md](LICENSE-SETUP.md) for commercial setup instructions.
