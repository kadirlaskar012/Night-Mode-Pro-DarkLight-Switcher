import React from 'react';
import { Crown, Sparkles, Moon } from 'lucide-react';
import { LicenseInfo, TrialInfo } from '@/types/license';
import { getTrialDaysRemaining, isPro, isTrialActive } from '@/lib/license';

interface HeaderProps {
  license: LicenseInfo | null;
  trial: TrialInfo | null;
  onOpenUpgradeModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ license, trial, onOpenUpgradeModal }) => {
  const isProUser = isPro(license, trial);
  const trialActive = isTrialActive(trial) && license?.status !== 'active';
  const daysLeft = getTrialDaysRemaining(trial);

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-slate-800/60 border-b border-slate-700/50 backdrop-blur-sm">
      <div className="flex items-center space-x-2.5">
        <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-glow p-1">
          <Moon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-sm font-semibold tracking-tight text-white flex items-center gap-1.5">
            Night Mode Pro
          </h1>
          <p className="text-[10px] text-slate-400 font-medium">Eye Comfort & Dark Theme</p>
        </div>
      </div>

      <div>
        {isProUser ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-gradient-to-r from-amber-500/20 to-indigo-500/20 text-amber-300 border border-amber-500/40 shadow-glow">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            PRO ACTIVE
          </span>
        ) : (
          <button
            onClick={onOpenUpgradeModal}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 hover:border-indigo-400 transition-all shadow-sm group cursor-pointer"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span>GET PRO</span>
          </button>
        )}
      </div>
    </header>
  );
};
