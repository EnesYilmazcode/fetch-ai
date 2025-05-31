'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock, Brain, Award, ChevronRight, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, ReferenceLine, ReferenceDot } from 'recharts';
import { getRandomQuizEvent, type QuizEvent } from '@/lib/quizData';

interface PredictionPoint {
  price: number;
  x: number;
  y: number;
}

export default function QuizPage() {
  const router = useRouter();
  const chartRef = useRef<any>(null);
  const [currentEvent, setCurrentEvent] = useState<QuizEvent | null>(null);
  const [userPrediction, setUserPrediction] = useState<PredictionPoint | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [partialData, setPartialData] = useState<any[]>([]);
  const [fullData, setFullData] = useState<any[]>([]);

  useEffect(() => {
    loadNewEvent();
  }, []);

  const loadNewEvent = () => {
    setIsLoading(true);
    setTimeout(() => {
      const event = getRandomQuizEvent();
      setCurrentEvent(event);
      
      // Show only 80% of the data initially
      const splitIndex = Math.floor(event.preEventData.length * 0.8);
      const partial = event.preEventData.slice(0, splitIndex);
      const full = [...event.preEventData];
      
      // Add the actual outcome point to full data
      const lastDate = new Date(event.preEventData[event.preEventData.length - 1].date);
      const outcomeDate = new Date(lastDate.getTime() + 24 * 60 * 60 * 1000); // Next day
      const lastPrice = event.preEventData[event.preEventData.length - 1].price;
      const outcomePrice = lastPrice * (1 + event.actualOutcome.percentChange / 100);
      
      full.push({
        date: outcomeDate.toISOString().split('T')[0],
        price: outcomePrice,
        volume: event.preEventData[event.preEventData.length - 1].volume,
        isOutcome: true
      });
      
      setPartialData(partial);
      setFullData(full);
      setUserPrediction(null);
      setShowResult(false);
      setIsLoading(false);
    }, 500);
  };

  const handleChartClick = (event: any) => {
    if (showResult || !currentEvent) return;
    
    const chartContainer = event.currentTarget;
    const rect = chartContainer.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    
    // Calculate the price based on Y position
    const chartHeight = rect.height - 60; // Account for margins
    const chartTop = 30; // Top margin
    
    // Get price range from partial data
    const prices = partialData.map(d => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;
    const padding = priceRange * 0.1; // 10% padding
    
    const adjustedMinPrice = minPrice - padding;
    const adjustedMaxPrice = maxPrice + padding;
    const adjustedRange = adjustedMaxPrice - adjustedMinPrice;
    
    // Convert click Y to price (inverted because Y=0 is at top)
    const relativeY = (clickY - chartTop) / chartHeight;
    const predictedPrice = adjustedMaxPrice - (relativeY * adjustedRange);
    
    setUserPrediction({
      price: Math.max(0, predictedPrice),
      x: clickX,
      y: clickY
    });
  };

  const submitPrediction = () => {
    if (!userPrediction || !currentEvent) return;
    
    setShowResult(true);
    setQuestionsAnswered(prev => prev + 1);
    
    // Calculate accuracy score
    const lastPrice = currentEvent.preEventData[currentEvent.preEventData.length - 1].price;
    const actualOutcomePrice = lastPrice * (1 + currentEvent.actualOutcome.percentChange / 100);
    const priceDifference = Math.abs(userPrediction.price - actualOutcomePrice);
    const percentageError = (priceDifference / actualOutcomePrice) * 100;
    
    // Award points based on accuracy (within 5% = full points, within 10% = half points)
    if (percentageError <= 5) {
      setScore(prev => prev + 10);
    } else if (percentageError <= 10) {
      setScore(prev => prev + 5);
    } else if (percentageError <= 20) {
      setScore(prev => prev + 2);
    }
  };

  const nextQuestion = () => {
    loadNewEvent();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'earnings': return '📊';
      case 'announcement': return '📢';
      case 'market_news': return '📰';
      case 'regulation': return '⚖️';
      case 'economic': return '🏛️';
      default: return '📈';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price);
  };

  const calculateAccuracy = () => {
    if (!userPrediction || !currentEvent) return 0;
    
    const lastPrice = currentEvent.preEventData[currentEvent.preEventData.length - 1].price;
    const actualOutcomePrice = lastPrice * (1 + currentEvent.actualOutcome.percentChange / 100);
    const priceDifference = Math.abs(userPrediction.price - actualOutcomePrice);
    const percentageError = (priceDifference / actualOutcomePrice) * 100;
    
    return Math.max(0, 100 - percentageError);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFFDF8] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#DA9B3C] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz question...</p>
        </div>
      </div>
    );
  }

  if (!currentEvent) {
    return (
      <div className="min-h-screen bg-[#FFFDF8] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error loading quiz data. Please try again.</p>
          <Button onClick={() => router.push('/')} className="mt-4">
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  const chartData = showResult ? fullData : partialData;

  return (
    <div className="min-h-screen bg-[#FFFDF8]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push('/')}
              className="flex items-center gap-2 hover:bg-[#fdf5e6] hover:text-[#DA9B3C]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-2xl font-bold text-[#DA9B3C] flex items-center gap-2">
              <Brain className="h-6 w-6" />
              Financial Quiz
            </h1>
          </div>
          
          {/* Score Display */}
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="text-gray-600">Points: </span>
              <span className="font-bold text-[#DA9B3C]">{score}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">Questions: </span>
              <span className="font-bold text-green-600">{questionsAnswered}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Event Information */}
        <Card className="mb-6 bg-white border border-gray-200">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{getEventTypeIcon(currentEvent.eventType)}</span>
                  <div>
                    <Badge className={getDifficultyColor(currentEvent.difficulty)}>
                      {currentEvent.difficulty.toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className="ml-2">
                      {currentEvent.symbol}
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-xl text-[#333] mb-2">
                  {currentEvent.title}
                </CardTitle>
                <p className="text-gray-600 leading-relaxed">
                  {currentEvent.description}
                </p>
              </div>
              <div className="text-right text-sm text-gray-500 ml-4">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {new Date(currentEvent.date).toLocaleDateString()}
                </div>
                <div className="mt-1 font-medium">
                  {currentEvent.companyName}
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Interactive Chart Section */}
        <Card className="mb-6 bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5" />
              Interactive Price Prediction ({currentEvent.symbol})
            </CardTitle>
            <p className="text-sm text-gray-600">
              {!showResult ? 
                `📍 Click on the chart to predict where the stock price will go after this event!` :
                `✨ Here's what actually happened vs. your prediction`
              }
            </p>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div 
                className="h-96 cursor-crosshair" 
                onClick={handleChartClick}
                ref={chartRef}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#DA9B3C" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#DA9B3C" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorOutcome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `$${value.toFixed(0)}`}
                      domain={['dataMin - 5', 'dataMax + 5']}
                    />
                    <Tooltip 
                      formatter={(value: number, name: string) => [formatPrice(value), name === 'price' ? 'Price' : 'Price']}
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke="#DA9B3C"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorPrice)"
                    />
                    
                    {/* Show prediction point */}
                    {userPrediction && !showResult && (
                      <ReferenceDot 
                        x={partialData[partialData.length - 1]?.date} 
                        y={userPrediction.price} 
                        r={6} 
                        fill="#EF4444" 
                        stroke="#DC2626"
                        strokeWidth={2}
                      />
                    )}
                    
                    {/* Show prediction line */}
                    {userPrediction && (
                      <ReferenceLine 
                        y={userPrediction.price} 
                        stroke="#EF4444" 
                        strokeDasharray="5 5"
                        strokeWidth={2}
                      />
                    )}
                    
                    {/* Show actual outcome */}
                    {showResult && (
                      <ReferenceDot 
                        x={fullData[fullData.length - 1]?.date} 
                        y={fullData[fullData.length - 1]?.price} 
                        r={8} 
                        fill="#10B981" 
                        stroke="#059669"
                        strokeWidth={3}
                      />
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              {/* Prediction Info Overlay */}
              {userPrediction && !showResult && (
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border">
                  <div className="text-sm">
                    <div className="font-semibold text-red-600">Your Prediction</div>
                    <div className="text-gray-700">{formatPrice(userPrediction.price)}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {!showResult ? (
              <div className="mt-4 text-center">
                {userPrediction ? (
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600">
                      You predicted: <span className="font-bold text-red-600">{formatPrice(userPrediction.price)}</span>
                    </div>
                    <Button 
                      onClick={submitPrediction}
                      className="bg-[#DA9B3C] hover:bg-[#c8892d] text-white px-8"
                      size="lg"
                    >
                      Submit Prediction & See Result
                    </Button>
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm">
                    👆 Click anywhere on the chart to make your price prediction
                  </div>
                )}
              </div>
            ) : (
              /* Result Section */
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-red-50 border-red-200">
                    <CardContent className="p-4 text-center">
                      <div className="text-sm text-red-600 font-medium">Your Prediction</div>
                      <div className="text-xl font-bold text-red-700">{formatPrice(userPrediction?.price || 0)}</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4 text-center">
                      <div className="text-sm text-green-600 font-medium">Actual Result</div>
                      <div className="text-xl font-bold text-green-700">
                        {formatPrice(fullData[fullData.length - 1]?.price || 0)}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4 text-center">
                      <div className="text-sm text-blue-600 font-medium">Accuracy</div>
                      <div className="text-xl font-bold text-blue-700">
                        {calculateAccuracy().toFixed(1)}%
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">📚 What Happened & Why:</h4>
                  <p className="text-blue-700 mb-3">{currentEvent.actualOutcome.explanation}</p>
                  <h5 className="font-semibold text-blue-800 mb-1">💡 Key Learning:</h5>
                  <p className="text-blue-700">{currentEvent.actualOutcome.learningPoint}</p>
                </div>

                <Button 
                  onClick={nextQuestion}
                  className="w-full bg-[#DA9B3C] hover:bg-[#c8892d] text-white"
                  size="lg"
                >
                  Next Question
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 