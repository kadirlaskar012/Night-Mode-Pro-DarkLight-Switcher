# Night Mode Pro – Launch & Growth Playbook

A tactical checklist for publishing to the Chrome Web Store and acquiring your first 100 paying customers.

---

## 📦 Part 1: Chrome Web Store Submission Checklist

### Step 1: Prepare the Production Zip
1. Run:
   ```bash
   npm run build
   npm run zip
   ```
2. The submission-ready zip will be created in `.output/night-mode-pro-<version>.zip`.

### Step 2: Chrome Web Store Developer Dashboard
1. Log in to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole).
2. Pay the one-time $5 Google registration fee if this is a new developer account.
3. Click **Add new item** and upload the zip file from `.output/`.

### Step 3: Fill in Store Listing Details
1. **Name**: `Night Mode Pro – Dark/Light Switcher` (from `STORE-LISTING.md`)
2. **Summary**: `Instant eye comfort for every website. Turn any site dark with custom brightness, warm light filter & smart schedule.`
3. **Detailed Description**: Copy directly from `STORE-LISTING.md`.
4. **Category**: `Accessibility`
5. **Language**: `English`

### Step 4: Upload Graphic Assets
- **Store Icon**: Upload `src/public/icons/icon-128.png` (128x128).
- **Screenshots (1280x800)**: Capture the 5 screenshots from `promo/promo-assets.html`.
- **Small Promo Tile (440x280)**: Capture from `promo/promo-assets.html`.
- **Marquee Tile (1400x560)**: Capture from `promo/promo-assets.html`.

### Step 5: Privacy Practices Tab
1. **Single Purpose**:
   `Provides eye comfort and high-contrast dark themes on websites by adjusting webpage styling, brightness, and color temperature.`
2. **Host Permissions Justification**:
   `The extension must inject dark CSS styling and smart media inversion across websites requested by the user.`
3. **Storage Justification**:
   `Stores local user preferences, custom presets, and site rules on the user's machine.`
4. **Data Usage**:
   - Check **"No data is collected"** (or specify license validation if asked).
   - Enter your hosted Privacy Policy URL: `https://your-domain.com/privacy-policy.html` (or host free on GitHub Pages / Cloudflare Pages).
5. Click **Submit for Review**. Review typically takes 24–48 hours.

---

## 🎯 Part 2: Acquiring Your First 100 Paying Users

At a **$2.99 one-time impulse price point**, conversion rates are high (typically 4%–8% from install to paid) when eye-strain pain is highlighted. 100 paying users ($299 gross) requires approximately 1,500 – 2,500 active installs.

### 1. Reddit Strategy (Days 1–3)
Target communities where users suffer from late-night eye fatigue:
- **r/chrome_extensions**: Post a developer showcase: *"I got tired of dark mode extensions inverting YouTube videos and blinding me with white flashes, so I built Night Mode Pro."*
- **r/accessibility**: Share how the warm light circadian filter and OLED black presets reduce photophobia and digital eye strain.
- **r/SideProject & r/IndieHackers**: Share your commercial journey, pricing rationale ($2.99 one-time vs hated subscriptions), and tech stack (WXT + React 18 + MV3).
- **r/webdev & r/programming**: Share a technical deep-dive on how you eliminated the white flash at `document_start` without layout shift.
*Rule: Offer 10 free promo license keys in the comments to generate early reviews.*

### 2. Product Hunt Launch (Week 1)
- Schedule your launch on a Tuesday or Wednesday at 00:01 PST.
- Headline: `Night Mode Pro – Instant dark mode & blue-light eye shield for every website.`
- Maker Comment: Explain why you priced it at $2.99 lifetime (anti-subscription movement).
- Include the GIF / video showing before & after with photos untouched.

### 3. Twitter / X & Tech Influencers (Week 2)
- Post a 15-second screen recording showing a blinding white site (e.g. Wikipedia or HackerNews) transforming instantly to a soothing warm dark mode using `Alt+Shift+D`.
- Tag creators who talk about developer health, ergonomics, and productivity tools.
- Thread topic: *"Why subscriptions for simple browser extensions are broken, and why I launched a $2.99 lifetime tool."*

### 4. YouTube & TikTok Micro-Shorts
- Create vertical 30-second shorts: *"Chrome extensions you didn't know you needed (Part 1): How to make every website dark mode without turning photos into creepy negatives."*
- Demonstrate YouTube video playing normally while surrounding page is pure OLED black.

### 5. Facebook Groups & Student Communities
- Target University / College groups, Medical / Nursing student groups, and Law student forums who do intense late-night reading and PDF reviewing.
- Offer student discount promo codes.

---

## 📊 Conversion Funnel Goals
- **Day 1–7**: 250 installs, 15 reviews (5.0 rating), 12 Pro upgrades ($35)
- **Day 8–14**: 1,000 installs, 40 Pro upgrades ($120)
- **Day 15–30**: 2,500 installs, 100+ Pro upgrades ($300+)
- **Next milestone**: Re-invest in localized Chrome Web Store search ads and YouTube sponsorship.
