import React, { useRef, useState } from 'react';
import { Info, Download, Upload, RotateCcw, Mail, Shield, ExternalLink, Heart, AlertTriangle } from 'lucide-react';
import { PRICING_CONFIG } from '@/constants/pricing';
import { resetSettings, sanitizeUserSettings, saveSettings } from '@/lib/storage';
import { UserSettings } from '@/types/settings';

interface AboutTabProps {
  settings: UserSettings;
  onUpdateSettings: (settings: UserSettings) => void;
}

export const AboutTab: React.FC<AboutTabProps> = ({ settings, onUpdateSettings }) => {
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(settings, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `night-mode-pro-settings-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const raw = JSON.parse(event.target?.result as string);
        if (raw && typeof raw === 'object') {
          const sanitized = sanitizeUserSettings(raw);
          await saveSettings(sanitized);
          onUpdateSettings(sanitized);
          setImportStatus('Settings successfully validated and imported!');
          chrome.runtime.sendMessage({ type: 'BROADCAST_SETTINGS' });
        } else {
          setImportStatus('Failed to import: JSON must be an object.');
        }
      } catch (err) {
        setImportStatus('Failed to import: Invalid JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetDefaults = async () => {
    const defaults = await resetSettings();
    onUpdateSettings(defaults);
    setResetConfirmOpen(false);
    chrome.runtime.sendMessage({ type: 'BROADCAST_SETTINGS' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight">About &amp; Maintenance</h2>
        <p className="text-sm text-slate-400">
          Night Mode Pro version, backups, privacy policy, and support.
        </p>
      </div>

      {/* App Info Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Night Mode Pro – Dark/Light Switcher</h3>
            <p className="text-xs text-slate-400 mt-0.5">Version 1.0.0 • Manifest V3 Production Ready</p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
            Latest Version
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Crafted for high performance, zero battery drain, and ultimate eye comfort at night. Built with strictly zero trackers, zero telemetry, and zero remote code injection.
        </p>

        <div className="flex flex-wrap gap-4 pt-2 border-t border-slate-800 text-xs">
          <a
            href="privacy-policy.html"
            target="_blank"
            className="text-indigo-400 hover:underline flex items-center gap-1"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Privacy Policy</span>
          </a>

          <a
            href={`mailto:${PRICING_CONFIG.SUPPORT_EMAIL}`}
            className="text-indigo-400 hover:underline flex items-center gap-1"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Priority Support ({PRICING_CONFIG.SUPPORT_EMAIL})</span>
          </a>

          <a
            href={PRICING_CONFIG.WEBSITE_URL}
            target="_blank"
            className="text-indigo-400 hover:underline flex items-center gap-1"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Official Website</span>
          </a>
        </div>
      </div>

      {/* Backup & Restore (JSON) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-200">Backup &amp; Migration</h3>
          <p className="text-xs text-slate-400">
            Export all your custom presets, schedule, and site whitelist/blacklists to transfer between computers.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleExportJson}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium flex items-center gap-2 border border-slate-700 transition-colors"
          >
            <Download className="w-4 h-4 text-indigo-400" />
            <span>Export Settings JSON</span>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            accept=".json"
            onChange={handleImportJson}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium flex items-center gap-2 border border-slate-700 transition-colors"
          >
            <Upload className="w-4 h-4 text-indigo-400" />
            <span>Import Settings JSON</span>
          </button>

          <button
            type="button"
            onClick={() => setResetConfirmOpen(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 rounded-xl text-xs font-medium flex items-center gap-2 border border-slate-700 hover:border-rose-500/40 transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-rose-400" />
            <span>Reset to Factory Defaults</span>
          </button>
        </div>

        {importStatus && (
          <p className="text-xs text-indigo-300 font-mono bg-indigo-950/30 p-2 rounded-lg border border-indigo-500/20">
            {importStatus}
          </p>
        )}
      </div>

      {/* Changelog v1.0.0 */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <h3 className="text-sm font-semibold text-slate-200">Changelog</h3>
        <div className="space-y-2 text-xs text-slate-400">
          <div className="font-semibold text-white">v1.0.0 (Initial Release)</div>
          <ul className="list-disc pl-5 space-y-1">
            <li>High-performance Smart Invert Engine with image/video re-inversion</li>
            <li>Alternative Filter-Only Engine for sensitive sites</li>
            <li>Zero-latency Anti-Flash prevention at document_start</li>
            <li>Astronomical sunrise and sunset auto-scheduling calculation</li>
            <li>Multi-language support: English, Bangla, Hindi, Spanish</li>
            <li>Alt+Shift+D (Tab), Alt+Shift+N (Global), Alt+Shift+Up/Down shortcuts</li>
            <li>Lemon Squeezy &amp; Gumroad license integration with offline grace period</li>
          </ul>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5 text-rose-400 font-bold text-sm">
              <AlertTriangle className="w-5 h-5" />
              <span>Reset all settings to default?</span>
            </div>

            <p className="text-xs text-slate-300">
              This will restore all sliders, schedules, presets, and site rules to their original factory state. Your license key and Pro status will NOT be removed.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setResetConfirmOpen(false)}
                className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetDefaults}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow-glow"
              >
                Yes, Reset Defaults
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
