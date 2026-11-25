import { elapsedSeconds, initialTrackerState, trackerReducer } from '@/utils/tracker';
import type { TrackerState } from '@/utils/tracker';
const reduce = (state: TrackerState, ...actions: Parameters<typeof trackerReducer>[1][]) => actions.reduce(trackerReducer, state);
describe('trackerReducer', () => {
  it('START inicia', () => expect(trackerReducer(initialTrackerState, { type: 'START', now: 1000 }).status).toBe('active'));
  it('PAUSE e RESUME', () => {
    const paused = reduce(initialTrackerState, { type: 'START', now: 0 }, { type: 'PAUSE', now: 5000 });
    const resumed = trackerReducer(paused, { type: 'RESUME', now: 8000 });
    expect(resumed.pausedMs).toBe(3000);
  });
});
