import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '../store/gameStore';
import { HIRAGANA } from '../data/hiragana';
import { KATAKANA } from '../data/katakana';
import { Fonts, Spacing, BorderRadius, ColorTheme } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import { RootStackParamList } from '../navigation';
import { shuffleArray, pickRandom } from '../utils/array';
import { XP_TABLE } from '../systems/xp';

type Nav = StackNavigationProp<RootStackParamList>;

const TOTAL_QUESTIONS = 10;
const TIME_PER_QUESTION = 15;

function buildQuestions() {
  const pool = [...HIRAGANA, ...KATAKANA];
  const selected = pickRandom(pool, TOTAL_QUESTIONS);
  const allRomaji = pool.map(c => c.romaji);

  return selected.map(card => {
    const distractors = shuffleArray(allRomaji.filter(r => r !== card.romaji)).slice(0, 3);
    const options = shuffleArray([card.romaji, ...distractors]);
    return { card, options };
  });
}

function makeStyles(colors: ColorTheme) {
  return StyleSheet.create({
    flex: { flex: 1 },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.lg, gap: Spacing.md },
    bigEmoji: { fontSize: 72 },
    doneTitle: { color: colors.text, fontSize: Fonts.sizes.xl, fontWeight: '800' },
    doneSubtitle: { color: colors.textSecondary, fontSize: Fonts.sizes.md, textAlign: 'center' },
    backBtn: { backgroundColor: colors.surfaceAlt, borderRadius: BorderRadius.md, padding: Spacing.md, marginTop: Spacing.md },
    backBtnText: { color: colors.text, fontSize: Fonts.sizes.md },
    resultCard: {
      backgroundColor: colors.card,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      alignItems: 'center',
      gap: Spacing.sm,
      borderWidth: 1,
      borderColor: colors.secondary + '44',
      width: '100%',
    },
    resultXP: { color: colors.secondary, fontSize: Fonts.sizes.xl, fontWeight: '800' },
    perfectNote: { color: colors.primary, fontSize: Fonts.sizes.sm },
    continueBtn: { width: '100%', borderRadius: BorderRadius.md, overflow: 'hidden', marginTop: Spacing.sm },
    continueBtnGrad: { padding: Spacing.md, alignItems: 'center' },
    continueBtnText: { color: '#FFFFFF', fontSize: Fonts.sizes.lg, fontWeight: '800' },
    infoCard: {
      backgroundColor: colors.card,
      borderRadius: BorderRadius.lg,
      padding: Spacing.md,
      gap: Spacing.sm,
      width: '100%',
      borderWidth: 1,
      borderColor: colors.border,
    },
    infoRow: { color: colors.textSecondary, fontSize: Fonts.sizes.md },
    startBtn: { width: '100%', borderRadius: BorderRadius.md, overflow: 'hidden' },
    startBtnGrad: { padding: Spacing.md, alignItems: 'center' },
    startBtnText: { color: '#FFFFFF', fontSize: Fonts.sizes.lg, fontWeight: '800' },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: Spacing.md,
      gap: Spacing.sm,
    },
    qCounter: { color: colors.textSecondary, fontSize: Fonts.sizes.sm, width: 48 },
    timerTrack: {
      flex: 1,
      height: 8,
      backgroundColor: colors.surfaceAlt,
      borderRadius: BorderRadius.full,
      overflow: 'hidden',
    },
    timerFill: { height: '100%', borderRadius: BorderRadius.full },
    timerText: { color: colors.text, fontWeight: '700', width: 30, textAlign: 'right', fontSize: Fonts.sizes.sm },
    kanaArea: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    kanaBox: {
      width: 180,
      height: 180,
      borderRadius: BorderRadius.xl,
      backgroundColor: colors.card,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1.5,
      borderColor: colors.primary,
      gap: Spacing.xs,
    },
    kana: { fontSize: Fonts.sizes.kana, color: colors.text },
    kanaType: { color: colors.textMuted, fontSize: Fonts.sizes.xs },
    optionsArea: { padding: Spacing.md, gap: Spacing.sm },
    option: {
      borderRadius: BorderRadius.md,
      padding: Spacing.md,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    optionText: { color: colors.text, fontSize: Fonts.sizes.lg, fontWeight: '600' },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: Spacing.md,
    },
    scoreText: { color: colors.success, fontWeight: '700' },
    xpText: { color: colors.secondary, fontWeight: '700' },
  });
}

