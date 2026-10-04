# 🚀 Step-by-Step Chrome Web Store Publishing Guide

Follow these exact steps to publish **Night Mode Pro** on the Chrome Web Store:

---

### Step 1: Open Chrome Developer Dashboard
1. Go to: **[https://chrome.google.com/webstore/devconsole](https://chrome.google.com/webstore/devconsole)**
2. Sign in with your Google Developer Account (if not registered, there is a one-time $5 registration fee charged by Google).

---

### Step 2: Upload the Extension Package (.zip)
1. Click **"New Item"** (top right button).
2. Drag and drop the ready-to-publish file:
   👉 `CHROME_STORE_PUBLISH_KIT/package/night-mode-pro-v1.0.1-chrome.zip`
3. Wait 10 seconds while Google processes the manifest and files.

---

### Step 3: Fill in Store Listing Details
Copy-paste directly from `CHROME_STORE_PUBLISH_KIT/SEO_METADATA_AND_COPY.md`:
1. **Product Name:** `Night Mode Pro – Dark Mode & Eye Care Switcher`
2. **Summary (Short Description):**
   `Smart dark mode for every website. Warm blue light filter, zero white flash, true OLED black, and eye strain protection.`
3. **Description:**
   Copy the full formatted description from section 2 of `SEO_METADATA_AND_COPY.md`.
4. **Category:** Select `Productivity` (or `Accessibility`).
5. **Language:** Select `English (United States)`.

---

### Step 4: Upload Store Graphics & Promotional Screenshots
Navigate to the **Store Listing Graphic Assets** section and upload from the `CHROME_STORE_PUBLISH_KIT/graphics/` folder:

1. **Store Icon (128x128):**
   Upload: `CHROME_STORE_PUBLISH_KIT/graphics/store-icon-128x128.png`
2. **Screenshots (1280x800):**
   - **Screenshot 1:** `CHROME_STORE_PUBLISH_KIT/graphics/screenshot-1-before-after.png` *(High-converting split Before/After comparison)*
   - **Screenshot 2:** `CHROME_STORE_PUBLISH_KIT/graphics/screenshot-2-popup-controls.png` *(Popup & feature highlights)*
   - **Screenshot 3:** `CHROME_STORE_PUBLISH_KIT/graphics/screenshot-3-oled-and-warmth.png` *(Warm blue light shield & OLED black)*
3. **Small Promo Tile (440x280):**
   Upload: `CHROME_STORE_PUBLISH_KIT/graphics/promo-small-tile-440x280.png`
4. **Marquee Promo Banner (1400x560):**
   Upload: `CHROME_STORE_PUBLISH_KIT/graphics/promo-marquee-1400x560.png`

---

### Step 5: Fill in Privacy & Permissions
Navigate to the **Privacy** tab in the Developer Console:

1. **Single Purpose:**
   Paste:
   `Night Mode Pro transforms web pages into a comfortable dark mode with blue light filtering to protect users' vision and reduce eye fatigue.`
2. **Permission Justifications:**
   Copy each justification from Section 4 of `SEO_METADATA_AND_COPY.md` for:
   - `storage`
   - `activeTab`
   - `alarms`
   - `scripting`
   - `tabs`
   - `host_permissions (<all_urls>)`
3. **Data Usage:**
   - Select **"No"** to: "Does this extension collect or transmit user data?"
   - Night Mode Pro is 100% offline and client-side.
4. **Privacy Policy Link:**
   Provide the URL where your `PRIVACY_POLICY.html` is hosted (or your GitHub raw link: `https://raw.githubusercontent.com/kadirlaskar012/Night-Mode-Pro-DarkLight-Switcher/main/PRIVACY-POLICY.html`).

---

### Step 6: Submit for Review!
1. Click **"Submit for Review"** at the top right.
2. Review typically takes **24 to 48 hours**. Because our permissions are standard and fully justified with zero user tracking, approval is usually fast and smooth!
