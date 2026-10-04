import React from 'react';
import { Lock, Plus } from 'lucide-react';
import { BUILT_IN_PRESETS } from '@/constants/defaults';
import { Preset } from '@/types/settings';

interface PresetChipsProps {
  activePresetId: string;
  customPresets: Preset[];
  isPro: boolean;
  onSelectPreset: (preset: Preset) => void;
  onSavePreset: () => void;
  onLockedClick: (feature: string) => void;
}

export const PresetChips: React.FC<PresetChipsProps> = ({
  activePresetId,
  customPresets,
  isPro,
  onSelectPreset,
  onSavePreset,
  onLockedClick,
}) => {
  const allPresets = [...BUILT_IN_PRESETS, ...customPresets];

  return (
    <div className="px-4 py-2">
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className="text-slate-300 font-medium">Presets</span>
        <button
          type="button"
          onClick={() => {
            if (!isPro) {
              onLockedClick('Save Custom Presets');
            } else {
              onSavePreset();
            }
          }}
          className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5"
        >
          <Plus className="w-3 h-3" />
          <span>Save preset</span>
          {!isPro && (
            <span className="px-1 py-0.2 rounded text-[8px] font-extrabold bg-gradient-to-r from-amber-500 to-indigo-500 text-white shadow-sm ml-0.5">
              PRO
            </span>
          )}
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {allPresets.map((preset) => {
          const isSelected = activePresetId === preset.id;
          const isLocked = preset.isPro && !isPro;

          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => {
                if (isLocked) {
                  onLockedClick(`"${preset.name}" Preset`);
                } else {
                  onSelectPreset(preset);
                }
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-700/60'
              }`}
            >
              <span>{preset.name}</span>
              {isLocked && (
                <span className="px-1 py-0.2 rounded text-[8px] font-extrabold bg-gradient-to-r from-amber-500 to-indigo-500 text-white shadow-sm ml-0.5">
                  PRO
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
