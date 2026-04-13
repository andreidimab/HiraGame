import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Fonts, Spacing, BorderRadius } from '../theme';

interface StreakBadgeProps {
  streak: number;
  shieldsAvailable: number;
  compact?: boolean;
}

export function StreakBadge({ streak, shieldsAvailable, compact = false }: StreakBadgeProps) {
  if (compact) {
    return (
      <View style={styles.compactRow}>
        <Text style={styles.fire}>🔥</Text>
        <Text style={styles.compactCount}>{streak}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.streakBox}>
        <Text style={styles.fire}>🔥</Text>
        <Text style={styles.count}>{streak}</Text>
        <Text style={styles.label}>day streak</Text>
      </View>
      {shieldsAvailable > 0 && (
        <View style={styles.shieldBadge}>
          <Text style={styles.shieldIcon}>🛡️</Text>
          <Text style={styles.shieldCount}>{shieldsAvailable}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  streakBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surfaceAlt,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  fire: {
    fontSize: 20,
  },
  count: {
    color: Colors.accent,
    fontSize: Fonts.sizes.xl,
    fontWeight: '800',
  },
  label: {
    color: Colors.textSecondary,
    fontSize: Fonts.sizes.sm,
  },
  shieldBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  shieldIcon: {
    fontSize: 14,
  },
  shieldCount: {
    color: Colors.textSecondary,
    fontSize: Fonts.sizes.sm,
    fontWeight: '600',
  },
  compactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  compactCount: {
    color: Colors.accent,
    fontSize: Fonts.sizes.md,
    fontWeight: '700',
  },
});
