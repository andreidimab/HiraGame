import React, { useState, useRef, useCallback, useMemo } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '../store/gameStore';
import { getLessonById, getCardById } from '../data/lessons';
import { Fonts, Spacing, BorderRadius, ColorTheme } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import { RootStackParamList } from '../navigation';
import { XP_TABLE } from '../systems/xp';
import { shuffleArray } from '../utils/array';

type RouteType = RouteProp<RootStackParamList, 'Lesson'>;
type Nav = StackNavigationProp<RootStackParamList>;

// ---- Flashcard sub-component ----
function FlashCard({
  kana, romaji, mnemonic, onRate, colors,
}: {
  kana: string;
  romaji: string;
  mnemonic?: string;
  onRate: (rating: 1 | 2 | 3) => void;
  colors: ColorTheme;
}) {
  const [flipped, setFlipped] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;

  const fc = useMemo(() => StyleSheet.create({
    container: { alignItems: 'center', gap: Spacing.lg },
    cardWrapper: { width: 280, height: 200 },
    card: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      borderRadius: BorderRadius.xl,
      alignItems: 'center',
      justifyContent: 'center',
      backfaceVisibility: 'hidden',
      padding: Spacing.lg,
      gap: Spacing.sm,
    },
    front: { backgroundColor: colors.card, borderWidth: 1.5, borderColor: colors.primary },
    back: { backgroundColor: colors.surfaceAlt, borderWidth: 1.5, borderColor: colors.secondary },
    kana: { fontSize: Fonts.sizes.kana, color: colors.text },
    tap: { color: colors.textMuted, fontSize: Fonts.sizes.sm },
    romajiText: { fontSize: Fonts.sizes.xxl, color: colors.secondary, fontWeight: '800' },
    mnemonic: { color: colors.textSecondary, fontSize: Fonts.sizes.sm, textAlign: 'center' },
    rateRow: { flexDirection: 'row', gap: Spacing.sm },
    rateBtn: {
      flex: 1,
      borderRadius: BorderRadius.md,
      paddingVertical: Spacing.sm,
      alignItems: 'center',
      maxWidth: 100,
    },
    hard: { backgroundColor: colors.error + 'CC' },
    good: { backgroundColor: colors.primary },
    easy: { backgroundColor: colors.success + 'CC' },
    rateBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: Fonts.sizes.md },
    rateSubText: { color: 'rgba(255,255,255,0.6)', fontSize: Fonts.sizes.xs },
  }), [colors]);

  const flip = () => {
    if (flipped) return;
    Animated.spring(flipAnim, { toValue: 1, useNativeDriver: true }).start();
    setFlipped(true);
  };

  const frontRotate = flipAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const backRotate = flipAnim.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] });

  return (
    <View style={fc.container}>
      <TouchableOpacity onPress={flip} activeOpacity={0.9} style={fc.cardWrapper}>
        <Animated.View style={[fc.card, fc.front, { transform: [{ rotateY: frontRotate }] }]}>
          <Text style={fc.kana}>{kana}</Text>
          <Text style={fc.tap}>Tap to reveal</Text>
        </Animated.View>
        <Animated.View style={[fc.card, fc.back, { transform: [{ rotateY: backRotate }] }]}>
          <Text style={fc.romajiText}>{romaji}</Text>
          {mnemonic && <Text style={fc.mnemonic}>{mnemonic}</Text>}
        </Animated.View>
      </TouchableOpacity>

      {flipped && (
        <View style={fc.rateRow}>
          <TouchableOpacity style={[fc.rateBtn, fc.hard]} onPress={() => onRate(1)}>
            <Text style={fc.rateBtnText}>Hard</Text>
            <Text style={fc.rateSubText}>+1d</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[fc.rateBtn, fc.good]} onPress={() => onRate(2)}>
            <Text style={fc.rateBtnText}>Good</Text>
            <Text style={fc.rateSubText}>+3d</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[fc.rateBtn, fc.easy]} onPress={() => onRate(3)}>
            <Text style={fc.rateBtnText}>Easy</Text>
            <Text style={fc.rateSubText}>+7d</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// ---- Quiz sub-component ----
function QuizQuestion({
  kana, correctRomaji, allRomaji, onAnswer, colors,
}: {
  kana: string;
  correctRomaji: string;
  allRomaji: string[];
  onAnswer: (correct: boolean) => void;
  colors: ColorTheme;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const options = useRef(
    shuffleArray([correctRomaji, ...allRomaji.filter(r => r !== correctRomaji).slice(0, 3)])
  ).current;

  const qz = useMemo(() => StyleSheet.create({
    container: { alignItems: 'center', gap: Spacing.lg, width: '100%' },
    prompt: { color: colors.textSecondary, fontSize: Fonts.sizes.md },
    kanaBox: {
      width: 180,
      height: 180,
      borderRadius: BorderRadius.xl,
      backgroundColor: colors.card,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1.5,
      borderColor: colors.primary,
    },
    kana: { fontSize: Fonts.sizes.kana, color: colors.text },
    options: { width: '100%', gap: Spacing.sm },
    option: {
      borderRadius: BorderRadius.md,
      padding: Spacing.md,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    optionText: { color: colors.text, fontSize: Fonts.sizes.lg, fontWeight: '600' },
  }), [colors]);

  const handlePress = (opt: string) => {
    if (selected) return;
    setSelected(opt);
    setTimeout(() => onAnswer(opt === correctRomaji), 700);
  };

  return (
    <View style={qz.container}>
      <Text style={qz.prompt}>What is this kana?</Text>
      <View style={qz.kanaBox}>
        <Text style={qz.kana}>{kana}</Text>
      </View>
      <View style={qz.options}>
        {options.map((opt) => {
          let bg = colors.surfaceAlt;
          if (selected === opt) {
            bg = opt === correctRomaji ? colors.success : colors.error;
          } else if (selected && opt === correctRomaji) {
            bg = colors.success + '88';
          }
          return (
            <TouchableOpacity
              key={opt}
              style={[qz.option, { backgroundColor: bg }]}
              onPress={() => handlePress(opt)}
              activeOpacity={0.8}
            >
              <Text style={qz.optionText}>{opt}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function makeStyles(colors: ColorTheme) {
  return StyleSheet.create({
    flex: { flex: 1 },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
    errorText: { color: colors.textSecondary },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: Spacing.md,
      gap: Spacing.sm,
    },
    backBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.surfaceAlt,
      alignItems: 'center',
      justifyContent: 'center',
    },
    backText: { color: colors.text, fontSize: Fonts.sizes.md },
    progressTrack: {
      flex: 1,
      height: 8,
      backgroundColor: colors.surfaceAlt,
      borderRadius: BorderRadius.full,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: colors.primary,
      borderRadius: BorderRadius.full,
    },
    progressLabel: { color: colors.textMuted, fontSize: Fonts.sizes.sm, width: 40, textAlign: 'right' },
    typeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.md,
      paddingBottom: Spacing.md,
    },
    lessonTitle: { color: colors.text, fontSize: Fonts.sizes.lg, fontWeight: '700' },
    typeBadge: {
      backgroundColor: colors.surfaceAlt,
      borderRadius: BorderRadius.full,
      paddingHorizontal: Spacing.sm,
      paddingVertical: 4,
    },
    typeText: { color: colors.textSecondary, fontSize: Fonts.sizes.xs },
    cardArea: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: Spacing.md,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: Spacing.md,
    },
    footerXP: { color: colors.secondary, fontWeight: '700' },
    footerAcc: { color: colors.textSecondary, fontSize: Fonts.sizes.sm },
  });
}

// ---- Main Lesson Screen ----
export default function LessonScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const nav = useNavigation<Nav>();
  const route = useRoute<RouteType>();
  const { lessonId } = route.params;
  const lesson = getLessonById(lessonId);

  const { completeLesson, recordSRS, addXP } = useGameStore();

  const [cardIndex, setCardIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);

  const cards = lesson?.cardIds.map(id => getCardById(id)).filter(Boolean) ?? [];
  const allRomaji = cards.map(c => c!.romaji);

  const progressAnim = useRef(new Animated.Value(0)).current;

  const advance = useCallback(
    (wasCorrect: boolean, earned: number) => {
      const newTotal = total + 1;
      const newCorrect = wasCorrect ? correct + 1 : correct;
      const newXP = xpEarned + earned;

      Animated.timing(progressAnim, {
        toValue: (cardIndex + 1) / cards.length,
        duration: 300,
        useNativeDriver: false,
      }).start();

      if (cardIndex + 1 >= cards.length) {
        const accuracy = newTotal > 0 ? newCorrect / newTotal : 1;
        const perfBonus = accuracy === 1 ? XP_TABLE.perfectQuiz : 0;
        const finalXP = newXP + (lesson?.xpReward ?? 0) + perfBonus;

        completeLesson(lessonId, finalXP);
        const prevLevel = useGameStore.getState().level;
        nav.replace('Results', {
          xpEarned: finalXP,
          accuracy,
          lessonTitle: lesson?.title ?? 'Lesson',
          newLevel: useGameStore.getState().level > prevLevel ? useGameStore.getState().level : undefined,
        });
      } else {
        setCardIndex(cardIndex + 1);
        setTotal(newTotal);
        setCorrect(newCorrect);
        setXpEarned(newXP);
      }
    },
    [cardIndex, cards.length, correct, total, xpEarned, lesson, lessonId, nav]
  );

  if (!lesson || cards.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Lesson not found.</Text>
      </View>
    );
  }

  const card = cards[cardIndex]!;

  return (
    <LinearGradient colors={[colors.background, colors.gradientBg]} style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => nav.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>✕</Text>
          </TouchableOpacity>
          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
          <Text style={styles.progressLabel}>{cardIndex + 1}/{cards.length}</Text>
        </View>

        <View style={styles.typeRow}>
          <Text style={styles.lessonTitle}>{lesson.title}</Text>
          <View style={styles.typeBadge}>
            <Text style={styles.typeText}>
              {lesson.type === 'flashcard' ? '📖 Flashcard' : '✏️ Quiz'}
            </Text>
          </View>
        </View>

        <View style={styles.cardArea}>
          {lesson.type === 'flashcard' ? (
            <FlashCard
              key={card.id}
              kana={card.kana}
              romaji={card.romaji}
              mnemonic={card.mnemonic}
              colors={colors}
              onRate={(rating) => {
                recordSRS(card.id, rating);
                const earned = rating >= 2 ? XP_TABLE.flashcardCorrect : 0;
                addXP(earned);
                advance(rating >= 2, earned);
              }}
            />
          ) : (
            <QuizQuestion
              key={card.id}
              kana={card.kana}
              correctRomaji={card.romaji}
              allRomaji={allRomaji}
              colors={colors}
              onAnswer={(wasCorrect) => {
                const earned = wasCorrect ? XP_TABLE.quizCorrect : 0;
                if (earned > 0) addXP(earned);
                advance(wasCorrect, earned);
              }}
            />
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerXP}>⭐ {xpEarned} XP earned</Text>
          <Text style={styles.footerAcc}>
            {total > 0 ? `${Math.round((correct / total) * 100)}% accuracy` : ''}
          </Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
