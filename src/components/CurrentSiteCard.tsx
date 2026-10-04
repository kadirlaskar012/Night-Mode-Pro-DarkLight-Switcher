import React from 'react';
import { Globe, Lock, ShieldAlert, Sparkles, Check } from 'lucide-react';

interface CurrentSiteCardProps {
  hostname: string;
  isRestrictedPage: boolean;
  isSiteEnabled: boolean;
  isAlreadyDark: boolean;
  isPro: boolean;
  onToggleSite: (enabled: boolean) => void;
  onLockedClick: (feature: string) => void;
}

export const CurrentSiteCard: React.FC<CurrentSiteCardProps> = ({
  hostname,
  isRestrictedPage,
  isSiteEnabled,
  isAlreadyDark,
  isPro,
  onToggleSite,
  onLockedClick,
}) => {
  if (isRestrictedPage || !hostname) {
    return (
      <div className="mx-4 my-2 p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/40 flex items-center gap-2 text-slate-400 text-xs">
        <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0" />
        <span>Night Mode is not available on this browser page.</span>
      </div>
    );
  }

  return (
    <div className="mx-4 my-2 p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 min-w-0">
          <Globe className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span className="text-xs font-semibold text-slate-200 truncate max-w-[170px]" title={hostname}>
            {hostname}
          </span>
        </div>

        {/* Site toggle */}
        <div className="flex items-center gap-1.5">
          {!isPro && (
            <span className="px-1.5 py-0.2 rounded text-[8px] font-extrabold bg-gradient-to-r from-amber-500 to-indigo-500 text-white shadow-sm">
              PRO
            </span>
          )}
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={isSiteEnabled}
              onChange={(e) => {
                if (!isPro) {
                  onLockedClick('Per-Site Night Mode Controls');
                } else {
                  onToggleSite(e.target.checked);
                }
              }}
            />
            <div className="w-7 h-4 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>
      </div>

      {/* Already dark indicator */}
      {isAlreadyDark && (
        <div className="flex items-center justify-between pt-1 border-t border-slate-700/30 text-[11px] text-slate-400">
          <span className="flex items-center gap-1 text-indigo-300">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            Site has native dark theme
          </span>
          <span className="text-[10px] text-slate-500 font-mono">Auto-skipped</span>
        </div>
      )}
    </div>
  );
};
