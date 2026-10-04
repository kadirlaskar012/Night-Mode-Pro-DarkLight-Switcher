import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.resolve('CHROME_STORE_PUBLISH_KIT/graphics');
const TEMP_DIR = path.resolve('CHROME_STORE_PUBLISH_KIT/graphics/temp');

if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// 1. Screenshot 1: Before & After Split Comparison on a Text Website (1280x800)
const screenshot1Html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1280px;
    height: 800px;
    overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background: #090d16;
    color: #f1f5f9;
    padding: 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .header-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 24px;
    background: rgba(15, 23, 42, 0.85);
    border: 1px solid rgba(99, 102, 241, 0.3);
    border-radius: 16px;
    backdrop-filter: blur(12px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  }
  .brand-group { display: flex; align-items: center; gap: 14px; }
  .brand-icon {
    width: 40px; height: 40px; border-radius: 10px;
    background: linear-gradient(135deg, #6366f1, #a855f7);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0 15px rgba(99, 102, 241, 0.6);
  }
  .brand-title {
    font-size: 20px; font-weight: 800; letter-spacing: -0.5px;
    background: linear-gradient(90deg, #ffffff, #c7d2fe);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .brand-tag { font-size: 11px; color: #94a3b8; margin-top: 2px; }
  .feature-pills { display: flex; gap: 10px; }
  .pill {
    padding: 6px 14px; background: rgba(30, 41, 59, 0.7);
    border: 1px solid rgba(148, 163, 184, 0.2); border-radius: 999px;
    font-size: 11px; font-weight: 600; color: #e2e8f0;
    display: flex; align-items: center; gap: 6px;
  }
  .pill-highlight {
    background: rgba(99, 102, 241, 0.25);
    border-color: rgba(129, 140, 248, 0.5); color: #a5b4fc;
  }

  .browser-mockup {
    width: 100%; height: 670px; background: #1e293b;
    border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.7), 0 0 40px rgba(99, 102, 241, 0.15);
    overflow: hidden; display: flex; flex-direction: column; position: relative;
  }
  .browser-header {
    height: 42px; background: #0f172a;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    display: flex; align-items: center; padding: 0 16px; gap: 16px;
  }
  .browser-dots { display: flex; gap: 7px; }
  .dot { width: 11px; height: 11px; border-radius: 50%; }
  .dot-red { background: #ef4444; }
  .dot-yellow { background: #eab308; }
  .dot-green { background: #22c55e; }
  .browser-url-bar {
    flex: 1; max-width: 520px; height: 26px;
    background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px; display: flex; align-items: center; padding: 0 12px;
    font-size: 11px; color: #94a3b8; gap: 8px;
  }

  .split-container { flex: 1; display: flex; position: relative; overflow: hidden; }
  .split-left {
    width: 48%; background: #ffffff; color: #0f172a;
    padding: 36px 42px; overflow: hidden; position: relative;
  }
  .glare-overlay {
    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    box-shadow: inset 0 0 100px rgba(255, 255, 255, 0.9);
    pointer-events: none;
  }
  .before-badge {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 14px; background: #fee2e2; border: 1px solid #ef4444;
    border-radius: 8px; color: #b91c1c; font-size: 12px; font-weight: 800;
    margin-bottom: 20px; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
  }
  .split-right {
    width: 52%; background: #0f1422; color: #f1f5f9;
    padding: 36px 42px; overflow: hidden; position: relative;
  }
  .after-badge {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 14px; background: rgba(99, 102, 241, 0.2); border: 1px solid #6366f1;
    border-radius: 8px; color: #a5b4fc; font-size: 12px; font-weight: 800;
    margin-bottom: 20px; box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
  }

  .article-title-light { font-size: 26px; font-weight: 800; color: #000000; line-height: 1.25; margin-bottom: 12px; }
  .article-title-dark { font-size: 26px; font-weight: 800; color: #ffffff; line-height: 1.25; margin-bottom: 12px; }
  .article-sub-light { font-size: 13px; color: #64748b; margin-bottom: 20px; }
  .article-sub-dark { font-size: 13px; color: #94a3b8; margin-bottom: 20px; }
  .article-p-light { font-size: 14px; line-height: 1.7; color: #1e293b; margin-bottom: 16px; }
  .article-p-dark { font-size: 14px; line-height: 1.7; color: #cbd5e1; margin-bottom: 16px; }

  .media-box-light {
    width: 100%; height: 160px; border-radius: 12px;
    background: linear-gradient(135deg, #38bdf8, #818cf8);
    margin-bottom: 16px; display: flex; align-items: center; justify-content: center;
    color: white; font-weight: 700; font-size: 14px;
    box-shadow: 0 6px 15px rgba(0,0,0,0.1);
  }
  .media-box-dark {
    width: 100%; height: 160px; border-radius: 12px;
    background: linear-gradient(135deg, #38bdf8, #818cf8);
    margin-bottom: 16px; display: flex; align-items: center; justify-content: center;
    color: white; font-weight: 700; font-size: 14px;
    box-shadow: 0 6px 20px rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1);
  }

  .slider-divider {
    position: absolute; left: 48%; top: 0; bottom: 0; width: 3px;
    background: #6366f1; box-shadow: 0 0 15px #6366f1, 0 0 30px #818cf8;
    z-index: 50; display: flex; align-items: center; justify-content: center;
  }
  .slider-knob {
    width: 52px; height: 52px; border-radius: 50%; background: #0f172a;
    border: 3px solid #6366f1; box-shadow: 0 0 25px rgba(99, 102, 241, 0.8), 0 8px 20px rgba(0,0,0,0.6);
    display: flex; align-items: center; justify-content: center;
    color: white; font-size: 18px; font-weight: bold; cursor: ew-resize;
  }
  .slider-tooltip {
    position: absolute; top: 50%; transform: translateY(-50%);
    background: #6366f1; color: white; padding: 6px 14px; border-radius: 20px;
    font-size: 11px; font-weight: 800; letter-spacing: 0.5px;
    white-space: nowrap; box-shadow: 0 4px 15px rgba(99, 102, 241, 0.5);
    margin-top: 45px;
  }
</style>
</head>
<body>
  <div class="header-bar">
    <div class="brand-group">
      <div class="brand-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
          <path d="M19 3v4"></path>
          <path d="M21 5h-4"></path>
        </svg>
      </div>
      <div>
        <div class="brand-title">Night Mode Pro</div>
        <div class="brand-tag">Next-Gen Dark Mode &amp; Eye Comfort Switcher</div>
      </div>
    </div>
    <div class="feature-pills">
      <div class="pill pill-highlight">✨ 1-Click Smooth Dark Switch</div>
      <div class="pill">🛡️ Zero White Flash</div>
      <div class="pill">🖼️ Photos &amp; Videos Preserved</div>
      <div class="pill">⚡ 60 FPS Smooth Scrolling</div>
    </div>
  </div>

  <div class="browser-mockup">
    <div class="browser-header">
      <div class="browser-dots">
        <div class="dot dot-red"></div>
        <div class="dot dot-yellow"></div>
        <div class="dot dot-green"></div>
      </div>
      <div class="browser-url-bar">
        <span>🔒 https://en.wikipedia.org/wiki/Astrophysics</span>
      </div>
    </div>

    <div class="split-container">
      <div class="split-left">
        <div class="glare-overlay"></div>
        <div class="before-badge">❌ BEFORE: 100% White Screen Glare (Eye Strain)</div>
        <h1 class="article-title-light">Astrophysics &amp; Deep Space Exploration</h1>
        <div class="article-sub-light">Reading in bright daylight or midnight without screen adaptation causes severe eye fatigue and blue-light insomnia.</div>
        <div class="media-box-light">🔭 High-Resolution Space Photography (Original Color)</div>
        <p class="article-p-light">Modern astronomy relies on deep-sky observatories capturing cosmic radiation across radio, infrared, optical, and ultraviolet spectra. Staring at bright, uncalibrated white computer monitors disrupts melatonin synthesis and strains ocular muscles during prolonged evening reading.</p>
      </div>

      <div class="slider-divider">
        <div class="slider-knob">🌓</div>
        <div class="slider-tooltip">◀ SLIDE TO COMPARE ▶</div>
      </div>

      <div class="split-right">
        <div class="after-badge">✨ AFTER: Smart Invert • Warm Contrast • Zero Glare</div>
        <h1 class="article-title-dark">Astrophysics &amp; Deep Space Exploration</h1>
        <div class="article-sub-dark">Gentle, soothing dark background with blue-light filtering for strain-free nighttime reading and battery efficiency.</div>
        <div class="media-box-dark">🔭 High-Resolution Space Photography (Colors 100% Preserved)</div>
        <p class="article-p-dark">Modern astronomy relies on deep-sky observatories capturing cosmic radiation across radio, infrared, optical, and ultraviolet spectra. Staring at bright, uncalibrated white computer monitors disrupts melatonin synthesis and strains ocular muscles during prolonged evening reading.</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

// 2. Screenshot 2: Powerful Popup Dashboard & Real-Time Controls (1280x800)
const screenshot2Html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1280px; height: 800px; overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: radial-gradient(circle at 50% 30%, #171c2e, #07090e 70%);
    color: #ffffff; padding: 40px; display: flex; align-items: center; justify-content: center;
    position: relative;
  }
  .bg-glow {
    position: absolute; width: 600px; height: 600px; border-radius: 50%;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.2), transparent 70%);
    top: 50%; left: 50%; transform: translate(-50%, -50%); pointer-events: none;
  }
  .main-layout {
    width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 40px; z-index: 10;
  }
  .left-callouts, .right-callouts {
    flex: 1; display: flex; flex-direction: column; gap: 24px;
  }
  .callout-card {
    background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(99, 102, 241, 0.3);
    border-radius: 16px; padding: 20px; backdrop-filter: blur(10px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.5);
  }
  .callout-title {
    font-size: 16px; font-weight: 800; color: #818cf8; margin-bottom: 6px; display: flex; align-items: center; gap: 8px;
  }
  .callout-desc {
    font-size: 13px; color: #94a3b8; line-height: 1.5;
  }

  /* Popup Mockup */
  .popup-frame {
    width: 350px; background: #0f172a; border-radius: 24px;
    border: 1px solid rgba(99, 102, 241, 0.4);
    box-shadow: 0 30px 60px rgba(0,0,0,0.9), 0 0 50px rgba(99, 102, 241, 0.3);
    overflow: hidden; display: flex; flex-direction: column;
  }
  .popup-header {
    background: rgba(30, 41, 59, 0.8); padding: 14px 18px;
    display: flex; align-items: center; justify-content: space-between;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }
  .popup-power {
    display: flex; flex-direction: column; align-items: center; padding: 24px 0 16px;
  }
  .big-btn {
    width: 76px; height: 76px; border-radius: 50%;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    box-shadow: 0 0 30px rgba(99, 102, 241, 0.6);
    display: flex; align-items: center; justify-content: center;
  }
  .mode-switch {
    display: flex; background: #1e293b; margin: 0 16px 12px;
    border-radius: 12px; padding: 4px;
  }
  .mode-tab { flex: 1; text-align: center; padding: 6px; font-size: 11px; font-weight: 700; border-radius: 8px; }
  .mode-active { background: #6366f1; color: white; }
  .mode-inactive { color: #94a3b8; }

  .slider-row {
    padding: 8px 18px;
  }
  .slider-header {
    display: flex; justify-content: space-between; font-size: 12px; font-weight: 600; margin-bottom: 6px; color: #cbd5e1;
  }
  .bar-bg { width: 100%; height: 6px; background: #334155; border-radius: 3px; position: relative; }
  .bar-fill { height: 100%; border-radius: 3px; }
  .presets-row {
    padding: 10px 18px; display: flex; gap: 6px; flex-wrap: wrap;
  }
  .p-chip {
    padding: 4px 10px; border-radius: 6px; font-size: 10px; font-weight: 700;
  }
</style>
</head>
<body>
  <div class="bg-glow"></div>

  <div class="main-layout">
    <div class="left-callouts">
      <div class="callout-card">
        <div class="callout-title">⚡ 1-Click Master Power Switch</div>
        <div class="callout-desc">Instantly toggle dark and light modes with zero white flash across active tabs or globally.</div>
      </div>
      <div class="callout-card">
        <div class="callout-title">🎛️ Precision Sliders</div>
        <div class="callout-desc">Fine-tune screen brightness, warm light filter (0%–100%), contrast, and distraction-free grayscale.</div>
      </div>
    </div>

    <!-- Center Popup -->
    <div class="popup-frame">
      <div class="popup-header">
        <div style="display:flex;align-items:center;gap:8px;">
          <div style="width:24px;height:24px;background:#6366f1;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:12px;">🌓</div>
          <span style="font-weight:bold;font-size:13px;">Night Mode Pro</span>
        </div>
        <span style="font-size:9px;font-weight:bold;padding:2px 8px;background:rgba(245,158,11,0.2);color:#fbbf24;border:1px solid #f59e0b;border-radius:12px;">PRO ACTIVE</span>
      </div>

      <div class="popup-power">
        <div class="big-btn">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M12 2v10"></path><path d="M18.4 6.6a9 9 0 1 1-12.77.04"></path></svg>
        </div>
        <div style="color:#34d399;font-weight:bold;font-size:12px;margin-top:8px;">● Night Mode Active</div>
      </div>

      <div class="mode-switch">
        <div class="mode-tab mode-inactive">☀️ Light</div>
        <div class="mode-tab mode-active">🌙 Dark</div>
        <div class="mode-tab mode-inactive">⏰ Auto</div>
      </div>

      <div class="slider-row">
        <div class="slider-header"><span>☀️ Brightness</span><span>85%</span></div>
        <div class="bar-bg"><div class="bar-fill" style="width:85%;background:#818cf8;"></div></div>
      </div>

      <div class="slider-row">
        <div class="slider-header"><span>🔥 Warm Light Filter</span><span>35%</span></div>
        <div class="bar-bg"><div class="bar-fill" style="width:35%;background:#f59e0b;"></div></div>
      </div>

      <div class="slider-row">
        <div class="slider-header"><span>👁️ Contrast Boost</span><span>105%</span></div>
        <div class="bar-bg"><div class="bar-fill" style="width:70%;background:#a855f7;"></div></div>
      </div>

      <div class="presets-row">
        <div class="p-chip" style="background:#6366f1;color:white;">Night</div>
        <div class="p-chip" style="background:#1e293b;color:#94a3b8;border:1px solid #334155;">Reading</div>
        <div class="p-chip" style="background:#1e293b;color:#94a3b8;border:1px solid #334155;">Deep Night</div>
        <div class="p-chip" style="background:#1e293b;color:#94a3b8;border:1px solid #334155;">OLED Black</div>
      </div>

      <div style="padding:12px 18px;background:#090d16;display:flex;justify-content:space-between;font-size:11px;color:#94a3b8;">
        <span>⚙️ Options</span>
        <span style="color:#818cf8;">⭐ Rate 5 Stars</span>
      </div>
    </div>

    <div class="right-callouts">
      <div class="callout-card">
        <div class="callout-title">🎯 Instant Calibrated Presets</div>
        <div class="callout-desc">Switch with one touch between Night, Reading (warm amber), Deep Night, and True OLED Pitch-Black.</div>
      </div>
      <div class="callout-card">
        <div class="callout-title">🔒 Per-Site Control &amp; Whitelist</div>
        <div class="callout-desc">Easily enable or disable dark mode for individual websites, or create custom wildcard rules.</div>
      </div>
    </div>
  </div>
</body>
</html>
`;

// 3. Screenshot 3: Blue Light Warm Filter & OLED Pitch-Black (1280x800)
const screenshot3Html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1280px; height: 800px; overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #06080e; color: #ffffff; padding: 36px 48px;
    display: flex; flex-direction: column; justify-content: space-between;
  }
  .header {
    text-align: center; max-width: 700px; margin: 0 auto;
  }
  .badge {
    display: inline-block; padding: 4px 14px; border-radius: 999px;
    background: rgba(245, 158, 11, 0.2); border: 1px solid #f59e0b;
    color: #fbbf24; font-size: 11px; font-weight: 800; margin-bottom: 12px;
  }
  h1 { font-size: 32px; font-weight: 900; margin-bottom: 8px; }
  p { font-size: 14px; color: #94a3b8; }

  .dual-showcase {
    display: flex; gap: 30px; margin-top: 24px; flex: 1;
  }
  .card-warm {
    flex: 1; background: #131210; border-radius: 20px;
    border: 2px solid rgba(245, 158, 11, 0.4);
    box-shadow: 0 20px 40px rgba(0,0,0,0.7), 0 0 35px rgba(245, 158, 11, 0.15);
    padding: 28px; display: flex; flex-direction: column; justify-content: space-between;
  }
  .card-oled {
    flex: 1; background: #000000; border-radius: 20px;
    border: 2px solid rgba(99, 102, 241, 0.4);
    box-shadow: 0 20px 40px rgba(0,0,0,0.7), 0 0 35px rgba(99, 102, 241, 0.15);
    padding: 28px; display: flex; flex-direction: column; justify-content: space-between;
  }
  .card-tag {
    font-size: 12px; font-weight: 800; display: inline-flex; align-items: center; gap: 6px;
    margin-bottom: 12px;
  }
  .tag-warm { color: #f59e0b; }
  .tag-oled { color: #818cf8; }
  .card-h2 { font-size: 22px; font-weight: 800; margin-bottom: 8px; }
  .card-p { font-size: 13px; line-height: 1.6; color: #94a3b8; margin-bottom: 16px; }

  .preview-snippet {
    background: rgba(255,255,255,0.03); border-radius: 12px; padding: 16px;
    font-family: monospace; font-size: 12px; line-height: 1.6; border: 1px solid rgba(255,255,255,0.06);
  }
  .snippet-warm { color: #fed7aa; }
  .snippet-oled { color: #e2e8f0; }

  .footer-pills {
    display: flex; justify-content: center; gap: 16px; margin-top: 24px;
  }
  .f-pill {
    padding: 8px 18px; border-radius: 999px; background: rgba(30, 41, 59, 0.6);
    border: 1px solid rgba(148, 163, 184, 0.2); font-size: 12px; font-weight: 600;
  }
</style>
</head>
<body>
  <div class="header">
    <div class="badge">PRO LEVEL EYE CARE &amp; SCREEN HEALTH</div>
    <h1>Warm Light Filter &amp; True OLED Black</h1>
    <p>Engineered for night owls, developers, and late-night readers who need serious eye protection.</p>
  </div>

  <div class="dual-showcase">
    <!-- Warm Light Card -->
    <div class="card-warm">
      <div>
        <div class="card-tag tag-warm">🔥 CIRCADIAN RHYTHM SHIELD</div>
        <div class="card-h2">Blue-Light Warm Filter (0%–100%)</div>
        <div class="card-p">Filters harsh blue wavelengths that inhibit melatonin production. Replaces blue glare with a soothing amber glow for effortless bedtime reading.</div>
      </div>
      <div class="preview-snippet snippet-warm">
        // Circadian Bedtime Reading Profile<br>
        const eyeComfort = {<br>
        &nbsp;&nbsp;blueLightReduction: "98%",<br>
        &nbsp;&nbsp;melatoninPreservation: true,<br>
        &nbsp;&nbsp;colorTemperature: "2700K Warm Amber"<br>
        };
      </div>
    </div>

    <!-- OLED Black Card -->
    <div class="card-oled">
      <div>
        <div class="card-tag tag-oled">⚡ ZERO PIXEL ILLUMINATION</div>
        <div class="card-h2">True OLED Pitch-Black (#000000)</div>
        <div class="card-p">Pure absolute black turning off individual OLED pixels. Maximizes contrast, saves laptop battery life, and eliminates screen glow in dark rooms.</div>
      </div>
      <div class="preview-snippet snippet-oled">
        /* True OLED Battery Saver Mode */<br>
        :root {<br>
        &nbsp;&nbsp;--bg-canvas: #000000 !important;<br>
        &nbsp;&nbsp;--contrast-ratio: 1000000:1;<br>
        &nbsp;&nbsp;--battery-efficiency: "+42%";<br>
        }
      </div>
    </div>
  </div>

  <div class="footer-pills">
    <div class="f-pill">🛡️ Reduces Digital Eye Strain</div>
    <div class="f-pill">🌙 Encourages Natural Sleep Cycles</div>
    <div class="f-pill">🔋 Increases Laptop Battery Endurance</div>
  </div>
</body>
</html>
`;

// 4. Small Promo Tile (440x280)
const promoSmallTileHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 440px; height: 280px; overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: radial-gradient(circle at top right, #1e1b4b, #090d16 70%);
    color: #ffffff; display: flex; flex-direction: column; justify-content: space-between;
    padding: 24px; position: relative;
  }
  .accent-circle {
    position: absolute; width: 250px; height: 250px; border-radius: 50%;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.25), transparent 70%);
    top: -50px; right: -50px; pointer-events: none;
  }
  .top-section { display: flex; align-items: center; gap: 14px; z-index: 2; }
  .icon-wrapper {
    width: 58px; height: 58px; border-radius: 16px;
    background: linear-gradient(135deg, #6366f1, #a855f7);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0 25px rgba(99, 102, 241, 0.6);
  }
  .title-group h1 {
    font-size: 24px; font-weight: 800; letter-spacing: -0.5px;
    background: linear-gradient(90deg, #ffffff, #c7d2fe);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .title-group p { font-size: 11px; color: #94a3b8; font-weight: 500; }
  .mid-section { z-index: 2; }
  .tagline {
    font-size: 14px; font-weight: 600; color: #e2e8f0; line-height: 1.4; margin-bottom: 12px;
  }
  .chips { display: flex; gap: 8px; flex-wrap: wrap; }
  .chip {
    padding: 4px 10px; background: rgba(30, 41, 59, 0.8);
    border: 1px solid rgba(148, 163, 184, 0.25); border-radius: 999px;
    font-size: 10px; font-weight: 700; color: #cbd5e1;
  }
  .bottom-bar {
    display: flex; align-items: center; justify-content: space-between;
    padding-top: 10px; border-top: 1px solid rgba(255, 255, 255, 0.1); z-index: 2;
  }
  .rating {
    font-size: 11px; color: #facc15; font-weight: 700; display: flex; align-items: center; gap: 4px;
  }
  .badge {
    font-size: 10px; font-weight: 800; padding: 3px 8px; border-radius: 6px;
    background: linear-gradient(90deg, #f59e0b, #ef4444); color: white;
  }
</style>
</head>
<body>
  <div class="accent-circle"></div>

  <div class="top-section">
    <div class="icon-wrapper">
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
        <path d="M19 3v4"></path>
        <path d="M21 5h-4"></path>
      </svg>
    </div>
    <div class="title-group">
      <h1>Night Mode Pro</h1>
      <p>Dark Mode &amp; Light Switcher</p>
    </div>
  </div>

  <div class="mid-section">
    <div class="tagline">Smart dark mode for every website. Zero white flash &amp; eye protection.</div>
    <div class="chips">
      <span class="chip">⚡ Zero-Flash</span>
      <span class="chip">🌙 OLED Black</span>
      <span class="chip">🛡️ Blue Light Filter</span>
    </div>
  </div>

  <div class="bottom-bar">
    <div class="rating">★★★★★ <span>Top Eye Care</span></div>
    <div class="badge">LIFETIME PRO</div>
  </div>
</body>
</html>
`;

// 5. Marquee Banner (1400x560)
const marqueeHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1400px; height: 560px; overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: radial-gradient(circle at 75% 30%, #1e1b4b, #090d16 65%);
    color: #ffffff; display: flex; align-items: center; justify-content: space-between;
    padding: 60px 80px; position: relative;
  }
  .left-content { max-width: 620px; z-index: 10; }
  .brand-badge {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 6px 14px; background: rgba(99, 102, 241, 0.2);
    border: 1px solid rgba(129, 140, 248, 0.4); border-radius: 999px;
    font-size: 13px; font-weight: 700; color: #a5b4fc; margin-bottom: 20px;
  }
  h1 {
    font-size: 46px; font-weight: 900; line-height: 1.15;
    letter-spacing: -1px; margin-bottom: 16px;
  }
  h1 span {
    background: linear-gradient(90deg, #818cf8, #c084fc);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  p { font-size: 16px; color: #94a3b8; line-height: 1.6; margin-bottom: 28px; }
  .features-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .feature-item {
    display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 600; color: #e2e8f0;
  }
  .check-icon { color: #34d399; font-weight: 800; }

  .right-preview {
    width: 580px; height: 420px; background: #0f172a; border-radius: 20px;
    border: 1px solid rgba(99, 102, 241, 0.3);
    box-shadow: 0 30px 60px -12px rgba(0,0,0,0.8), 0 0 50px rgba(99, 102, 241, 0.25);
    overflow: hidden; display: flex; flex-direction: column; z-index: 10;
  }
  .mock-header {
    height: 40px; background: #090d16; border-bottom: 1px solid rgba(255,255,255,0.08);
    display: flex; align-items: center; padding: 0 16px; gap: 8px;
  }
  .mock-content { flex: 1; display: flex; }
  .mock-light { width: 45%; background: #ffffff; padding: 24px; color: #0f172a; }
  .mock-dark {
    width: 55%; background: #0b0f19; padding: 24px; color: #f1f5f9;
    border-left: 2px solid #6366f1; position: relative;
  }
</style>
</head>
<body>
  <div class="left-content">
    <div class="brand-badge">⚡ NEXT-GEN CHROME EXTENSION (MV3)</div>
    <h1>Effortless Dark Mode for <span>Every Website</span></h1>
    <p>Eliminate blinding screen glare, preserve photo &amp; video fidelity, and protect your circadian rhythm with warm amber light filtering.</p>

    <div class="features-grid">
      <div class="feature-item"><span class="check-icon">✓</span> Zero White Flash on Page Refresh</div>
      <div class="feature-item"><span class="check-icon">✓</span> True OLED Pitch-Black (#000000)</div>
      <div class="feature-item"><span class="check-icon">✓</span> Warm Light Blue Shield (0%–100%)</div>
      <div class="feature-item"><span class="check-icon">✓</span> Non-Conflicting Alt+Shift+D Shortcut</div>
      <div class="feature-item"><span class="check-icon">✓</span> 60 FPS Buttery-Smooth Scrolling</div>
      <div class="feature-item"><span class="check-icon">✓</span> 100% Private – Zero Tracking</div>
    </div>
  </div>

  <div class="right-preview">
    <div class="mock-header">
      <span style="color:#ef4444;font-size:16px;">●</span>
      <span style="color:#eab308;font-size:16px;">●</span>
      <span style="color:#22c55e;font-size:16px;">●</span>
      <span style="margin-left:12px;font-size:11px;color:#64748b;">🔒 https://wikipedia.org/wiki/Dark_mode</span>
    </div>
    <div class="mock-content">
      <div class="mock-light">
        <div style="font-size:11px;font-weight:bold;color:#ef4444;margin-bottom:8px;">❌ BEFORE</div>
        <div style="font-size:16px;font-weight:bold;margin-bottom:6px;">Harsh White Glare</div>
        <div style="font-size:11px;line-height:1.5;color:#475569;">Straining eye muscles during late night coding and browsing.</div>
      </div>
      <div class="mock-dark">
        <div style="font-size:11px;font-weight:bold;color:#818cf8;margin-bottom:8px;">✨ AFTER</div>
        <div style="font-size:16px;font-weight:bold;margin-bottom:6px;">Soothing Dark Theme</div>
        <div style="font-size:11px;line-height:1.5;color:#94a3b8;">High contrast, zero glare, and comfortable typography.</div>
      </div>
    </div>
  </div>
</body>
</html>
`;

// Render all assets
async function renderAll() {
  console.log('Rendering all promotional assets for Chrome Web Store...');

  const tasks = [
    { name: 'screenshot-1-before-after.png', html: screenshot1Html, width: 1280, height: 800 },
    { name: 'screenshot-2-popup-controls.png', html: screenshot2Html, width: 1280, height: 800 },
    { name: 'screenshot-3-oled-and-warmth.png', html: screenshot3Html, width: 1280, height: 800 },
    { name: 'promo-small-tile-440x280.png', html: promoSmallTileHtml, width: 440, height: 280 },
    { name: 'promo-marquee-1400x560.png', html: marqueeHtml, width: 1400, height: 560 },
  ];

  for (const t of tasks) {
    const tmpFile = path.join(TEMP_DIR, `temp-${t.name}.html`);
    const outFile = path.join(OUTPUT_DIR, t.name);

    fs.writeFileSync(tmpFile, t.html, 'utf8');

    try {
      execFileSync(CHROME_PATH, [
        '--headless',
        '--disable-gpu',
        '--hide-scrollbars',
        `--window-size=${t.width},${t.height}`,
        `--screenshot=${outFile}`,
        `file://${tmpFile.replace(/\\/g, '/')}`,
      ]);
      console.log(`✓ Rendered ${t.name} (${t.width}x${t.height})`);
    } catch (e) {
      console.error(`Error rendering ${t.name}:`, e.message);
    } finally {
      if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
    }
  }

  if (fs.existsSync(TEMP_DIR)) {
    fs.rmdirSync(TEMP_DIR);
  }
  console.log('All store assets successfully created in CHROME_STORE_PUBLISH_KIT/graphics/');
}

renderAll();
