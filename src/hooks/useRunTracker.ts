import * as Location from 'expo-location';
import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { averagePaceSecPerKm, simplifyRoute } from '@/utils/geo';
import { elapsedSeconds, initialTrackerState, trackerReducer } from '@/utils/tracker';
import type { SaveRunInput } from '@/types';
export function useRunTracker() {
  const [state, dispatch] = useReducer(trackerReducer, initialTrackerState);
  const [now, setNow] = useState(() => Date.now());
  const [permissionDenied, setPermissionDenied] = useState(false);
  const subscription = useRef<Location.LocationSubscription | null>(null);
  useEffect(() => {
    if (state.status !== 'active') return undefined;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [state.status]);
  const stopWatching = useCallback(() => { subscription.current?.remove(); subscription.current = null; }, []);
  useEffect(() => stopWatching, [stopWatching]);
  const startWatching = useCallback(async () => {
    const sub = await Location.watchPositionAsync({ accuracy: Location.Accuracy.BestForNavigation, timeInterval: 2000, distanceInterval: 5 }, (loc) => dispatch({ type: 'ADD_POINT', now: loc.timestamp, lat: loc.coords.latitude, lng: loc.coords.longitude }));
    subscription.current = sub;
  }, []);
  const start = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') { setPermissionDenied(true); return false; }
    setPermissionDenied(false); dispatch({ type: 'START', now: Date.now() }); await startWatching(); return true;
  }, [startWatching]);
  const pause = useCallback(() => { stopWatching(); dispatch({ type: 'PAUSE', now: Date.now() }); }, [stopWatching]);
  const resume = useCallback(async () => { dispatch({ type: 'RESUME', now: Date.now() }); await startWatching(); }, [startWatching]);
  const finish = useCallback((spotifyTrackName: string | null): SaveRunInput | null => {
    stopWatching(); const at = Date.now(); dispatch({ type: 'FINISH', now: at });
    if (state.startedAt === null) return null;
    return { startedAt: new Date(state.startedAt).toISOString(), endedAt: new Date(at).toISOString(), distanceMeters: state.distanceMeters, durationSeconds: Math.round(elapsedSeconds({ ...state, status: 'finished', finishedAt: at }, at)), route: simplifyRoute(state.route), spotifyTrackName };
  }, [state, stopWatching]);
  const reset = useCallback(() => { stopWatching(); dispatch({ type: 'RESET' }); }, [stopWatching]);
  const seconds = elapsedSeconds(state, now);
  return { status: state.status, route: state.route, distanceMeters: state.distanceMeters, elapsedSeconds: seconds, pace: averagePaceSecPerKm(state.distanceMeters, seconds), permissionDenied, start, pause, resume, finish, reset };
}
