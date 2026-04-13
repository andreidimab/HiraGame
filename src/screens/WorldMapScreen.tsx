import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '../store/gameStore';
import { REGIONS, Lesson } from '../data/lessons';
import { Fonts, Spacing, BorderRadius, ColorTheme } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import { RootStackParamList } from '../navigation';

type Nav = StackNavigationProp<RootStackParamList>;

function makeStyles(colors: ColorTheme) {
  return StyleSheet.create({
    flex: { flex: 1 },
    titleBar: {
      paddingHorizontal: Spacing.md,
      paddingTop: Spacing.md,
      paddingBottom: Spacing.sm,
    },
    title: { color: colors.text, fontSize: Fonts.sizes.xl, fontWeight: '800' },
    subtitle: { color: colors.textSecondary, fontSize: Fonts.sizes.sm },
    content: { padding: Spacing.md, paddingBottom: Spacing.xxl, gap: Spacing.md },
    regionCard: {
      backgroundColor: colors.card,
      borderRadius: BorderRadius.lg,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border,
    },
    regionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: Spacing.md,
    },
    regionLocked: { opacity: 0.6 },
    regionLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, flex: 1 },
    regionEmoji: {
      width: 52,
      height: 52,
      borderRadius: BorderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    regionName: { color: colors.text, fontSize: Fonts.sizes.md, fontWeight: '700' },
    textLocked: { color: colors.textMuted },
    regionDesc: { color: colors.textSecondary, fontSize: Fonts.sizes.xs, maxWidth: 220 },
    chevron: { color: colors.textMuted, fontSize: 12 },
    progressRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
      paddingHorizontal: Spacing.md,
      paddingBottom: Spacing.sm,
    },
    progressTrack: {
      flex: 1,
      height: 6,
      backgroundColor: colors.surfaceAlt,
      borderRadius: BorderRadius.full,
      overflow: 'hidden',
    },
    progressFill: { height: '100%', borderRadius: BorderRadius.full },
    progressText: { color: colors.textMuted, fontSize: Fonts.sizes.xs, width: 40 },
    lessonList: {
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    lessonRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
      padding: Spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border + '66',
    },
    lessonDone: { opacity: 0.7 },
    lessonIcon: { fontSize: 18, width: 24 },
    lessonInfo: { flex: 1 },
    lessonTitle: { color: colors.text, fontSize: Fonts.sizes.sm, fontWeight: '600' },
    textDone: { color: colors.textSecondary },
    lessonType: { color: colors.textMuted, fontSize: Fonts.sizes.xs },
    lessonArrow: { color: colors.textMuted, fontSize: 20 },
  });
}

export default function WorldMapScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const nav = useNavigation<Nav>();
  const { completedLessons, unlockedRegions } = useGameStore();
  const [expandedRegion, setExpandedRegion] = useState<string | null>('hiragana');

  return (
    <LinearGradient colors={[colors.background, colors.gradientBg]} style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <View style={styles.titleBar}>
          <Text style={styles.title}>🗺️ World Map</Text>
          <Text style={styles.subtitle}>
            {completedLessons.length} lessons completed
          </Text>
        </View>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {REGIONS.map((region) => {
            const isUnlocked = unlockedRegions.includes(region.id);
            const regionLessons = region.lessons;
            const completed = regionLessons.filter(l => completedLessons.includes(l.id)).length;
            const progress = regionLessons.length > 0 ? completed / regionLessons.length : 0;
            const isExpanded = expandedRegion === region.id;

            return (
              <View key={region.id} style={styles.regionCard}>
                <TouchableOpacity
                  style={[styles.regionHeader, !isUnlocked && styles.regionLocked]}
                  onPress={() => isUnlocked && setExpandedRegion(isExpanded ? null : region.id)}
                  activeOpacity={isUnlocked ? 0.8 : 1}
                >
                  <View style={styles.regionLeft}>
                    <View
                      style={[
                        styles.regionEmoji,
                        { backgroundColor: isUnlocked ? region.color + '33' : colors.textMuted + '33' },
                      ]}
                    >
                      <Text style={{ fontSize: 28 }}>{isUnlocked ? region.emoji : '🔒'}</Text>
                    </View>
                    <View>
                      <Text style={[styles.regionName, !isUnlocked && styles.textLocked]}>
                        {region.name}
                      </Text>
                      <Text style={styles.regionDesc} numberOfLines={1}>
                        {isUnlocked ? region.description : 'Complete previous region to unlock'}
                      </Text>
                    </View>
                  </View>
                  {isUnlocked && (
                    <Text style={styles.chevron}>{isExpanded ? '▲' : '▼'}</Text>
                  )}
                </TouchableOpacity>

                {isUnlocked && (
                  <View style={styles.progressRow}>
                    <View style={styles.progressTrack}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${Math.round(progress * 100)}%`, backgroundColor: region.color },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressText}>{completed}/{regionLessons.length}</Text>
                  </View>
                )}

                {isUnlocked && isExpanded && (
                  <View style={styles.lessonList}>
                    {regionLessons.map((lesson: Lesson) => {
                      const done = completedLessons.includes(lesson.id);
                      return (
                        <TouchableOpacity
                          key={lesson.id}
                          style={[styles.lessonRow, done && styles.lessonDone]}
                          onPress={() => nav.navigate('Lesson', { lessonId: lesson.id })}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.lessonIcon}>
                            {done ? '✅' : lesson.type === 'flashcard' ? '📖' : '✏️'}
                          </Text>
                          <View style={styles.lessonInfo}>
                            <Text style={[styles.lessonTitle, done && styles.textDone]}>
                              {lesson.title}
                            </Text>
                            <Text style={styles.lessonType}>
                              {lesson.type === 'flashcard' ? 'Flashcard' : 'Quiz'} • {lesson.xpReward} XP
                            </Text>
                          </View>
                          {!done && <Text style={styles.lessonArrow}>›</Text>}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
