import React from 'react';
import { Sun, Moon, Clock, Lock } from 'lucide-react';
import { getMessage } from '@/lib/i18n';
import { ThemeMode } from '@/types/settings';

interface ModeSelectorProps {
  mode: ThemeMode;
  isPro: boolean;
  onChangeMode: (mode: ThemeMode) => void;
  onLockedClick: (featureName: string) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  mode,
  isPro,
  onChangeMode,
  onLockedClick,
}) => {
  return (
    <div className="px-4 py-2">
      <div className="flex items-center justify-between p-1 bg-slate-800/80 rounded-xl border border-slate-700/60 shadow-inner">
        {/* Light Mode */}
        <button
          type="button"
          onClick={() => onChangeMode('light')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
            mode === 'light'
              ? 'bg-slate-700 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sun className="w-3.5 h-3.5 text-amber-400" />
          <span>{getMessage('modeLight', undefined, 'Light')}</span>
        </button>

        {/* Dark Mode */}
        <button
          type="button"
          onClick={() => onChangeMode('dark')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
            mode === 'dark'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Moon className="w-3.5 h-3.5 text-indigo-200" />
          <span>{getMessage('modeDark', undefined, 'Dark')}</span>
        </button>

        {/* Auto Mode (Pro) */}
        <button
          type="button"
          onClick={() => {
            if (isPro) {
              onChangeMode('auto');
            } else {
              onLockedClick('Automatic Schedule & Solar Sync');
            }
          }}
          className={`relative flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
            mode === 'auto'
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-indigo-300" />
          <span>{getMessage('modeAuto', undefined, 'Auto')}</span>
          {!isPro && (
            <span className="px-1 py-0.2 rounded text-[8px] font-extrabold bg-gradient-to-r from-amber-500 to-indigo-500 text-white shadow-sm ml-0.5">
              PRO
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
