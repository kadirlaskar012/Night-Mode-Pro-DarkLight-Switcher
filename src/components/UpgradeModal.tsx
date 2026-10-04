import React, { useState } from 'react';
import { X, Check, Sparkles, ExternalLink, ShieldCheck, Key, Crown, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import { PRICING_CONFIG } from '@/constants/pricing';
import { verifyLicenseKey } from '@/lib/license';
import { getLicenseInfo, saveLicenseInfo } from '@/lib/storage';

interface UpgradeModalProps {
  isOpen: boolean;
  featureName?: string;
  onClose: () => void;
  onOpenLicenseTab: () => void;
  onLicenseActivated?: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  featureName,
  onClose,
  onOpenLicenseTab,
  onLicenseActivated,
}) => {
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [licenseKey, setLicenseKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const comparisonItems = [
    { name: 'Smart Dark Mode on All Sites', free: '✅', pro: '✅' },
    { name: 'Photo & Video Protection', free: '✅', pro: '✅' },
    { name: 'Smooth Zero-Flash GPU Engine', free: '✅', pro: '✅' },
    { name: 'Screen Brightness Range', free: '50%–100%', pro: '10%–100% (Ultra)' },
    { name: 'Warm Light Filter (Blue Shield)', free: '❌', pro: '✅ (0%–100%)' },
    { name: 'True OLED Black (#000000)', free: '❌', pro: '✅ Included' },
    { name: 'Sunset / Sunrise Auto Schedule', free: '❌', pro: '✅ Included' },
    { name: 'Domain Whitelist & Blacklist', free: '❌', pro: '✅ Included' },
    { name: 'Save Unlimited Custom Presets', free: '❌', pro: '✅ Included' },
    { name: 'Multi-Device Activations', free: '1 Device', pro: '3 Devices' },
  ];

  const handleBuy = () => {
    chrome.tabs.create({ url: PRICING_CONFIG.LEMON_SQUEEZY.CHECKOUT_URL });
  };

  const handleActivateInline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseKey.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await verifyLicenseKey(licenseKey.trim(), 'lemonsqueezy');
      if (res.valid) {
        const currentLicense = await getLicenseInfo();
        await saveLicenseInfo({
          ...currentLicense,
          key: licenseKey.trim(),
          provider: 'lemonsqueezy',
          status: 'active',
          plan: 'lifetime',
          lastValidated: Date.now(),
          activationDate: Date.now(),
          instanceId: res.instanceId,
          customerEmail: res.customerEmail,
          expiresAt: res.expiresAt || null,
          deviceCount: 1,
          maxDevices: PRICING_CONFIG.MAX_DEVICES_PER_KEY,
        });

        chrome.runtime.sendMessage({ type: 'UPDATE_BADGE' });
        chrome.runtime.sendMessage({ type: 'BROADCAST_SETTINGS' });

        setSuccessMsg('Pro successfully unlocked! Enjoy lifetime access.');
        if (onLicenseActivated) onLicenseActivated();
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setErrorMsg(res.message || 'Invalid license key. Please check and try again.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Verification error. Check internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreInModal = async () => {
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const syncRes = await chrome.storage.sync.get('nmp_license');
      if (syncRes && syncRes['nmp_license'] && syncRes['nmp_license'].status === 'active') {
        const restored = syncRes['nmp_license'];
        await saveLicenseInfo(restored);
        setSuccessMsg('Restored! Lifetime Pro unlocked.');
        chrome.runtime.sendMessage({ type: 'UPDATE_BADGE' });
        chrome.runtime.sendMessage({ type: 'BROADCAST_SETTINGS' });
        if (onLicenseActivated) onLicenseActivated();
        setTimeout(() => onClose(), 1500);
        return;
      }
      setShowKeyInput(true);
      setErrorMsg('No synced purchase found. Enter your license key.');
    } catch {
      setErrorMsg('Could not restore. Please enter key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-[326px] bg-slate-900 border border-indigo-500/40 rounded-2xl p-4 shadow-2xl flex flex-col text-slate-100 max-h-[94vh] overflow-y-auto custom-scrollbar">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-3 right-3 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-center text-center mt-1">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center shadow-glow mb-2">
            <Crown className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5 justify-center">
            <span>Night Mode Pro</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-gradient-to-r from-amber-500 to-indigo-500 text-white shadow-sm">
              LIFETIME
            </span>
          </h2>
          {featureName ? (
            <p className="text-xs text-amber-300 mt-0.5 font-medium">
              Unlock <span className="underline font-bold">{featureName}</span> &amp; all Pro powers
            </p>
          ) : (
            <p className="text-xs text-slate-400 mt-0.5">
              Ultimate eye comfort, OLED deep black &amp; circadian filter
            </p>
          )}
        </div>

        {/* Lifetime Pricing Banner */}
        <div className="my-2.5 p-2.5 rounded-xl bg-gradient-to-b from-indigo-950/80 to-slate-800/90 border border-indigo-500/30 text-center shadow-inner">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs text-slate-400 line-through">
              {PRICING_CONFIG.LIFETIME_ORIGINAL_PRICE}
            </span>
            <span className="text-2xl font-black text-white tracking-tight">
              {PRICING_CONFIG.LIFETIME_PRICE}
            </span>
            <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider bg-emerald-950/90 px-1.5 py-0.5 rounded border border-emerald-500/40">
              One-Time Only
            </span>
          </div>
          <p className="text-[11px] text-indigo-200 font-medium mt-0.5">
            Pay once • Use forever • No subscriptions
          </p>
        </div>

        {/* Free vs Pro Comparison Table */}
        <div className="my-1.5 rounded-xl border border-slate-700/60 overflow-hidden bg-slate-950/60">
          <div className="grid grid-cols-12 bg-slate-800/80 px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-300 border-b border-slate-700/60">
            <span className="col-span-6">Features</span>
            <span className="col-span-3 text-center text-slate-400">Free</span>
            <span className="col-span-3 text-center text-amber-300">Pro</span>
          </div>
          <div className="divide-y divide-slate-800/60 text-[11px]">
            {comparisonItems.map((item, idx) => (
              <div
                key={idx}
                className={`grid grid-cols-12 px-2 py-1.5 items-center ${
                  idx % 2 === 0 ? 'bg-slate-900/30' : 'bg-transparent'
                }`}
              >
                <span className="col-span-6 text-slate-200 text-[10.5px] leading-tight font-medium">
                  {item.name}
                </span>
                <span className="col-span-3 text-center text-[10px] text-slate-400 font-mono">
                  {item.free}
                </span>
                <span className="col-span-3 text-center text-[10px] text-emerald-400 font-mono font-bold">
                  {item.pro}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Guarantee Banner */}
        <div className="flex items-center justify-center gap-1.5 my-2 text-[10.5px] text-slate-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
          <span>Use on up to 3 PCs • 30-Day Money-Back Guarantee</span>
        </div>

        {/* Primary Checkout Button */}
        <button
          onClick={handleBuy}
          className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 via-indigo-600 to-violet-600 hover:from-amber-400 hover:to-violet-500 text-white shadow-glow transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Unlock Lifetime Pro for {PRICING_CONFIG.LIFETIME_PRICE}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>

        {/* Inline License Key Activation */}
        <div className="mt-2.5 pt-2 border-t border-slate-800">
          {!showKeyInput ? (
            <div className="space-y-1.5 text-center">
              <div className="flex items-center justify-center gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => setShowKeyInput(true)}
                  className="text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Key className="w-3 h-3" />
                  <span>Enter license key</span>
                </button>
                <span className="text-slate-600">•</span>
                <button
                  type="button"
                  onClick={handleRestoreInModal}
                  className="text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                  <span>Restore Purchase</span>
                </button>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onOpenLicenseTab();
                }}
                className="text-[10px] text-slate-400 hover:text-slate-200 hover:underline flex items-center justify-center gap-1 mx-auto cursor-pointer pt-0.5"
              >
                <span>View full Free vs Pro plan dashboard &rarr;</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleActivateInline} className="space-y-2 mt-1">
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="Enter license key..."
                  value={licenseKey}
                  onChange={(e) => setLicenseKey(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500 placeholder:text-slate-600"
                />
                <button
                  type="submit"
                  disabled={loading || !licenseKey.trim()}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  {loading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <ArrowRight className="w-3 h-3" />}
                  <span>Activate</span>
                </button>
              </div>

              {errorMsg && (
                <p className="text-[10px] text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </p>
              )}

              {successMsg && (
                <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-bold">
                  <Check className="w-3 h-3 flex-shrink-0" />
                  <span>{successMsg}</span>
                </p>
              )}

              <button
                type="button"
                onClick={() => setShowKeyInput(false)}
                className="text-[10px] text-slate-500 hover:text-slate-400 block text-center w-full"
              >
                Cancel
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
