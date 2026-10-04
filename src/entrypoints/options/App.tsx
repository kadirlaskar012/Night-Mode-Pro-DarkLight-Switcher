import React, { useEffect, useState } from 'react';
import {
  Moon,
  Sliders,
  Clock,
  Globe,
  Sparkles,
  Keyboard,
  Key,
  Info,
  Crown,
  Download,
  ExternalLink,
} from 'lucide-react';
import { AboutTab } from '@/components/options/AboutTab';
import { GeneralTab } from '@/components/options/GeneralTab';
import { LicenseTab } from '@/components/options/LicenseTab';
import { PresetsTab } from '@/components/options/PresetsTab';
import { ScheduleTab } from '@/components/options/ScheduleTab';
import { ShortcutsTab } from '@/components/options/ShortcutsTab';
import { SitesTab } from '@/components/options/SitesTab';
import { UpgradeModal } from '@/components/UpgradeModal';
import { DEFAULT_USER_SETTINGS } from '@/constants/defaults';
import { PRICING_CONFIG } from '@/constants/pricing';
import { getTrialDaysRemaining, isPro, isTrialActive } from '@/lib/license';
import {
  getLicenseInfo,
  getSettings,
  getTrialInfo,
  saveSettings,
} from '@/lib/storage';
import { LicenseInfo, TrialInfo } from '@/types/license';
import { UserSettings } from '@/types/settings';

type TabId = 'general' | 'schedule' | 'sites' | 'presets' | 'shortcuts' | 'license' | 'about';

export const OptionsApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('general');
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_USER_SETTINGS);
  const [license, setLicense] = useState<LicenseInfo | null>(null);
  const [trial, setTrial] = useState<TrialInfo | null>(null);

  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [lockedFeatureName, setLockedFeatureName] = useState('');
  const [savedBanner, setSavedBanner] = useState(false);

  useEffect(() => {
    async function init() {
      const [s, l, t] = await Promise.all([getSettings(), getLicenseInfo(), getTrialInfo()]);
      setSettings(s);
      setLicense(l);
      setTrial(t);

      // Handle URL hash navigation (e.g. #license)
      const hash = window.location.hash.replace('#', '') as TabId;
      if (['general', 'schedule', 'sites', 'presets', 'shortcuts', 'license', 'about'].includes(hash)) {
        setActiveTab(hash);
      }
    }
    init();
  }, []);

  const handleUpdateSettings = async (partial: Partial<UserSettings>) => {
    const updated = { ...settings, ...partial };
    setSettings(updated);
    await saveSettings(updated);
    chrome.runtime.sendMessage({ type: 'BROADCAST_SETTINGS' });

    // Flash small saved indicator
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 2000);
  };

  const isProUser = isPro(license, trial);
  const trialActive = isTrialActive(trial) && license?.status !== 'active';
  const daysLeft = getTrialDaysRemaining(trial);

  const openUpgradeModal = (feature?: string) => {
    setLockedFeatureName(feature || '');
    setUpgradeModalOpen(true);
  };

  const navItems = [
    { id: 'general' as TabId, label: 'General', icon: Sliders },
    { id: 'schedule' as TabId, label: 'Schedule', icon: Clock, pro: true },
    { id: 'sites' as TabId, label: 'Sites & Rules', icon: Globe, pro: true },
    { id: 'presets' as TabId, label: 'Presets', icon: Sparkles },
    { id: 'shortcuts' as TabId, label: 'Shortcuts', icon: Keyboard },
    { id: 'license' as TabId, label: 'License & Plan', icon: Key },
    { id: 'about' as TabId, label: 'About & Backup', icon: Info },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-slate-900/80 border-b border-slate-800 backdrop-blur-md px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-glow flex items-center justify-center p-1.5">
            <Moon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              Night Mode Pro
              <span className="text-xs font-normal text-slate-400">Settings</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {savedBanner && (
            <span className="text-xs text-emerald-400 font-medium animate-fadeIn">
              ✓ Saved
            </span>
          )}

          <button
            onClick={() => chrome.tabs.create({ url: chrome.runtime.getURL('/options.html' + window.location.hash) })}
            title="Open options in a full browser tab"
            className="px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700/80 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Open in Tab</span>
          </button>

          {isProUser ? (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              PRO ACTIVE
            </span>
          ) : trialActive ? (
            <button
              onClick={() => openUpgradeModal('Trial Active')}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 flex items-center gap-1.5 transition-colors"
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              TRIAL ({daysLeft} days left)
            </button>
          ) : (
            <button
              onClick={() => openUpgradeModal('Lifetime Pro Upgrade')}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-glow hover:opacity-95 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Upgrade ($2.99)</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 flex flex-col md:flex-row gap-6">
        {/* Navigation Sidebar / Horizontal Tab Bar */}
        <aside className="w-full md:w-60 flex-shrink-0 flex md:flex-col overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 gap-1.5 border-b md:border-b-0 md:border-r border-slate-800/80 pr-0 md:pr-4 custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  window.location.hash = item.id;
                }}
                className={`flex-shrink-0 md:w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-glow'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 bg-slate-900/60 md:bg-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="whitespace-nowrap">{item.label}</span>
                </div>
                {item.pro && !isProUser && (
                  <span className="ml-2 text-[9px] text-amber-400 font-bold bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-500/30">
                    PRO
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Right Content Area */}
        <main className="flex-1 min-w-0">
          {activeTab === 'general' && (
            <GeneralTab
              settings={settings}
              isPro={isProUser}
              onUpdate={handleUpdateSettings}
              onLockedClick={openUpgradeModal}
            />
          )}

          {activeTab === 'schedule' && (
            <ScheduleTab
              settings={settings}
              isPro={isProUser}
              onUpdate={handleUpdateSettings}
              onLockedClick={openUpgradeModal}
            />
          )}

          {activeTab === 'sites' && (
            <SitesTab
              settings={settings}
              isPro={isProUser}
              onUpdate={handleUpdateSettings}
              onLockedClick={openUpgradeModal}
            />
          )}

          {activeTab === 'presets' && (
            <PresetsTab
              settings={settings}
              isPro={isProUser}
              onUpdate={handleUpdateSettings}
              onLockedClick={openUpgradeModal}
            />
          )}

          {activeTab === 'shortcuts' && (
            <ShortcutsTab
              isPro={isProUser}
              onLockedClick={openUpgradeModal}
            />
          )}

          {activeTab === 'license' && license && trial && (
            <LicenseTab
              license={license}
              trial={trial}
              onUpdateLicense={(l) => setLicense(l)}
            />
          )}

          {activeTab === 'about' && (
            <AboutTab
              settings={settings}
              onUpdateSettings={(s) => setSettings(s)}
            />
          )}
        </main>
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={upgradeModalOpen}
        featureName={lockedFeatureName}
        onClose={() => setUpgradeModalOpen(false)}
        onOpenLicenseTab={() => setActiveTab('license')}
      />
    </div>
  );
};
