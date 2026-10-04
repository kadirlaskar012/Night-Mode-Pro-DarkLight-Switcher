import { defineBackground } from 'wxt/sandbox';
import { PRICING_CONFIG } from '@/constants/pricing';
import { LemonSqueezyAdapter, isPro } from '@/lib/license';
import {
  getLicenseInfo,
  getSettings,
  getTrialInfo,
  saveLicenseInfo,
  updateSettings,
} from '@/lib/storage';

const ALARM_SCHEDULE_CHECK = 'nmp_schedule_alarm';
const ALARM_LICENSE_CHECK = 'nmp_license_alarm';

export default defineBackground(() => {
  // 1. Install & Startup Handler
  chrome.runtime.onInstalled.addListener(async (details) => {
    // Automatically check and restore license from chrome.storage.sync across reinstalls and updates
    await getLicenseInfo();

    // Ensure background alarms exist
    chrome.alarms.create(ALARM_SCHEDULE_CHECK, { periodInMinutes: 1 });
    chrome.alarms.create(ALARM_LICENSE_CHECK, { periodInMinutes: 60 * 24 }); // Check daily

    if (details.reason === 'install') {
      // Initialize trial info
      await getTrialInfo();

      // Open onboarding page on initial install
      chrome.tabs.create({
        url: chrome.runtime.getURL('/onboarding.html'),
      });
    }

    updateBadge();
  });

  // 2. Alarms Listener
  chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === ALARM_SCHEDULE_CHECK) {
      await handleScheduleAlarm();
    } else if (alarm.name === ALARM_LICENSE_CHECK) {
      await handleLicenseRevalidation();
    }
  });

  // 3. Shortcuts / Commands Listener
  chrome.commands.onCommand.addListener(async (command) => {
    const settings = await getSettings();
    const license = await getLicenseInfo();
    const trial = await getTrialInfo();
    const pro = isPro(license, trial);

    if (command === 'toggle_mode') {
      // Toggle on current tab (FREE feature)
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab?.id) {
        chrome.tabs.sendMessage(tab.id, { type: 'TOGGLE_CURRENT_TAB' });
      }
    } else if (command === 'toggle_global') {
      // Global toggle (PRO feature)
      if (pro) {
        const newEnabled = !settings.enabled;
        await updateSettings({ enabled: newEnabled });
        broadcastSettingsUpdate();
        updateBadge();
      }
    } else if (command === 'brightness_up') {
      // Brightness +5% (PRO feature)
      if (pro) {
        const newBrightness = Math.min(100, (settings.brightness || 85) + 5);
        await updateSettings({ brightness: newBrightness });
        broadcastSettingsUpdate();
      }
    } else if (command === 'brightness_down') {
      // Brightness -5% (PRO feature)
      if (pro) {
        const newBrightness = Math.max(10, (settings.brightness || 85) - 5);
        await updateSettings({ brightness: newBrightness });
        broadcastSettingsUpdate();
      }
    }
  });

  // 4. Runtime Message Listener
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === 'BROADCAST_SETTINGS') {
      broadcastSettingsUpdate();
      updateBadge();
      sendResponse({ success: true });
      return true;
    }

    if (message.type === 'UPDATE_BADGE') {
      updateBadge();
      sendResponse({ success: true });
      return true;
    }
  });

  // Helper: Broadcast settings update to all open tabs
  async function broadcastSettingsUpdate() {
    try {
      const tabs = await chrome.tabs.query({});
      for (const tab of tabs) {
        if (tab.id) {
          const u = tab.url || '';
          if (!u.startsWith('chrome://') && !u.startsWith('edge://') && !u.startsWith('about:') && !u.startsWith('chrome-extension://')) {
            chrome.tabs.sendMessage(tab.id, { type: 'SETTINGS_UPDATED' }).catch(() => {
              // Content script may not be loaded in dormant tabs
            });
          }
        }
      }
    } catch (err) {
      console.warn('[NightModePro] Error broadcasting settings:', err);
    }
  }

  // Helper: Update browser action badge
  async function updateBadge() {
    try {
      const settings = await getSettings();
      const license = await getLicenseInfo();
      const trial = await getTrialInfo();
      const pro = isPro(license, trial);

      if (!settings.enabled || settings.mode === 'light') {
        await chrome.action.setBadgeText({ text: 'OFF' });
        await chrome.action.setBadgeBackgroundColor({ color: '#64748b' }); // slate-500
      } else {
        await chrome.action.setBadgeText({ text: pro ? 'PRO' : 'ON' });
        await chrome.action.setBadgeBackgroundColor({
          color: pro ? '#6366f1' : '#22c55e', // indigo-500 or green-500
        });
      }
    } catch (err) {
      console.warn('[NightModePro] Error updating badge:', err);
    }
  }

  // Helper: Schedule check
  async function handleScheduleAlarm() {
    const settings = await getSettings();
    if (settings.enabled && settings.mode === 'auto') {
      broadcastSettingsUpdate();
    }
  }

  // Helper: Silent license re-validation
  async function handleLicenseRevalidation() {
    try {
      const license = await getLicenseInfo();
      if (!license.key || license.status !== 'active') return;

      const now = Date.now();
      const daysSinceValidation = license.lastValidated
        ? (now - license.lastValidated) / (1000 * 60 * 60 * 24)
        : 999;

      // Re-validate every 7 days
      if (daysSinceValidation >= PRICING_CONFIG.REVALIDATION_INTERVAL_DAYS) {
        const res = await LemonSqueezyAdapter.validate(license.key, license.instanceId);
        if (res.valid) {
          license.lastValidated = now;
          license.status = 'active';
          await saveLicenseInfo(license);
        } else if (res.status === 'grace_period') {
          // Keep active in grace period
          license.status = 'grace_period';
          await saveLicenseInfo(license);
        } else {
          license.status = 'expired';
          await saveLicenseInfo(license);
          updateBadge();
        }
      }
    } catch (err) {
      console.warn('[NightModePro] License revalidation error:', err);
    }
  }
});
