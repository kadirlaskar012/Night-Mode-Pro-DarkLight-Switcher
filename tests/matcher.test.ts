import { describe, expect, it } from 'vitest';
import { evaluateSiteRules, matchesPattern, wildcardToRegex } from '../src/lib/matcher';

describe('Matcher - Wildcard and Pattern Rules', () => {
  it('converts wildcards into regex correctly', () => {
    const reg = wildcardToRegex('*.youtube.com');
    expect(reg.test('www.youtube.com')).toBe(true);
    expect(reg.test('m.youtube.com')).toBe(true);
    expect(reg.test('vimeo.com')).toBe(false);
  });

  it('matches URLs with wildcards and protocols', () => {
    expect(matchesPattern('*.youtube.com', 'https://www.youtube.com/watch?v=123')).toBe(true);
    expect(matchesPattern('github.com/*', 'https://github.com/microsoft/vscode')).toBe(true);
    expect(matchesPattern('reddit.com', 'reddit.com')).toBe(true);
    expect(matchesPattern('reddit.com', 'google.com')).toBe(false);
  });

  it('evaluates whitelist and blacklist priorities', () => {
    const rules = [
      { id: '1', pattern: '*.youtube.com', type: 'blacklist' as const, createdAt: 1 },
      { id: '2', pattern: 'docs.google.com', type: 'whitelist' as const, createdAt: 2 },
    ];

    expect(evaluateSiteRules('https://www.youtube.com/feed/explore', rules)).toBe(false);
    expect(evaluateSiteRules('https://docs.google.com/document/d/123', rules)).toBe(true);
    expect(evaluateSiteRules('https://wikipedia.org', rules)).toBeUndefined();
  });
});
