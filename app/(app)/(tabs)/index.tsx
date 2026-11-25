import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { SpotifyPlayerCard } from '@/components/spotify/SpotifyPlayerCard';
import { useWeeklyStats } from '@/hooks/useRuns';
import { spacing, useTheme } from '@/theme';
import { formatDistance } from '@/utils/geo';
export default function HomeScreen() {
  const { theme } = useTheme(); const router = useRouter(); const { data: stats } = useWeeklyStats();
  return (
    <Screen scroll>
      <View style={styles.header}><Text style={[styles.title, { color: theme.text }]}>RotaFit</Text><Text style={[styles.subtitle, { color: theme.muted }]}>Pronto para correr?</Text></View>
      <Card style={styles.statsCard}>
        <Text style={[styles.statsTitle, { color: theme.text }]}>Esta semana</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}><Text style={[styles.statValue, { color: theme.primary }]}>{formatDistance(Number(stats?.total_distance_meters ?? 0))}</Text><Text style={[styles.statLabel, { color: theme.muted }]}>Distância</Text></View>
          <View style={styles.statItem}><Text style={[styles.statValue, { color: theme.text }]}>{stats?.run_count ?? 0}</Text><Text style={[styles.statLabel, { color: theme.muted }]}>Corridas</Text></View>
        </View>
      </Card>
      <SpotifyPlayerCard />
      <View style={styles.footer}>
        <Button title="Iniciar Corrida" variant="primary" onPress={() => router.push('/run/active')} style={styles.startBtn} />
      </View>
    </Screen>
  );
}
const styles = StyleSheet.create({ header: { marginTop: spacing.md, marginBottom: spacing.lg }, title: { fontSize: 32, fontWeight: '900' }, subtitle: { fontSize: 16 }, statsCard: { marginBottom: spacing.md }, statsTitle: { fontSize: 16, fontWeight: '700', marginBottom: spacing.md }, statsRow: { flexDirection: 'row', justifyContent: 'space-around' }, statItem: { alignItems: 'center' }, statValue: { fontSize: 24, fontWeight: '800' }, statLabel: { fontSize: 14, marginTop: 4 }, footer: { marginTop: 'auto', paddingVertical: spacing.xl }, startBtn: { alignSelf: 'stretch' } });
