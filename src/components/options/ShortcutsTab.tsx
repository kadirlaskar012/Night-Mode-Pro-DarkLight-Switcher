import React from 'react';
import { Command, ExternalLink, Keyboard, Sparkles, Lock } from 'lucide-react';

interface ShortcutsTabProps {
  isPro: boolean;
  onLockedClick: (feature: string) => void;
}

export const ShortcutsTab: React.FC<ShortcutsTabProps> = ({ isPro, onLockedClick }) => {
  const shortcuts = [
    {
      title: 'Toggle Current Tab',
      description: 'Switch between dark and light mode instantly on the active tab.',
      keys: ['Alt', 'D'],
      isPro: false,
    },
    {
      title: 'Global Toggle (All Tabs)',
      description: 'Turn Night Mode Pro on or off across all open tabs at once.',
      keys: ['Alt', 'Shift', 'D'],
      isPro: true,
    },
    {
      title: 'Increase Brightness (+5%)',
      description: 'Quickly brighten the screen in 5% increments without opening popup.',
      keys: ['Alt', '↑'],
      isPro: true,
    },
    {
      title: 'Decrease Brightness (-5%)',
      description: 'Quickly dim the screen in 5% increments for instant eye comfort.',
      keys: ['Alt', '↓'],
      isPro: true,
    },
  ];

  const handleOpenChromeShortcuts = () => {
    chrome.tabs.create({ url: 'chrome://extensions/shortcuts' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Keyboard Shortcuts</h2>
          <p className="text-sm text-slate-400">
            Control Night Mode Pro instantly with keyboard shortcuts from any tab.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenChromeShortcuts}
          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-glow"
        >
          <span>Customize Keys</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 divide-y divide-slate-800">
        {shortcuts.map((shortcut, i) => (
          <div key={i} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between">
            <div className="pr-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white">{shortcut.title}</span>
                {shortcut.isPro && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold text-indigo-300 bg-indigo-950/80 border border-indigo-500/30 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" /> PRO
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{shortcut.description}</p>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              {shortcut.keys.map((k, j) => (
                <kbd
                  key={j}
                  className="px-2.5 py-1 bg-slate-950 border border-slate-700/80 rounded-lg text-xs font-mono text-slate-200 shadow-sm"
                >
                  {k}
                </kbd>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-400 flex items-start gap-3">
        <Keyboard className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
        <span>
          To change any shortcut key combination or make shortcuts global across your entire operating system, click <strong>Customize Keys</strong> to open Chrome's native extension shortcut configuration page.
        </span>
      </div>
    </div>
  );
};
