export const GAME_CONFIGS = [
  {
    title: 'Quick Challenge',
    description: 'Answer as many mixed questions as you can in 60 seconds.',
    route: {
      pathname: '/practice/session' as const,
      params: {
        operation: 'mixed',
        difficulty: '2',
        questionCount: '50',
        adaptive: 'true',
        timeLimitSeconds: '60',
        mode: 'game',
      },
    },
  },
  {
    title: 'Streak Challenge',
    description: 'See how long you can keep a correct-answer streak going.',
    route: {
      pathname: '/practice/session' as const,
      params: {
        operation: 'mixed',
        difficulty: '2',
        questionCount: '20',
        adaptive: 'true',
        mode: 'game',
      },
    },
  },
  {
    title: 'Multiplication Challenge',
    description: 'Focus completely on multiplication facts from 1 through 12.',
    route: {
      pathname: '/practice/session' as const,
      params: {
        operation: 'multiplication',
        difficulty: '3',
        questionCount: '20',
        adaptive: 'true',
        tables: '1,2,3,4,5,6,7,8,9,10,11,12',
        mode: 'game',
      },
    },
  },
  {
    title: 'Weak Facts Challenge',
    description: 'Review the multiplication facts that need the most practice.',
    route: {
      pathname: '/practice/session' as const,
      params: {
        operation: 'multiplication',
        difficulty: '2',
        questionCount: '15',
        adaptive: 'true',
        mode: 'game',
      },
    },
  },
];
