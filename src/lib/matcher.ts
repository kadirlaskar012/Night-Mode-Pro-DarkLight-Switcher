/**
 * Pattern matching utilities for Whitelist and Blacklist.
 * Supports wildcards like:
 *   - *.youtube.com
 *   - https://github.com/*
 *   - wikipedia.org
 *   - *docs.google.com*
 */

/**
 * Converts a wildcard string (e.g. *.example.com) to a regular expression.
 */
export function wildcardToRegex(pattern: string): RegExp {
  const trimmed = pattern.trim().toLowerCase();
  if (!trimmed) {
    return /^$/;
  }

  // Strip protocol if present to match against host or full url flexibly
  let cleaned = trimmed;
  if (cleaned.startsWith('http://')) cleaned = cleaned.slice(7);
  else if (cleaned.startsWith('https://')) cleaned = cleaned.slice(8);

  // Escape special regex characters except *
  const escaped = cleaned.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
  // Replace * with .*
  const regexStr = '^' + escaped.replace(/\*/g, '.*') + '$';

  return new RegExp(regexStr, 'i');
}

/**
 * Checks if a given URL or hostname matches a pattern.
 */
export function matchesPattern(pattern: string, urlOrHostname: string): boolean {
  if (!pattern || !urlOrHostname) return false;

  const target = urlOrHostname.trim().toLowerCase();
  const regex = wildcardToRegex(pattern);

  // Test full target
  if (regex.test(target)) return true;

  // Test without protocol if target is a full URL
  let withoutProtocol = target;
  if (withoutProtocol.startsWith('http://')) withoutProtocol = withoutProtocol.slice(7);
  else if (withoutProtocol.startsWith('https://')) withoutProtocol = withoutProtocol.slice(8);

  if (regex.test(withoutProtocol)) return true;

  // Also test just the hostname if target has paths
  const hostname = withoutProtocol.split('/')[0].split(':')[0];
  if (regex.test(hostname)) return true;

  return false;
}

/**
 * Checks whether a given hostname or URL should have Dark Mode enabled
 * based on whitelist and blacklist rules.
 *
 * Logic:
 * 1. If any blacklist rule matches, return false (disable dark mode).
 * 2. If any whitelist rule matches, return true (enable dark mode).
 * 3. Default to undefined (meaning use global setting).
 */
export function evaluateSiteRules(
  urlOrHostname: string,
  rules: Array<{ pattern: string; type: 'whitelist' | 'blacklist' }>
): boolean | undefined {
  if (!rules || rules.length === 0) return undefined;

  for (const rule of rules) {
    if (matchesPattern(rule.pattern, urlOrHostname)) {
      if (rule.type === 'blacklist') {
        return false;
      }
      if (rule.type === 'whitelist') {
        return true;
      }
    }
  }

  return undefined;
}
