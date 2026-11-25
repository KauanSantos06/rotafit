import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getRun, getWeeklyStats, listRuns, saveRun } from '@/services/runs';
import type { SaveRunInput } from '@/types';
export const useRuns = () => useQuery({ queryKey: ['runs'], queryFn: listRuns });
export const useRun = (id: string) => useQuery({ queryKey: ['runs', id], queryFn: () => getRun(id), enabled: !!id });
export const useWeeklyStats = () => useQuery({ queryKey: ['weekly_stats'], queryFn: getWeeklyStats });
export function useSaveRun() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: saveRun, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['runs'] }); queryClient.invalidateQueries({ queryKey: ['weekly_stats'] }); } });
}
