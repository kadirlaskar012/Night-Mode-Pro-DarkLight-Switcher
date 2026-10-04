import React from 'react';
import { Sliders, Sparkles, Moon, Sun, Clock, Zap, Shield, Globe, Lock } from 'lucide-react';
import { UserSettings, EngineType, ThemeMode } from '@/types/settings';

interface GeneralTabProps {
  settings: UserSettings;
  isPro: boolean;
  onUpdate: (partial: Partial<UserSettings>) => void;
  onLockedClick: (feature: string) => void;
}

export const GeneralTab: React.FC<GeneralTabProps> = ({
  settings,
  isPro,
  onUpdate,
  onLockedClick,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight">General Preferences</h2>
        <p className="text-sm text-slate-400">Configure default appearance and theme behaviors.</p>
      </div>

      <div className="grid gap-6">
        {/* Default Mode */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Default Mode</h3>
              <p className="text-xs text-slate-400">Choose the initial state when opening new tabs.</p>
            </div>
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => onUpdate({ mode: 'light' })}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                  settings.mode === 'light' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                Light
              </button>
              <button
                type="button"
                onClick={() => onUpdate({ mode: 'dark' })}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                  settings.mode === 'dark' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-indigo-300" />
                Dark
              </button>
              <button
                type="button"
                onClick={() => {
                  if (isPro) {
                    onUpdate({ mode: 'auto' });
                  } else {
                    onLockedClick('Automatic Theme Mode');
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                  settings.mode === 'auto' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-indigo-300" />
                Auto
                {!isPro && <Lock className="w-3 h-3 text-amber-400 ml-0.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Engine Choice */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Dark Engine Mode</h3>
            <p className="text-xs text-slate-400">Select how colors and page elements are converted.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {/* Smart Engine */}
            <div
              onClick={() => onUpdate({ engine: 'smart' })}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                settings.engine === 'smart'
                  ? 'bg-indigo-950/40 border-indigo-500 shadow-glow'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-indigo-400" />
                  Smart Engine (Recommended)
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  Included
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                High-performance intelligent color inversion. Photos, videos, canvas, and graphics keep original colors.
              </p>
            </div>

            {/* Filter-Only Engine (Pro) */}
            <div
              onClick={() => {
                if (isPro) {
                  onUpdate({ engine: 'filter' });
                } else {
                  onLockedClick('Alternative Filter-Only Engine');
                }
              }}
              className={`p-4 rounded-xl border cursor-pointer transition-all relative ${
                settings.engine === 'filter'
                  ? 'bg-indigo-950/40 border-indigo-500 shadow-glow'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  Filter-Only Engine
                </span>
                {!isPro && (
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-500/30 flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" /> PRO
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Applies a gentle dimming and warm overlay without inverting colors. Ideal for sites that break with standard inversion.
              </p>
            </div>
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 divide-y divide-slate-800">
          {/* Smooth Fade Transition */}
          <div className="flex items-center justify-between py-3 first:pt-0">
            <div>
              <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-200">
                <span>Smooth Fade Transitions</span>
                {!isPro && <Lock className="w-3.5 h-3.5 text-amber-400" />}
              </div>
              <p className="text-xs text-slate-400">Gentle CSS transition when toggling modes (automatically disabled if reduced motion preferred).</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isPro ? settings.smoothTransition : false}
                disabled={!isPro}
                onChange={(e) => {
                  if (isPro) onUpdate({ smoothTransition: e.target.checked });
                  else onLockedClick('Smooth Fade Transitions');
                }}
              />
              <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {/* Already Dark Detection */}
          <div className="flex items-center justify-between py-3">
            <div>
              <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-200">
                <span>Auto-Skip Already Dark Sites</span>
              </div>
              <p className="text-xs text-slate-400">Detects native dark themes (via meta color-scheme and background luminance) to prevent double-inverting.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.alreadyDarkDetection}
                onChange={(e) => onUpdate({ alreadyDarkDetection: e.target.checked })}
              />
              <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {/* Language Selection */}
          <div className="flex items-center justify-between py-3 last:pb-0">
            <div>
              <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-200">
                <Globe className="w-4 h-4 text-indigo-400" />
                <span>Interface Language</span>
              </div>
              <p className="text-xs text-slate-400">Select language for popup, options, and extension controls.</p>
            </div>
            <select
              value={settings.language}
              onChange={(e) => onUpdate({ language: e.target.value })}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="en">English</option>
              <option value="bn">বাংলা (Bangla)</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="es">Español (Spanish)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
