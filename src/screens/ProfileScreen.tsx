import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Modal, Alert, Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '../store/gameStore';
import { useAuthStore } from '../store/authStore';
import { Avatar, AvatarOutfitPicker } from '../components/Avatar';
import { XPBar } from '../components/XPBar';
import { StreakBadge } from '../components/StreakBadge';
import { Fonts, Spacing, BorderRadius, ColorTheme } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import { AvatarOutfit } from '../store/gameStore';
import { getLevelTitle } from '../systems/xp';

const ACHIEVEMENT_META: Record<string, { label: string; desc: string; emoji: string }> = {
  first_steps: { label: 'First Steps', desc: 'Complete your first lesson', emoji: '👣' },
  kana_master: { label: 'Kana Master', desc: '100% accuracy on all Hiragana & Katakana', emoji: '⭐' },
  week_warrior: { label: 'Week Warrior', desc: 'Maintain a 7-day streak', emoji: '⚔️' },
  night_owl: { label: 'Night Owl', desc: 'Complete a lesson after midnight', emoji: '🦉' },
  speed_reader: { label: 'Speed Reader', desc: 'Finish a quiz in under 60 seconds', emoji: '💨' },
  century_streak: { label: 'Century Streak', desc: '100-day streak', emoji: '💯' },
};

function makeStyles(colors: ColorTheme) {
  return StyleSheet.create({
    flex: { flex: 1 },
    content: { padding: Spacing.md, paddingBottom: Spacing.xxl, gap: Spacing.md },
    heroSection: { alignItems: 'center', paddingVertical: Spacing.lg, gap: Spacing.sm },
    editBadge: {
      backgroundColor: colors.surfaceAlt,
      borderRadius: BorderRadius.full,
      paddingHorizontal: Spacing.sm,
      paddingVertical: 4,
    },
    editBadgeText: { color: colors.textSecondary, fontSize: Fonts.sizes.xs },
    username: { color: colors.text, fontSize: Fonts.sizes.xl, fontWeight: '800' },
    levelTitle: { color: colors.primary, fontSize: Fonts.sizes.sm, fontWeight: '600' },
    nameEdit: { width: 200 },
    nameInput: {
      color: colors.text,
      fontSize: Fonts.sizes.xl,
      fontWeight: '800',
      borderBottomWidth: 2,
      borderBottomColor: colors.primary,
      textAlign: 'center',
      paddingVertical: 4,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: BorderRadius.lg,
      padding: Spacing.md,
      gap: Spacing.sm,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cardTitle: { color: colors.textSecondary, fontSize: Fonts.sizes.sm, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 },
    statsRow: { flexDirection: 'row', gap: Spacing.sm },
    statBox: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: BorderRadius.md,
      padding: Spacing.sm,
      alignItems: 'center',
      gap: 2,
      borderWidth: 1,
      borderColor: colors.border,
    },
    statEmoji: { fontSize: 18 },
    statValue: { color: colors.text, fontSize: Fonts.sizes.md, fontWeight: '800' },
    statLabel: { color: colors.textMuted, fontSize: 9, textAlign: 'center' },
    streakDetails: { gap: 4 },
    streakDetail: { color: colors.textSecondary, fontSize: Fonts.sizes.sm },
    achievementGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
    achievementBadge: {
      width: '47%',
      backgroundColor: colors.surfaceAlt,
      borderRadius: BorderRadius.md,
      padding: Spacing.sm,
      alignItems: 'center',
      gap: 4,
      borderWidth: 1,
      borderColor: colors.primary + '44',
    },
    achievementLocked: { borderColor: colors.border, opacity: 0.5 },
    achievementEmoji: { fontSize: 28 },
    achievementLabel: { color: colors.text, fontSize: Fonts.sizes.sm, fontWeight: '700', textAlign: 'center' },
    textLocked: { color: colors.textMuted },
    achievementDesc: { color: colors.textMuted, fontSize: 10, textAlign: 'center' },
    accountRow: { gap: 4 },
    accountProvider: { color: colors.text, fontSize: Fonts.sizes.sm, fontWeight: '600' },
    accountEmail: { color: colors.textMuted, fontSize: Fonts.sizes.xs },
    themeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: Spacing.xs,
    },
    themeLabel: { color: colors.text, fontSize: Fonts.sizes.sm, fontWeight: '600' },
    signOutBtn: {
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      borderColor: colors.error + '88',
      padding: Spacing.sm,
      alignItems: 'center',
      marginTop: Spacing.xs,
    },
    signOutText: { color: colors.error, fontWeight: '700', fontSize: Fonts.sizes.md },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
    modalCard: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: BorderRadius.xl,
      borderTopRightRadius: BorderRadius.xl,
      padding: Spacing.lg,
      gap: Spacing.md,
    },
    modalTitle: { color: colors.text, fontSize: Fonts.sizes.lg, fontWeight: '800', textAlign: 'center' },
    modalClose: { alignItems: 'center', padding: Spacing.md },
    modalCloseText: { color: colors.textSecondary, fontSize: Fonts.sizes.md },
  });
}

