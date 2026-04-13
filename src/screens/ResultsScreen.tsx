import React, { useEffect, useRef, useMemo } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Fonts, Spacing, BorderRadius, ColorTheme } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import { RootStackParamList } from '../navigation';
import { XPBar } from '../components/XPBar';
import { useGameStore } from '../store/gameStore';

type RouteType = RouteProp<RootStackParamList, 'Results'>;
type Nav = StackNavigationProp<RootStackParamList>;

function makeStyles(colors: ColorTheme) {
  return StyleSheet.create({
    flex: { flex: 1 },
    content: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: Spacing.lg,
      gap: Spacing.md,
    },
    badge: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: colors.surfaceAlt,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 3,
      borderColor: colors.primary,
    },
    badgeEmoji: { fontSize: 60 },
    gradeLabel: { color: colors.text, fontSize: Fonts.sizes.xl, fontWeight: '800' },
    lessonTitle: { color: colors.textSecondary, fontSize: Fonts.sizes.md },
    statsCard: {
      backgroundColor: colors.card,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      width: '100%',
      borderWidth: 1,
      borderColor: colors.border,
      gap: Spacing.md,
    },
    statRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    statLabel: { color: colors.textSecondary, fontSize: Fonts.sizes.md },
    statValue: { fontSize: Fonts.sizes.lg, fontWeight: '800' },
    divider: { height: 1, backgroundColor: colors.border },
    levelUpBanner: {
      backgroundColor: colors.primary + '33',
      borderRadius: BorderRadius.md,
      padding: Spacing.md,
      borderWidth: 1,
      borderColor: colors.primary,
      width: '100%',
    },
    levelUpText: { color: colors.text, textAlign: 'center', fontWeight: '700', fontSize: Fonts.sizes.md },
    xpSection: {
      backgroundColor: colors.surface,
      borderRadius: BorderRadius.md,
      padding: Spacing.md,
      width: '100%',
    },
    actions: { width: '100%', gap: Spacing.sm },
    continueBtn: { borderRadius: BorderRadius.md, overflow: 'hidden' },
    continueBtnGradient: { padding: Spacing.md, alignItems: 'center' },
    continueBtnText: { color: colors.text, fontSize: Fonts.sizes.lg, fontWeight: '800' },
    worldMapBtn: { alignItems: 'center', padding: Spacing.sm },
    worldMapText: { color: colors.textSecondary, fontSize: Fonts.sizes.md },
  });
}

export default function ResultsScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const nav = useNavigation<Nav>();
  const route = useRoute<RouteType>();
  const { xpEarned, accuracy, lessonTitle, newLevel } = route.params;
  const { totalXP } = useGameStore();

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const xpCountAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 80, friction: 6 }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
    Animated.timing(xpCountAnim, { toValue: xpEarned, duration: 1200, useNativeDriver: false }).start();
  }, []);

  const accuracyPct = Math.round(accuracy * 100);
  const grade = accuracyPct === 100 ? '🌟' : accuracyPct >= 80 ? '⭐' : accuracyPct >= 60 ? '✅' : '📖';
  const gradeLabel = accuracyPct === 100 ? 'Perfect!' : accuracyPct >= 80 ? 'Great job!' : accuracyPct >= 60 ? 'Good work!' : 'Keep practicing!';

  return (
    <LinearGradient colors={[colors.resultsGradient, colors.background]} style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <View style={styles.content}>
          <Animated.View style={[styles.badge, { transform: [{ scale: scaleAnim }] }]}>
            <Text style={styles.badgeEmoji}>{grade}</Text>
          </Animated.View>

          <Text style={styles.gradeLabel}>{gradeLabel}</Text>
          <Text style={styles.lessonTitle}>{lessonTitle}</Text>

          <Animated.View style={[styles.statsCard, { opacity: fadeAnim }]}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Accuracy</Text>
              <Text style={[
                styles.statValue,
                { color: accuracyPct >= 80 ? colors.success : accuracyPct >= 60 ? colors.secondary : colors.error },
              ]}>
                {accuracyPct}%
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>XP Earned</Text>
              <Animated.Text style={[styles.statValue, { color: colors.secondary }]}>
                ⭐ {xpEarned}
              </Animated.Text>
            </View>
            {accuracyPct === 100 && (
              <>
                <View style={styles.divider} />
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Perfect Bonus</Text>
                  <Text style={[styles.statValue, { color: colors.primary }]}>+50 XP</Text>
                </View>
              </>
            )}
          </Animated.View>

          {newLevel && (
            <Animated.View style={[styles.levelUpBanner, { opacity: fadeAnim }]}>
              <Text style={styles.levelUpText}>🎉 Level Up! You're now Level {newLevel}!</Text>
            </Animated.View>
          )}

          <Animated.View style={[styles.xpSection, { opacity: fadeAnim }]}>
            <XPBar totalXP={totalXP} />
          </Animated.View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.continueBtn}
              onPress={() => nav.navigate('MainTabs')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[colors.primary, colors.primaryDark]}
                style={styles.continueBtnGradient}
              >
                <Text style={styles.continueBtnText}>Continue</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.worldMapBtn}
              onPress={() => nav.navigate('MainTabs', { screen: 'WorldMap' })}
              activeOpacity={0.8}
            >
              <Text style={styles.worldMapText}>Back to World Map</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
