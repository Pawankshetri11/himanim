import React, { createContext, useContext, useReducer, useEffect } from 'react';

interface GameTask {
  id: string;
  type: 'quiz' | 'puzzle' | 'memory' | 'math' | 'word';
  title: string;
  description: string;
  data: any; // Flexible data structure for different game types
  page: number;
}

interface GameAnswer {
  taskId: string;
  answer: any; // Flexible answer structure
  page: number;
  completedAt: number;
}

interface GameState {
  currentPage: number;
  currentTaskIndex: number;
  answers: GameAnswer[];
  score: string | null;
  isCompleted: boolean;
  isTaskCompleted: boolean;
  isTransitioning: boolean;
  sessionId: string;
  hasAdblock: boolean;
  startTime: number;
}

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  tasks: GameTask[];
  generateScore: () => string;
  getCurrentPageTasks: () => GameTask[];
  getCurrentTask: () => GameTask | null;
}

type GameAction =
  | { type: 'START_GAME' }
  | { type: 'NEXT_TASK' }
  | { type: 'NEXT_PAGE' }
  | { type: 'SUBMIT_ANSWER'; payload: GameAnswer }
  | { type: 'COMPLETE_TASK' }
  | { type: 'START_TRANSITION' }
  | { type: 'END_TRANSITION' }
  | { type: 'COMPLETE_GAME'; payload: string }
  | { type: 'RESET_GAME' }
  | { type: 'SET_ADBLOCK'; payload: boolean }
  | { type: 'LOAD_STATE'; payload: GameState };

const initialState: GameState = {
  currentPage: 0,
  currentTaskIndex: 0,
  answers: [],
  score: null,
  isCompleted: false,
  isTaskCompleted: false,
  isTransitioning: false,
  sessionId: '',
  hasAdblock: false,
  startTime: Date.now(),
};

