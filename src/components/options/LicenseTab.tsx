import React, { useState } from 'react';
import {
  Key,
  ShieldCheck,
  Sparkles,
  Check,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  Smartphone,
  Crown,
  Flame,
  Sun,
  Moon,
  Clock,
  Globe,
  Sliders,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from 'lucide-react';
import { PRICING_CONFIG } from '@/constants/pricing';
import { LemonSqueezyAdapter, GumroadAdapter, verifyLicenseKey } from '@/lib/license';
import { saveLicenseInfo } from '@/lib/storage';
import { LicenseInfo, PaymentProvider, TrialInfo } from '@/types/license';

interface LicenseTabProps {
  license: LicenseInfo;
  trial: TrialInfo;
  onUpdateLicense: (updated: LicenseInfo) => void;
}

export const LicenseTab: React.FC<LicenseTabProps> = ({
  license,
  trial,
  onUpdateLicense,
}) => {
  const [inputKey, setInputKey] = useState(license.key || '');
  const [provider, setProvider] = useState<PaymentProvider>(license.provider || 'lemonsqueezy');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  const isProActive = license.status === 'active' || license.status === 'grace_period';

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputKey.trim()) return;

    setLoading(true);
    setMessage(null);

    try {
      const res = await verifyLicenseKey(inputKey.trim(), provider);

      if (res.valid) {
        const updated: LicenseInfo = {
          ...license,
          key: inputKey.trim(),
          provider,
          status: res.status,
          customerEmail: res.customerEmail,
          instanceId: res.instanceId,
          lastValidated: Date.now(),
          activationDate: license.activationDate || Date.now(),
        };

        await saveLicenseInfo(updated);
        onUpdateLicense(updated);
        setMessage({
          text: 'License successfully activated! Thank you for supporting Night Mode Pro Lifetime.',
          type: 'success',
        });
        chrome.runtime.sendMessage({ type: 'UPDATE_BADGE' });
      } else {
        setMessage({
          text: res.message || 'License activation failed. Please check your key.',
          type: 'error',
        });
      }
    } catch (err: any) {
      setMessage({
        text: err?.message || 'Error communicating with license server. Please try again.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async () => {
    if (!license.key || !license.instanceId) return;

    setLoading(true);
    try {
      if (license.provider === 'lemonsqueezy') {
        await LemonSqueezyAdapter.deactivate(license.key, license.instanceId);
      }

      const updated: LicenseInfo = {
        ...license,
        key: null,
        status: 'free',
        instanceId: undefined,
      };

      await saveLicenseInfo(updated);
      onUpdateLicense(updated);
      setInputKey('');
      setMessage({
        text: 'License successfully deactivated on this device.',
        type: 'info',
      });
      chrome.runtime.sendMessage({ type: 'UPDATE_BADGE' });
    } catch {
      setMessage({
        text: 'Failed to deactivate license.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRestorePurchase = async () => {
    setLoading(true);
    setMessage(null);
    try {
      // 1. Check synced storage across Google profiles & reinstalls
      const syncRes = await chrome.storage.sync.get('nmp_license');
      if (syncRes && syncRes['nmp_license'] && syncRes['nmp_license'].status === 'active') {
        const restored = syncRes['nmp_license'];
        await saveLicenseInfo(restored);
        onUpdateLicense(restored);
        setMessage({
          text: 'Success! Your Lifetime Pro license was found in your Google profile and restored.',
          type: 'success',
        });
        chrome.runtime.sendMessage({ type: 'UPDATE_BADGE' });
        return;
      }

      // 2. If user has an input key, re-verify with gateway
      if (inputKey.trim()) {
        const res = await verifyLicenseKey(inputKey.trim(), provider);
        if (res.valid) {
          const updated: LicenseInfo = {
            ...license,
            key: inputKey.trim(),
            provider,
            status: res.status,
            customerEmail: res.customerEmail,
            instanceId: res.instanceId,
            lastValidated: Date.now(),
            activationDate: Date.now(),
          };
          await saveLicenseInfo(updated);
          onUpdateLicense(updated);
          setMessage({
            text: 'Purchase successfully validated and restored from payment gateway!',
            type: 'success',
          });
          chrome.runtime.sendMessage({ type: 'UPDATE_BADGE' });
          return;
        }
      }

      setMessage({
        text: 'No cloud purchase found in this Chrome account. Enter your license key from your purchase email to activate.',
        type: 'info',
      });
    } catch (err: any) {
      setMessage({
        text: 'Error checking purchase: ' + (err?.message || 'Check your internet connection.'),
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const comparisonData = [
    { feature: 'Universal Dark Mode on All Websites', free: true, pro: true, freeText: 'Included', proText: 'Included' },
    { feature: 'Photo & Video Color Inversion Shield', free: true, pro: true, freeText: 'Included', proText: 'Included' },
    { feature: 'Zero-Flash GPU Acceleration Engine', free: true, pro: true, freeText: 'Included', proText: 'Included' },
    { feature: 'Brightness Slider Range', free: false, pro: true, freeText: '50% – 100%', proText: '10% – 100% (Ultra-Dim)' },
    { feature: 'Warm Light Filter (Blue-Light Shield)', free: false, pro: true, freeText: 'Locked', proText: '0% – 100% Custom' },
    { feature: 'True OLED Pitch-Black (#000000)', free: false, pro: true, freeText: 'Locked', proText: 'Included' },
    { feature: 'Smart Contrast Enhancer', free: false, pro: true, freeText: 'Locked', proText: '50% – 150% Range' },
    { feature: 'Distraction-Free Grayscale Mode', free: false, pro: true, freeText: 'Locked', proText: '0% – 100% Range' },
    { feature: 'Sunset / Sunrise Astronomical Auto Schedule', free: false, pro: true, freeText: 'Locked', proText: 'Offline Solar Sync' },
    { feature: 'Custom Domain Whitelist & Blacklist Rules', free: false, pro: true, freeText: 'Locked', proText: 'Unlimited Domains' },
    { feature: 'Create & Save Custom Presets', free: false, pro: true, freeText: 'Locked', proText: 'Unlimited Presets' },
    { feature: 'Global Keyboard Shortcuts', free: false, pro: true, freeText: 'Alt+Shift+D only', proText: 'All Hotkeys + Brightness' },
    { feature: 'Simultaneous Devices Covered', free: false, pro: true, freeText: '1 Browser', proText: 'Up to 3 Devices' },
    { feature: 'Lifetime Updates & Support', free: false, pro: true, freeText: 'Community', proText: 'Lifetime Included' },
  ];

  const proHighlights = [
    {
      icon: Flame,
      title: 'Warm Light & Blue Filter',
      desc: 'Eliminates circadian-disrupting blue glare for deep nighttime sleep and strain-free reading.',
    },
    {
      icon: Moon,
      title: 'True OLED Pitch-Black',
      desc: 'Generates pure #000000 black background to maximize OLED battery savings and eye comfort.',
    },
    {
      icon: Clock,
      title: 'Solar Auto Schedule',
      desc: 'Calculates exact sunset and sunrise times locally for hands-free automatic theme transitions.',
    },
    {
      icon: Globe,
      title: 'Per-Site Whitelist & Rules',
      desc: 'Specify exact domains, subdomains, and wildcard paths to always invert or permanently exclude.',
    },
    {
      icon: Sliders,
      title: 'Unlimited Custom Presets',
      desc: 'Fine-tune brightness, warm tint, and contrast, then save unlimited presets with one click.',
    },
    {
      icon: Sun,
      title: '10% Ultra-Dim Mode',
      desc: 'Go below your monitor\'s physical minimum brightness for pitch-dark room environments.',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <span>License &amp; Plan Management</span>
          {isProActive && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-amber-500 to-indigo-500 text-white shadow-glow">
              LIFETIME PRO ACTIVE
            </span>
          )}
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Enjoy unlimited dark mode with perpetual lifetime access. One-time payment, zero subscriptions.
        </p>
      </div>

      {/* Main Plan Status / Upgrade Banner */}
      {!isProActive ? (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950/90 via-slate-900 to-slate-900 border border-indigo-500/40 p-6 md:p-8 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm">
                <Crown className="w-3.5 h-3.5" />
                <span>LIFETIME DEAL • PAY ONCE, USE FOREVER</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                Upgrade to Night Mode Pro
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Unlock full eye protection with Circadian Warm Light, True OLED Black, Solar Scheduling,
                and unlimited custom site rules. No recurring monthly or annual fees.
              </p>
            </div>

            <div className="flex flex-col items-center sm:items-end w-full md:w-auto bg-slate-950/70 p-5 rounded-2xl border border-indigo-500/30 shadow-inner flex-shrink-0">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-sm text-slate-400 line-through">
                  {PRICING_CONFIG.LIFETIME_ORIGINAL_PRICE}
                </span>
                <span className="text-4xl font-black text-white tracking-tight">
                  {PRICING_CONFIG.LIFETIME_PRICE}
                </span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">
                  Save 57%
                </span>
              </div>
              <p className="text-xs text-indigo-300 font-medium mb-4 text-center sm:text-right">
                One-time payment • Lifetime updates • 3 Devices
              </p>
              <button
                onClick={() => chrome.tabs.create({ url: PRICING_CONFIG.LEMON_SQUEEZY.CHECKOUT_URL })}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-500 via-indigo-600 to-violet-600 hover:from-amber-400 hover:to-violet-500 text-white rounded-xl text-sm font-bold shadow-glow flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Buy Lifetime Pro Now</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-indigo-950/60 to-slate-900 border border-indigo-500/40 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center shadow-glow flex-shrink-0">
              <Crown className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Night Mode Pro Lifetime</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                  ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {license.customerEmail
                  ? `Licensed to ${license.customerEmail} • Covers up to ${PRICING_CONFIG.MAX_DEVICES_PER_KEY} PCs`
                  : `Covers up to ${PRICING_CONFIG.MAX_DEVICES_PER_KEY} devices • All premium features fully unlocked`}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                Key: {license.key ? `${license.key.slice(0, 8)}...${license.key.slice(-4)}` : 'Active'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDeactivate}
            disabled={loading}
            className="px-4 py-2 bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-200 border border-slate-700 hover:border-rose-500/50 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer flex-shrink-0"
          >
            <span>Deactivate on this PC</span>
          </button>
        </div>
      )}

      {/* Free vs Pro Comparison Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-lg">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <span>Free vs. Pro Feature Comparison</span>
            <span className="text-xs font-normal text-slate-400">(Why upgrade to Pro?)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Transparent comparison of what is included in the perpetual Free edition vs Lifetime Pro.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950/60">
          <div className="grid grid-cols-12 bg-slate-800/90 px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-slate-700/80">
            <span className="col-span-6">Features &amp; Capabilities</span>
            <span className="col-span-3 text-center text-slate-400">Free Tier</span>
            <span className="col-span-3 text-center text-amber-300 font-extrabold flex items-center justify-center gap-1">
              <Crown className="w-3.5 h-3.5 text-amber-400" /> Lifetime Pro
            </span>
          </div>

          <div className="divide-y divide-slate-800/60 text-xs">
            {comparisonData.map((item, idx) => (
              <div
                key={idx}
                className={`grid grid-cols-12 px-4 py-2.5 items-center transition-colors ${
                  idx % 2 === 0 ? 'bg-slate-900/40' : 'bg-transparent'
                } hover:bg-slate-800/30`}
              >
                <span className="col-span-6 text-slate-200 font-medium">
                  {item.feature}
                </span>

                <span className="col-span-3 text-center flex items-center justify-center gap-1 text-slate-400 font-mono text-[11px]">
                  {item.free ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-slate-600 flex-shrink-0" />
                  )}
                  <span>{item.freeText}</span>
                </span>

                <span className="col-span-3 text-center flex items-center justify-center gap-1 font-bold text-emerald-400 font-mono text-[11px]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{item.proText}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {!isProActive && (
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <span>✨ Get all Pro features permanently with a single $2.99 one-time payment.</span>
            <button
              onClick={() => chrome.tabs.create({ url: PRICING_CONFIG.LEMON_SQUEEZY.CHECKOUT_URL })}
              className="text-amber-400 hover:text-amber-300 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Get Lifetime Access Now</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Pro Features Spotlight Cards */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">
            Premium Features Spotlight
          </h3>
          <p className="text-xs text-slate-400">
            Engineered specifically for developers, night readers, and power users.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {proHighlights.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div
                key={i}
                className="bg-slate-900 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-4 transition-all space-y-2"
              >
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white">{feat.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* License Key Activation Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-lg">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Key className="w-4 h-4 text-indigo-400" />
            <span>{isProActive ? 'Change or Re-Validate License Key' : 'Activate Existing License Key'}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            If you already purchased Night Mode Pro from Lemon Squeezy or Gumroad, enter your key below.
          </p>
        </div>

        <form onSubmit={handleActivate} className="space-y-4">
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs text-slate-400 mb-1 font-medium">License Key</label>
              <input
                type="text"
                required
                placeholder="e.g. 12345678-ABCD-EFGH-IJKL-MN9876543210"
                value={inputKey}
                disabled={loading}
                onChange={(e) => setInputKey(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500 placeholder:text-slate-600"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1 font-medium">Payment Provider</label>
              <select
                value={provider}
                disabled={loading}
                onChange={(e) => setProvider(e.target.value as PaymentProvider)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="lemonsqueezy">Lemon Squeezy</option>
                <option value="gumroad">Gumroad</option>
              </select>
            </div>
          </div>

          {message && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                message.type === 'success'
                  ? 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-300'
                  : message.type === 'error'
                  ? 'bg-rose-950/60 border border-rose-500/30 text-rose-300'
                  : 'bg-indigo-950/60 border border-indigo-500/30 text-indigo-300'
              }`}
            >
              {message.type === 'success' ? (
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={loading || !inputKey.trim()}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-glow disabled:opacity-50 transition-all cursor-pointer"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
              <span>{isProActive ? 'Update License Key' : 'Activate Pro Access'}</span>
            </button>

            {!isProActive && (
              <button
                type="button"
                onClick={handleRestorePurchase}
                disabled={loading}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Restore Previous Purchase</span>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Multi-Device Policy & Refund Guarantees */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-white font-bold text-xs">
            <Smartphone className="w-4 h-4 text-indigo-400" />
            <span>3-Device Personal License</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Your single license key can be used on up to <strong>3 computers</strong> (e.g., home PC, work laptop, secondary desktop). If you replace a machine, simply deactivate on the old one.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-white font-bold text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>30-Day Money-Back Guarantee</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            If you are not 100% happy with Night Mode Pro for any reason, email{' '}
            <a href={`mailto:${PRICING_CONFIG.SUPPORT_EMAIL}`} className="text-indigo-400 hover:underline">
              {PRICING_CONFIG.SUPPORT_EMAIL}
            </a>{' '}
            within 30 days for a prompt, full refund.
          </p>
        </div>
      </div>
    </div>
  );
};
