import React, { useEffect, useState, useMemo } from 'react';
import {
  View, Text, FlatList, StyleSheet, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '../store/gameStore';
import { Fonts, Spacing, BorderRadius, ColorTheme } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import { getWeeklyLeaderboard, LeaderboardEntry } from '../firebase/leaderboard';

const MEDAL: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

function makeStyles(colors: ColorTheme) {
  return StyleSheet.create({
    flex: { flex: 1 },
    header: { padding: Spacing.md },
    title: { color: colors.text, fontSize: Fonts.sizes.xl, fontWeight: '800' },
    subtitle: { color: colors.textSecondary, fontSize: Fonts.sizes.sm },
    myRankCard: {
      marginHorizontal: Spacing.md,
      marginBottom: Spacing.md,
      backgroundColor: colors.primary + '33',
      borderRadius: BorderRadius.md,
      padding: Spacing.md,
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: colors.primary,
    },
    myRankLabel: { color: colors.textSecondary, fontSize: Fonts.sizes.xs },
    myRankValue: { color: colors.text, fontSize: Fonts.sizes.xl, fontWeight: '800' },
    myXP: { alignItems: 'flex-end' },
    myXPLabel: { color: colors.textSecondary, fontSize: Fonts.sizes.xs },
    myXPValue: { color: colors.secondary, fontSize: Fonts.sizes.md, fontWeight: '700' },
    list: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.xxl, gap: 2 },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
      backgroundColor: colors.card,
      borderRadius: BorderRadius.sm,
      padding: Spacing.md,
    },
    rowMe: {
      backgroundColor: colors.primary + '22',
      borderWidth: 1,
      borderColor: colors.primary,
    },
    rankText: { width: 32, fontSize: 18, textAlign: 'center' },
    userInfo: { flex: 1 },
    rowUsername: { color: colors.text, fontSize: Fonts.sizes.md, fontWeight: '600' },
    rowUsernameMe: { color: colors.primaryLight },
    rowXP: { color: colors.secondary, fontSize: Fonts.sizes.sm, fontWeight: '700' },
    errorBox: { margin: Spacing.md, alignItems: 'center' },
    errorText: { color: colors.textSecondary, textAlign: 'center' },
    emptyBox: { padding: Spacing.xl, alignItems: 'center' },
    emptyText: { color: colors.textMuted },
  });
}

export default function LeaderboardScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { username, weeklyXP } = useGameStore();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getWeeklyLeaderboard()
      .then(setEntries)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const myRank = entries.findIndex(e => e.username === username) + 1;

  return (
    <LinearGradient colors={[colors.background, colors.gradientBg]} style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <View style={styles.header}>
          <Text style={styles.title}>🏆 Leaderboard</Text>
          <Text style={styles.subtitle}>Weekly XP Rankings — resets every Monday</Text>
        </View>

        <View style={styles.myRankCard}>
          <View>
            <Text style={styles.myRankLabel}>Your rank</Text>
            <Text style={styles.myRankValue}>{myRank > 0 ? `#${myRank}` : 'Unranked'}</Text>
          </View>
          <View style={styles.myXP}>
            <Text style={styles.myXPLabel}>This week</Text>
            <Text style={styles.myXPValue}>⭐ {weeklyXP.toLocaleString()} XP</Text>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: Spacing.xl }} />
        ) : error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>Could not load leaderboard. Check your connection.</Text>
          </View>
        ) : (
          <FlatList
            data={entries}
            keyExtractor={(item) => item.userId}
            contentContainerStyle={styles.list}
            renderItem={({ item, index }) => {
              const rank = index + 1;
              const isMe = item.username === username;
              return (
                <View style={[styles.row, isMe && styles.rowMe]}>
                  <Text style={styles.rankText}>
                    {MEDAL[rank] ?? `#${rank}`}
                  </Text>
                  <View style={styles.userInfo}>
                    <Text style={[styles.rowUsername, isMe && styles.rowUsernameMe]}>
                      {item.username}{isMe ? ' (You)' : ''}
                    </Text>
                  </View>
                  <Text style={styles.rowXP}>
                    ⭐ {item.weeklyXP.toLocaleString()}
                  </Text>
                </View>
              );
            }}
            ListEmptyComponent={
              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>No entries yet. Be the first!</Text>
              </View>
            }
          />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}
