import React, { useState } from 'react';
import { Globe, Plus, Trash2, Search, Upload, Shield, Check, Lock, AlertCircle } from 'lucide-react';
import { SiteRule, SiteSetting, UserSettings } from '@/types/settings';

interface SitesTabProps {
  settings: UserSettings;
  isPro: boolean;
  onUpdate: (partial: Partial<UserSettings>) => void;
  onLockedClick: (feature: string) => void;
}

export const SitesTab: React.FC<SitesTabProps> = ({
  settings,
  isPro,
  onUpdate,
  onLockedClick,
}) => {
  const [newPattern, setNewPattern] = useState('');
  const [newType, setNewType] = useState<'whitelist' | 'blacklist'>('blacklist');
  const [searchQuery, setSearchQuery] = useState('');
  const [bulkText, setBulkText] = useState('');
  const [showBulkModal, setShowBulkModal] = useState(false);

  const siteRules = settings.siteRules || [];
  const perSiteSettings = settings.perSiteSettings || {};

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPro) {
      onLockedClick('Custom Whitelist & Blacklist');
      return;
    }
    if (!newPattern.trim()) return;

    const newRule: SiteRule = {
      id: 'rule_' + Date.now(),
      pattern: newPattern.trim().toLowerCase(),
      type: newType,
      createdAt: Date.now(),
    };

    onUpdate({
      siteRules: [newRule, ...siteRules],
    });
    setNewPattern('');
  };

  const handleDeleteRule = (id: string) => {
    onUpdate({
      siteRules: siteRules.filter((r) => r.id !== id),
    });
  };

  const handleBulkImport = () => {
    if (!isPro) {
      onLockedClick('Bulk Site Rules Import');
      return;
    }
    const lines = bulkText.split('\n').map((l) => l.trim()).filter(Boolean);
    const added: SiteRule[] = [];

    lines.forEach((line) => {
      // Check if starts with ! or - for blacklist or whitelist
      let type: 'whitelist' | 'blacklist' = 'blacklist';
      let pattern = line;
      if (pattern.startsWith('+')) {
        type = 'whitelist';
        pattern = pattern.slice(1).trim();
      } else if (pattern.startsWith('-')) {
        type = 'blacklist';
        pattern = pattern.slice(1).trim();
      }

      if (pattern) {
        added.push({
          id: 'rule_' + Math.random().toString(36).substr(2, 9),
          pattern: pattern.toLowerCase(),
          type,
          createdAt: Date.now(),
        });
      }
    });

    onUpdate({
      siteRules: [...added, ...siteRules],
    });
    setBulkText('');
    setShowBulkModal(false);
  };

  const handleDeletePerSiteSetting = (hostname: string) => {
    const updated = { ...perSiteSettings };
    delete updated[hostname];
    onUpdate({ perSiteSettings: updated });
  };

  const filteredRules = siteRules.filter((r) =>
    r.pattern.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>Site Rules &amp; Overrides</span>
            {!isPro && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-gradient-to-r from-amber-500 to-indigo-500 text-white shadow-sm">
                PRO
              </span>
            )}
          </h2>
          <p className="text-sm text-slate-400">
            Control which websites are automatically inverted, filtered, or excluded.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (!isPro) {
              onLockedClick('Bulk Import Site Rules');
            } else {
              setShowBulkModal(true);
            }
          }}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Bulk Import</span>
        </button>
      </div>

      {!isPro && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-transparent border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-inner">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Domain Rules &amp; Custom Overrides are Pro Features</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-gradient-to-r from-amber-500 to-indigo-500 text-white shadow-sm">
                  PRO
                </span>
              </h4>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Create unlimited website whitelists and blacklists with Night Mode Pro Lifetime ($2.99 one-time).
              </p>
            </div>
          </div>
          <button
            onClick={() => onLockedClick('Custom Whitelist & Blacklist')}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-glow flex-shrink-0 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>Upgrade to Pro ($2.99) &rarr;</span>
          </button>
        </div>
      )}

      {/* Add New Rule Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-3">Add Website Rule</h3>

        <form onSubmit={handleAddRule} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="e.g. *.youtube.com, github.com/*, docs.google.com"
              value={newPattern}
              onChange={(e) => setNewPattern(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="blacklist">Blacklist (Always Disable)</option>
              <option value="whitelist">Whitelist (Always Enable)</option>
            </select>

            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-glow flex-shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Rule</span>
            </button>
          </div>
        </form>

        <p className="text-[11px] text-slate-500 mt-2">
          Wildcards: <code className="text-indigo-400">*.domain.com</code> matches all subdomains; <code className="text-indigo-400">domain.com/*</code> matches all pages on that domain.
        </p>
      </div>

      {/* Rules Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-200">
            Active Rules ({filteredRules.length})
          </h3>

          <div className="relative w-48">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter rules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {filteredRules.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            No rules found. Add websites above to create custom whitelist or blacklist rules.
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {filteredRules.map((rule) => (
              <div key={rule.id} className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      rule.type === 'whitelist'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-950 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {rule.type}
                  </span>
                  <span className="text-xs font-mono text-slate-200">{rule.pattern}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteRule(rule.id)}
                  className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Per-Site Saved Preferences */}
      {Object.keys(perSiteSettings).length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-semibold text-slate-200">
            Per-Site Custom Adjustments ({Object.keys(perSiteSettings).length})
          </h3>

          <div className="divide-y divide-slate-800">
            {Object.entries(perSiteSettings).map(([host, site]) => (
              <div key={host} className="py-2.5 flex items-center justify-between text-xs">
                <span className="font-mono text-slate-300">{host}</span>
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 text-[11px]">
                    {site.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeletePerSiteSetting(host)}
                    className="p-1 text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bulk Import Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-white">Bulk Import Website Rules</h3>
            <p className="text-xs text-slate-400">
              Paste rules one per line. Prefix with <code>+</code> for whitelist or <code>-</code> for blacklist (default is blacklist).
            </p>

            <textarea
              rows={6}
              placeholder={"+docs.google.com\n-*.youtube.com\n-netflix.com"}
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowBulkModal(false)}
                className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkImport}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-glow"
              >
                Import Rules
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
