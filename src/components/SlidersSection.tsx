import React from 'react';
import { SunMedium, Contrast, Flame, Eye, Lock, Crown } from 'lucide-react';

interface SlidersSectionProps {
  brightness: number;
  contrast: number;
  warm: number;
  grayscale: number;
  isPro: boolean;
  onChangeBrightness: (value: number) => void;
  onChangeContrast: (value: number) => void;
  onChangeWarm: (value: number) => void;
  onChangeGrayscale: (value: number) => void;
  onLockedClick: (feature: string) => void;
}

export const SlidersSection: React.FC<SlidersSectionProps> = ({
  brightness,
  contrast,
  warm,
  grayscale,
  isPro,
  onChangeBrightness,
  onChangeContrast,
  onChangeWarm,
  onChangeGrayscale,
  onLockedClick,
}) => {
  return (
    <div className="px-4 py-2 space-y-3">
      {/* Brightness Slider (Free 50-100%, Pro 10-100%) */}
      <div>
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="flex items-center gap-1.5 text-slate-300 font-medium">
            <SunMedium className="w-3.5 h-3.5 text-amber-400" />
            Brightness
          </span>
          <span className="text-[11px] font-mono font-semibold text-slate-400">
            {brightness}%
          </span>
        </div>
        <input
          type="range"
          min={isPro ? 10 : 50}
          max={100}
          step={1}
          value={brightness}
          onChange={(e) => onChangeBrightness(Number(e.target.value))}
          className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
        {!isPro && (
          <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
            <span>Free range: 50% - 100%</span>
            <span
              onClick={() => onLockedClick('Extended 10%–100% Brightness')}
              className="text-indigo-400 hover:underline cursor-pointer flex items-center gap-0.5"
            >
              10%–100% <Lock className="w-2.5 h-2.5 inline" />
            </span>
          </div>
        )}
      </div>

      {/* Warm / Blue-Light Filter Slider (Pro) */}
      <div
        className={`relative ${!isPro ? 'opacity-80 cursor-pointer' : ''}`}
        onClick={!isPro ? () => onLockedClick('Warm Light & Blue-Light Filter') : undefined}
      >
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="flex items-center gap-1.5 text-slate-300 font-medium">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            Warm Light Filter
            {!isPro && (
              <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-gradient-to-r from-amber-500 to-indigo-500 text-white flex items-center gap-0.5 shadow-sm">
                <Crown className="w-2.5 h-2.5" /> PRO
              </span>
            )}
          </span>
          <span className="text-[11px] font-mono font-semibold text-slate-400">
            {isPro ? `${warm}%` : 'Locked'}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          disabled={!isPro}
          value={isPro ? warm : 0}
          onChange={(e) => onChangeWarm(Number(e.target.value))}
          className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500 disabled:opacity-40 disabled:cursor-pointer"
        />
      </div>

      {/* Contrast Slider (Pro) */}
      <div
        className={`relative ${!isPro ? 'opacity-85 cursor-pointer' : ''}`}
        onClick={!isPro ? () => onLockedClick('Smart Contrast Enhancer') : undefined}
      >
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="flex items-center gap-1.5 text-slate-300 font-medium">
            <Contrast className="w-3.5 h-3.5 text-indigo-400" />
            Contrast
            {!isPro && (
              <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-gradient-to-r from-amber-500 to-indigo-500 text-white flex items-center gap-0.5 shadow-sm">
                <Crown className="w-2.5 h-2.5" /> PRO
              </span>
            )}
          </span>
          <span className="text-[11px] font-mono font-semibold text-slate-400">
            {isPro ? `${contrast}%` : 'Locked'}
          </span>
        </div>
        <input
          type="range"
          min={50}
          max={150}
          step={5}
          disabled={!isPro}
          value={isPro ? contrast : 100}
          onChange={(e) => onChangeContrast(Number(e.target.value))}
          className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 disabled:opacity-40 disabled:cursor-pointer"
        />
      </div>

      {/* Grayscale Slider (Pro) */}
      <div
        className={`relative ${!isPro ? 'opacity-85 cursor-pointer' : ''}`}
        onClick={!isPro ? () => onLockedClick('Distraction-Free Grayscale') : undefined}
      >
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="flex items-center gap-1.5 text-slate-300 font-medium">
            <Eye className="w-3.5 h-3.5 text-emerald-400" />
            Grayscale
            {!isPro && (
              <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-gradient-to-r from-amber-500 to-indigo-500 text-white flex items-center gap-0.5 shadow-sm">
                <Crown className="w-2.5 h-2.5" /> PRO
              </span>
            )}
          </span>
          <span className="text-[11px] font-mono font-semibold text-slate-400">
            {isPro ? `${grayscale}%` : 'Locked'}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          disabled={!isPro}
          value={isPro ? grayscale : 0}
          onChange={(e) => onChangeGrayscale(Number(e.target.value))}
          className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500 disabled:opacity-40 disabled:cursor-pointer"
        />
      </div>
    </div>
  );
};
