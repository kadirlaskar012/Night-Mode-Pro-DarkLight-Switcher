# 🚀 Chrome Web Store Listing – SEO & Publication Kit

Use the exact copy and settings below in the **Chrome Developer Dashboard** (`https://chrome.google.com/webstore/devconsole`).

---

## 📌 1. Basic Store Listing Details

### Extension Name (Max 45 Characters)
```text
Night Mode Pro – Dark Mode & Eye Care Switcher
```

### Short Description (Max 132 Characters)
```text
Smart dark mode for every website. Warm blue light filter, zero white flash, true OLED black, and eye strain protection.
```

### Primary Category
```text
Productivity
```

### Secondary Category
```text
Accessibility
```

### Language
```text
English (United States)
(Multi-locale automatically supported via _locales for English, Bengali, Hindi, and Spanish)
```

---

## 📝 2. Detailed Store Description (Formatted for High SEO & Conversion)

```markdown
Transform every website into a sleek, comfortable, eye-friendly dark theme. Say goodbye to blinding white screens, late-night ocular fatigue, and sleep-disrupting blue glare!

Night Mode Pro is a lightweight, ultra-fast Dark Mode & Day/Night Switcher extension built on Google Chrome Manifest V3. Engineered for buttery-smooth 60 FPS scrolling and zero white flashes on page loads.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌟 KEY HIGHLIGHTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ Zero White Flash: Pre-paint CSS injection ensures you never get blinded by a sudden white screen when opening or refreshing tabs.
🖼️ Media Preservation: Photos, videos, and avatars stay in their original natural colors without ugly negative inversions.
🚀 Silky-Smooth 60 FPS Scrolling: GPU-optimized rendering with zero lag or frame drops even on heavy social feeds and infinite-scroll pages.
⌨️ Conflict-Free Keyboard Shortcut: Instant `Alt + Shift + D` toggle on your active tab without lifting your hands from the keyboard.
🔒 100% Private & Offline: Runs entirely in your browser. No tracking, no analytics, no ads, no data collection.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🟢 FREE FOREVER FEATURES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Universal Dark Mode across all web pages and articles
• High-performance Smart Invert Engine with image/video color protection
• Custom Screen Dimmer (50% to 100% brightness control)
• Instant `Alt + Shift + D` keyboard shortcut
• Calibrated "Night" preset for everyday evening reading
• Browser Toolbar status badge (ON/OFF)
• Multi-language support (English, Bangla, Hindi, Spanish)
• No forced lockouts, no annoying popups, free forever!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👑 LIFETIME PRO FEATURES ($2.99 One-Time • Lifetime Updates)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• 🔥 Circadian Warm Light & Blue-Light Shield (0% – 100% amber tint for healthy sleep)
• ⚡ True OLED Pitch-Black (#000000 pure black for maximum battery savings and contrast)
• 🌙 Ultra-Dim Brightness down to 10% for dark room reading
• 👁️ Smart Contrast Enhancer (50% – 150%)
• 🎯 Distraction-Free Grayscale mode for focused reading & research
• ⏰ Astronomical Solar Sync (Automatically switches with your local sunrise/sunset)
• 🕒 Custom Daily Schedule (e.g., automatically active from 20:00 to 07:00)
• 🌐 Per-Site Rules & Domain Whitelist/Blacklist
• 💾 Save Unlimited Custom Presets
• ⌨️ Global Shortcuts: `Alt + Shift + N` (All tabs), `Alt + Shift + Up/Down` (Brightness)
• 🔄 Instant Purchase Restoration across device reinstalls

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 WHY CHOOSE NIGHT MODE PRO OVER OTHER DARK READERS?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. No Browsing Lag: Other dark extensions slow down your browser by heavily manipulating the DOM on every scroll. Night Mode Pro uses hardware-accelerated CSS custom properties for 60 FPS performance.
2. No Refresh White Flashing: Our synchronous session cache applies dark styling at frame zero before the browser paints the page.
3. No Annoying Subscriptions: Pay once ($2.99) and enjoy Lifetime access forever with free updates.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔒 PRIVACY & SECURITY FIRST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Zero Tracking: We do NOT track your browsing history or record visited URLs.
• No Data Collection: All settings, custom rules, and license tokens are stored locally on your device.
• Compliant with Chrome Web Store Developer Policies and GDPR.

Install Night Mode Pro now and give your eyes the soothing comfort they deserve!
```

---

## 🔍 3. Strategic SEO Keywords & Search Tags

When potential users search on the Chrome Web Store or Google, these keywords will drive traffic to your extension:

| Priority | Primary Keywords | Search Intent |
|---|---|---|
| 🔥 High | `dark mode`, `night mode`, `dark reader`, `dark theme` | Direct replacement searches |
| 🔥 High | `blue light filter`, `eye protection`, `screen dimmer` | Eye care and wellness searches |
| ⚡ Medium | `oled dark mode`, `night shift`, `invert colors` | Display & aesthetic optimization |
| ⚡ Medium | `turn off the lights`, `midnight mode`, `eye care` | Reading and bedtime searches |
| 💡 Long-tail | `dark mode for all websites`, `disable white flash dark mode`, `fast dark mode extension` | Feature-specific intent |

---

## 🛡️ 4. Chrome Web Store Reviewer Justifications (Crucial for Fast 1-Day Approval)

Copy and paste these exact explanations into the **Privacy / Permissions** review tab in the Developer Console:

### Single Purpose Description:
```text
Night Mode Pro provides automated and customized dark mode color switching and circadian blue-light filtering across websites to protect user vision, prevent eye strain, and improve readability in low-light environments.
```

### Permission Justifications:
- **`storage`**:
  *Justification:* Required to store user theme preferences (brightness, warm filter, contrast, active preset), custom site whitelist/blacklist rules, and license status locally on the device.
- **`activeTab`**:
  *Justification:* Required to toggle dark mode on the current active tab when the user clicks the toolbar icon or presses the keyboard shortcut (`Alt + Shift + D`).
- **`alarms`**:
  *Justification:* Required to trigger scheduled dark mode transitions (such as sunrise/sunset solar calculation or custom daily schedule windows) periodically in the background.
- **`scripting`**:
  *Justification:* Required to inject and update the lightweight CSS styling and custom properties that invert web page colors while preserving original media.
- **`tabs`**:
  *Justification:* Required to broadcast live theme setting updates across open tabs and allow the user to open settings in a dedicated full browser tab.
- **`host_permissions (<all_urls>)`**:
  *Justification:* Required to apply the dark mode color scheme and preserve image/video colors across all websites the user navigates to.

---

## 🖼️ 5. Promotional Images Guide

All graphics have been generated and pre-formatted in the `CHROME_STORE_PUBLISH_KIT/graphics/` folder:

1. **`store-icon-128x128.png`** (128x128): Upload in the **Store Icon** slot.
2. **`screenshot-1-before-after.png`** (1280x800): Upload as **Screenshot #1** (Before/After split view).
3. **`screenshot-2-popup-controls.png`** (1280x800): Upload as **Screenshot #2** (Dashboard & controls).
4. **`screenshot-3-oled-and-warmth.png`** (1280x800): Upload as **Screenshot #3** (Warm filter & OLED black).
5. **`promo-small-tile-440x280.png`** (440x280): Upload in **Small Promo Tile**.
6. **`promo-marquee-1400x560.png`** (1400x560): Upload in **Marquee Promo Tile**.
