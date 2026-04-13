import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './src/navigation';
import AuthScreen from './src/screens/AuthScreen';
import { useGameStore } from './src/store/gameStore';
import { useAuthStore } from './src/store/authStore';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import { updateUserGameStats } from './src/firebase/userProfile';

function AppContent() {
  const { colors, isDark } = useTheme();
  const [hydrated, setHydrated] = useState(false);
  const hydrate = useGameStore(s => s.hydrate);
  const { user, loading: authLoading, subscribeToAuth } = useAuthStore();

  useEffect(() => {
    hydrate().finally(() => setHydrated(true));
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToAuth();
    return unsubscribe;
  }, []);

  const { totalXP, weeklyXP, streak, level, avatarOutfit, username } = useGameStore();
  useEffect(() => {
    if (!user) return;
    updateUserGameStats(user.uid, {
      totalXP, weeklyXP, streak: streak.current, level, avatarOutfit, username,
    });
  }, [user, totalXP, weeklyXP, streak.current, level]);

  if (!hydrated || authLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  const SKIP_AUTH = false;

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      {(SKIP_AUTH || user) ? <AppNavigator /> : <AuthScreen />}
    </>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
