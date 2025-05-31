const API_KEY = 'TA5XRJYDMT0IILJV';
const BASE_URL = 'https://www.alphavantage.co/query';

export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: string;
  peRatio?: string;
}

export interface ChartDataPoint {
  date: string;
  price: number;
  volume: number;
}

export interface StockOverview {
  symbol: string;
  name: string;
  description: string;
  sector: string;
  industry: string;
  marketCap: string;
  peRatio: string;
  dividendYield: string;
  eps: string;
  beta: string;
  fiftyTwoWeekHigh: string;
  fiftyTwoWeekLow: string;
}

export interface SearchResult {
  symbol: string;
  name: string;
  type: string;
  region: string;
  marketOpen: string;
  marketClose: string;
  timezone: string;
  currency: string;
  matchScore: string;
}

// Add delay between API calls to avoid rate limiting
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data for fallback when API fails
const getMockStockData = (symbol: string) => {
  const basePrice = symbol === 'AAPL' ? 185 : symbol === 'MSFT' ? 420 : symbol === 'GOOGL' ? 155 : 180;
  const change = (Math.random() - 0.5) * 10;
  const changePercent = (change / basePrice) * 100;
  
  return {
    quote: {
      symbol,
      price: basePrice + change,
      change,
      changePercent,
      volume: Math.floor(Math.random() * 50000000) + 10000000,
    },
    chartData: Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      const price = basePrice + (Math.random() - 0.5) * 20;
      return {
        date: date.toISOString().split('T')[0],
        price,
        volume: Math.floor(Math.random() * 30000000) + 5000000,
      };
    }),
    overview: {
      symbol,
      name: symbol === 'AAPL' ? 'Apple Inc.' : symbol === 'MSFT' ? 'Microsoft Corporation' : symbol === 'GOOGL' ? 'Alphabet Inc.' : `${symbol} Corp`,
      description: `${symbol} is a leading technology company.`,
      sector: 'Technology',
      industry: 'Technology',
      marketCap: '2800000000000',
      peRatio: '28.5',
      dividendYield: '0.5',
      eps: '6.43',
      beta: '1.2',
      fiftyTwoWeekHigh: (basePrice + 30).toString(),
      fiftyTwoWeekLow: (basePrice - 30).toString(),
    }
  };
};

