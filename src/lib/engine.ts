import { TabEffectiveState } from './storage';

export const NMP_STYLE_ID = 'night-mode-pro-engine-style';
export const NMP_FLASH_ID = 'night-mode-pro-anti-flash';
export const NMP_OVERLAY_ID = 'night-mode-pro-filter-overlay';

/**
 * Saves effective tab state synchronously to sessionStorage & localStorage
 * for instant 0ms pre-paint restoration on page refresh and navigation.
 */
export function saveCachedTabState(state: TabEffectiveState): void {
  try {
    sessionStorage.setItem('nmp_cached_active', state.isActive ? '1' : '0');
    sessionStorage.setItem('nmp_cached_engine', state.engine);
    sessionStorage.setItem('nmp_cached_brightness', String(state.brightness));
    sessionStorage.setItem('nmp_cached_contrast', String(state.contrast));
    sessionStorage.setItem('nmp_cached_warm', String(state.warm));
    sessionStorage.setItem('nmp_cached_grayscale', String(state.grayscale));
  } catch {
    // Restricted environment fallback
  }
}

/**
 * Retrieves cached tab state synchronously at document_start.
 */
export function getCachedTabState(): TabEffectiveState | null {
  try {
    const active = sessionStorage.getItem('nmp_cached_active');
    if (active === '0') {
      return null;
    }
    if (active === '1') {
      return {
        isActive: true,
        engine: (sessionStorage.getItem('nmp_cached_engine') as 'smart' | 'filter') || 'smart',
        brightness: Number(sessionStorage.getItem('nmp_cached_brightness')) || 85,
        contrast: Number(sessionStorage.getItem('nmp_cached_contrast')) || 100,
        warm: Number(sessionStorage.getItem('nmp_cached_warm')) || 0,
        grayscale: Number(sessionStorage.getItem('nmp_cached_grayscale')) || 0,
        smoothTransition: false,
        isProUser: true,
        hostname: window.location.hostname,
      };
    }
  } catch {
    // Restricted environment fallback
  }
  return null;
}

/**
 * Parses an rgba/rgb string and returns its perceived luminance (0 - 255)
 */
export function getLuminance(colorStr: string): { luminance: number; alpha: number } | null {
  if (!colorStr || colorStr === 'transparent') return null;

  const match = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!match) return null;

  const r = parseInt(match[1], 10);
  const g = parseInt(match[2], 10);
  const b = parseInt(match[3], 10);
  const a = match[4] !== undefined ? parseFloat(match[4]) : 1;

  if (a < 0.2) return null; // Transparent or semi-transparent

  // Relative luminance formula (ITU-R BT.709)
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return { luminance, alpha: a };
}

/**
 * Detects if a document is already dark based on meta tags and computed styles
 */
export function isSiteAlreadyDark(): boolean {
  if (typeof document === 'undefined') return false;

  // Never evaluate if Night Mode Pro engine or anti-flash is already applied in the DOM
  if (
    document.documentElement.hasAttribute('data-night-mode-pro') ||
    document.getElementById(NMP_STYLE_ID) ||
    document.getElementById(NMP_FLASH_ID)
  ) {
    return false;
  }

  // 1. Check meta color-scheme strictly for dark-only
  const metaColorScheme = document.querySelector('meta[name="color-scheme"]');
  if (metaColorScheme) {
    const content = metaColorScheme.getAttribute('content')?.toLowerCase().trim() || '';
    if (content === 'dark') {
      return true;
    }
  }

  // 2. Check for explicit dark theme markers on html or body
  if (document.documentElement) {
    const htmlClasses = document.documentElement.className.toLowerCase();
    if (htmlClasses.includes('dark-theme') || htmlClasses.includes('theme-dark')) {
      return true;
    }
  }

  return false;
}

/**
 * Builds the CSS rules for the Smart Invert Engine.
 * Dynamically includes ONLY active filter functions to drastically reduce GPU draw passes.
 * Completely eliminates backface-visibility layer thrashing for silky-smooth 60fps scrolling.
 */
