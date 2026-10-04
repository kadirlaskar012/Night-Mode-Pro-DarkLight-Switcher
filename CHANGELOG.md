# Changelog

All notable changes to **Night Mode Pro** are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-10-04

### Added
- **Core Dark Engine**:
  - High-performance Smart Invert Engine with automatic reverse filtering for images, videos, canvas, SVGs, and background images.
  - Speculative pre-paint stylesheet injection at `document_start` to eliminate white flash during page loads.
  - Filter-Only alternative engine for delicate websites that do not tolerate color inversion.
  - Dynamic content observation with `requestAnimationFrame`-throttled MutationObserver supporting open Shadow DOM trees.
  - Auto-detection of websites that already possess a native dark theme (via `meta[name="color-scheme"]` and luminance analysis).
  - Fullscreen video handling to disable active filters automatically when entering fullscreen.
  - Print stylesheet handling to preserve white paper backgrounds during print dialogs.
- **Popup Interface**:
  - Compact 340px responsive React UI with light/dark adaptive styling.
  - Master glowing toggle button for instant power ON/OFF.
  - Segmented control for Light, Dark, and Auto modes.
  - Active site indicator card with per-site override toggle and "Already dark" detection chip.
  - Fine-grained sliders for Brightness, Warm Light Filter, Contrast, and Grayscale.
  - Built-in presets: Night (free), Reading (Pro), Deep Night (Pro), OLED Black (Pro).
  - Modal for saving and naming custom presets.
- **Full Options Page**:
  - 7 comprehensive management tabs: General, Schedule, Sites, Presets, Shortcuts, License, About.
  - Automated scheduling: custom daily time window, offline astronomical sunrise/sunset solar calculation, and system theme mirroring.
  - Interactive 24-hour visual timeline preview.
  - Domain rules manager: wildcard whitelist and blacklist (`*.youtube.com`, `github.com/*`), search filter, and bulk import.
  - Keyboard shortcuts table and deep link to Chrome shortcut settings.
  - Full backup and migration system with Settings JSON Export and Import.
  - Factory reset mechanism with confirmation modal.
- **Licensing & Payment System**:
  - Provider-agnostic license layer with Lemon Squeezy and Gumroad adapters.
  - 7-day all-access free trial initialized on first install.
  - Offline grace period (14 days) and silent periodic revalidation every 7 days.
  - 3-device activation limit with device deactivation support.
  - Non-intrusive upgrade modal with feature highlights and one-time $2.99 pricing.
- **Internationalization (i18n)**:
  - Full multi-language support in English (`en`), Bangla (`bn`), Hindi (`hi`), and Spanish (`es`).
- **Assets & Documentation**:
  - Custom SVG logo: crescent moon and split golden sun with indigo-violet gradient.
  - High-resolution generated PNG icons in 16x16, 32x32, 48x48, and 128x128 for active and inactive states.
  - Chrome Web Store promotional templates (5x 1280x800 screenshots, 440x280 tile, 1400x560 marquee tile).
  - Standalone Tailwind landing page and Privacy Policy HTML.
