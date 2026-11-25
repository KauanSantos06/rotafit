import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { ThemePicker } from '@/components/ThemePicker';
import { useAuth } from '@/context/AuthContext';
import { useSpotify } from '@/context/SpotifyContext';
import { spacing, useTheme } from '@/theme';
export default function ProfileScreen() {
  const { theme } = useTheme(); const { user, signOut } = useAuth(); const { tokens, connect, disconnect } = useSpotify();
  return (
    <Screen scroll>
      <Text style={[styles.title, { color: theme.text }]}>Perfil</Text>
      <Card style={styles.card}><Text style={[styles.name, { color: theme.text }]}>{user?.email ?? 'Usuário'}</Text></Card>
      <Card style={styles.card}><Text style={[styles.label, { color: theme.text }]}>Tema do app</Text><ThemePicker /></Card>
      <Card style={styles.card}>
        <Text style={[styles.label, { color: theme.text }]}>Spotify</Text>
        {tokens ? (<Button title="Desconectar Spotify" variant="danger" onPress={disconnect} />) : (<Button title="Conectar Spotify" variant="secondary" onPress={connect} />)}
      </Card>
      <Button title="Sair da conta" variant="danger" onPress={() => signOut()} style={{ marginTop: spacing.xl }} />
    </Screen>
  );
}
const styles = StyleSheet.create({ title: { fontSize: 28, fontWeight: '800', marginVertical: spacing.md }, card: { marginBottom: spacing.md }, name: { fontSize: 18, fontWeight: '700' }, label: { fontSize: 16, fontWeight: '700', marginBottom: spacing.sm } });
