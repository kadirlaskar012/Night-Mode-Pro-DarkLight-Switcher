import React from 'react';
import { Settings, Sparkles, Star } from 'lucide-react';
import { PRICING_CONFIG } from '@/constants/pricing';

interface FooterProps {
  isPro: boolean;
  onOpenOptions: () => void;
  onOpenUpgradeModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  isPro,
  onOpenOptions,
  onOpenUpgradeModal,
}) => {
  return (
    <footer className="mt-3 px-4 py-2.5 bg-slate-800/80 border-t border-slate-700/50 flex items-center justify-between">
      <button
        type="button"
        onClick={onOpenOptions}
        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
      >
        <Settings className="w-3.5 h-3.5" />
        <span>Settings</span>
      </button>

      {!isPro ? (
        <button
          type="button"
          onClick={onOpenUpgradeModal}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-glow hover:opacity-95 transition-all active:scale-95"
        >
          <Sparkles className="w-3 h-3 text-amber-300" />
          <span>Upgrade $2.99</span>
        </button>
      ) : (
        <span className="text-[11px] text-indigo-400 font-medium flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Pro Activated
        </span>
      )}

      <a
        href={PRICING_CONFIG.CHROME_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-xs text-slate-400 hover:text-amber-400 transition-colors"
      >
        <Star className="w-3.5 h-3.5" />
        <span>Rate us</span>
      </a>
    </footer>
  );
};
