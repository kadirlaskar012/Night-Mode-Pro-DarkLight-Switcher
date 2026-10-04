import React, { useState } from 'react';
import { Moon, Sparkles, Check, ArrowRight, Keyboard, ShieldCheck, Flame, Clock, Star } from 'lucide-react';
import { PRICING_CONFIG } from '@/constants/pricing';

export const OnboardingApp: React.FC = () => {
  const [step, setStep] = useState(1);

  const handleFinish = () => {
    // Open a friendly site or close onboarding tab
    chrome.tabs.create({ url: 'https://www.google.com' });
    window.close();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-6 font-sans">
      {/* Header */}
      <header className="max-w-3xl w-full mx-auto flex items-center justify-between py-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-glow flex items-center justify-center p-2">
            <Moon className="w-6 h-6 text-white" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">Night Mode Pro</span>
        </div>

        {/* Step dots */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all ${
                step === s ? 'w-8 bg-indigo-500 shadow-glow' : 'w-2 bg-slate-800'
              }`}
            />
          ))}
        </div>
      </header>

      {/* Main Step Cards */}
      <main className="max-w-xl w-full mx-auto my-auto py-8">
        {step === 1 && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 text-center animate-fadeIn">
            <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 mx-auto flex items-center justify-center shadow-glow">
              <Moon className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">
                Step 1 of 3
              </span>
              <h2 className="text-2xl font-bold text-white mt-1">One-Click Night Comfort</h2>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                Click the extension icon in your browser toolbar anytime to toggle instant dark mode on any website. Colors adapt smoothly while preserving images and videos.
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80 flex items-center justify-around text-xs">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Zero white flash</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Original photos &amp; video</span>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-glow flex items-center justify-center gap-2 transition-all"
            >
              <span>Next: Keyboard Shortcut</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 text-center animate-fadeIn">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center shadow-glow">
              <Keyboard className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest">
                Step 2 of 3
              </span>
              <h2 className="text-2xl font-bold text-white mt-1">Instant Keyboard Shortcut</h2>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                Never take your hands off the keyboard. Press the global shortcut anytime on any page to switch modes immediately.
              </p>
            </div>

            <div className="py-6 flex items-center justify-center gap-3">
              <kbd className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-lg font-mono font-bold text-white shadow-lg">
                Alt
              </kbd>
              <span className="text-slate-500 font-bold text-xl">+</span>
              <kbd className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-lg font-mono font-bold text-white shadow-lg">
                Shift
              </kbd>
              <span className="text-slate-500 font-bold text-xl">+</span>
              <kbd className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-lg font-mono font-bold text-white shadow-lg">
                D
              </kbd>
            </div>

            <button
              onClick={() => setStep(3)}
              className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-glow flex items-center justify-center gap-2 transition-all"
            >
              <span>Next: Your 7-Day All-Access Trial</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="bg-slate-900 border border-indigo-500/30 rounded-3xl p-8 shadow-2xl space-y-6 text-center animate-fadeIn">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white mx-auto flex items-center justify-center shadow-glow">
              <Sparkles className="w-8 h-8 text-amber-300" />
            </div>

            <div>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                7-Day Free Premium Trial Activated
              </span>
              <h2 className="text-2xl font-bold text-white mt-2">All Pro Features Are Unlocked</h2>
              <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                Enjoy complete access for the next 7 days. No credit card or registration needed.
              </p>
            </div>

            <div className="space-y-2 text-left bg-slate-950/70 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>Warm amber eye comfort filter for circadian rhythm protection</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span>Automatic sunset/sunrise solar scheduling</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Free tier remains yours forever even after the trial ends</span>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm shadow-glow flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <span>Start Browsing with Night Mode Pro</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-500 py-3">
        Night Mode Pro • Lifetime Eye Comfort • 100% Privacy Focused
      </footer>
    </div>
  );
};
