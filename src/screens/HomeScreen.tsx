import React, { useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '../store/gameStore';
import { XPBar } from '../components/XPBar';
import { StreakBadge } from '../components/StreakBadge';
import { Avatar } from '../components/Avatar';
import { Fonts, Spacing, BorderRadius, ColorTheme } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import { REGIONS } from '../data/lessons';
import { RootStackParamList } from '../navigation';

type Nav = StackNavigationProp<RootStackParamList>;

function makeStyles(colors: ColorTheme) {
  return StyleSheet.create({
    flex: { flex: 1 },
    content: { padding: Spacing.md, paddingBottom: Spacing.xxl },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.md,
    },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
    headerRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
    greeting: { color: colors.textSecondary, fontSize: Fonts.sizes.xs },
    username: { color: colors.text, fontSize: Fonts.sizes.md, fontWeight: '700' },
    coins: { color: colors.secondary, fontSize: Fonts.sizes.sm, fontWeight: '600' },
    xpSection: {
      backgroundColor: colors.surface,
      borderRadius: BorderRadius.md,
      padding: Spacing.md,
      marginBottom: Spacing.md,
    },
    dailyCard: { borderRadius: BorderRadius.lg, overflow: 'hidden', marginBottom: Spacing.lg },
    dailyCardDone: {},
    dailyGradient: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: Spacing.md,
      gap: Spacing.md,
    },
    dailyEmoji: { fontSize: 32 },
    dailyText: { flex: 1 },
    dailyTitle: { color: colors.text, fontSize: Fonts.sizes.md, fontWeight: '700' },
    dailySubtitle: { color: 'rgba(255,255,255,0.7)', fontSize: Fonts.sizes.sm },
    dailyArrow: { color: colors.text, fontSize: 28, fontWeight: '300' },
    section: { marginBottom: Spacing.lg },
    sectionTitle: {
      color: colors.textSecondary,
      fontSize: Fonts.sizes.sm,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: Spacing.sm,
    },
    continueCard: {
      backgroundColor: colors.card,
      borderRadius: BorderRadius.md,
      padding: Spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
    continueBadge: {
      width: 44,
      height: 44,
      borderRadius: BorderRadius.sm,
      backgroundColor: colors.surfaceAlt,
      alignItems: 'center',
      justifyContent: 'center',
    },
    continueType: { fontSize: 22 },
    continueInfo: { flex: 1 },
    continueTitle: { color: colors.text, fontSize: Fonts.sizes.md, fontWeight: '600' },
    continueRegion: { color: colors.textSecondary, fontSize: Fonts.sizes.sm },
    continueXP: {
      backgroundColor: colors.primaryDark,
      borderRadius: BorderRadius.sm,
      paddingHorizontal: Spacing.sm,
      paddingVertical: 4,
    },
    xpBadge: { color: colors.secondary, fontSize: Fonts.sizes.xs, fontWeight: '700' },
    miniRow: { flexDirection: 'row', gap: Spacing.sm },
    miniCard: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: BorderRadius.md,
      padding: Spacing.md,
      alignItems: 'center',
      gap: 4,
      borderWidth: 1,
      borderColor: colors.border,
    },
    miniEmoji: { fontSize: 32 },
    miniTitle: { color: colors.text, fontSize: Fonts.sizes.sm, fontWeight: '700' },
    miniDesc: { color: colors.textMuted, fontSize: Fonts.sizes.xs, textAlign: 'center' },
    streakCard: {
      backgroundColor: colors.card,
      borderRadius: BorderRadius.md,
      padding: Spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: colors.border,
    },
    streakBest: { color: colors.textMuted, fontSize: Fonts.sizes.sm },
  });
}