export function generateSmartEngineCSS(state: TabEffectiveState): string {
  const bVal = (state.brightness / 100).toFixed(2);
  const cVal = (state.contrast / 100).toFixed(2);
  const sepiaVal = (state.warm / 100).toFixed(2);
  const grayVal = (state.grayscale / 100).toFixed(2);

  // Optimize filter string: only include functions that actually change pixels
  const filterList: string[] = ['invert(1)', 'hue-rotate(180deg)'];
  if (state.brightness !== 100) {
    filterList.push(`brightness(var(--nmp-brightness, ${bVal}))`);
  }
  if (state.contrast !== 100) {
    filterList.push(`contrast(var(--nmp-contrast, ${cVal}))`);
  }
  if (state.warm > 0) {
    filterList.push(`sepia(var(--nmp-warm, ${sepiaVal}))`);
  }
  if (state.grayscale > 0) {
    filterList.push(`grayscale(var(--nmp-grayscale, ${grayVal}))`);
  }
  const filterCss = filterList.join(' ');

  return `
    /* Night Mode Pro - High Performance Smart Invert Engine */
    html[data-night-mode-pro="smart"] {
      filter: ${filterCss} !important;
      background-color: #ffffff !important;
      color-scheme: dark !important;
    }

    /* Active smooth transition ONLY during interactive toggle */
    html.nmp-transitioning,
    html.nmp-transitioning[data-night-mode-pro] {
      transition: filter 180ms ease, background-color 180ms ease !important;
    }

    /* Media re-inversion so pictures, videos, icons and canvases stay normal */
    html[data-night-mode-pro="smart"] img,
    html[data-night-mode-pro="smart"] video,
    html[data-night-mode-pro="smart"] canvas,
    html[data-night-mode-pro="smart"] svg image,
    html[data-night-mode-pro="smart"] iframe[src*="youtube"],
    html[data-night-mode-pro="smart"] iframe[src*="vimeo"],
    html[data-night-mode-pro="smart"] [data-nmp-bg="true"] {
      filter: invert(1) hue-rotate(180deg) !important;
    }

    /* Prevent double inversion on img inside picture */
    html[data-night-mode-pro="smart"] picture {
      filter: none !important;
    }
    html[data-night-mode-pro="smart"] picture img {
      filter: invert(1) hue-rotate(180deg) !important;
    }

    /* Fullscreen videos and dialogs: disable filter */
    html[data-night-mode-pro="smart"]:fullscreen,
    html[data-night-mode-pro="smart"] :fullscreen,
    html[data-night-mode-pro="smart"] ::backdrop {
      filter: none !important;
    }

    /* Smooth Off Transition state to prevent flash when disabling */
    html[data-night-mode-pro="off"] {
      filter: invert(0) hue-rotate(0deg) brightness(1) contrast(1) sepia(0) grayscale(0) !important;
      transition: filter 180ms ease, background-color 180ms ease !important;
    }
    html[data-night-mode-pro="off"] img,
    html[data-night-mode-pro="off"] video,
    html[data-night-mode-pro="off"] canvas,
    html[data-night-mode-pro="off"] [data-nmp-bg="true"] {
      filter: none !important;
      transition: filter 180ms ease !important;
    }

    /* Print styles */
    @media print {
      html[data-night-mode-pro] {
        filter: none !important;
        background: transparent !important;
      }
      html[data-night-mode-pro] img,
      html[data-night-mode-pro] video,
      html[data-night-mode-pro] canvas {
        filter: none !important;
      }
    }
  `;
}

/**
 * Builds the CSS rules for the Filter-Only Engine (Overlay dim + warm)
 */
