import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Dimensions,
  Animated, Modal, BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '../../store/gameStore';
import { HIRAGANA } from '../../data/hiragana';
import { KATAKANA } from '../../data/katakana';
import { KanaCard } from '../../data/hiragana';
import { Fonts, Spacing, BorderRadius, ColorTheme } from '../../theme';
import { useTheme } from '../../theme/ThemeContext';
import { RootStackParamList } from '../../navigation';
import { shuffleArray } from '../../utils/array';
import { XP_TABLE } from '../../systems/xp';

type RouteType = RouteProp<RootStackParamList, 'KanaRain'>;
type Nav = StackNavigationProp<RootStackParamList>;

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const FALL_DURATION = 5000;
const SPAWN_INTERVAL = 1800;
const MAX_ACTIVE = 6;

interface FallingKana {
  id: string;
  card: KanaCard;
  x: number;
  anim: Animated.Value;
}

function makeStyles(colors: ColorTheme) {
  return StyleSheet.create({
    flex: { flex: 1 },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.lg, gap: Spacing.md },
    bigEmoji: { fontSize: 64 },
    title: { color: colors.text, fontSize: Fonts.sizes.xl, fontWeight: '800' },
    subtitle: { color: colors.textSecondary, fontSize: Fonts.sizes.md, textAlign: 'center' },
    infoCard: {
      backgroundColor: colors.card, borderRadius: BorderRadius.md, padding: Spacing.md,
      gap: Spacing.sm, width: '100%', borderWidth: 1, borderColor: colors.border,
    },
    infoRow: { color: colors.textSecondary, fontSize: Fonts.sizes.md },
    startBtn: { width: '100%', borderRadius: BorderRadius.md, overflow: 'hidden' },
    startGrad: { padding: Spacing.md, alignItems: 'center' },
    startText: { color: colors.text, fontSize: Fonts.sizes.lg, fontWeight: '800' },
    backLink: { padding: Spacing.sm },
    backLinkText: { color: colors.textSecondary, fontSize: Fonts.sizes.md },
    resultCard: { backgroundColor: colors.card, borderRadius: BorderRadius.md, padding: Spacing.md, alignItems: 'center', width: '100%' },
    resultXP: { color: colors.secondary, fontSize: Fonts.sizes.xl, fontWeight: '800' },
    hud: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.md },
    hudBackBtn: {
      width: 32, height: 32, borderRadius: 16, backgroundColor: colors.surfaceAlt,
      alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border,
    },
    hudBackText: { color: colors.textSecondary, fontSize: 14 },
    flashCorrect: { backgroundColor: colors.success + '22' },
    flashWrong: { backgroundColor: colors.error + '22' },
    lives: { fontSize: 16 },
    scoreHud: { color: colors.text, fontWeight: '700', fontSize: Fonts.sizes.md },
    timerHud: { color: colors.secondary, fontWeight: '700', fontSize: Fonts.sizes.md },
    rainField: { flex: 1, position: 'relative' },
    fallingCard: {
      position: 'absolute', width: 60, height: 60, backgroundColor: colors.primary + 'CC',
      borderRadius: BorderRadius.md, alignItems: 'center', justifyContent: 'center',
    },
    fallingKana: { fontSize: 30, color: colors.text },
    answerArea: {
      padding: Spacing.md, gap: Spacing.sm, backgroundColor: colors.surface,
      borderTopWidth: 1, borderTopColor: colors.border,
    },
    targetLabel: { color: colors.textSecondary, fontSize: Fonts.sizes.sm, textAlign: 'center' },
    choicesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, justifyContent: 'center' },
    choiceBtn: {
      backgroundColor: colors.surfaceAlt, borderRadius: BorderRadius.md,
      paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
      borderWidth: 1, borderColor: colors.border, minWidth: 80, alignItems: 'center',
    },
    choiceText: { color: colors.text, fontSize: Fonts.sizes.md, fontWeight: '700' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: Spacing.lg },
    modalCard: {
      backgroundColor: colors.surface, borderRadius: BorderRadius.xl, padding: Spacing.xl,
      width: '100%', gap: Spacing.md, borderWidth: 1, borderColor: colors.border, alignItems: 'center',
    },
    modalEmoji: { fontSize: 48 },
    modalTitle: { color: colors.text, fontSize: Fonts.sizes.xl, fontWeight: '800', textAlign: 'center' },
    modalBody: { color: colors.textSecondary, fontSize: Fonts.sizes.md, textAlign: 'center', lineHeight: 22 },
    modalActions: { flexDirection: 'row', gap: Spacing.sm, width: '100%', marginTop: Spacing.sm },
    modalCancelBtn: {
      flex: 1, borderRadius: BorderRadius.md, padding: Spacing.md, alignItems: 'center',
      backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border,
    },
    modalCancelText: { color: colors.textSecondary, fontSize: Fonts.sizes.md, fontWeight: '600' },
    modalLeaveBtn: {
      flex: 1, borderRadius: BorderRadius.md, padding: Spacing.md, alignItems: 'center',
      backgroundColor: colors.error + '22', borderWidth: 1, borderColor: colors.error + '88',
    },
    modalLeaveText: { color: colors.error, fontSize: Fonts.sizes.md, fontWeight: '700' },
  });
}