export default function HomeScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const nav = useNavigation<Nav>();
  const { totalXP, level, streak, username, avatarOutfit, completedLessons, lastDailyChallengeDate } = useGameStore();
  const today = new Date().toISOString().split('T')[0];
  const dailyDone = lastDailyChallengeDate === today;

  const nextLesson = REGIONS.flatMap(r => r.lessons)
    .find(l => !completedLessons.includes(l.id));

  return (
    <LinearGradient colors={[colors.background, colors.gradientBg]} style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Avatar outfit={avatarOutfit} size="sm" />
              <View>
                <Text style={styles.greeting}>Welcome back,</Text>
                <Text style={styles.username}>{username}</Text>
              </View>
            </View>
            <View style={styles.headerRight}>
              <StreakBadge streak={streak.current} shieldsAvailable={streak.shieldsAvailable} compact />
              <Text style={styles.coins}>🌸 {useGameStore.getState().sakuraCoins}</Text>
            </View>
          </View>

          {/* XP Bar */}
          <View style={styles.xpSection}>
            <XPBar totalXP={totalXP} />
          </View>

          {/* Daily Challenge CTA */}
          <TouchableOpacity
            style={[styles.dailyCard, dailyDone && styles.dailyCardDone]}
            onPress={() => nav.navigate('DailyChallenge' as any)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={dailyDone ? [colors.surfaceAlt, colors.surface] : ['#6C3FCF', '#4A2A9E']}
              style={styles.dailyGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.dailyEmoji}>{dailyDone ? '✅' : '⚡'}</Text>
              <View style={styles.dailyText}>
                <Text style={styles.dailyTitle}>
                  {dailyDone ? 'Daily Challenge Complete!' : "Today's Daily Challenge"}
                </Text>
                <Text style={styles.dailySubtitle}>
                  {dailyDone ? 'Come back tomorrow for more XP' : '10 questions • 150 XP • Timed'}
                </Text>
              </View>
              {!dailyDone && <Text style={styles.dailyArrow}>›</Text>}
            </LinearGradient>
          </TouchableOpacity>

          {/* Continue Learning */}
          {nextLesson && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Continue Learning</Text>
              <TouchableOpacity
                style={styles.continueCard}
                onPress={() => nav.navigate('Lesson', { lessonId: nextLesson.id })}
                activeOpacity={0.8}
              >
                <View style={styles.continueBadge}>
                  <Text style={styles.continueType}>
                    {nextLesson.type === 'flashcard' ? '📖' : '✏️'}
                  </Text>
                </View>
                <View style={styles.continueInfo}>
                  <Text style={styles.continueTitle}>{nextLesson.title}</Text>
                  <Text style={styles.continueRegion}>
                    {nextLesson.region === 'hiragana' ? '🌸 Hiragana Village' : '⚓ Katakana Port'}
                  </Text>
                </View>
                <View style={styles.continueXP}>
                  <Text style={styles.xpBadge}>+{nextLesson.xpReward} XP</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* Mini-Games */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mini-Games</Text>
            <View style={styles.miniRow}>
              <TouchableOpacity
                style={styles.miniCard}
                onPress={() => nav.navigate('KanaRain', { region: 'hiragana' })}
                activeOpacity={0.8}
              >
                <Text style={styles.miniEmoji}>🌧️</Text>
                <Text style={styles.miniTitle}>Kana Rain</Text>
                <Text style={styles.miniDesc}>Tap falling kana</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.miniCard}
                onPress={() => nav.navigate('MatchBlitz', { region: 'hiragana' })}
                activeOpacity={0.8}
              >
                <Text style={styles.miniEmoji}>⚡</Text>
                <Text style={styles.miniTitle}>Match Blitz</Text>
                <Text style={styles.miniDesc}>Flip & match pairs</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.miniRow}>
              <TouchableOpacity
                style={styles.miniCard}
                onPress={() => nav.navigate('PhraseRain')}
                activeOpacity={0.8}
              >
                <Text style={styles.miniEmoji}>🌊</Text>
                <Text style={styles.miniTitle}>Phrase Rain</Text>
                <Text style={styles.miniDesc}>Match falling words</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.miniCard}
                onPress={() => nav.navigate('WordBuilder')}
                activeOpacity={0.8}
              >
                <Text style={styles.miniEmoji}>🧩</Text>
                <Text style={styles.miniTitle}>Word Builder</Text>
                <Text style={styles.miniDesc}>Arrange kana tiles</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Streak */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Streak</Text>
            <View style={styles.streakCard}>
              <StreakBadge streak={streak.current} shieldsAvailable={streak.shieldsAvailable} />
              <Text style={styles.streakBest}>Best: {streak.longest} days</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
