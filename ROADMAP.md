# Night Mode Pro – Product Roadmap

This document outlines upcoming feature iterations and planned architectural enhancements for Night Mode Pro.

---

## 🚀 Version 1.1 (Next Release)

### 1. Contrast Auto-Learning per Site
- **Dynamic Contrast Optimization**: Automatically analyze foreground-to-background contrast ratios using WCAG AA/AAA calculations on visited pages.
- **Smart Adjustment**: If a website has poor readability (e.g. gray-on-gray low-contrast text), automatically boost contrast locally by +15% without user intervention.

### 2. Scheduled Themes per Website
- **Site-Specific Schedules**: Allow users to set independent schedules for work vs entertainment sites (e.g., auto-dark on `jira.com` only after 18:00, but dark mode always active on `reddit.com`).

### 3. Mobile Chromium Support (Kiwi Browser & Microsoft Edge Android)
- **Mobile Viewport Optimization**: Ensure the popup and options UI scale seamlessly to smaller mobile screens when run on Kiwi Browser or Chromium-based mobile extensions.
- **Touch-Friendly Controls**: Enhanced touch targets and haptic feedback simulation on slider drags.

### 4. Font & Typography Enhancements
- **Nighttime Reading Font Override**: Optional toggle to apply ultra-readable dyslexic-friendly or serif night fonts (e.g., Merriweather, Atkinson Hyperlegible) to article body text.
- **Font Weight Boost**: Subtle stroke/weight boost for thin web fonts that can become difficult to read on deep dark backgrounds.

---

## 🔮 Version 1.2+ (Future Vision)

- **Sync Across Devices via Cloudflare KV / Encrypted Sync**: Optional end-to-end encrypted sync for users who want multi-browser parity across Chrome, Brave, and Edge.
- **Custom CSS Injector for Power Users**: Per-site custom CSS rules tab with instant syntax highlighting for surgical page styling.
- **Color Temperature Presets**: Kelvin-based color temperature controls (e.g., 2700K Candlelight, 3400K Sunset, 4500K Fluorescent).
