import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Modal, BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '../../store/gameStore';
import { Fonts, Spacing, BorderRadius, ColorTheme } from '../../theme';
import { useTheme } from '../../theme/ThemeContext';
import { RootStackParamList } from '../../navigation';
import { KANA_WORDS, KanaWord } from '../../data/words';
import { shuffleArray } from '../../utils/array';
import { XP_TABLE } from '../../systems/xp';

type RouteType = RouteProp<RootStackParamList, 'WordBuilder'>;
type Nav = StackNavigationProp<RootStackParamList>;

const GAME_DURATION = 60;
const TILE_POOL_SIZE = 8; // number of kana tiles shown

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
    startText: { color: '#FFFFFF', fontSize: Fonts.sizes.lg, fontWeight: '800' },
    backLink: { padding: Spacing.sm },
    backLinkText: { color: colors.textSecondary, fontSize: Fonts.sizes.md },
    resultCard: { backgroundColor: colors.card, borderRadius: BorderRadius.md, padding: Spacing.md, alignItems: 'center', width: '100%' },
    resultXP: { color: colors.secondary, fontSize: Fonts.sizes.xl, fontWeight: '800' },
    // HUD
    hud: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.md },
    hudBackBtn: {
      width: 32, height: 32, borderRadius: 16, backgroundColor: colors.surfaceAlt,
      alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border,
    },
    hudBackText: { color: colors.textSecondary, fontSize: 14 },
    hudStat: { color: colors.text, fontWeight: '600', fontSize: Fonts.sizes.md },
    hudTimer: { color: colors.secondary, fontWeight: '800', fontSize: Fonts.sizes.lg },
    // Word target
    targetArea: { alignItems: 'center', padding: Spacing.lg, gap: Spacing.sm },
    meaningLabel: { color: colors.textSecondary, fontSize: Fonts.sizes.sm },
    meaningText: { color: colors.text, fontSize: Fonts.sizes.xxl, fontWeight: '800' },
    // Answer slots
    answerRow: { flexDirection: 'row', gap: Spacing.sm, justifyContent: 'center', minHeight: 64, flexWrap: 'wrap' },
    answerSlot: {
      width: 56, height: 56, borderRadius: BorderRadius.md,
      backgroundColor: colors.card, borderWidth: 2, borderColor: colors.primary,
      alignItems: 'center', justifyContent: 'center',
    },
    answerSlotEmpty: { borderStyle: 'dashed', borderColor: colors.border, backgroundColor: colors.surfaceAlt },
    answerSlotCorrect: { backgroundColor: colors.success + '33', borderColor: colors.success },
    answerKana: { fontSize: 24, color: colors.text },
    // Tile pool
    tileArea: { flex: 1, padding: Spacing.md, gap: Spacing.sm },
    tileRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, justifyContent: 'center' },
    tile: {
      width: 56, height: 56, borderRadius: BorderRadius.md,
      backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border,
      alignItems: 'center', justifyContent: 'center',
    },
    tileUsed: { opacity: 0.2 },
    tileKana: { fontSize: 22, color: colors.text },
    // Feedback
    feedbackCorrect: { color: colors.success, fontSize: Fonts.sizes.sm, fontWeight: '700', textAlign: 'center' },
    feedbackWrong: { color: colors.error, fontSize: Fonts.sizes.sm, fontWeight: '700', textAlign: 'center' },
    // Modal
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

function buildTilePool(word: KanaWord): string[] {
  // Split kana into individual characters
  const correct = Array.from(word.kana);
  // Add distractors to reach TILE_POOL_SIZE
  const allKana = 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん'.split('');
  const distractors = shuffleArray(allKana.filter(k => !correct.includes(k))).slice(0, TILE_POOL_SIZE - correct.length);
  return shuffleArray([...correct, ...distractors]);
}

