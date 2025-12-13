export interface Card {
  id: string;
  label: string;
  description?: string;
}

export interface Category {
  id: string;
  label: string;
  cards: string[];
}

export interface CardSortingSession {
  id: string;
  participantId: string;
  cards: Card[];
  categories: Category[];
  timestamp: number;
}

export interface CardSortingResults {
  totalParticipants: number;
  cardPlacements: Record<string, Record<string, number>>;
  agreementMatrix: number[][];
  suggestedCategories: Category[];
}

export const analyzeCardSorting = (sessions: CardSortingSession[]): CardSortingResults => {
  const cardPlacements: Record<string, Record<string, number>> = {};
  
  sessions.forEach(session => {
    session.categories.forEach(category => {
      category.cards.forEach(cardId => {
        if (!cardPlacements[cardId]) cardPlacements[cardId] = {};
        cardPlacements[cardId][category.id] = (cardPlacements[cardId][category.id] || 0) + 1;
      });
    });
  });

  const agreementMatrix = calculateAgreementMatrix(sessions);
  const suggestedCategories = generateSuggestedCategories(sessions);

  return {
    totalParticipants: sessions.length,
    cardPlacements,
    agreementMatrix,
    suggestedCategories
  };
};

const calculateAgreementMatrix = (sessions: CardSortingSession[]): number[][] => {
  const allCards = sessions[0]?.cards || [];
  const matrix: number[][] = Array(allCards.length).fill(0).map(() => Array(allCards.length).fill(0));

  sessions.forEach(session => {
    session.categories.forEach(category => {
      for (let i = 0; i < category.cards.length; i++) {
        for (let j = i + 1; j < category.cards.length; j++) {
          const idx1 = allCards.findIndex(c => c.id === category.cards[i]);
          const idx2 = allCards.findIndex(c => c.id === category.cards[j]);
          if (idx1 !== -1 && idx2 !== -1) {
            matrix[idx1][idx2]++;
            matrix[idx2][idx1]++;
          }
        }
      }
    });
  });

  return matrix;
};

const generateSuggestedCategories = (sessions: CardSortingSession[]): Category[] => {
  const categoryFrequency: Record<string, number> = {};
  
  sessions.forEach(session => {
    session.categories.forEach(category => {
      categoryFrequency[category.label] = (categoryFrequency[category.label] || 0) + 1;
    });
  });

  return Object.entries(categoryFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([label], idx) => ({
      id: `suggested-${idx}`,
      label,
      cards: []
    }));
};
