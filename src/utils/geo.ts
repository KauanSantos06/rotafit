import type { RoutePoint } from '@/types';
const EARTH_RADIUS_M = 6371000;
const toRad = (deg: number) => (deg * Math.PI) / 180;
export function haversineMeters(a: RoutePoint, b: RoutePoint): number {
  const dLat = toRad(b.lat - a.lat); const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat); const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)));
}
const MAX_SPEED_MPS = 10;
export function isPlausibleJump(prev: RoutePoint, next: RoutePoint): boolean {
  const dt = next.t - prev.t; if (dt <= 0) return false;
  return (haversineMeters(prev, next) / (dt / 1000)) <= MAX_SPEED_MPS;
}
export function routeDistanceMeters(route: RoutePoint[]): number {
  let total = 0;
  for (let i = 1; i < route.length; i++) { if (isPlausibleJump(route[i - 1], route[i])) total += haversineMeters(route[i - 1], route[i]); }
  return total;
}
export function averagePaceSecPerKm(distanceMeters: number, durationSeconds: number): number | null {
  if (distanceMeters <= 0) return null;
  return durationSeconds / (distanceMeters / 1000);
}
export function formatDistance(meters: number): string { return meters >= 1000 ? `${(meters / 1000).toFixed(2).replace('.', ',')} km` : `${Math.round(meters)} m`; }
const pad = (n: number) => String(Math.floor(n)).padStart(2, '0');
export function formatDuration(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600); const m = Math.floor((totalSeconds % 3600) / 60); const s = Math.floor(totalSeconds % 60);
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}
export function formatPace(secPerKm: number | null): string {
  if (secPerKm === null || !Number.isFinite(secPerKm)) return '—';
  const m = Math.floor(secPerKm / 60); const s = Math.round(secPerKm % 60);
  return `${m}'${String(s).padStart(2, '0')}"/km`;
}
export function estimateCalories(distanceMeters: number, durationSeconds: number, weightKg = 70): number {
  if (durationSeconds <= 0) return 0;
  return Math.round(9.8 * weightKg * (durationSeconds / 3600));
}
export function simplifyRoute(route: RoutePoint[], maxPoints = 200): RoutePoint[] {
  if (route.length <= maxPoints) return route;
  const step = route.length / maxPoints; const result: RoutePoint[] = [];
  for (let i = 0; i < maxPoints; i++) result.push(route[Math.floor(i * step)]);
  result.push(route[route.length - 1]); return result;
}
