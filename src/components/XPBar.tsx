import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { Colors, Fonts, Spacing, BorderRadius } from '../theme';
import { xpToNextLevel, getLevelTitle, getLevelColor } from '../systems/xp';

interface XPBarProps {
  totalXP: number;
  compact?: boolean;
}

export function XPBar({ totalXP, compact = false }: XPBarProps) {
  const { current, required, level } = xpToNextLevel(totalXP);
  const progress = required > 0 ? current / required : 1;
  const animWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animWidth, {
      toValue: progress,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const levelColor = getLevelColor(level);

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <View style={[styles.levelBadgeSmall, { backgroundColor: levelColor }]}>
          <Text style={styles.levelBadgeText}>{level}</Text>
        </View>
        <View style={styles.barTrackSmall}>
          <Animated.View
            style={[
              styles.barFill,
              {
                width: animWidth.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
                backgroundColor: levelColor,
              },
            ]}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.levelBadge, { backgroundColor: levelColor }]}>
          <Text style={styles.levelText}>Lv.{level}</Text>
        </View>
        <Text style={styles.levelTitle}>{getLevelTitle(level)}</Text>
        <Text style={styles.xpText}>{current} / {required} XP</Text>
      </View>
      <View style={styles.barTrack}>
        <Animated.View
          style={[
            styles.barFill,
            {
              width: animWidth.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
              backgroundColor: levelColor,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  levelBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  levelText: {
    color: Colors.text,
    fontSize: Fonts.sizes.sm,
    fontWeight: '700',
  },
  levelTitle: {
    color: Colors.textSecondary,
    fontSize: Fonts.sizes.sm,
    flex: 1,
  },
  xpText: {
    color: Colors.textMuted,
    fontSize: Fonts.sizes.xs,
  },
  barTrack: {
    height: 8,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
  // Compact
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  levelBadgeSmall: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelBadgeText: {
    color: Colors.text,
    fontSize: Fonts.sizes.xs,
    fontWeight: '700',
  },
  barTrackSmall: {
    height: 6,
    flex: 1,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
});