export async function getStockQuote(symbol: string): Promise<StockQuote> {
  try {
    console.log(`Fetching quote for ${symbol}`);
    
    const response = await fetch(
      `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
    );
    const data = await response.json();
    
    console.log('Quote API Response:', data);
    
    if (data['Error Message']) {
      throw new Error(data['Error Message']);
    }
    
    if (data['Note']) {
      console.warn('API Rate limit hit, using mock data');
      return getMockStockData(symbol).quote;
    }

    const quote = data['Global Quote'];
    if (!quote || Object.keys(quote).length === 0) {
      console.warn('Empty quote response, using mock data');
      return getMockStockData(symbol).quote;
    }

    return {
      symbol: quote['01. symbol'] || symbol,
      price: parseFloat(quote['05. price']) || 0,
      change: parseFloat(quote['09. change']) || 0,
      changePercent: parseFloat(quote['10. change percent']?.replace('%', '')) || 0,
      volume: parseInt(quote['06. volume']) || 0,
    };
  } catch (error) {
    console.error('Error fetching stock quote:', error);
    console.log('Falling back to mock data');
    return getMockStockData(symbol).quote;
  }
}

export async function getStockChart(symbol: string, interval: 'daily' | 'weekly' | 'monthly' = 'daily'): Promise<ChartDataPoint[]> {
  try {
    console.log(`Fetching chart for ${symbol} - ${interval}`);
    
    let functionType = 'TIME_SERIES_DAILY';
    if (interval === 'weekly') functionType = 'TIME_SERIES_WEEKLY';
    if (interval === 'monthly') functionType = 'TIME_SERIES_MONTHLY';

    // Add delay to avoid rate limiting
    await delay(1000);

    const response = await fetch(
      `${BASE_URL}?function=${functionType}&symbol=${symbol}&apikey=${API_KEY}`
    );
    const data = await response.json();

    console.log('Chart API Response:', data);

    if (data['Error Message']) {
      throw new Error(data['Error Message']);
    }
    
    if (data['Note']) {
      console.warn('API Rate limit hit, using mock data');
      return getMockStockData(symbol).chartData;
    }

    let timeSeriesKey = 'Time Series (Daily)';
    if (interval === 'weekly') timeSeriesKey = 'Weekly Time Series';
    if (interval === 'monthly') timeSeriesKey = 'Monthly Time Series';

    const timeSeries = data[timeSeriesKey];
    if (!timeSeries || Object.keys(timeSeries).length === 0) {
      console.warn('Empty chart response, using mock data');
      return getMockStockData(symbol).chartData;
    }

    const chartData: ChartDataPoint[] = Object.entries(timeSeries)
      .slice(0, 100) // Limit to last 100 data points
      .map(([date, values]: [string, any]) => ({
        date,
        price: parseFloat(values['4. close']) || 0,
        volume: parseInt(values['5. volume']) || 0,
      }))
      .reverse(); // Reverse to show oldest to newest

    return chartData;
  } catch (error) {
    console.error('Error fetching chart data:', error);
    console.log('Falling back to mock data');
    return getMockStockData(symbol).chartData;
  }
}

export async function getStockOverview(symbol: string): Promise<StockOverview> {
  try {
    console.log(`Fetching overview for ${symbol}`);
    
    // Add delay to avoid rate limiting
    await delay(2000);
    
    const response = await fetch(
      `${BASE_URL}?function=OVERVIEW&symbol=${symbol}&apikey=${API_KEY}`
    );
    const data = await response.json();

    console.log('Overview API Response:', data);

    if (data['Error Message']) {
      throw new Error(data['Error Message']);
    }
    
    if (data['Note']) {
      console.warn('API Rate limit hit, using mock data');
      return getMockStockData(symbol).overview;
    }

    if (!data.Symbol) {
      console.warn('Empty overview response, using mock data');
      return getMockStockData(symbol).overview;
    }

    return {
      symbol: data.Symbol || symbol,
      name: data.Name || `${symbol} Corp`,
      description: data.Description || `${symbol} is a publicly traded company.`,
      sector: data.Sector || 'N/A',
      industry: data.Industry || 'N/A',
      marketCap: data.MarketCapitalization || 'N/A',
      peRatio: data.PERatio || 'N/A',
      dividendYield: data.DividendYield || 'N/A',
      eps: data.EPS || 'N/A',
      beta: data.Beta || 'N/A',
      fiftyTwoWeekHigh: data['52WeekHigh'] || 'N/A',
      fiftyTwoWeekLow: data['52WeekLow'] || 'N/A',
    };
  } catch (error) {
    console.error('Error fetching stock overview:', error);
    console.log('Falling back to mock data');
    return getMockStockData(symbol).overview;
  }
}

export async function searchStocks(keywords: string): Promise<SearchResult[]> {
  try {
    console.log(`Searching for ${keywords}`);
    
    // Add delay to avoid rate limiting
    await delay(500);
    
    const response = await fetch(
      `${BASE_URL}?function=SYMBOL_SEARCH&keywords=${keywords}&apikey=${API_KEY}`
    );
    const data = await response.json();

    console.log('Search API Response:', data);

    if (data['Error Message']) {
      throw new Error(data['Error Message']);
    }
    
    if (data['Note']) {
      console.warn('API Rate limit hit, returning default results');
      return getDefaultSearchResults(keywords);
    }

    const matches = data.bestMatches;
    if (!matches || matches.length === 0) {
      console.warn('No search results, returning defaults');
      return getDefaultSearchResults(keywords);
    }

    return matches.slice(0, 10).map((match: any) => ({
      symbol: match['1. symbol'] || '',
      name: match['2. name'] || '',
      type: match['3. type'] || 'Equity',
      region: match['4. region'] || 'United States',
      marketOpen: match['5. marketOpen'] || '09:30',
      marketClose: match['6. marketClose'] || '16:00',
      timezone: match['7. timezone'] || 'UTC-04',
      currency: match['8. currency'] || 'USD',
      matchScore: match['9. matchScore'] || '1.0000',
    }));
  } catch (error) {
    console.error('Error searching stocks:', error);
    return getDefaultSearchResults(keywords);
  }
}

// Fallback search results when API fails
function getDefaultSearchResults(keywords: string): SearchResult[] {
  const defaultStocks = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corporation' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'TSLA', name: 'Tesla, Inc.' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation' },
    { symbol: 'META', name: 'Meta Platforms, Inc.' },
    { symbol: 'NFLX', name: 'Netflix, Inc.' },
  ];

  return defaultStocks
    .filter(stock => 
      stock.symbol.toLowerCase().includes(keywords.toLowerCase()) ||
      stock.name.toLowerCase().includes(keywords.toLowerCase())
    )
    .slice(0, 5)
    .map(stock => ({
      symbol: stock.symbol,
      name: stock.name,
      type: 'Equity',
      region: 'United States',
      marketOpen: '09:30',
      marketClose: '16:00',
      timezone: 'UTC-04',
      currency: 'USD',
      matchScore: '1.0000',
    }));
} 