export function generateFilterEngineCSS(state: TabEffectiveState): string {
  const bVal = (state.brightness / 100).toFixed(2);
  const cVal = (state.contrast / 100).toFixed(2);
  const sepiaVal = (state.warm / 100).toFixed(2);
  const grayVal = (state.grayscale / 100).toFixed(2);

  const filterList: string[] = [];
  if (state.brightness !== 100) {
    filterList.push(`brightness(var(--nmp-brightness, ${bVal}))`);
  }
  if (state.contrast !== 100) {
    filterList.push(`contrast(var(--nmp-contrast, ${cVal}))`);
  }
  if (state.warm > 0) {
    filterList.push(`sepia(var(--nmp-warm, ${sepiaVal}))`);
  }
  if (state.grayscale > 0) {
    filterList.push(`grayscale(var(--nmp-grayscale, ${grayVal}))`);
  }
  const filterCss = filterList.length > 0 ? filterList.join(' ') : 'none';

  return `
    /* Night Mode Pro - Filter Only Engine */
    html[data-night-mode-pro="filter"] {
      filter: ${filterCss} !important;
      background-color: #1a1a1a !important;
      color-scheme: dark !important;
    }

    /* Active smooth transition ONLY during interactive toggle */
    html.nmp-transitioning,
    html.nmp-transitioning[data-night-mode-pro] {
      transition: filter 180ms ease, background-color 180ms ease !important;
    }

    /* Smooth Off Transition */
    html[data-night-mode-pro="off"] {
      filter: none !important;
      transition: filter 180ms ease !important;
    }

    /* Fullscreen reset */
    html[data-night-mode-pro="filter"]:fullscreen,
    html[data-night-mode-pro="filter"] :fullscreen {
      filter: none !important;
    }

    @media print {
      html[data-night-mode-pro] {
        filter: none !important;
      }
    }
  `;
}

/**
 * Injects anti-flash early style at document_start.
 * Styles both html and body to guarantee ZERO white flash on initial render.
 */
export function injectAntiFlashStyle(): void {
  if (typeof document === 'undefined' || document.getElementById(NMP_FLASH_ID)) return;

  const style = document.createElement('style');
  style.id = NMP_FLASH_ID;
  style.textContent = `
    html:not([data-night-mode-pro="off"]) {
      background-color: #121212 !important;
      color-scheme: dark !important;
    }
    html:not([data-night-mode-pro="off"]) body {
      background-color: #121212 !important;
      color: #e2e8f0 !important;
    }
  `;

  const target = document.documentElement || document.head;
  if (target) {
    target.insertBefore(style, target.firstChild);
  }
}

/**
 * Removes anti-flash early style
 */
export function removeAntiFlashStyle(): void {
  if (typeof document === 'undefined') return;
  const style = document.getElementById(NMP_FLASH_ID);
  if (style) {
    style.remove();
  }
}

let removeTransitionTimeout: number | null = null;

/**
 * Injects or updates the Dark Engine style in the DOM.
 * @param animate When true, triggers smooth 180ms transition (use for interactive toggle).
 *                When false, applies instantly with 0ms delay (use for refresh and page load).
 */