export default function ProfileScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const {
    username, avatarOutfit, totalXP, level, streak, achievements,
    completedLessons, weeklyXP, sakuraCoins,
    setUsername, setAvatarOutfit,
  } = useGameStore();
  const { user, logout } = useAuthStore();

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(username);

  const unlockedAchievements = achievements.filter(a => a.unlockedAt !== null);

  return (
    <LinearGradient colors={[colors.background, colors.gradientBg]} style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Avatar & Name */}
          <View style={styles.heroSection}>
            <Avatar outfit={avatarOutfit} size="lg" onPress={() => setShowAvatarPicker(true)} />
            <TouchableOpacity style={styles.editBadge} onPress={() => setShowAvatarPicker(true)}>
              <Text style={styles.editBadgeText}>✏️ Change</Text>
            </TouchableOpacity>

            {editingName ? (
              <View style={styles.nameEdit}>
                <TextInput
                  style={styles.nameInput}
                  value={nameInput}
                  onChangeText={setNameInput}
                  autoFocus
                  maxLength={20}
                  onBlur={() => {
                    setUsername(nameInput.trim() || 'Player');
                    setEditingName(false);
                  }}
                />
              </View>
            ) : (
              <TouchableOpacity onPress={() => { setNameInput(username); setEditingName(true); }}>
                <Text style={styles.username}>{username} ✏️</Text>
              </TouchableOpacity>
            )}

            <Text style={styles.levelTitle}>{getLevelTitle(level)}</Text>
          </View>

          {/* XP & Level */}
          <View style={styles.card}>
            <XPBar totalXP={totalXP} />
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <StatBox label="Total XP" value={totalXP.toLocaleString()} emoji="⭐" styles={styles} />
            <StatBox label="Weekly XP" value={weeklyXP.toLocaleString()} emoji="📅" styles={styles} />
            <StatBox label="Lessons" value={completedLessons.length.toString()} emoji="📖" styles={styles} />
            <StatBox label="Coins" value={sakuraCoins.toString()} emoji="🌸" styles={styles} />
          </View>

          {/* Streak */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Streak</Text>
            <StreakBadge streak={streak.current} shieldsAvailable={streak.shieldsAvailable} />
            <View style={styles.streakDetails}>
              <Text style={styles.streakDetail}>Best streak: {streak.longest} days</Text>
              {streak.shieldsAvailable > 0 && (
                <Text style={styles.streakDetail}>🛡️ {streak.shieldsAvailable} shield{streak.shieldsAvailable > 1 ? 's' : ''} available</Text>
              )}
            </View>
          </View>

          {/* Achievements */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              Achievements ({unlockedAchievements.length}/{achievements.length})
            </Text>
            <View style={styles.achievementGrid}>
              {achievements.map((a) => {
                const meta = ACHIEVEMENT_META[a.id];
                if (!meta) return null;
                const unlocked = a.unlockedAt !== null;
                return (
                  <View
                    key={a.id}
                    style={[styles.achievementBadge, !unlocked && styles.achievementLocked]}
                  >
                    <Text style={styles.achievementEmoji}>
                      {unlocked ? meta.emoji : '🔒'}
                    </Text>
                    <Text style={[styles.achievementLabel, !unlocked && styles.textLocked]}>
                      {meta.label}
                    </Text>
                    <Text style={styles.achievementDesc} numberOfLines={2}>
                      {meta.desc}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Account info + sign out */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Settings</Text>
            <View style={styles.themeRow}>
              <Text style={styles.themeLabel}>🌙 Dark Mode</Text>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={isDark ? colors.primaryLight : colors.textMuted}
              />
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Account</Text>
            <View style={styles.accountRow}>
              <Text style={styles.accountProvider}>
                {user?.providerData[0]?.providerId === 'password' ? '📧 Email' :
                 user?.providerData[0]?.providerId === 'google.com' ? '🔵 Google' :
                 user?.providerData[0]?.providerId === 'facebook.com' ? '📘 Facebook' :
                 user?.providerData[0]?.providerId === 'twitter.com' ? '🐦 X / Twitter' : '🔑 Signed in'}
              </Text>
              <Text style={styles.accountEmail} numberOfLines={1}>{user?.email ?? user?.displayName}</Text>
            </View>
            <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
              <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Avatar Picker Modal */}
      <Modal visible={showAvatarPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Choose Avatar</Text>
            <AvatarOutfitPicker
              selected={avatarOutfit}
              onSelect={(outfit: AvatarOutfit) => {
                setAvatarOutfit(outfit);
                setShowAvatarPicker(false);
              }}
            />
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setShowAvatarPicker(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

function StatBox({ label, value, emoji, styles }: { label: string; value: string; emoji: string; styles: ReturnType<typeof makeStyles> }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statEmoji}>{emoji}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}
