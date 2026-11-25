import { useRouter } from 'expo-router';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { RoutePath } from '@/components/RoutePath';
import { useRunTracker } from '@/hooks/useRunTracker';
import { useSaveRun } from '@/hooks/useRuns';
import { spacing, useTheme } from '@/theme';
import { formatDistance, formatDuration, formatPace } from '@/utils/geo';
export default function ActiveRunScreen() {
  const { theme } = useTheme(); const router = useRouter();
  const { status, route, distanceMeters, elapsedSeconds, pace, start, pause, resume, finish } = useRunTracker();
  const saveRun = useSaveRun();
  async function handleFinish() {
    const input = finish(null);
    if (!input) return;
    try { const id = await saveRun.mutateAsync(input); router.replace(`/run/${id}`); } catch (e) { Alert.alert('Erro ao salvar', String(e)); }
  }
  if (status === 'idle') return (<View style={[styles.center, { backgroundColor: theme.background }]}><Text style={[styles.title, { color: theme.text }]}>Pronto?</Text><Button title="Iniciar" onPress={start} /></View>);
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <RoutePath route={route} live={status === 'active'} height={300} />
      <View style={styles.stats}>
        <Text style={[styles.distance, { color: theme.text }]}>{formatDistance(distanceMeters)}</Text>
        <View style={styles.row}>
          <Text style={[styles.meta, { color: theme.muted }]}>{formatDuration(elapsedSeconds)}</Text>
          <Text style={[styles.meta, { color: theme.muted }]}>{formatPace(pace)}</Text>
        </View>
      </View>
      <View style={styles.controls}>
        {status === 'active' ? (<Button title="Pausar" variant="secondary" onPress={pause} />) : (<Button title="Retomar" variant="primary" onPress={resume} />)}
        <Button title="Finalizar" variant="danger" onPress={handleFinish} />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({ center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg }, title: { fontSize: 32, fontWeight: '800' }, container: { flex: 1, padding: spacing.md, justifyContent: 'center' }, stats: { alignItems: 'center', marginVertical: spacing.xl }, distance: { fontSize: 64, fontWeight: '900' }, row: { flexDirection: 'row', gap: spacing.xl, marginTop: spacing.sm }, meta: { fontSize: 20, fontWeight: '700' }, controls: { gap: spacing.md, marginTop: 'auto', marginBottom: spacing.xl } });