export default function WordBuilderScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const nav = useNavigation<Nav>();
  const route = useRoute<RouteType>();
  const { addXP } = useGameStore();

  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [currentWord, setCurrentWord] = useState<KanaWord | null>(null);
  const [tilePool, setTilePool] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [usedIndices, setUsedIndices] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showExitModal, setShowExitModal] = useState(false);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (started) { setShowExitModal(true); return true; }
      return false;
    });
    return () => sub.remove();
  }, [started]);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const wordPoolRef = useRef<KanaWord[]>([]);

  const pickNextWord = useCallback(() => {
    if (wordPoolRef.current.length === 0) {
      wordPoolRef.current = shuffleArray([...KANA_WORDS]);
    }
    const word = wordPoolRef.current.pop()!;
    setCurrentWord(word);
    setTilePool(buildTilePool(word));
    setSelected([]);
    setUsedIndices([]);
    setFeedback(null);
  }, []);

  const startGame = useCallback(() => {
    wordPoolRef.current = shuffleArray([...KANA_WORDS]);
    setScore(0); setXpEarned(0); setTimeLeft(GAME_DURATION); setFinished(false); setStarted(true);
    pickNextWord();
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current!); setFinished(true); return 0; }
        return t - 1;
      });
    }, 1000);
  }, [pickNextWord]);

  const handleTilePress = useCallback((kana: string, index: number) => {
    if (!currentWord || usedIndices.includes(index)) return;
    const newSelected = [...selected, kana];
    const newUsedIndices = [...usedIndices, index];
    setSelected(newSelected);
    setUsedIndices(newUsedIndices);

    const targetKana = Array.from(currentWord.kana);
    if (newSelected.length === targetKana.length) {
      if (newSelected.join('') === currentWord.kana) {
        const xp = 8;
        setFeedback('correct');
        setScore(s => s + 1);
        setXpEarned(e => e + xp);
        addXP(xp);
        setTimeout(() => pickNextWord(), 500);
      } else {
        setFeedback('wrong');
        setTimeout(() => { setSelected([]); setUsedIndices([]); setFeedback(null); }, 600);
      }
    }
  }, [currentWord, selected, usedIndices, addXP, pickNextWord]);

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
          <Text style={styles.bigEmoji}>🧩</Text>
          <Text style={styles.title}>Word Builder</Text>
          <Text style={styles.subtitle}>Tap kana tiles in order to spell the Japanese word!</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoRow}>📖 Kana-only Japanese words</Text>
            <Text style={styles.infoRow}>⏱️ 60 seconds</Text>
            <Text style={styles.infoRow}>⭐ +8 XP per word</Text>
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
    const finalXP = XP_TABLE.miniGameSession + score * 2;
    return (
      <LinearGradient colors={[colors.resultsGradient, colors.background]} style={styles.flex}>
        <SafeAreaView style={styles.center}>
          <Text style={styles.bigEmoji}>{score >= 10 ? '🌟' : score >= 5 ? '⭐' : '🧩'}</Text>
          <Text style={styles.title}>{score >= 10 ? 'Amazing!' : score >= 5 ? 'Nice work!' : 'Good try!'}</Text>
          <Text style={styles.subtitle}>{score} words built</Text>
          <View style={styles.resultCard}><Text style={styles.resultXP}>⭐ +{finalXP} XP</Text></View>
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

  const targetKana = currentWord ? Array.from(currentWord.kana) : [];

  return (
    <LinearGradient colors={[colors.background, colors.gradientBg]} style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <View style={styles.hud}>
          <TouchableOpacity style={styles.hudBackBtn} onPress={() => setShowExitModal(true)}>
            <Text style={styles.hudBackText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.hudStat}>🧩 {score}</Text>
          <Text style={[styles.hudTimer, timeLeft <= 10 && { color: colors.error }]}>{timeLeft}s</Text>
          <Text style={styles.hudStat}>⭐ {xpEarned}</Text>
        </View>

        {currentWord && (
          <View style={styles.targetArea}>
            <Text style={styles.meaningLabel}>Spell in Japanese:</Text>
            <Text style={styles.meaningText}>{currentWord.meaning}</Text>

            {/* Answer slots */}
            <View style={styles.answerRow}>
              {targetKana.map((_, i) => {
                const filled = selected[i];
                const isCorrect = feedback === 'correct';
                return (
                  <View
                    key={i}
                    style={[
                      styles.answerSlot,
                      !filled && styles.answerSlotEmpty,
                      isCorrect && filled && styles.answerSlotCorrect,
                    ]}
                  >
                    {filled ? <Text style={styles.answerKana}>{filled}</Text> : null}
                  </View>
                );
              })}
            </View>

            {feedback === 'correct' && <Text style={styles.feedbackCorrect}>✓ Correct!</Text>}
            {feedback === 'wrong' && <Text style={styles.feedbackWrong}>✗ Try again</Text>}
          </View>
        )}

        {/* Tile pool */}
        <View style={styles.tileArea}>
          <View style={styles.tileRow}>
            {tilePool.map((kana, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.tile, usedIndices.includes(i) && styles.tileUsed]}
                onPress={() => handleTilePress(kana, i)}
                activeOpacity={0.7}
                disabled={usedIndices.includes(i)}
              >
                <Text style={styles.tileKana}>{kana}</Text>
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
