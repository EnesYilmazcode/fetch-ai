export interface QuizEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  symbol: string;
  companyName: string;
  eventType: 'earnings' | 'announcement' | 'market_news' | 'regulation' | 'economic';
  difficulty: 'easy' | 'medium' | 'hard';
  
  // Chart data leading up to the event
  preEventData: ChartDataPoint[];
  
  // The actual outcome
  actualOutcome: {
    direction: 'up' | 'down' | 'neutral';
    percentChange: number;
    explanation: string;
    learningPoint: string;
  };
  
  // Multiple choice options for direction
  options: {
    up: string;
    down: string;
    neutral: string;
  };
}

export interface ChartDataPoint {
  date: string;
  price: number;
  volume: number;
  isOutcome?: boolean; // Optional flag to mark outcome points
}

export const quizEvents: QuizEvent[] = [
  {
    id: 'tsla_earnings_miss_2022',
    title: 'Tesla Misses Q3 2022 Delivery Expectations',
    description: 'Tesla delivered 343,830 vehicles in Q3 2022, falling short of analyst expectations of 358,000 deliveries. This was the second consecutive quarter of missing delivery targets.',
    date: '2022-10-02',
    symbol: 'TSLA',
    companyName: 'Tesla Inc.',
    eventType: 'earnings',
    difficulty: 'medium',
    
    preEventData: [
      { date: '2022-09-15', price: 303.35, volume: 45000000 },
      { date: '2022-09-16', price: 299.68, volume: 78000000 },
      { date: '2022-09-20', price: 309.16, volume: 72000000 },
      { date: '2022-09-21', price: 313.83, volume: 68000000 },
      { date: '2022-09-22', price: 297.89, volume: 81000000 },
      { date: '2022-09-26', price: 265.25, volume: 125000000 },
      { date: '2022-09-27', price: 273.58, volume: 95000000 },
      { date: '2022-09-28', price: 287.30, volume: 87000000 },
      { date: '2022-09-29', price: 285.87, volume: 72000000 },
      { date: '2022-09-30', price: 264.86, volume: 85000000 }
    ],
    
    actualOutcome: {
      direction: 'down',
      percentChange: -8.6,
      explanation: 'Tesla stock fell 8.6% in the following week as investors were disappointed by the delivery miss and concerns about demand in China.',
      learningPoint: 'Missing delivery expectations often leads to immediate sell-offs in growth stocks, especially when it happens consecutively.'
    },
    
    options: {
      up: 'Stock will rise - delivery numbers still show growth',
      down: 'Stock will fall - missing expectations signals problems',
      neutral: 'Stock will stay flat - already priced in'
    }
  },
  
  {
    id: 'aapl_iphone_14_launch',
    title: 'Apple Announces iPhone 14 with Satellite Features',
    description: 'Apple unveiled the iPhone 14 series with emergency satellite connectivity, improved cameras, and the new Dynamic Island feature. Pre-orders exceeded expectations.',
    date: '2022-09-07',
    symbol: 'AAPL',
    companyName: 'Apple Inc.',
    eventType: 'announcement',
    difficulty: 'easy',
    
    preEventData: [
      { date: '2022-08-24', price: 167.53, volume: 54000000 },
      { date: '2022-08-25', price: 170.03, volume: 51000000 },
      { date: '2022-08-26', price: 165.42, volume: 90000000 },
      { date: '2022-08-29', price: 161.38, volume: 73000000 },
      { date: '2022-08-30', price: 158.91, volume: 77000000 },
      { date: '2022-08-31', price: 157.96, volume: 87000000 },
      { date: '2022-09-01', price: 157.96, volume: 69000000 },
      { date: '2022-09-02', price: 155.81, volume: 76000000 },
      { date: '2022-09-06', price: 154.53, volume: 73000000 }
    ],
    
    actualOutcome: {
      direction: 'up',
      percentChange: 6.3,
      explanation: 'Apple stock rose 6.3% over the next week as the satellite feature was seen as innovative and early pre-order data showed strong demand.',
      learningPoint: 'Successful product launches with innovative features typically drive short-term gains for established tech companies.'
    },
    
    options: {
      up: 'Stock will rise - innovative features drive demand',
      down: 'Stock will fall - high price points may hurt sales',
      neutral: 'Stock will stay flat - incremental improvements only'
    }
  },
  
  {
    id: 'nflx_password_sharing_crackdown',
    title: 'Netflix Announces Password Sharing Crackdown',
    description: 'Netflix revealed plans to charge additional fees for password sharing and reported slower subscriber growth. The company estimated 100M+ households share passwords.',
    date: '2023-01-19',
    symbol: 'NFLX',
    companyName: 'Netflix Inc.',
    eventType: 'announcement',
    difficulty: 'hard',
    
    preEventData: [
      { date: '2023-01-05', price: 337.77, volume: 12000000 },
      { date: '2023-01-06', price: 339.19, volume: 15000000 },
      { date: '2023-01-09', price: 332.22, volume: 18000000 },
      { date: '2023-01-10', price: 330.58, volume: 16000000 },
      { date: '2023-01-11', price: 335.17, volume: 14000000 },
      { date: '2023-01-12', price: 349.78, volume: 19000000 },
      { date: '2023-01-13', price: 345.89, volume: 17000000 },
      { date: '2023-01-17', price: 348.61, volume: 21000000 },
      { date: '2023-01-18', price: 350.45, volume: 16000000 }
    ],
    
    actualOutcome: {
      direction: 'up',
      percentChange: 4.2,
      explanation: 'Netflix stock initially rose 4.2% as investors saw password sharing fees as a new revenue stream, despite concerns about user churn.',
      learningPoint: 'Market often views new revenue opportunities positively, even if they might affect user experience short-term.'
    },
    
    options: {
      up: 'Stock will rise - new revenue from password fees',
      down: 'Stock will fall - users will cancel subscriptions',
      neutral: 'Stock will stay flat - mixed impact on revenue'
    }
  },
  
  {
    id: 'fed_rate_hike_march_2023',
    title: 'Federal Reserve Raises Interest Rates by 0.25%',
    description: 'The Fed raised interest rates to 4.75-5.00%, citing persistent inflation concerns. This was the 9th consecutive rate hike since March 2022.',
    date: '2023-03-22',
    symbol: 'SPY',
    companyName: 'S&P 500 ETF',
    eventType: 'economic',
    difficulty: 'medium',
    
    preEventData: [
      { date: '2023-03-08', price: 394.21, volume: 85000000 },
      { date: '2023-03-09', price: 387.83, volume: 112000000 },
      { date: '2023-03-10', price: 384.52, volume: 155000000 },
      { date: '2023-03-13', price: 382.40, volume: 145000000 },
      { date: '2023-03-14', price: 395.16, volume: 98000000 },
      { date: '2023-03-15', price: 396.44, volume: 87000000 },
      { date: '2023-03-16', price: 402.20, volume: 76000000 },
      { date: '2023-03-17', price: 404.19, volume: 89000000 },
      { date: '2023-03-20', price: 402.75, volume: 93000000 },
      { date: '2023-03-21', price: 403.28, volume: 72000000 }
    ],
    
    actualOutcome: {
      direction: 'down',
      percentChange: -2.4,
      explanation: 'The S&P 500 fell 2.4% as higher rates increase borrowing costs and make bonds more attractive relative to stocks.',
      learningPoint: 'Rising interest rates typically pressure stock valuations, especially growth stocks, as they increase the discount rate for future cash flows.'
    },
    
    options: {
      up: 'Market will rise - rate hikes show economic strength',
      down: 'Market will fall - higher rates hurt valuations',
      neutral: 'Market will stay flat - rate hike was expected'
    }
  },
  
  {
    id: 'msft_ai_investment_2023',
    title: 'Microsoft Announces $10B Investment in OpenAI',
    description: 'Microsoft announced a multi-year, multi-billion dollar investment in OpenAI, extending their partnership and integrating GPT into Microsoft products.',
    date: '2023-01-23',
    symbol: 'MSFT',
    companyName: 'Microsoft Corporation',
    eventType: 'announcement',
    difficulty: 'easy',
    
    preEventData: [
      { date: '2023-01-09', price: 239.51, volume: 32000000 },
      { date: '2023-01-10', price: 240.73, volume: 28000000 },
      { date: '2023-01-11', price: 235.87, volume: 45000000 },
      { date: '2023-01-12', price: 238.19, volume: 37000000 },
      { date: '2023-01-13', price: 242.04, volume: 33000000 },
      { date: '2023-01-17', price: 240.35, volume: 41000000 },
      { date: '2023-01-18', price: 245.61, volume: 39000000 },
      { date: '2023-01-19', price: 244.12, volume: 35000000 },
      { date: '2023-01-20', price: 240.22, volume: 47000000 }
    ],
    
    actualOutcome: {
      direction: 'up',
      percentChange: 7.8,
      explanation: 'Microsoft stock surged 7.8% as investors saw the AI investment as positioning the company as a leader in the next wave of technology.',
      learningPoint: 'Strategic investments in emerging technologies often drive significant stock appreciation when markets believe in the potential.'
    },
    
    options: {
      up: 'Stock will rise - AI leadership and competitive advantage',
      down: 'Stock will fall - large investment with uncertain returns',
      neutral: 'Stock will stay flat - too early to value AI impact'
    }
  }
];

export function getRandomQuizEvent(): QuizEvent {
  return quizEvents[Math.floor(Math.random() * quizEvents.length)];
}

export function getQuizEventById(id: string): QuizEvent | undefined {
  return quizEvents.find(event => event.id === id);
}

export function getQuizEventsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): QuizEvent[] {
  return quizEvents.filter(event => event.difficulty === difficulty);
} 