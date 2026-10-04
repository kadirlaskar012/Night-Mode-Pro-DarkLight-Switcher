import React, { useEffect, useState } from 'react';
import { CurrentSiteCard } from '@/components/CurrentSiteCard';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { ModeSelector } from '@/components/ModeSelector';
import { PowerButton } from '@/components/PowerButton';
import { PresetChips } from '@/components/PresetChips';
import { SavePresetModal } from '@/components/SavePresetModal';
import { SlidersSection } from '@/components/SlidersSection';
import { UpgradeModal } from '@/components/UpgradeModal';
import { DEFAULT_USER_SETTINGS } from '@/constants/defaults';
import { isPro } from '@/lib/license';
import {
  getLicenseInfo,
  getSettings,
  getTrialInfo,
  saveSettings,
  saveSettingsDebounced,
  updateSettings,
} from '@/lib/storage';
import { LicenseInfo, TrialInfo } from '@/types/license';
import { Preset, ThemeMode, UserSettings } from '@/types/settings';

export const App: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_USER_SETTINGS);
  const [license, setLicense] = useState<LicenseInfo | null>(null);
  const [trial, setTrial] = useState<TrialInfo | null>(null);

  const [currentHostname, setCurrentHostname] = useState<string>('');
  const [isRestricted, setIsRestricted] = useState<boolean>(false);
  const [isAlreadyDark, setIsAlreadyDark] = useState<boolean>(false);

  const [upgradeModalOpen, setUpgradeModalOpen] = useState<boolean>(false);
  const [lockedFeatureName, setLockedFeatureName] = useState<string>('');
  const [savePresetModalOpen, setSavePresetModalOpen] = useState<boolean>(false);

  const isProUser = isPro(license, trial);

  // Load initial settings and active tab context
  useEffect(() => {
    async function loadData() {
      const [loadedSettings, loadedLicense, loadedTrial] = await Promise.all([
        getSettings(),
        getLicenseInfo(),
        getTrialInfo(),
      ]);

      setSettings(loadedSettings);
      setLicense(loadedLicense);
      setTrial(loadedTrial);

      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab?.url) {
          const url = tab.url;
          if (
            url.startsWith('chrome://') ||
            url.startsWith('edge://') ||
            url.startsWith('about:') ||
            url.startsWith('chrome-extension://') ||
            url.includes('chromewebstore.google.com') ||
            url.endsWith('.pdf')
          ) {
            setIsRestricted(true);
          } else {
            const host = new URL(url).hostname;
            setCurrentHostname(host);

            // Query active tab content script
            if (tab.id) {
              chrome.tabs.sendMessage(tab.id, { type: 'GET_TAB_STATUS' }, (response) => {
                if (chrome.runtime.lastError) {
                  return;
                }
                if (response && response.isAlreadyDark) {
                  setIsAlreadyDark(true);
                }
              });
            }
          }
        }
      } catch (err) {
        console.warn('[NightModePro] Error reading active tab:', err);
      }
    }

    loadData();
  }, []);

  const notifyActiveTab = () => {
    chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
      if (tab?.id) {
        chrome.tabs.sendMessage(tab.id, { type: 'SETTINGS_UPDATED' }).catch(() => {});
      }
    }).catch(() => {});
  };

  // Sync settings helper for discrete actions (toggles, presets)
  const handleUpdateSettings = async (partial: Partial<UserSettings>) => {
    const updated = { ...settings, ...partial };
    setSettings(updated);
    await saveSettings(updated);
    chrome.runtime.sendMessage({ type: 'BROADCAST_SETTINGS' });
    notifyActiveTab();
  };

  // Debounced sync for continuous slider drag operations
  const handleUpdateSliders = (partial: Partial<UserSettings>) => {
    const updated = { ...settings, ...partial };
    setSettings(updated);
    notifyActiveTab();
    saveSettingsDebounced(updated, 150).then(() => {
      chrome.runtime.sendMessage({ type: 'BROADCAST_SETTINGS' });
    });
  };

  const handleTogglePower = () => {
    handleUpdateSettings({ enabled: !settings.enabled });
  };

  const handleChangeMode = (mode: ThemeMode) => {
    handleUpdateSettings({ mode, enabled: mode !== 'light' });
  };

  const handleToggleSite = (enabled: boolean) => {
    if (!currentHostname) return;
    const perSite = { ...settings.perSiteSettings };
    perSite[currentHostname] = {
      ...(perSite[currentHostname] || {}),
      enabled,
    };
    handleUpdateSettings({ perSiteSettings: perSite });
  };

  const handleSelectPreset = (preset: Preset) => {
    handleUpdateSettings({
      activePresetId: preset.id,
      brightness: preset.brightness,
      contrast: isProUser ? preset.contrast : 100,
      warm: isProUser ? preset.warm : 0,
      grayscale: isProUser ? preset.grayscale : 0,
    });
  };

  const handleSaveCustomPreset = (newPreset: Preset) => {
    const updatedCustom = [...settings.customPresets, newPreset];
    handleUpdateSettings({
      customPresets: updatedCustom,
      activePresetId: newPreset.id,
    });
  };

  const openUpgradeModal = (feature?: string) => {
    setLockedFeatureName(feature || '');
    setUpgradeModalOpen(true);
  };

  const openOptionsPage = (tabName?: string) => {
    if (tabName) {
      chrome.tabs.create({ url: chrome.runtime.getURL(`/options.html#${tabName}`) });
    } else {
      chrome.runtime.openOptionsPage();
    }
  };

  const siteEnabled =
    currentHostname && settings.perSiteSettings[currentHostname]?.enabled !== undefined
      ? settings.perSiteSettings[currentHostname].enabled
      : settings.enabled;

  return (
    <div className="w-[340px] bg-slate-900 text-slate-100 flex flex-col justify-between select-none">
      {/* Header */}
      <Header
        license={license}
        trial={trial}
        onOpenUpgradeModal={() => openUpgradeModal('Full Pro Access')}
      />

      <main className="flex-1 flex flex-col divide-y divide-slate-800/60">
        {/* Master Power Button */}
        <PowerButton enabled={settings.enabled} onToggle={handleTogglePower} />

        {/* Mode Selector (Light | Dark | Auto) */}
        <ModeSelector
          mode={settings.mode}
          isPro={isProUser}
          onChangeMode={handleChangeMode}
          onLockedClick={openUpgradeModal}
        />

        {/* Current Site Card */}
        <CurrentSiteCard
          hostname={currentHostname}
          isRestrictedPage={isRestricted}
          isSiteEnabled={siteEnabled}
          isAlreadyDark={isAlreadyDark}
          isPro={isProUser}
          onToggleSite={handleToggleSite}
          onLockedClick={openUpgradeModal}
        />

        {/* Sliders */}
        <SlidersSection
          brightness={settings.brightness}
          contrast={settings.contrast}
          warm={settings.warm}
          grayscale={settings.grayscale}
          isPro={isProUser}
          onChangeBrightness={(v) => handleUpdateSliders({ brightness: v })}
          onChangeContrast={(v) => handleUpdateSliders({ contrast: v })}
          onChangeWarm={(v) => handleUpdateSliders({ warm: v })}
          onChangeGrayscale={(v) => handleUpdateSliders({ grayscale: v })}
          onLockedClick={openUpgradeModal}
        />

        {/* Preset Chips */}
        <PresetChips
          activePresetId={settings.activePresetId}
          customPresets={settings.customPresets}
          isPro={isProUser}
          onSelectPreset={handleSelectPreset}
          onSavePreset={() => setSavePresetModalOpen(true)}
          onLockedClick={openUpgradeModal}
        />
      </main>

      {/* Footer */}
      <Footer
        isPro={isProUser}
        onOpenOptions={() => openOptionsPage()}
        onOpenUpgradeModal={() => openUpgradeModal('Full Pro Access')}
      />

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={upgradeModalOpen}
        featureName={lockedFeatureName}
        onClose={() => setUpgradeModalOpen(false)}
        onOpenLicenseTab={() => openOptionsPage('license')}
      />

      {/* Save Preset Modal */}
      <SavePresetModal
        isOpen={savePresetModalOpen}
        currentSliders={{
          brightness: settings.brightness,
          contrast: settings.contrast,
          warm: settings.warm,
          grayscale: settings.grayscale,
        }}
        onClose={() => setSavePresetModalOpen(false)}
        onSave={handleSaveCustomPreset}
      />
    </div>
  );
};