export default function KanaRainScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const nav = useNavigation<Nav>();
  const route = useRoute<RouteType>();
  const { region } = route.params;
  const pool = region === 'hiragana' ? HIRAGANA : KATAKANA;
  const { addXP } = useGameStore();

  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60);
  const [falling, setFalling] = useState<FallingKana[]>([]);
  const [currentTarget, setCurrentTarget] = useState<KanaCard | null>(null);
  const [choices, setChoices] = useState<string[]>([]);
  const [flash, setFlash] = useState<'correct' | 'wrong' | null>(null);
  const [showExitModal, setShowExitModal] = useState(false);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (started) { setShowExitModal(true); return true; }
      return false;
    });
    return () => sub.remove();
  }, [started]);

  const spawnTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const gameTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const fallingRef = useRef<FallingKana[]>([]);
  const idCounter = useRef(0);

  const pickNewTarget = useCallback(() => {
    const card = pool[Math.floor(Math.random() * pool.length)];
    const distractors = shuffleArray(pool.filter(c => c.romaji !== card.romaji)).slice(0, 3);
    setCurrentTarget(card);
    setChoices(shuffleArray([card.romaji, ...distractors.map(d => d.romaji)]));
    return card;
  }, [pool]);

  const spawnCard = useCallback((target: KanaCard) => {
    if (fallingRef.current.length >= MAX_ACTIVE) return;
    const x = Math.random() * (SCREEN_W - 80);
    const anim = new Animated.Value(0);
    const id = `kana_${idCounter.current++}`;
    const newFalling: FallingKana = { id, card: target, x, anim };
    fallingRef.current = [...fallingRef.current, newFalling];
    setFalling([...fallingRef.current]);
    Animated.timing(anim, { toValue: 1, duration: FALL_DURATION, useNativeDriver: true }).start(({ finished }) => {
      if (finished) {
        fallingRef.current = fallingRef.current.filter(f => f.id !== id);
        setFalling([...fallingRef.current]);
        setMissed(m => m + 1);
        setLives(l => { const nl = l - 1; if (nl <= 0) endGame(); return nl; });
      }
    });
  }, []);

  const endGame = useCallback(() => {
    setGameOver(true);
    if (spawnTimer.current) clearInterval(spawnTimer.current);
    if (gameTimer.current) clearInterval(gameTimer.current);
  }, []);

  const startGame = useCallback(() => {
    setStarted(true); setScore(0); setMissed(0); setLives(3); setTimeLeft(60); setGameOver(false);
    fallingRef.current = []; setFalling([]);
    const target = pickNewTarget();
    gameTimer.current = setInterval(() => {
      setTimeLeft(t => { if (t <= 1) { endGame(); return 0; } return t - 1; });
    }, 1000);
    spawnCard(target);
    spawnTimer.current = setInterval(() => {
      setCurrentTarget(ct => { if (ct) spawnCard(ct); return ct; });
    }, SPAWN_INTERVAL);
  }, [pickNewTarget, spawnCard, endGame]);

  const handleAnswer = (romaji: string) => {
    if (!currentTarget || gameOver) return;
    if (romaji === currentTarget.romaji) {
      fallingRef.current.forEach(f => { if (f.card.romaji === romaji) f.anim.stopAnimation(); });
      fallingRef.current = fallingRef.current.filter(f => f.card.romaji !== romaji);
      setFalling([...fallingRef.current]);
      setScore(s => s + 1); setFlash('correct'); setTimeout(() => setFlash(null), 300); pickNewTarget();
    } else {
      setFlash('wrong'); setTimeout(() => setFlash(null), 300);
      setLives(l => { const nl = l - 1; if (nl <= 0) endGame(); return nl; });
    }
  };

  const handleExitConfirm = () => {
    setShowExitModal(false);
    if (spawnTimer.current) clearInterval(spawnTimer.current);
    if (gameTimer.current) clearInterval(gameTimer.current);
    nav.goBack();
  };

  useEffect(() => {
    return () => {
      if (spawnTimer.current) clearInterval(spawnTimer.current);
      if (gameTimer.current) clearInterval(gameTimer.current);
    };
  }, []);

  if (!started) {
    return (
      <LinearGradient colors={[colors.background, colors.gradientBg]} style={styles.flex}>
        <SafeAreaView style={styles.center}>
          <Text style={styles.bigEmoji}>🌧️</Text>
          <Text style={styles.title}>Kana Rain</Text>
          <Text style={styles.subtitle}>Tap the correct romaji before kana hits the ground!</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoRow}>💨 Kana falls from the top</Text>
            <Text style={styles.infoRow}>❤️ 3 lives</Text>
            <Text style={styles.infoRow}>⏱️ 60 seconds</Text>
          </View>
          <TouchableOpacity style={styles.startBtn} onPress={startGame}>
            <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.startGrad}>
              <Text style={styles.startText}>Start Game</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => nav.goBack()} style={styles.backLink}>
            <Text style={styles.backLinkText}>Back</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (gameOver) {
    const xp = Math.min(score * 5, XP_TABLE.miniGameSession);
    addXP(xp);
    return (
      <LinearGradient colors={[colors.resultsGradient, colors.background]} style={styles.flex}>
        <SafeAreaView style={styles.center}>
          <Text style={styles.bigEmoji}>{score >= 20 ? '🌟' : score >= 10 ? '⭐' : '💧'}</Text>
          <Text style={styles.title}>Game Over!</Text>
          <Text style={styles.subtitle}>{score} kana caught correctly</Text>
          <View style={styles.resultCard}><Text style={styles.resultXP}>⭐ +{xp} XP</Text></View>
          <TouchableOpacity style={styles.startBtn} onPress={startGame}>
            <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.startGrad}>
              <Text style={styles.startText}>Play Again</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => nav.goBack()} style={styles.backLink}>
            <Text style={styles.backLinkText}>Back to Home</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={[colors.background, colors.gradientBg]} style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <View style={[styles.hud, flash === 'correct' && styles.flashCorrect, flash === 'wrong' && styles.flashWrong]}>
          <TouchableOpacity style={styles.hudBackBtn} onPress={() => setShowExitModal(true)}>
            <Text style={styles.hudBackText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.lives}>{'❤️'.repeat(lives)}</Text>
          <Text style={styles.scoreHud}>Score: {score}</Text>
          <Text style={styles.timerHud}>{timeLeft}s</Text>
        </View>
        <View style={styles.rainField}>
          {falling.map((f) => (
            <Animated.View
              key={f.id}
              style={[styles.fallingCard, { left: f.x, transform: [{ translateY: f.anim.interpolate({ inputRange: [0, 1], outputRange: [-60, SCREEN_H - 200] }) }] }]}
            >
              <Text style={styles.fallingKana}>{f.card.kana}</Text>
            </Animated.View>
          ))}
        </View>
        <View style={styles.answerArea}>
          {currentTarget && <Text style={styles.targetLabel}>What is this kana?</Text>}
          <View style={styles.choicesGrid}>
            {choices.map((c) => (
              <TouchableOpacity key={c} style={styles.choiceBtn} onPress={() => handleAnswer(c)} activeOpacity={0.8}>
                <Text style={styles.choiceText}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <Modal visible={showExitModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalEmoji}>🚪</Text>
              <Text style={styles.modalTitle}>Leave Game?</Text>
              <Text style={styles.modalBody}>
                Are you sure you want to go back to the menu?{'\n'}This will reset your progress.
              </Text>
              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setShowExitModal(false)}>
                  <Text style={styles.modalCancelText}>Keep Playing</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalLeaveBtn} onPress={handleExitConfirm}>
                  <Text style={styles.modalLeaveText}>Leave</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}
