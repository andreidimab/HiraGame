// Simplified SM-2 Spaced Repetition System
// Rating: 1=Hard, 2=Good, 3=Easy

export type SRSRating = 1 | 2 | 3;

export interface SRSCard {
  cardId: string;
  interval: number;     // days until next review
  ease: number;         // ease factor (starts at 2.5)
  dueDate: number;      // timestamp (ms) when next due
  reviewCount: number;
  correctCount: number;
}

const INITIAL_EASE = 2.5;
const MIN_EASE = 1.3;
const INTERVAL_BY_RATING: Record<SRSRating, number> = {
  1: 1,   // Hard: 1 day
  2: 3,   // Good: 3 days
  3: 7,   // Easy: 7 days (then multiplied by ease on subsequent reviews)
};

export function createSRSCard(cardId: string): SRSCard {
  return {
    cardId,
    interval: 0,
    ease: INITIAL_EASE,
    dueDate: Date.now(),
    reviewCount: 0,
    correctCount: 0,
  };
}

export function updateSRSCard(card: SRSCard, rating: SRSRating): SRSCard {
  const isCorrect = rating >= 2;
  let newInterval: number;
  let newEase = card.ease;

  if (card.reviewCount === 0) {
    newInterval = INTERVAL_BY_RATING[rating];
  } else {
    if (rating === 1) {
      // Hard — reset to 1 day, reduce ease
      newInterval = 1;
      newEase = Math.max(MIN_EASE, card.ease - 0.2);
    } else if (rating === 2) {
      // Good — standard interval progression
      newInterval = Math.round(card.interval * card.ease);
      newEase = card.ease;
    } else {
      // Easy — longer interval, slight ease boost
      newInterval = Math.round(card.interval * card.ease * 1.3);
      newEase = Math.min(3.0, card.ease + 0.15);
    }
    newInterval = Math.max(1, newInterval);
  }

  const dueDate = Date.now() + newInterval * 24 * 60 * 60 * 1000;

  return {
    ...card,
    interval: newInterval,
    ease: newEase,
    dueDate,
    reviewCount: card.reviewCount + 1,
    correctCount: isCorrect ? card.correctCount + 1 : card.correctCount,
  };
}

export function isDue(card: SRSCard): boolean {
  return Date.now() >= card.dueDate;
}

export function getDueCards(cards: SRSCard[]): SRSCard[] {
  return cards.filter(isDue).sort((a, b) => a.dueDate - b.dueDate);
}

export function getAccuracy(card: SRSCard): number {
  if (card.reviewCount === 0) return 0;
  return card.correctCount / card.reviewCount;
}
