import React, { useState } from 'react';
import { Clock, Sun, Sunrise, Sunset, Monitor, MapPin, Lock, Info, Check } from 'lucide-react';
import { calculateSunriseSunset, isTimeInRange } from '@/lib/schedule';
import { ScheduleConfig, ScheduleType, UserSettings } from '@/types/settings';

interface ScheduleTabProps {
  settings: UserSettings;
  isPro: boolean;
  onUpdate: (partial: Partial<UserSettings>) => void;
  onLockedClick: (feature: string) => void;
}

export const ScheduleTab: React.FC<ScheduleTabProps> = ({
  settings,
  isPro,
  onUpdate,
  onLockedClick,
}) => {
  const [geoStatus, setGeoStatus] = useState<string>('');
  const schedule = settings.schedule;

  const handleTypeChange = (type: ScheduleType) => {
    if (!isPro) {
      onLockedClick('Automatic Theme Schedule');
      return;
    }
    onUpdate({
      schedule: {
        ...schedule,
        type,
      },
    });
  };

  const handleTimeChange = (startTime: string, endTime: string) => {
    onUpdate({
      schedule: {
        ...schedule,
        startTime,
        endTime,
      },
    });
  };

  const requestGeolocation = () => {
    if (!navigator.geolocation) {
      setGeoStatus('Geolocation not supported by this browser.');
      return;
    }

    setGeoStatus('Requesting position...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(4));
        const lon = parseFloat(pos.coords.longitude.toFixed(4));
        const sun = calculateSunriseSunset(lat, lon);
        onUpdate({
          schedule: {
            ...schedule,
            type: 'sun',
            latitude: lat,
            longitude: lon,
            startTime: sun.sunset,
            endTime: sun.sunrise,
          },
        });
        setGeoStatus(`Coordinates set: ${lat}°, ${lon}° (Sunrise: ${sun.sunrise}, Sunset: ${sun.sunset})`);
      },
      (err) => {
        setGeoStatus(`Permission denied or unavailable (${err.message}). Using manual times.`);
      }
    );
  };

  // Build 24-hour visual timeline preview
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const activeHours = hours.map((hour) => {
    const timeStr = `${String(hour).padStart(2, '0')}:00`;
    if (schedule.type === 'sun' && schedule.latitude && schedule.longitude) {
      const { sunrise, sunset } = calculateSunriseSunset(schedule.latitude, schedule.longitude);
      return isTimeInRange(timeStr, sunset, sunrise);
    }
    return isTimeInRange(timeStr, schedule.startTime, schedule.endTime);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>Automatic Schedule</span>
            {!isPro && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-gradient-to-r from-amber-500 to-indigo-500 text-white shadow-sm">
                PRO
              </span>
            )}
          </h2>
          <p className="text-sm text-slate-400">
            Automatically switch to dark mode at sunset or during scheduled hours.
          </p>
        </div>
      </div>

      {!isPro && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-transparent border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-inner">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Automatic Scheduling is a Pro Feature</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-gradient-to-r from-amber-500 to-indigo-500 text-white shadow-sm">
                  PRO
                </span>
              </h4>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Switch themes automatically at sunset or on custom hours with Night Mode Pro Lifetime ($2.99 one-time).
              </p>
            </div>
          </div>
          <button
            onClick={() => onLockedClick('Automatic Theme Schedule')}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-glow flex-shrink-0 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>Upgrade to Pro ($2.99) &rarr;</span>
          </button>
        </div>
      )}

      {/* Mode Selection Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Custom Time */}
        <div
          onClick={() => handleTypeChange('time')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            schedule.type === 'time'
              ? 'bg-indigo-950/40 border-indigo-500 shadow-glow'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-white flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-400" />
              Custom Time
            </span>
            {schedule.type === 'time' && <Check className="w-4 h-4 text-indigo-400" />}
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Set exact start and end times that repeat daily (supports overnight hours).
          </p>
        </div>

        {/* Sunrise / Sunset */}
        <div
          onClick={() => handleTypeChange('sun')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            schedule.type === 'sun'
              ? 'bg-indigo-950/40 border-indigo-500 shadow-glow'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-white flex items-center gap-1.5">
              <Sunset className="w-4 h-4 text-amber-400" />
              Sunrise & Sunset
            </span>
            {schedule.type === 'sun' && <Check className="w-4 h-4 text-indigo-400" />}
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Dark from dusk till dawn based on your local solar position.
          </p>
        </div>

        {/* System Theme */}
        <div
          onClick={() => handleTypeChange('system')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            schedule.type === 'system'
              ? 'bg-indigo-950/40 border-indigo-500 shadow-glow'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-white flex items-center gap-1.5">
              <Monitor className="w-4 h-4 text-emerald-400" />
              Follow System
            </span>
            {schedule.type === 'system' && <Check className="w-4 h-4 text-indigo-400" />}
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Automatically mirror your operating system's light or dark theme setting.
          </p>
        </div>
      </div>

      {/* Time Pickers Section */}
      {schedule.type === 'time' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-200">Set Schedule Hours</h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1">
                <Sunset className="w-3.5 h-3.5 text-amber-400" /> Start Time (Turn On)
              </label>
              <input
                type="time"
                value={schedule.startTime}
                disabled={!isPro}
                onChange={(e) => handleTimeChange(e.target.value, schedule.endTime)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1">
                <Sunrise className="w-3.5 h-3.5 text-amber-400" /> End Time (Turn Off)
              </label>
              <input
                type="time"
                value={schedule.endTime}
                disabled={!isPro}
                onChange={(e) => handleTimeChange(schedule.startTime, e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 disabled:opacity-50"
              />
            </div>
          </div>
        </div>
      )}

      {/* Geolocation Section for Sunrise / Sunset */}
      {schedule.type === 'sun' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Solar Position Calculation</h3>
              <p className="text-xs text-slate-400">
                Calculates precise sunset and sunrise offline using astronomical solar equations.
              </p>
            </div>
            <button
              type="button"
              onClick={requestGeolocation}
              disabled={!isPro}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all shadow-glow disabled:opacity-50"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Detect My Coordinates</span>
            </button>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-400">
            <Info className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Privacy guarantee:</strong> Your location is only read once to determine your local latitude &amp; longitude and is stored strictly on your device. Zero coordinates are sent to any remote server.
            </span>
          </div>

          {geoStatus && (
            <p className="text-xs text-indigo-300 font-mono bg-indigo-950/30 p-2 rounded-lg border border-indigo-500/20">
              {geoStatus}
            </p>
          )}
        </div>
      )}

      {/* 24-Hour Timeline Preview */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-200">24-Hour Schedule Timeline</h3>
          <span className="text-xs text-slate-400 font-mono">
            {schedule.type === 'system' ? 'System Theme Active' : `${schedule.startTime} → ${schedule.endTime}`}
          </span>
        </div>

        {/* Bar */}
        <div className="grid grid-cols-24 gap-0.5 h-8 bg-slate-950 rounded-xl p-1 border border-slate-800">
          {activeHours.map((active, hour) => (
            <div
              key={hour}
              title={`${hour}:00 - ${active ? 'Night Mode Active' : 'Light Mode'}`}
              className={`h-full rounded-sm transition-all ${
                active
                  ? 'bg-gradient-to-t from-indigo-600 to-violet-500 shadow-glow'
                  : 'bg-slate-800/50 hover:bg-slate-700/50'
              }`}
            />
          ))}
        </div>

        <div className="flex justify-between text-[10px] text-slate-500 font-mono px-0.5">
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>23:59</span>
        </div>
      </div>
    </div>
  );
};
