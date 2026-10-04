/**
 * Internationalization helper for Night Mode Pro.
 * Wraps chrome.i18n.getMessage with safe fallbacks.
 */
export function getMessage(
  messageName: string,
  substitutions?: string | string[],
  fallbackText?: string
): string {
  try {
    if (typeof chrome !== 'undefined' && chrome.i18n && chrome.i18n.getMessage) {
      const msg = chrome.i18n.getMessage(messageName, substitutions);
      if (msg) return msg;
    }
  } catch (err) {
    // Ignore and return fallback
  }

  return fallbackText || messageName;
}
