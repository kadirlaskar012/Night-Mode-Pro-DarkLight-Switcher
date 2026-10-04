import { DEFAULT_USER_SETTINGS } from '../constants/defaults';
import { PRICING_CONFIG } from '../constants/pricing';
import { LicenseInfo, TrialInfo } from '../types/license';
import { EngineType, Preset, SiteSetting, UserSettings } from '../types/settings';
import { isPro } from './license';
import { evaluateSiteRules } from './matcher';
import { shouldBeActiveBySchedule } from './schedule';

const SETTINGS_KEY = 'nmp_settings';
const LICENSE_KEY = 'nmp_license';
const TRIAL_KEY = 'nmp_trial';

/**
 * Strict validator and sanitizer for UserSettings.
 * Prevents corrupted storage, NaN values, type mismatch, or injection attacks from imported JSON.
 */
export function sanitizeUserSettings(input: unknown): UserSettings {
  if (!input || typeof input !== 'object') {
    return { ...DEFAULT_USER_SETTINGS };
  }

  const raw = input as Record<string, any>;

  // Validate mode
  const validModes = ['light', 'dark', 'auto'];
  const mode = validModes.includes(raw.mode) ? raw.mode : DEFAULT_USER_SETTINGS.mode;

  // Validate engine
  const validEngines = ['smart', 'filter'];
  const engine = validEngines.includes(raw.engine) ? raw.engine : DEFAULT_USER_SETTINGS.engine;

  // Validate sliders (clamp numbers, prevent NaN / Infinity)
  const clamp = (val: any, min: number, max: number, fallback: number) => {
    const num = Number(val);
    if (isNaN(num) || !isFinite(num)) return fallback;
    return Math.max(min, Math.min(max, Math.round(num)));
  };

  const brightness = clamp(raw.brightness, 10, 100, DEFAULT_USER_SETTINGS.brightness);
  const contrast = clamp(raw.contrast, 50, 150, DEFAULT_USER_SETTINGS.contrast);
  const warm = clamp(raw.warm, 0, 100, DEFAULT_USER_SETTINGS.warm);
  const grayscale = clamp(raw.grayscale, 0, 100, DEFAULT_USER_SETTINGS.grayscale);

  // Validate language
  const validLangs = ['en', 'bn', 'hi', 'es'];
  const language = validLangs.includes(raw.language) ? raw.language : 'en';

  // Validate custom presets
  const customPresets: Preset[] = Array.isArray(raw.customPresets)
    ? raw.customPresets.filter((p: any) => p && typeof p === 'object' && typeof p.name === 'string').map((p: any) => ({
        id: String(p.id || 'custom_' + Math.random().toString(36).slice(2, 8)).slice(0, 50),
        name: String(p.name || 'Preset').slice(0, 30),
        isCustom: true,
        isPro: true,
        brightness: clamp(p.brightness, 10, 100, 85),
        contrast: clamp(p.contrast, 50, 150, 100),
        warm: clamp(p.warm, 0, 100, 0),
        grayscale: clamp(p.grayscale, 0, 100, 0),
      }))
    : [];

  // Validate schedule
  const validSchedTypes = ['time', 'sun', 'system'];
  const schedType = raw.schedule && validSchedTypes.includes(raw.schedule.type) ? raw.schedule.type : 'time';
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  const startTime = raw.schedule && timeRegex.test(raw.schedule.startTime) ? raw.schedule.startTime : '20:00';
  const endTime = raw.schedule && timeRegex.test(raw.schedule.endTime) ? raw.schedule.endTime : '07:00';

  // Validate siteRules
  const siteRules = Array.isArray(raw.siteRules)
    ? raw.siteRules
        .filter((r: any) => r && typeof r.pattern === 'string' && (r.type === 'whitelist' || r.type === 'blacklist'))
        .map((r: any) => ({
          id: String(r.id || 'rule_' + Math.random().toString(36).slice(2, 8)).slice(0, 50),
          pattern: String(r.pattern).trim().toLowerCase().slice(0, 255),
          type: r.type as 'whitelist' | 'blacklist',
          createdAt: typeof r.createdAt === 'number' ? r.createdAt : Date.now(),
        }))
    : [];

  // Validate perSiteSettings
  const perSiteSettings: Record<string, SiteSetting> = {};
  if (raw.perSiteSettings && typeof raw.perSiteSettings === 'object') {
    for (const [key, val] of Object.entries(raw.perSiteSettings)) {
      if (typeof key === 'string' && key.length < 255 && val && typeof val === 'object') {
        const v = val as any;
        perSiteSettings[key.toLowerCase()] = {
          enabled: Boolean(v.enabled),
          overrideSliders: Boolean(v.overrideSliders),
          brightness: v.brightness !== undefined ? clamp(v.brightness, 10, 100, 85) : undefined,
          warm: v.warm !== undefined ? clamp(v.warm, 0, 100, 0) : undefined,
          contrast: v.contrast !== undefined ? clamp(v.contrast, 50, 150, 100) : undefined,
          grayscale: v.grayscale !== undefined ? clamp(v.grayscale, 0, 100, 0) : undefined,
        };
      }
    }
  }

  return {
    version: 1,
    enabled: typeof raw.enabled === 'boolean' ? raw.enabled : DEFAULT_USER_SETTINGS.enabled,
    mode,
    engine,
    brightness,
    contrast,
    warm,
    grayscale,
    activePresetId: typeof raw.activePresetId === 'string' ? raw.activePresetId.slice(0, 50) : 'night',
    customPresets,
    schedule: {
      type: schedType,
      startTime,
      endTime,
      latitude: typeof raw.schedule?.latitude === 'number' ? raw.schedule.latitude : undefined,
      longitude: typeof raw.schedule?.longitude === 'number' ? raw.schedule.longitude : undefined,
    },
    smoothTransition: Boolean(raw.smoothTransition ?? true),
    alreadyDarkDetection: Boolean(raw.alreadyDarkDetection ?? true),
    perSiteSettings,
    siteRules,
    language,
    hasSeenOnboarding: Boolean(raw.hasSeenOnboarding),
  };
}