// Mock game tasks - different types of games
const mockTasks: GameTask[] = [
  // Page 1 - Mix of different game types
  {
    id: '1-1',
    page: 1,
    type: 'quiz',
    title: 'Finance Knowledge',
    description: 'Test your understanding of compound interest',
    data: {
      question: 'What is compound interest?',
      options: [
        'Interest calculated only on the principal amount',
        'Interest calculated on principal and accumulated interest',
        'A type of bank account',
        'A loan payment method'
      ],
      correctAnswer: 1
    }
  },
  {
    id: '1-2',
    page: 1,
    type: 'puzzle',
    title: 'Budget Puzzle',
    description: 'Arrange the budget items in the correct order',
    data: {
      items: ['Emergency Fund', 'Basic Needs', 'Wants', 'Investments'],
      correctOrder: [1, 0, 2, 3], // Basic Needs, Emergency Fund, Wants, Investments
      instruction: 'Drag items to arrange them by financial priority'
    }
  },
  {
    id: '1-3',
    page: 1,
    type: 'math',
    title: 'Quick Math',
    description: 'Calculate the compound interest',
    data: {
      problem: 'If you invest $1000 at 5% annual interest compounded yearly, what will it be worth after 2 years?',
      options: ['$1100', '$1102.50', '$1105', '$1050'],
      correctAnswer: 1,
      formula: 'A = P(1 + r)^t'
    }
  },
  {
    id: '1-4',
    page: 1,
    type: 'memory',
    title: 'Financial Terms Memory',
    description: 'Match the financial terms with their definitions',
    data: {
      pairs: [
        { term: 'APR', definition: 'Annual Percentage Rate' },
        { term: '401k', definition: 'Retirement savings plan' },
        { term: 'ROI', definition: 'Return on Investment' },
        { term: 'ETF', definition: 'Exchange Traded Fund' }
      ]
    }
  },
  // Page 2
  {
    id: '2-1',
    page: 2,
    type: 'word',
    title: 'Financial Word Game',
    description: 'Find the financial term',
    data: {
      letters: ['D', 'I', 'V', 'E', 'R', 'S', 'I', 'F', 'Y'],
      target: 'DIVERSIFY',
      hint: 'Spreading investments to reduce risk'
    }
  },
  {
    id: '2-2',
    page: 2,
    type: 'quiz',
    title: 'Credit Knowledge',
    description: 'Understanding credit scores',
    data: {
      question: 'What is a good credit score range?',
      options: ['300-500', '500-650', '650-750', '750-850'],
      correctAnswer: 3
    }
  },
  {
    id: '2-3',
    page: 2,
    type: 'puzzle',
    title: 'Investment Portfolio',
    description: 'Build a balanced portfolio',
    data: {
      categories: ['Stocks', 'Bonds', 'Real Estate', 'Cash'],
      targetPercentages: [50, 30, 15, 5],
      instruction: 'Allocate percentages to create a balanced portfolio'
    }
  },
  {
    id: '2-4',
    page: 2,
    type: 'math',
    title: 'Savings Calculation',
    description: 'Calculate monthly savings needed',
    data: {
      problem: 'To save $10,000 in 2 years with 3% annual interest, how much should you save monthly?',
      options: ['$400', '$410', '$420', '$430'],
      correctAnswer: 1
    }
  },
  // Page 3
  {
    id: '3-1',
    page: 3,
    type: 'memory',
    title: 'Investment Types',
    description: 'Match investments with their characteristics',
    data: {
      pairs: [
        { term: 'Stocks', definition: 'High risk, high reward' },
        { term: 'Bonds', definition: 'Low risk, steady income' },
        { term: 'Mutual Funds', definition: 'Professionally managed' },
        { term: 'Index Funds', definition: 'Tracks market index' }
      ]
    }
  },
  {
    id: '3-2',
    page: 3,
    type: 'word',
    title: 'Budget Challenge',
    description: 'Spell the budgeting rule',
    data: {
      letters: ['5', '0', '3', '0', '2', '0'],
      target: '503020',
      hint: 'Popular budgeting rule percentages'
    }
  },
  {
    id: '3-3',
    page: 3,
    type: 'puzzle',
    title: 'Debt Payoff Strategy',
    description: 'Order debts by payoff strategy',
    data: {
      debts: [
        { name: 'Credit Card 1', balance: 2000, rate: 18, minimum: 50 },
        { name: 'Credit Card 2', balance: 1000, rate: 22, minimum: 30 },
        { name: 'Car Loan', balance: 8000, rate: 6, minimum: 200 },
        { name: 'Student Loan', balance: 15000, rate: 4, minimum: 150 }
      ],
      strategy: 'avalanche', // Pay highest interest first
      instruction: 'Order debts by avalanche method (highest interest rate first)'
    }
  },
  {
    id: '3-4',
    page: 3,
    type: 'quiz',
    title: 'Final Challenge',
    description: 'Test your overall knowledge',
    data: {
      question: 'What is the most important factor in building wealth?',
      options: ['High income', 'Time and compound interest', 'Taking big risks', 'Avoiding all debt'],
      correctAnswer: 1
    }
  }
];

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      const sessionId = Date.now().toString(36) + Math.random().toString(36).substr(2);
      return {
        ...initialState,
        currentPage: 1,
        currentTaskIndex: 0,
        sessionId,
        startTime: Date.now(),
      };
    
    case 'NEXT_TASK':
      return {
        ...state,
        currentTaskIndex: state.currentTaskIndex + 1,
        isTaskCompleted: false,
        isTransitioning: false,
      };
    
    case 'NEXT_PAGE':
      return {
        ...state,
        currentPage: state.currentPage + 1,
        currentTaskIndex: 0,
        isTaskCompleted: false,
        isTransitioning: false,
      };
    
    case 'SUBMIT_ANSWER':
      return {
        ...state,
        answers: [...state.answers, action.payload],
      };
    
    case 'COMPLETE_TASK':
      return {
        ...state,
        isTaskCompleted: true,
      };
    
    case 'START_TRANSITION':
      return {
        ...state,
        isTransitioning: true,
      };
    
    case 'END_TRANSITION':
      return {
        ...state,
        isTransitioning: false,
      };
    
    case 'COMPLETE_GAME':
      return {
        ...state,
        isCompleted: true,
        score: action.payload,
      };
    
    case 'RESET_GAME':
      return initialState;
    
    case 'SET_ADBLOCK':
      return {
        ...state,
        hasAdblock: action.payload,
      };
    
    case 'LOAD_STATE':
      return action.payload;
    
    default:
      return state;
  }
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        dispatch({ type: 'LOAD_STATE', payload: parsedState });
      } catch (error) {
        console.error('Failed to load game state:', error);
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('gameState', JSON.stringify(state));
  }, [state]);

  // Generate a unique 6-digit score
  const generateScore = (): string => {
    const scores = [
      '847293', '692847', '731856', '594827', '682739', '873492',
      '756284', '629847', '814736', '537289', '746821', '695873'
    ];
    return scores[Math.floor(Math.random() * scores.length)];
  };

  // Adblock detection
  useEffect(() => {
    const detectAdblock = () => {
      const adElement = document.createElement('div');
      adElement.innerHTML = '&nbsp;';
      adElement.className = 'adsbox';
      adElement.style.position = 'absolute';
      adElement.style.left = '-9999px';
      document.body.appendChild(adElement);
      
      setTimeout(() => {
        const isBlocked = adElement.offsetHeight === 0;
        dispatch({ type: 'SET_ADBLOCK', payload: isBlocked });
        document.body.removeChild(adElement);
      }, 100);
    };

    detectAdblock();
  }, []);

  // Get tasks for current page
  const getCurrentPageTasks = (): GameTask[] => {
    return mockTasks.filter(task => task.page === state.currentPage);
  };

  // Get current task
  const getCurrentTask = (): GameTask | null => {
    const pageTasks = getCurrentPageTasks();
    return pageTasks[state.currentTaskIndex] || null;
  };

  const value: GameContextType = {
    state,
    dispatch,
    tasks: mockTasks,
    generateScore,
    getCurrentPageTasks,
    getCurrentTask,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}