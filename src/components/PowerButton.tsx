import React from 'react';
import { Power } from 'lucide-react';
import { getMessage } from '@/lib/i18n';

interface PowerButtonProps {
  enabled: boolean;
  onToggle: () => void;
}

export const PowerButton: React.FC<PowerButtonProps> = ({ enabled, onToggle }) => {
  const activeLabel = getMessage('powerActive', undefined, 'Night Mode Active');
  const inactiveLabel = getMessage('powerInactive', undefined, 'Night Mode Inactive');

  return (
    <div className="flex flex-col items-center justify-center pt-4 pb-2">
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={enabled}
        aria-label={enabled ? inactiveLabel : activeLabel}
        className={`relative group flex items-center justify-center w-20 h-20 rounded-full transition-all duration-300 ease-out focus:outline-none focus:ring-4 ${
          enabled
            ? 'bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-glow focus:ring-indigo-500/40 text-white scale-100 hover:scale-105 active:scale-95'
            : 'bg-slate-800 text-slate-400 border-2 border-slate-700 hover:border-slate-500 hover:text-slate-300 focus:ring-slate-600/30'
        }`}
      >
        {/* Outer subtle glow ring when active */}
        {enabled && (
          <span className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping -z-10 pointer-events-none" />
        )}
        <Power
          className={`w-9 h-9 transition-transform duration-300 ${
            enabled ? 'rotate-0 text-white' : '-rotate-12 text-slate-400'
          }`}
        />
      </button>

      <span className="mt-2 text-xs font-medium text-slate-300">
        {enabled ? (
          <span className="text-emerald-400 flex items-center gap-1.5 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {activeLabel}
          </span>
        ) : (
          <span className="text-slate-400">{inactiveLabel}</span>
        )}
      </span>
    </div>
  );
};
