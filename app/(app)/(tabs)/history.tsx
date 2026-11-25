import { useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Card } from '@/components/Card';
import { EmptyState, LoadingView } from '@/components/StateViews';
import { useRuns } from '@/hooks/useRuns';
import { spacing, useTheme } from '@/theme';
import { formatDistance, formatDuration } from '@/utils/geo';
export default function HistoryScreen() {
  const { theme } = useTheme(); const router = useRouter(); const { data: runs, isLoading } = useRuns();
  if (isLoading) return <LoadingView />;
  return (
    <Screen>
      <Text style={[styles.title, { color: theme.text }]}>Histórico</Text>
      <FlatList data={runs} keyExtractor={(item) => item.id} contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState icon="time-outline" title="Nenhuma corrida" message="Suas corridas aparecerão aqui." />}
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push(`/run/${item.id}`)}>
            <Card style={styles.card}>
              <View style={styles.info}><Text style={[styles.date, { color: theme.text }]}>{new Date(item.startedAt).toLocaleDateString()}</Text><Text style={[styles.meta, { color: theme.muted }]}>{formatDistance(item.distanceMeters)} · {formatDuration(item.durationSeconds)}</Text></View>
              <Ionicons name="chevron-forward" size={20} color={theme.muted} />
            </Card>
          </Pressable>
        )}
      />
    </Screen>
  );
}
const styles = StyleSheet.create({ title: { fontSize: 28, fontWeight: '800', marginVertical: spacing.md }, list: { paddingBottom: 100 }, card: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm }, info: { flex: 1 }, date: { fontSize: 16, fontWeight: '700' }, meta: { fontSize: 14, marginTop: 2 } });
