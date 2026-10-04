export type ThemeMode = 'light' | 'dark' | 'auto';
export type EngineType = 'smart' | 'filter';

export interface Preset {
  id: string;
  name: string;
  isCustom: boolean;
  isPro: boolean;
  brightness: number; // 10 - 100 (%)
  contrast: number;   // 50 - 150 (%)
  warm: number;       // 0 - 100 (%) sepia/amber
  grayscale: number;  // 0 - 100 (%)
}

export type ScheduleType = 'time' | 'sun' | 'system';

export interface ScheduleConfig {
  type: ScheduleType;
  startTime: string; // HH:mm format, e.g. "20:00"
  endTime: string;   // HH:mm format, e.g. "07:00"
  latitude?: number;
  longitude?: number;
}

export interface SiteSetting {
  enabled: boolean;
  overrideSliders?: boolean;
  brightness?: number;
  warm?: number;
  contrast?: number;
  grayscale?: number;
}

export interface SiteRule {
  id: string;
  pattern: string; // e.g. *.youtube.com, github.com
  type: 'whitelist' | 'blacklist';
  createdAt: number;
}

export interface UserSettings {
  version: number;
  enabled: boolean;
  mode: ThemeMode;
  engine: EngineType;
  brightness: number; // default 85%
  contrast: number;   // default 100%
  warm: number;       // default 0%
  grayscale: number;  // default 0%
  activePresetId: string;
  customPresets: Preset[];
  schedule: ScheduleConfig;
  smoothTransition: boolean;
  alreadyDarkDetection: boolean;
  perSiteSettings: Record<string, SiteSetting>; // hostname -> setting
  siteRules: SiteRule[];
  language: string; // 'en' | 'bn' | 'hi' | 'es'
  hasSeenOnboarding: boolean;
}
