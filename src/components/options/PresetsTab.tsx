import React, { useState } from 'react';
import { Sparkles, Plus, Trash2, Edit2, Check, Lock, SunMedium, Flame, Contrast, Eye } from 'lucide-react';
import { BUILT_IN_PRESETS } from '@/constants/defaults';
import { Preset, UserSettings } from '@/types/settings';

interface PresetsTabProps {
  settings: UserSettings;
  isPro: boolean;
  onUpdate: (partial: Partial<UserSettings>) => void;
  onLockedClick: (feature: string) => void;
}

export const PresetsTab: React.FC<PresetsTabProps> = ({
  settings,
  isPro,
  onUpdate,
  onLockedClick,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');

  const [newPresetName, setNewPresetName] = useState('');
  const [brightness, setBrightness] = useState(80);
  const [contrast, setContrast] = useState(100);
  const [warm, setWarm] = useState(30);
  const [grayscale, setGrayscale] = useState(0);

  const customPresets = settings.customPresets || [];

  const handleCreatePreset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPro) {
      onLockedClick('Save Custom Presets');
      return;
    }
    if (!newPresetName.trim()) return;

    const newPreset: Preset = {
      id: 'custom_' + Date.now(),
      name: newPresetName.trim(),
      isCustom: true,
      isPro: true,
      brightness,
      contrast,
      warm,
      grayscale,
    };

    onUpdate({
      customPresets: [...customPresets, newPreset],
    });

    setNewPresetName('');
  };

  const handleDeletePreset = (id: string) => {
    onUpdate({
      customPresets: customPresets.filter((p) => p.id !== id),
    });
  };

  const handleStartRename = (preset: Preset) => {
    setEditingId(preset.id);
    setEditingName(preset.name);
  };

  const handleSaveRename = (id: string) => {
    if (!editingName.trim()) return;
    onUpdate({
      customPresets: customPresets.map((p) =>
        p.id === id ? { ...p, name: editingName.trim() } : p
      ),
    });
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight">Theme Presets</h2>
        <p className="text-sm text-slate-400">
          Choose from curated presets or create custom color configurations.
        </p>
      </div>

      {!isPro && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-transparent border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-inner">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Reading, Deep Night, OLED Black &amp; Custom Presets are Pro</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-gradient-to-r from-amber-500 to-indigo-500 text-white shadow-sm">
                  PRO
                </span>
              </h4>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Unlock all specialized presets and save unlimited custom configurations with Night Mode Pro Lifetime ($2.99 one-time).
              </p>
            </div>
          </div>
          <button
            onClick={() => onLockedClick('Pro Theme Presets')}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-glow flex-shrink-0 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>Upgrade to Pro ($2.99) &rarr;</span>
          </button>
        </div>
      )}

      {/* Built-In Presets Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-200">Built-In Presets</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {BUILT_IN_PRESETS.map((preset) => {
            const isLocked = preset.isPro && !isPro;
            const isActive = settings.activePresetId === preset.id;

            return (
              <div
                key={preset.id}
                onClick={() => {
                  if (isLocked) {
                    onLockedClick(`"${preset.name}" Preset`);
                  } else {
                    onUpdate({
                      activePresetId: preset.id,
                      brightness: preset.brightness,
                      contrast: preset.contrast,
                      warm: preset.warm,
                      grayscale: preset.grayscale,
                    });
                  }
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isActive
                    ? 'bg-indigo-950/40 border-indigo-500 shadow-glow'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{preset.name}</span>
                    {isActive && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/30 text-indigo-300">
                        Active
                      </span>
                    )}
                  </div>
                  {isLocked && <Lock className="w-3.5 h-3.5 text-amber-400" />}
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <SunMedium className="w-3 h-3 text-amber-400" />
                    Brightness: {preset.brightness}%
                  </span>
                  <span className="flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-500" />
                    Warm: {preset.warm}%
                  </span>
                  <span className="flex items-center gap-1">
                    <Contrast className="w-3 h-3 text-indigo-400" />
                    Contrast: {preset.contrast}%
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3 text-emerald-400" />
                    Grayscale: {preset.grayscale}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Custom Preset */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            Create Custom Preset
            {!isPro && <Lock className="w-3.5 h-3.5 text-amber-400" />}
          </h3>
        </div>

        <form onSubmit={handleCreatePreset} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Preset Name</label>
            <input
              type="text"
              placeholder="e.g. Ultra Dim Reading"
              value={newPresetName}
              disabled={!isPro}
              onChange={(e) => setNewPresetName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 disabled:opacity-50"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Brightness</span>
                <span className="font-mono">{brightness}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                disabled={!isPro}
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="w-full accent-indigo-500 disabled:opacity-50"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Warm Light Filter</span>
                <span className="font-mono">{warm}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                disabled={!isPro}
                value={warm}
                onChange={(e) => setWarm(Number(e.target.value))}
                className="w-full accent-amber-500 disabled:opacity-50"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Contrast</span>
                <span className="font-mono">{contrast}%</span>
              </div>
              <input
                type="range"
                min={50}
                max={150}
                disabled={!isPro}
                value={contrast}
                onChange={(e) => setContrast(Number(e.target.value))}
                className="w-full accent-indigo-500 disabled:opacity-50"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Grayscale</span>
                <span className="font-mono">{grayscale}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                disabled={!isPro}
                value={grayscale}
                onChange={(e) => setGrayscale(Number(e.target.value))}
                className="w-full accent-emerald-500 disabled:opacity-50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!isPro || !newPresetName.trim()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-glow disabled:opacity-50 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Save Custom Preset</span>
          </button>
        </form>
      </div>

      {/* User Custom Presets List */}
      {customPresets.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-semibold text-slate-200">
            Your Custom Presets ({customPresets.length})
          </h3>

          <div className="divide-y divide-slate-800">
            {customPresets.map((preset) => (
              <div key={preset.id} className="py-3 flex items-center justify-between">
                <div className="flex-1 mr-4">
                  {editingId === preset.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
                      />
                      <button
                        onClick={() => handleSaveRename(preset.id)}
                        className="p-1 text-emerald-400 hover:text-emerald-300"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-2">
                        {preset.name}
                        {settings.activePresetId === preset.id && (
                          <span className="text-[10px] text-indigo-400 font-normal">(Active)</span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 flex gap-3 mt-1">
                        <span>B: {preset.brightness}%</span>
                        <span>W: {preset.warm}%</span>
                        <span>C: {preset.contrast}%</span>
                        <span>G: {preset.grayscale}%</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      onUpdate({
                        activePresetId: preset.id,
                        brightness: preset.brightness,
                        contrast: preset.contrast,
                        warm: preset.warm,
                        grayscale: preset.grayscale,
                      })
                    }
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200"
                  >
                    Apply
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStartRename(preset)}
                    className="p-1 text-slate-500 hover:text-slate-300"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeletePreset(preset.id)}
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
    </div>
  );
};
