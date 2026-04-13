import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

import HomeScreen from '../screens/HomeScreen';
import WorldMapScreen from '../screens/WorldMapScreen';
import DailyChallengeScreen from '../screens/DailyChallengeScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LessonScreen from '../screens/LessonScreen';
import ResultsScreen from '../screens/ResultsScreen';
import KanaRainScreen from '../screens/minigames/KanaRainScreen';
import MatchBlitzScreen from '../screens/minigames/MatchBlitzScreen';
import PhraseRainScreen from '../screens/minigames/PhraseRainScreen';
import WordBuilderScreen from '../screens/minigames/WordBuilderScreen';

export type RootStackParamList = {
  MainTabs: { screen?: keyof MainTabParamList } | undefined;
  Lesson: { lessonId: string };
  Results: { xpEarned: number; accuracy: number; lessonTitle: string; newLevel?: number };
  KanaRain: { region: 'hiragana' | 'katakana' };
  MatchBlitz: { region: 'hiragana' | 'katakana' };
  PhraseRain: undefined;
  WordBuilder: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  WorldMap: undefined;
  DailyChallenge: undefined;
  Leaderboard: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <View style={{ opacity: focused ? 1 : 0.5 }}>
      <Text style={{ fontSize: 22 }}>{emoji}</Text>
    </View>
  );
}

function MainTabs() {
  const { colors } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 10 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} /> }}
      />
      <Tab.Screen
        name="WorldMap"
        component={WorldMapScreen}
        options={{
          tabBarLabel: 'World Map',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🗺️" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="DailyChallenge"
        component={DailyChallengeScreen}
        options={{
          tabBarLabel: 'Daily',
          tabBarIcon: ({ focused }) => <TabIcon emoji="⚡" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Leaderboard"
        component={LeaderboardScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🏆" focused={focused} /> }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} /> }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="Lesson" component={LessonScreen} />
        <Stack.Screen name="Results" component={ResultsScreen} />
        <Stack.Screen name="KanaRain" component={KanaRainScreen} />
        <Stack.Screen name="MatchBlitz" component={MatchBlitzScreen} />
        <Stack.Screen name="PhraseRain" component={PhraseRainScreen} />
        <Stack.Screen name="WordBuilder" component={WordBuilderScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
