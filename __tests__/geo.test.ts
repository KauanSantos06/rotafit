import type { RoutePoint } from '@/types';
import { averagePaceSecPerKm, estimateCalories, formatDistance, formatDuration, formatPace, haversineMeters, isPlausibleJump, routeDistanceMeters, simplifyRoute } from '@/utils/geo';
const pt = (lat: number, lng: number, t = 0): RoutePoint => ({ lat, lng, t });
describe('haversineMeters', () => {
  it('é zero para o mesmo ponto', () => expect(haversineMeters(pt(-15.79, -47.88), pt(-15.79, -47.88))).toBe(0));
});
describe('isPlausibleJump', () => {
  it('aceita um deslocamento normal', () => expect(isPlausibleJump(pt(0, 0, 0), pt(0, 0.0001, 2000))).toBe(true));
  it('rejeita salto', () => expect(isPlausibleJump(pt(0, 0, 0), pt(0, 0.01, 1000))).toBe(false));
});
describe('averagePaceSecPerKm', () => {
  it('calcula o ritmo', () => expect(averagePaceSecPerKm(1000, 300)).toBe(300));
});
