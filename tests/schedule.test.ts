import { describe, expect, it } from 'vitest';
import {
  calculateSunriseSunset,
  isTimeInRange,
  shouldBeActiveBySchedule,
} from '../src/lib/schedule';

describe('Schedule - Time & Solar Calculations', () => {
  it('correctly handles normal daylight time ranges', () => {
    expect(isTimeInRange('14:30', '09:00', '17:00')).toBe(true);
    expect(isTimeInRange('08:45', '09:00', '17:00')).toBe(false);
    expect(isTimeInRange('17:00', '09:00', '17:00')).toBe(false);
  });

  it('correctly handles overnight/cross-midnight ranges', () => {
    // 20:00 to 07:00
    expect(isTimeInRange('22:00', '20:00', '07:00')).toBe(true);
    expect(isTimeInRange('03:30', '20:00', '07:00')).toBe(true);
    expect(isTimeInRange('06:59', '20:00', '07:00')).toBe(true);
    expect(isTimeInRange('07:00', '20:00', '07:00')).toBe(false);
    expect(isTimeInRange('12:00', '20:00', '07:00')).toBe(false);
    expect(isTimeInRange('19:59', '20:00', '07:00')).toBe(false);
  });

  it('calculates realistic sunrise and sunset for coordinates', () => {
    // Coordinates for London: 51.5074 N, 0.1278 W
    const result = calculateSunriseSunset(51.5074, -0.1278, new Date('2026-06-21T12:00:00Z'));
    expect(result.sunrise).toMatch(/^\d{2}:\d{2}$/);
    expect(result.sunset).toMatch(/^\d{2}:\d{2}$/);
    expect(result.sunrise).not.toBe(result.sunset);
  });

  it('evaluates shouldBeActiveBySchedule based on system theme', () => {
    const config = {
      type: 'system' as const,
      startTime: '20:00',
      endTime: '07:00',
    };
    expect(shouldBeActiveBySchedule(config, true)).toBe(true);
    expect(shouldBeActiveBySchedule(config, false)).toBe(false);
  });
});
