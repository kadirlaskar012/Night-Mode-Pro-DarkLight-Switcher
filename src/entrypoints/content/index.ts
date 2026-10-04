import { defineContentScript } from 'wxt/sandbox';
import {
  applyEngineToDocument,
  getCachedTabState,
  injectAntiFlashStyle,
  isSiteAlreadyDark,
  removeEngineFromDocument,
  scanElementForBackgroundImages,
} from '@/lib/engine';
import { computeTabState, getSettings, TabEffectiveState } from '@/lib/storage';

export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: 'document_start',
  allFrames: true,

  main() {
    const url = window.location.href;

    // Gracefully ignore unsupported schemes and pages
    if (
      !url ||
      url.startsWith('chrome://') ||
      url.startsWith('edge://') ||
      url.startsWith('about:') ||
      url.startsWith('chrome-extension://') ||
      url.includes('chromewebstore.google.com') ||
      url.endsWith('.pdf')
    ) {
      return;
    }

    let currentState: TabEffectiveState | null = null;
    let siteIsDark = false;
    let siteIsDarkChecked = false;

    // 1. FAST-PATH SYNCHRONOUS INJECTION AT document_start (0ms)
    // On page refresh or internal navigation, sessionStorage has cached state immediately!
    const cachedState = getCachedTabState();
    if (cachedState && cachedState.isActive) {
      currentState = cachedState;
      // Apply immediately with animate = false: ZERO WHITE FLASH, INSTANT DARK!
      applyEngineToDocument(cachedState, false);
    } else {
      // If no active cache yet, style both html and body dark so initial paint is never white
      injectAntiFlashStyle();
    }

    // 2. Full asynchronous state resolution
    async function init(forceRecheckDark = false) {
      try {
        const isSystemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const state = await computeTabState(url, isSystemDark);
        const settings = await getSettings();

        // Check if page is already naturally dark (only once or when forced)
        if (settings.alreadyDarkDetection) {
          if (!siteIsDarkChecked || forceRecheckDark) {
            siteIsDark = isSiteAlreadyDark();
            siteIsDarkChecked = true;
          }
          if (siteIsDark && state.isActive) {
            const siteSetting = settings.perSiteSettings[state.hostname];
            if (siteSetting && siteSetting.enabled === true) {
              // Explicitly forced by user for this site
              siteIsDark = false;
            } else if (!siteSetting || siteSetting.enabled === undefined) {
              // If site is naturally dark, avoid invert to prevent white blinding,
              // but allow warm light/dimming filters if configured!
              if (state.warm > 0 || state.brightness < 100 || state.contrast !== 100 || state.grayscale > 0) {
                state.engine = 'filter';
              } else {
                state.isActive = false;
              }
            }
          }
        }

        currentState = state;
        // On initial page load / refresh, apply with 0ms instant transition (no flash)
        applyEngineToDocument(state, false);

        if (state.isActive && state.engine === 'smart') {
          startObserver();
        } else {
          stopObserver();
        }

        // Scan existing background images once DOM is ready, scheduled strictly in idle time
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', () => {
            scheduleIdleScan();
          }, { once: true });
        } else {
          scheduleIdleScan();
        }
      } catch (err) {
        stopObserver();
        removeEngineFromDocument(false);
      }
    }

    init();

    // 3. Scroll-aware background scanning: zero CPU/GPU overhead during scrolling
    let isScrolling = false;
    let scrollStopTimer: number | null = null;

    window.addEventListener('scroll', () => {
      isScrolling = true;
      if (scrollStopTimer) window.clearTimeout(scrollStopTimer);
      scrollStopTimer = window.setTimeout(() => {
        isScrolling = false;
        scheduleIdleScan();
      }, 150);
    }, { passive: true });

    let idleScanHandle: number | null = null;
    function scheduleIdleScan() {
      if (isScrolling || !currentState?.isActive || currentState.engine !== 'smart') return;
      if (idleScanHandle !== null) return;

      const runScan = () => {
        idleScanHandle = null;
        if (isScrolling || !currentState?.isActive) return;
        if (document.body) {
          scanElementForBackgroundImages(document.body);
        }
      };

      if (typeof (window as any).requestIdleCallback === 'function') {
        idleScanHandle = (window as any).requestIdleCallback(runScan, { timeout: 400 });
      } else {
        idleScanHandle = setTimeout(runScan, 200) as unknown as number;
      }
    }

    // 4. Dynamic content observation throttled with requestIdleCallback
    let pendingNodes: Node[] = [];
    let mutationIdleHandle: number | null = null;

    function processPendingNodes() {
      mutationIdleHandle = null;
      if (isScrolling || !pendingNodes.length || !currentState?.isActive || currentState.engine !== 'smart') {
        pendingNodes = [];
        return;
      }

      const nodesToScan = pendingNodes.slice(0, 30);
      pendingNodes = [];

      for (const node of nodesToScan) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node as Element;
          scanElementForBackgroundImages(el);

          // Handle open Shadow DOM
          if (el.shadowRoot) {
            scanElementForBackgroundImages(el.shadowRoot as unknown as Element);
          }
        }
      }
    }

    function scheduleMutationProcessing() {
      if (isScrolling || mutationIdleHandle !== null || pendingNodes.length === 0) return;

      if (typeof (window as any).requestIdleCallback === 'function') {
        mutationIdleHandle = (window as any).requestIdleCallback(processPendingNodes, { timeout: 300 });
      } else {
        mutationIdleHandle = setTimeout(processPendingNodes, 150) as unknown as number;
      }
    }

    let isObserving = false;
    const observer = new MutationObserver((mutations) => {
      if (!currentState?.isActive || currentState.engine !== 'smart' || isScrolling) return;

      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          for (let i = 0; i < mutation.addedNodes.length; i++) {
            const node = mutation.addedNodes[i];
            if (node.nodeType === Node.ELEMENT_NODE && pendingNodes.length < 30) {
              pendingNodes.push(node);
            }
          }
        }
      }

      if (pendingNodes.length > 0) {
        scheduleMutationProcessing();
      }
    });

    function startObserver() {
      if (isObserving) return;
      if (document.documentElement) {
        observer.observe(document.documentElement, {
          childList: true,
          subtree: true,
        });
        isObserving = true;
      }
    }

    function stopObserver() {
      if (!isObserving) return;
      observer.disconnect();
      isObserving = false;
      pendingNodes = [];
      if (mutationIdleHandle !== null) {
        if (typeof (window as any).cancelIdleCallback === 'function') {
          (window as any).cancelIdleCallback(mutationIdleHandle);
        } else {
          clearTimeout(mutationIdleHandle);
        }
        mutationIdleHandle = null;
      }
      if (idleScanHandle !== null) {
        if (typeof (window as any).cancelIdleCallback === 'function') {
          (window as any).cancelIdleCallback(idleScanHandle);
        } else {
          clearTimeout(idleScanHandle);
        }
        idleScanHandle = null;
      }
    }

    // 5. Fullscreen handling: reset filter when video enters fullscreen
    document.addEventListener('fullscreenchange', () => {
      if (document.fullscreenElement && currentState?.isActive) {
        document.documentElement.classList.add('nmp-fullscreen-active');
      } else {
        document.documentElement.classList.remove('nmp-fullscreen-active');
      }
    });

    // 6. Message listener for live updates from popup or background
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (sender.id && sender.id !== chrome.runtime.id) {
        return;
      }

      if (message.type === 'SETTINGS_UPDATED') {
        init();
        sendResponse({ success: true });
        return true;
      }

      if (message.type === 'GET_TAB_STATUS') {
        sendResponse({
          url,
          hostname: currentState?.hostname || window.location.hostname,
          isActive: currentState?.isActive || false,
          isAlreadyDark: siteIsDark,
          state: currentState,
        });
        return true;
      }

      if (message.type === 'TOGGLE_CURRENT_TAB') {
        const doToggle = (state: TabEffectiveState) => {
          state.isActive = !state.isActive;
          // User interaction uses smooth 180ms fade animation
          applyEngineToDocument(state, true);
          if (state.isActive && state.engine === 'smart') {
            startObserver();
          } else {
            stopObserver();
          }
          sendResponse({ isActive: state.isActive });
        };

        if (currentState) {
          doToggle(currentState);
        } else {
          init().then(() => {
            if (currentState) {
              doToggle(currentState);
            }
          });
        }
        return true;
      }
    });
  },
});
