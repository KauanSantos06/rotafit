import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from '@/components/Card';
import { RoutePath } from '@/components/RoutePath';
import { LoadingView } from '@/components/StateViews';
import { useRun } from '@/hooks/useRuns';
import { spacing, useTheme } from '@/theme';
import { formatDistance, formatDuration, formatPace } from '@/utils/geo';
export default function RunSummaryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>(); const { theme } = useTheme(); const { data: run, isLoading } = useRun(id);
  if (isLoading || !run) return <LoadingView />;
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <RoutePath route={run.route} height={300} />
      <Card style={styles.card}>
        <Text style={[styles.date, { color: theme.text }]}>{new Date(run.startedAt).toLocaleString()}</Text>
        <View style={styles.row}>
          <View style={styles.item}><Text style={[styles.value, { color: theme.primary }]}>{formatDistance(run.distanceMeters)}</Text><Text style={[styles.label, { color: theme.muted }]}>Distância</Text></View>
          <View style={styles.item}><Text style={[styles.value, { color: theme.text }]}>{formatDuration(run.durationSeconds)}</Text><Text style={[styles.label, { color: theme.muted }]}>Tempo</Text></View>
          <View style={styles.item}><Text style={[styles.value, { color: theme.text }]}>{formatPace(run.avgPaceSecPerKm)}</Text><Text style={[styles.label, { color: theme.muted }]}>Ritmo</Text></View>
        </View>
        {run.spotifyTrackName && <Text style={[styles.track, { color: theme.muted }]}>Tocando: {run.spotifyTrackName}</Text>}
      </Card>
    </View>
  );
}
const styles = StyleSheet.create({ container: { flex: 1, padding: spacing.md }, card: { marginTop: spacing.md }, date: { fontSize: 16, fontWeight: '700', marginBottom: spacing.md }, row: { flexDirection: 'row', justifyContent: 'space-between' }, item: { alignItems: 'center' }, value: { fontSize: 20, fontWeight: '800' }, label: { fontSize: 14, marginTop: 4 }, track: { marginTop: spacing.md, fontSize: 14, fontStyle: 'italic', textAlign: 'center' } });