export default function DailyChallengeScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const nav = useNavigation<Nav>();
  const { lastDailyChallengeDate, recordDailyChallenge } = useGameStore();
  const today = new Date().toISOString().split('T')[0];
  const alreadyDone = lastDailyChallengeDate === today;

  const [started, setStarted] = useState(false);
  const [questions] = useState(buildQuestions);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correct, setCorrect] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [finished, setFinished] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerAnim = useRef(new Animated.Value(1)).current;

  const currentQ = questions[qIndex];

  const clearTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const startTimer = () => {
    timerAnim.setValue(1);
    Animated.timing(timerAnim, {
      toValue: 0,
      duration: TIME_PER_QUESTION * 1000,
      useNativeDriver: false,
    }).start();

    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearTimer();
          handleAnswer(null);
          return TIME_PER_QUESTION;
        }
        return t - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (started && !finished) {
      setTimeLeft(TIME_PER_QUESTION);
      startTimer();
    }
    return clearTimer;
  }, [qIndex, started]);

  const handleAnswer = (answer: string | null) => {
    clearTimer();
    setSelected(answer ?? '__timeout__');
    const isCorrect = answer === currentQ.card.romaji;
    const earned = isCorrect ? XP_TABLE.quizCorrect : 0;

    setTimeout(() => {
      const newCorrect = isCorrect ? correct + 1 : correct;
      const newXP = xpEarned + earned;

      if (qIndex + 1 >= TOTAL_QUESTIONS) {
        const bonusXP = XP_TABLE.dailyChallenge;
        const perfect = newCorrect === TOTAL_QUESTIONS ? XP_TABLE.perfectQuiz : 0;
        const total = newXP + bonusXP + perfect;
        recordDailyChallenge(total);
        setXpEarned(total);
        setCorrect(newCorrect);
        setFinished(true);
      } else {
        setCorrect(newCorrect);
        setXpEarned(newXP);
        setQIndex(q => q + 1);
        setSelected(null);
        setTimeLeft(TIME_PER_QUESTION);
      }
    }, 700);
  };

  if (alreadyDone && !finished) {
    return (
      <LinearGradient colors={[colors.background, colors.gradientBg]} style={styles.flex}>
        <SafeAreaView style={styles.center}>
          <Text style={styles.bigEmoji}>✅</Text>
          <Text style={styles.doneTitle}>Challenge Complete!</Text>
          <Text style={styles.doneSubtitle}>You've already done today's challenge. Come back tomorrow!</Text>
          <TouchableOpacity style={styles.backBtn} onPress={() => nav.goBack()}>
            <Text style={styles.backBtnText}>Back to Home</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (finished) {
    return (
      <LinearGradient colors={[colors.resultsGradient, colors.background]} style={styles.flex}>
        <SafeAreaView style={styles.center}>
          <Text style={styles.bigEmoji}>{correct >= 9 ? '🌟' : correct >= 7 ? '⭐' : '✅'}</Text>
          <Text style={styles.doneTitle}>{correct >= 9 ? 'Incredible!' : correct >= 7 ? 'Great job!' : 'Well done!'}</Text>
          <Text style={styles.doneSubtitle}>{correct}/{TOTAL_QUESTIONS} correct</Text>
          <View style={styles.resultCard}>
            <Text style={styles.resultXP}>⭐ +{xpEarned} XP earned!</Text>
            {correct === TOTAL_QUESTIONS && <Text style={styles.perfectNote}>Perfect score bonus included!</Text>}
          </View>
          <TouchableOpacity style={styles.continueBtn} onPress={() => nav.navigate('MainTabs' as any)}>
            <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.continueBtnGrad}>
              <Text style={styles.continueBtnText}>Back to Home</Text>
            </LinearGradient>
          </TouchableOpacity>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (!started) {
    return (
      <LinearGradient colors={[colors.background, colors.gradientBg]} style={styles.flex}>
        <SafeAreaView style={styles.center}>
          <Text style={styles.bigEmoji}>⚡</Text>
          <Text style={styles.doneTitle}>Daily Challenge</Text>
          <Text style={styles.doneSubtitle}>10 questions • 15 seconds each • 150 XP</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoRow}>🌸 Mixed Hiragana & Katakana</Text>
            <Text style={styles.infoRow}>⏱️ {TIME_PER_QUESTION}s per question</Text>
            <Text style={styles.infoRow}>⭐ {XP_TABLE.dailyChallenge} base XP + accuracy bonus</Text>
          </View>
          <TouchableOpacity style={styles.startBtn} onPress={() => setStarted(true)} activeOpacity={0.8}>
            <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.startBtnGrad}>
              <Text style={styles.startBtnText}>Start Challenge</Text>
            </LinearGradient>
          </TouchableOpacity>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={[colors.background, colors.gradientBg]} style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <View style={styles.header}>
          <Text style={styles.qCounter}>{qIndex + 1} / {TOTAL_QUESTIONS}</Text>
          <View style={styles.timerTrack}>
            <Animated.View
              style={[
                styles.timerFill,
                {
                  width: timerAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
                  backgroundColor: timeLeft <= 5 ? colors.error : colors.primary,
                },
              ]}
            />
          </View>
          <Text style={[styles.timerText, timeLeft <= 5 && { color: colors.error }]}>{timeLeft}s</Text>
        </View>

        <View style={styles.kanaArea}>
          <View style={styles.kanaBox}>
            <Text style={styles.kana}>{currentQ.card.kana}</Text>
            <Text style={styles.kanaType}>
              {currentQ.card.region === 'hiragana' ? 'Hiragana' : 'Katakana'}
            </Text>
          </View>
        </View>

        <View style={styles.optionsArea}>
          {currentQ.options.map((opt) => {
            let bg = colors.surfaceAlt;
            if (selected === opt) {
              bg = opt === currentQ.card.romaji ? colors.success : colors.error;
            } else if (selected && opt === currentQ.card.romaji) {
              bg = colors.success + '88';
            }
            return (
              <TouchableOpacity
                key={opt}
                style={[styles.option, { backgroundColor: bg }]}
                onPress={() => !selected && handleAnswer(opt)}
                activeOpacity={0.8}
              >
                <Text style={styles.optionText}>{opt}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.footer}>
          <Text style={styles.scoreText}>✅ {correct} correct</Text>
          <Text style={styles.xpText}>⭐ {xpEarned} XP</Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
