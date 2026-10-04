import { ScheduleConfig } from '../types/settings';

/**
 * Checks if current time is within a start and end time window.
 * Handles ranges crossing midnight, e.g. 20:00 to 07:00.
 */
export function isTimeInRange(current: string, start: string, end: string): boolean {
  const [cH, cM] = current.split(':').map(Number);
  const [sH, sM] = start.split(':').map(Number);
  const [eH, eM] = end.split(':').map(Number);

  const currentMinutes = cH * 60 + cM;
  const startMinutes = sH * 60 + sM;
  const endMinutes = eH * 60 + eM;

  if (startMinutes <= endMinutes) {
    // Normal window within the same day, e.g. 09:00 to 17:00
    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
  } else {
    // Crosses midnight, e.g. 20:00 to 07:00
    return currentMinutes >= startMinutes || currentMinutes < endMinutes;
  }
}

/**
 * Formats a Date object to "HH:mm".
 */
export function formatTimeHHMM(date: Date): string {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

/**
 * Approximate calculation of Sunrise and Sunset times based on coordinates.
 * Uses standard solar calculation formulas without external dependencies.
 */
export function calculateSunriseSunset(
  lat: number,
  lon: number,
  date: Date = new Date()
): { sunrise: string; sunset: string } {
  const zenith = 90.8333; // Civil twilight / Official zenith with refraction
  const dayOfYear = getDayOfYear(date);

  // Convert longitude to hour value and calculate an approximate time
  const lngHour = lon / 15;

  // Sunrise approximation
  const tSunrise = dayOfYear + ((6 - lngHour) / 24);
  const sunriseTime = calcSunTime(tSunrise, lat, lon, zenith, true, date);

  // Sunset approximation
  const tSunset = dayOfYear + ((18 - lngHour) / 24);
  const sunsetTime = calcSunTime(tSunset, lat, lon, zenith, false, date);

  return {
    sunrise: sunriseTime || '06:00',
    sunset: sunsetTime || '18:30',
  };
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

function calcSunTime(
  t: number,
  lat: number,
  lon: number,
  zenith: number,
  isSunrise: boolean,
  currentDate: Date
): string | null {
  // Sun's mean anomaly
  const M = (0.9856 * t) - 3.289;
  const MRad = (M * Math.PI) / 180;

  // Sun's true longitude
  let L = M + (1.916 * Math.sin(MRad)) + (0.020 * Math.sin(2 * MRad)) + 282.634;
  L = ((L % 360) + 360) % 360;
  const LRad = (L * Math.PI) / 180;

  // Right ascension
  let RA = (180 / Math.PI) * Math.atan(0.91764 * Math.tan(LRad));
  RA = ((RA % 360) + 360) % 360;

  // Adjust RA to be in the same quadrant as L
  const Lquadrant = Math.floor(L / 90) * 90;
  const RAquadrant = Math.floor(RA / 90) * 90;
  RA = RA + (Lquadrant - RAquadrant);
  RA = RA / 15;

  // Sun's declination
  const sinDec = 0.39782 * Math.sin(LRad);
  const cosDec = Math.cos(Math.asin(sinDec));

  // Sun's local hour angle
  const latRad = (lat * Math.PI) / 180;
  const zenithRad = (zenith * Math.PI) / 180;
  const cosH = (Math.cos(zenithRad) - (sinDec * Math.sin(latRad))) / (cosDec * Math.cos(latRad));

  if (cosH > 1) return null; // Sun never rises
  if (cosH < -1) return null; // Sun never sets

  let H: number;
  if (isSunrise) {
    H = 360 - (180 / Math.PI) * Math.acos(cosH);
  } else {
    H = (180 / Math.PI) * Math.acos(cosH);
  }
  H = H / 15;

  // Local mean time of rising/setting
  const T = H + RA - (0.06571 * t) - 6.622;

  // Adjust to UTC
  let UT = T - (lon / 15);
  UT = ((UT % 24) + 24) % 24;

  // Convert UTC to local time of the user
  const timezoneOffsetHours = -currentDate.getTimezoneOffset() / 60;
  let localHour = UT + timezoneOffsetHours;
  localHour = ((localHour % 24) + 24) % 24;

  const hours = Math.floor(localHour);
  const minutes = Math.floor((localHour - hours) * 60);

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

/**
 * Determines whether Night Mode should be active based on ScheduleConfig.
 */
export function shouldBeActiveBySchedule(
  config: ScheduleConfig,
  isSystemDark: boolean = false,
  date: Date = new Date()
): boolean {
  if (config.type === 'system') {
    return isSystemDark;
  }

  const currentTime = formatTimeHHMM(date);

  if (config.type === 'sun' && config.latitude !== undefined && config.longitude !== undefined) {
    const { sunrise, sunset } = calculateSunriseSunset(config.latitude, config.longitude, date);
    // Night mode active from Sunset to Sunrise
    return isTimeInRange(currentTime, sunset, sunrise);
  }

  // Fallback to configured start/end times
  return isTimeInRange(currentTime, config.startTime, config.endTime);
}