/**
 * Retrieve UserSettings from chrome.storage.sync with sanitization
 */
export async function getSettings(): Promise<UserSettings> {
  try {
    const res = await chrome.storage.sync.get(SETTINGS_KEY);
    if (res && res[SETTINGS_KEY]) {
      return sanitizeUserSettings(res[SETTINGS_KEY]);
    }
  } catch (err) {
    try {
      const localRes = await chrome.storage.local.get(SETTINGS_KEY);
      if (localRes && localRes[SETTINGS_KEY]) {
        return sanitizeUserSettings(localRes[SETTINGS_KEY]);
      }
    } catch {
      // Fallback below
    }
  }
  return { ...DEFAULT_USER_SETTINGS };
}

let saveTimer: ReturnType<typeof setTimeout> | null = null;
let pendingSaveSettings: UserSettings | null = null;

/**
 * Save UserSettings to chrome.storage.sync with fallback to local
 */
export async function saveSettings(settings: UserSettings): Promise<void> {
  const sanitized = sanitizeUserSettings(settings);
  try {
    await chrome.storage.sync.set({ [SETTINGS_KEY]: sanitized });
  } catch (err) {
    await chrome.storage.local.set({ [SETTINGS_KEY]: sanitized });
  }
}

/**
 * Debounced save to protect chrome.storage.sync rate limits (MAX_WRITE_OPERATIONS_PER_MINUTE)
 */
export function saveSettingsDebounced(settings: UserSettings, delayMs = 200): Promise<void> {
  pendingSaveSettings = settings;
  return new Promise((resolve) => {
    if (saveTimer) {
      clearTimeout(saveTimer);
    }
    saveTimer = setTimeout(async () => {
      if (pendingSaveSettings) {
        await saveSettings(pendingSaveSettings);
        pendingSaveSettings = null;
      }
      resolve();
    }, delayMs);
  });
}

/**
 * Update partial UserSettings
 */
export async function updateSettings(partial: Partial<UserSettings>): Promise<UserSettings> {
  const current = await getSettings();
  const updated: UserSettings = {
    ...current,
    ...partial,
  };
  await saveSettings(updated);
  return updated;
}

/**
 * Reset settings to default
 */
export async function resetSettings(): Promise<UserSettings> {
  await saveSettings(DEFAULT_USER_SETTINGS);
  return { ...DEFAULT_USER_SETTINGS };
}

/**
 * Retrieve License Info with automatic cross-reinstall sync restoration
 */
export async function getLicenseInfo(): Promise<LicenseInfo> {
  // 1. Try local storage first
  try {
    const res = await chrome.storage.local.get(LICENSE_KEY);
    if (res && res[LICENSE_KEY] && res[LICENSE_KEY].status === 'active') {
      return res[LICENSE_KEY];
    }
  } catch (err) {
    console.warn('[NightModePro] Error reading license from local storage:', err);
  }

  // 2. Try chrome.storage.sync (Restores purchase across extension reinstalls & Google Chrome sync!)
  try {
    const syncRes = await chrome.storage.sync.get(LICENSE_KEY);
    if (syncRes && syncRes[LICENSE_KEY] && syncRes[LICENSE_KEY].status === 'active') {
      const restored = syncRes[LICENSE_KEY];
      // Mirror back to local storage
      await chrome.storage.local.set({ [LICENSE_KEY]: restored });
      return restored;
    }
  } catch (err) {
    console.warn('[NightModePro] Error reading license from sync storage:', err);
  }

  // Fallback to local record if present
  try {
    const res = await chrome.storage.local.get(LICENSE_KEY);
    if (res && res[LICENSE_KEY]) {
      return res[LICENSE_KEY];
    }
  } catch {
    // Fallback to default
  }

  return {
    key: null,
    provider: 'lemonsqueezy',
    status: 'free',
    plan: 'lifetime',
    activationDate: null,
    lastValidated: null,
    expiresAt: null,
    deviceCount: 0,
    maxDevices: PRICING_CONFIG.MAX_DEVICES_PER_KEY,
  };
}

