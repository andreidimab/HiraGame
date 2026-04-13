import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AvatarOutfit } from '../store/gameStore';
import { Colors, BorderRadius, Spacing } from '../theme';

const OUTFIT_DATA: Record<AvatarOutfit, { emoji: string; label: string; color: string }> = {
  samurai: { emoji: '⚔️', label: 'Samurai', color: '#CE93D8' },
  shrine_maiden: { emoji: '⛩️', label: 'Shrine Maiden', color: '#F48FB1' },
  tokyo_modern: { emoji: '🏙️', label: 'Modern Tokyo', color: '#4FC3F7' },
  ninja: { emoji: '🥷', label: 'Ninja', color: '#546E7A' },
  school_uniform: { emoji: '📚', label: 'School Uniform', color: '#81C784' },
};

interface AvatarProps {
  outfit: AvatarOutfit;
  size?: 'sm' | 'md' | 'lg';
  onPress?: () => void;
}

const SIZE_MAP = { sm: 40, md: 64, lg: 96 };
const FONT_MAP = { sm: 20, md: 32, lg: 48 };

export function Avatar({ outfit, size = 'md', onPress }: AvatarProps) {
  const data = OUTFIT_DATA[outfit];
  const dim = SIZE_MAP[size];
  const fontSize = FONT_MAP[size];

  const inner = (
    <View
      style={[
        styles.circle,
        { width: dim, height: dim, borderRadius: dim / 2, borderColor: data.color },
      ]}
    >
      <Text style={{ fontSize }}>{data.emoji}</Text>
    </View>
  );

  if (onPress) {
    return <TouchableOpacity onPress={onPress}>{inner}</TouchableOpacity>;
  }
  return inner;
}

export function AvatarOutfitPicker({
  selected,
  onSelect,
}: {
  selected: AvatarOutfit;
  onSelect: (outfit: AvatarOutfit) => void;
}) {
  return (
    <View style={styles.pickerRow}>
      {(Object.entries(OUTFIT_DATA) as [AvatarOutfit, typeof OUTFIT_DATA[AvatarOutfit]][]).map(
        ([key, data]) => (
          <TouchableOpacity
            key={key}
            onPress={() => onSelect(key)}
            style={[
              styles.outfitOption,
              { borderColor: data.color },
              selected === key && { backgroundColor: data.color + '33' },
            ]}
          >
            <Text style={styles.outfitEmoji}>{data.emoji}</Text>
            <Text style={styles.outfitLabel}>{data.label}</Text>
          </TouchableOpacity>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 2,
  },
  pickerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    justifyContent: 'center',
  },
  outfitOption: {
    alignItems: 'center',
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    backgroundColor: Colors.surface,
    width: 90,
    gap: 4,
  },
  outfitEmoji: {
    fontSize: 28,
  },
  outfitLabel: {
    color: Colors.textSecondary,
    fontSize: 10,
    textAlign: 'center',
  },
});
