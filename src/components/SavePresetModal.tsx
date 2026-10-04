import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { Preset } from '@/types/settings';

interface SavePresetModalProps {
  isOpen: boolean;
  currentSliders: {
    brightness: number;
    contrast: number;
    warm: number;
    grayscale: number;
  };
  onClose: () => void;
  onSave: (preset: Preset) => void;
}

export const SavePresetModal: React.FC<SavePresetModalProps> = ({
  isOpen,
  currentSliders,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newPreset: Preset = {
      id: 'custom_' + Date.now(),
      name: name.trim(),
      isCustom: true,
      isPro: true,
      ...currentSliders,
    };

    onSave(newPreset);
    setName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-[300px] bg-slate-900 border border-slate-700 rounded-2xl p-4 shadow-xl text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-1.5">
          <Save className="w-4 h-4 text-indigo-400" />
          Save Current Preset
        </h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Preset Name</label>
            <input
              type="text"
              required
              autoFocus
              maxLength={20}
              placeholder="e.g. Bedtime Warmth"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="text-[11px] text-slate-400 space-y-0.5 bg-slate-800/50 p-2 rounded-lg">
            <div>Brightness: {currentSliders.brightness}%</div>
            <div>Warmth: {currentSliders.warm}%</div>
            <div>Contrast: {currentSliders.contrast}%</div>
            <div>Grayscale: {currentSliders.grayscale}%</div>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-glow transition-all"
          >
            Save Preset
          </button>
        </form>
      </div>
    </div>
  );
};