export function applyEngineToDocument(state: TabEffectiveState, animate: boolean = false): void {
  if (typeof document === 'undefined' || !document.documentElement) return;

  // Clear any pending fade-out
  if (removeTransitionTimeout) {
    window.clearTimeout(removeTransitionTimeout);
    removeTransitionTimeout = null;
  }

  if (!state.isActive) {
    removeEngineFromDocument(animate);
    return;
  }

  // 1. Save state synchronously for instant zero-flash restoration on refresh
  saveCachedTabState(state);

  // 2. Direct GPU-accelerated CSS variable updates on root (zero layout recalculation)
  const rootStyle = document.documentElement.style;
  rootStyle.setProperty('--nmp-brightness', (state.brightness / 100).toFixed(2));
  rootStyle.setProperty('--nmp-contrast', (state.contrast / 100).toFixed(2));
  rootStyle.setProperty('--nmp-warm', (state.warm / 100).toFixed(2));
  rootStyle.setProperty('--nmp-grayscale', (state.grayscale / 100).toFixed(2));

  // 3. Set root attribute - apply transition ONLY if explicitly animated
  const currentEngine = document.documentElement.getAttribute('data-night-mode-pro');
  if (currentEngine !== state.engine) {
    if (animate) {
      document.documentElement.classList.add('nmp-transitioning');
      window.setTimeout(() => {
        if (document.documentElement) {
          document.documentElement.classList.remove('nmp-transitioning');
        }
      }, 200);
    } else {
      document.documentElement.classList.remove('nmp-transitioning');
    }
    document.documentElement.setAttribute('data-night-mode-pro', state.engine);
  }

  // 4. Ensure stylesheet exists with the appropriate engine definition
  const newCss = state.engine === 'smart'
    ? generateSmartEngineCSS(state)
    : generateFilterEngineCSS(state);

  let style = document.getElementById(NMP_STYLE_ID) as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement('style');
    style.id = NMP_STYLE_ID;
    style.setAttribute('data-engine', state.engine);
    style.textContent = newCss;
    (document.head || document.documentElement).appendChild(style);
  } else if (style.getAttribute('data-engine') !== state.engine || style.textContent !== newCss) {
    style.setAttribute('data-engine', state.engine);
    style.textContent = newCss;
  }

  removeAntiFlashStyle();
}

/**
 * Removes all Night Mode Pro styles and attributes.
 * @param animate When true, triggers smooth 180ms transition.
 */
export function removeEngineFromDocument(animate: boolean = false): void {
  if (typeof document === 'undefined' || !document.documentElement) return;

  try {
    sessionStorage.setItem('nmp_cached_active', '0');
  } catch {}

  if (removeTransitionTimeout) {
    window.clearTimeout(removeTransitionTimeout);
    removeTransitionTimeout = null;
  }

  if (animate) {
    // Smooth fade-out: trigger 180ms CSS filter transition
    document.documentElement.classList.add('nmp-transitioning');
    document.documentElement.setAttribute('data-night-mode-pro', 'off');

    removeTransitionTimeout = window.setTimeout(() => {
      cleanupEngineDom();
    }, 200);
  } else {
    cleanupEngineDom();
  }
}

function cleanupEngineDom(): void {
  if (!document.documentElement) return;

  document.documentElement.classList.remove('nmp-transitioning');
  document.documentElement.removeAttribute('data-night-mode-pro');

  const rootStyle = document.documentElement.style;
  rootStyle.removeProperty('--nmp-brightness');
  rootStyle.removeProperty('--nmp-contrast');
  rootStyle.removeProperty('--nmp-warm');
  rootStyle.removeProperty('--nmp-grayscale');

  const style = document.getElementById(NMP_STYLE_ID);
  if (style) {
    style.remove();
  }
  removeAntiFlashStyle();

  const markedBgElements = document.querySelectorAll('[data-nmp-bg="true"]');
  markedBgElements.forEach((el) => el.removeAttribute('data-nmp-bg'));
  removeTransitionTimeout = null;
}

/**
 * Scans an element for CSS inline background-image url() and marks with data-nmp-bg="true".
 * Targeted and optimized to avoid forced reflows during scrolling.
 */
export function scanElementForBackgroundImages(root: Element): void {
  if (!root) return;

  try {
    // 1. Check root itself
    const el = root as HTMLElement;
    if (el.style && el.style.backgroundImage && el.style.backgroundImage.includes('url(')) {
      if (!el.hasAttribute('data-nmp-bg')) {
        el.setAttribute('data-nmp-bg', 'true');
      }
    }

    // 2. Scan only elements with url in their style attribute
    if (root.querySelectorAll) {
      const elements = root.querySelectorAll('[style*="url("]');
      const len = Math.min(elements.length, 25);
      for (let i = 0; i < len; i++) {
        const item = elements[i] as HTMLElement;
        if (!item.hasAttribute('data-nmp-bg')) {
          item.setAttribute('data-nmp-bg', 'true');
        }
      }
    }
  } catch {
    // Cross-origin / Shadow DOM safety
  }
}
