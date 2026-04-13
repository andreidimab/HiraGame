import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Modal, BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '../../store/gameStore';
import { HIRAGANA } from '../../data/hiragana';
import { KATAKANA } from '../../data/katakana';
import { Fonts, Spacing, BorderRadius, ColorTheme } from '../../theme';
import { useTheme } from '../../theme/ThemeContext';
import { RootStackParamList } from '../../navigation';
import { shuffleArray } from '../../utils/array';
import { XP_TABLE } from '../../systems/xp';

type RouteType = RouteProp<RootStackParamList, 'MatchBlitz'>;
type Nav = StackNavigationProp<RootStackParamList>;

const PAIRS = 6;
const GAME_DURATION = 60;

interface Card {
  id: string;
  content: string;
  pairId: string;
  type: 'kana' | 'romaji';
}

function buildDeck(pool: typeof HIRAGANA): Card[] {
  const picked = shuffleArray(pool).slice(0, PAIRS);
  const cards: Card[] = [];
  picked.forEach((item, i) => {
    cards.push({ id: `k_${i}`, content: item.kana, pairId: `pair_${i}`, type: 'kana' });
    cards.push({ id: `r_${i}`, content: item.romaji, pairId: `pair_${i}`, type: 'romaji' });
  });
  return shuffleArray(cards);
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
    hudStat: { color: colors.text, fontWeight: '600', fontSize: Fonts.sizes.md },
    hudTimer: { color: colors.secondary, fontWeight: '800', fontSize: Fonts.sizes.lg },
    grid: {
      flex: 1, flexDirection: 'row', flexWrap: 'wrap',
      padding: Spacing.sm, gap: Spacing.sm, justifyContent: 'center', alignContent: 'center',
    },
    cardTile: {
      width: '30%', aspectRatio: 0.85, backgroundColor: colors.surfaceAlt,
      borderRadius: BorderRadius.md, alignItems: 'center', justifyContent: 'center',
      borderWidth: 1.5, borderColor: colors.border,
    },
    cardFlipped: { backgroundColor: colors.card, borderColor: colors.primary },
    cardMatched: { backgroundColor: colors.success + '33', borderColor: colors.success },
    cardHidden: { color: colors.textMuted, fontSize: Fonts.sizes.xl },
    cardKana: { fontSize: 32, color: colors.text },
    cardRomaji: { fontSize: Fonts.sizes.md, color: colors.secondary, fontWeight: '700' },
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

export default function MatchBlitzScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const nav = useNavigation<Nav>();
  const route = useRoute<RouteType>();
  const { region } = route.params;
  const pool = region === 'hiragana' ? HIRAGANA : KATAKANA;
  const { addXP } = useGameStore();

  const [started, setStarted] = useState(false);
  const [deck, setDeck] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [locked, setLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [moves, setMoves] = useState(0);
  const [finished, setFinished] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [showExitModal, setShowExitModal] = useState(false);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (started) { setShowExitModal(true); return true; }
      return false;
    });
    return () => sub.remove();
  }, [started]);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startGame = () => {
    setDeck(buildDeck(pool));
    setFlipped([]); setMatched([]); setLocked(false);
    setTimeLeft(GAME_DURATION); setMoves(0); setFinished(false); setStarted(true);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current!); endGame(0); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  const endGame = (bonusTime: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    const xp = XP_TABLE.miniGameSession + bonusTime * 2;
    setXpEarned(xp); addXP(xp); setFinished(true);
  };

  const handleCardPress = (card: Card) => {
    if (locked || flipped.includes(card.id) || matched.includes(card.pairId)) return;
    if (flipped.length === 2) return;
    const newFlipped = [...flipped, card.id];
    setFlipped(newFlipped); setMoves(m => m + 1);
    if (newFlipped.length === 2) {
      setLocked(true);
      const [a, b] = newFlipped.map(id => deck.find(c => c.id === id)!);
      if (a.pairId === b.pairId) {
        const newMatched = [...matched, a.pairId];
        setMatched(newMatched); setFlipped([]); setLocked(false);
        if (newMatched.length === PAIRS) endGame(timeLeft);
      } else {
        setTimeout(() => { setFlipped([]); setLocked(false); }, 800);
      }
    }
  };

  const handleExitConfirm = () => {
    setShowExitModal(false);
    if (timerRef.current) clearInterval(timerRef.current);
    nav.goBack();
  };

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  if (!started) {
    return (
      <LinearGradient colors={[colors.background, colors.gradientBg]} style={styles.flex}>
        <SafeAreaView style={styles.center}>
          <Text style={styles.bigEmoji}>⚡</Text>
          <Text style={styles.title}>Match Blitz</Text>
          <Text style={styles.subtitle}>Flip cards to match kana with their romaji!</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoRow}>🃏 {PAIRS} pairs of cards</Text>
            <Text style={styles.infoRow}>⏱️ {GAME_DURATION} seconds</Text>
            <Text style={styles.infoRow}>⭐ Bonus XP for leftover time</Text>
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

  if (finished) {
    const allMatched = matched.length === PAIRS;
    return (
      <LinearGradient colors={[colors.resultsGradient, colors.background]} style={styles.flex}>
        <SafeAreaView style={styles.center}>
          <Text style={styles.bigEmoji}>{allMatched ? '🌟' : timeLeft <= 0 ? '⏰' : '✅'}</Text>
          <Text style={styles.title}>{allMatched ? 'Perfect!' : 'Time Up!'}</Text>
          <Text style={styles.subtitle}>{matched.length}/{PAIRS} pairs found in {moves} moves</Text>
          <View style={styles.resultCard}><Text style={styles.resultXP}>⭐ +{xpEarned} XP</Text></View>
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
        <View style={styles.hud}>
          <TouchableOpacity style={styles.hudBackBtn} onPress={() => setShowExitModal(true)}>
            <Text style={styles.hudBackText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.hudStat}>🃏 {matched.length}/{PAIRS}</Text>
          <Text style={[styles.hudTimer, timeLeft <= 10 && { color: colors.error }]}>{timeLeft}s</Text>
          <Text style={styles.hudStat}>Moves: {moves}</Text>
        </View>
        <View style={styles.grid}>
          {deck.map((card) => {
            const isFlipped = flipped.includes(card.id);
            const isMatched = matched.includes(card.pairId);
            return (
              <TouchableOpacity
                key={card.id}
                style={[styles.cardTile, isFlipped && styles.cardFlipped, isMatched && styles.cardMatched]}
                onPress={() => handleCardPress(card)}
                activeOpacity={0.8}
              >
                {(isFlipped || isMatched) ? (
                  <Text style={card.type === 'kana' ? styles.cardKana : styles.cardRomaji}>{card.content}</Text>
                ) : (
                  <Text style={styles.cardHidden}>?</Text>
                )}
              </TouchableOpacity>
            );
          })}
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