/**
 * Save License Info to both local and sync storage for perpetual reinstall protection
 */
export async function saveLicenseInfo(info: LicenseInfo): Promise<void> {
  await chrome.storage.local.set({ [LICENSE_KEY]: info });
  try {
    await chrome.storage.sync.set({ [LICENSE_KEY]: info });
  } catch (err) {
    console.warn('[NightModePro] Could not save license to sync storage:', err);
  }
}

/**
 * Retrieve Trial Info from chrome.storage.local
 */
export async function getTrialInfo(): Promise<TrialInfo> {
  try {
    const res = await chrome.storage.local.get(TRIAL_KEY);
    if (res && res[TRIAL_KEY]) {
      return res[TRIAL_KEY];
    }
  } catch (err) {
    console.warn('[NightModePro] Error reading trial info from storage:', err);
  }

  const newTrial: TrialInfo = {
    installedAt: Date.now(),
    trialDays: PRICING_CONFIG.TRIAL_DAYS,
    trialEnded: false,
  };
  await chrome.storage.local.set({ [TRIAL_KEY]: newTrial });
  return newTrial;
}

/**
 * Mark trial as ended
 */
export async function endTrial(): Promise<void> {
  const trial = await getTrialInfo();
  trial.trialEnded = true;
  await chrome.storage.local.set({ [TRIAL_KEY]: trial });
}

/**
 * Computed active state for a given tab/URL
 */
export interface TabEffectiveState {
  isActive: boolean;
  engine: 'smart' | 'filter';
  brightness: number;
  contrast: number;
  warm: number;
  grayscale: number;
  smoothTransition: boolean;
  isProUser: boolean;
  hostname: string;
  isAlreadyDarkDetected?: boolean;
}

/**
 * Computes the active visual state for a given URL based on free/pro tier and settings.
 */
export async function computeTabState(
  url: string,
  isSystemDark: boolean = false
): Promise<TabEffectiveState> {
  const [settings, license, trial] = await Promise.all([
    getSettings(),
    getLicenseInfo(),
    getTrialInfo(),
  ]);

  const pro = isPro(license, trial);

  let hostname = '';
  try {
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      hostname = new URL(url).hostname;
    }
  } catch {
    hostname = '';
  }

  // 1. Determine base enabled state
  let isActive = settings.enabled;

  if (isActive) {
    if (settings.mode === 'light') {
      isActive = false;
    } else if (settings.mode === 'auto') {
      if (pro) {
        isActive = shouldBeActiveBySchedule(settings.schedule, isSystemDark);
      } else {
        // Auto mode is a pro feature; fallback to dark if free
        isActive = true;
      }
    } else {
      // dark
      isActive = true;
    }
  }

  // 2. Evaluate site whitelist/blacklist rules (Pro feature)
  if (pro && hostname && settings.siteRules && settings.siteRules.length > 0) {
    const ruleResult = evaluateSiteRules(url, settings.siteRules);
    if (ruleResult !== undefined) {
      isActive = ruleResult;
    }
  }

  // 3. Per-site override (Pro feature)
  let siteSetting: SiteSetting | undefined;
  if (pro && hostname && settings.perSiteSettings[hostname]) {
    siteSetting = settings.perSiteSettings[hostname];
    if (siteSetting.enabled !== undefined) {
      isActive = siteSetting.enabled;
    }
  }

  // 4. Sliders resolution
  let brightness = settings.brightness;
  let contrast = 100;
  let warm = 0;
  let grayscale = 0;
  let engine: EngineType = 'smart';

  if (pro) {
    contrast = settings.contrast;
    warm = settings.warm;
    grayscale = settings.grayscale;
    engine = settings.engine || 'smart';

    // Apply per-site slider overrides if present
    if (siteSetting && siteSetting.overrideSliders) {
      if (siteSetting.brightness !== undefined) brightness = siteSetting.brightness;
      if (siteSetting.contrast !== undefined) contrast = siteSetting.contrast;
      if (siteSetting.warm !== undefined) warm = siteSetting.warm;
      if (siteSetting.grayscale !== undefined) grayscale = siteSetting.grayscale;
    }
  } else {
    // FREE Tier limits:
    // Brightness clamped to 50-100%
    brightness = Math.max(50, Math.min(100, brightness));
    contrast = 100;
    warm = 0;
    grayscale = 0;
    engine = 'smart';
  }

  return {
    isActive,
    engine,
    brightness,
    contrast,
    warm,
    grayscale,
    smoothTransition: settings.smoothTransition !== false,
    isProUser: pro,
    hostname,
  };
}
