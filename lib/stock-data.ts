// Mock stock data for NSE/BSE listed stocks
// In production, connect this to Django backend API

export interface Stock {
  symbol: string;
  name: string;
  exchange: "NSE" | "BSE";
  sector: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  high52: number;
  low52: number;
  pe: number;
  open: number;
  high: number;
  low: number;
  prevClose: number;
}

export interface CandleData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export const trendingStocks: Stock[] = [
  {
    symbol: "RELIANCE",
    name: "Reliance Industries Ltd",
    exchange: "NSE",
    sector: "Oil & Gas",
    price: 2487.35,
    change: 45.2,
    changePercent: 1.85,
    volume: 12450000,
    marketCap: 1683450,
    high52: 2856.15,
    low52: 2180.0,
    pe: 28.5,
    open: 2445.0,
    high: 2498.9,
    low: 2440.5,
    prevClose: 2442.15,
  },
  {
    symbol: "TCS",
    name: "Tata Consultancy Services",
    exchange: "NSE",
    sector: "IT",
    price: 3892.5,
    change: -32.4,
    changePercent: -0.83,
    volume: 3240000,
    marketCap: 1425600,
    high52: 4258.0,
    low52: 3310.55,
    pe: 32.1,
    open: 3920.0,
    high: 3935.0,
    low: 3880.0,
    prevClose: 3924.9,
  },
  {
    symbol: "HDFCBANK",
    name: "HDFC Bank Ltd",
    exchange: "NSE",
    sector: "Banking",
    price: 1654.8,
    change: 22.65,
    changePercent: 1.39,
    volume: 8920000,
    marketCap: 1262300,
    high52: 1794.0,
    low52: 1363.55,
    pe: 19.8,
    open: 1635.0,
    high: 1660.0,
    low: 1630.0,
    prevClose: 1632.15,
  },
  {
    symbol: "INFY",
    name: "Infosys Ltd",
    exchange: "NSE",
    sector: "IT",
    price: 1876.25,
    change: 28.15,
    changePercent: 1.52,
    volume: 6780000,
    marketCap: 778400,
    high52: 1988.0,
    low52: 1358.35,
    pe: 29.4,
    open: 1850.0,
    high: 1882.0,
    low: 1845.0,
    prevClose: 1848.1,
  },
  {
    symbol: "ICICIBANK",
    name: "ICICI Bank Ltd",
    exchange: "NSE",
    sector: "Banking",
    price: 1089.45,
    change: -8.3,
    changePercent: -0.76,
    volume: 7650000,
    marketCap: 764800,
    high52: 1268.45,
    low52: 897.15,
    pe: 17.2,
    open: 1095.0,
    high: 1100.0,
    low: 1085.0,
    prevClose: 1097.75,
  },
  {
    symbol: "HINDUNILVR",
    name: "Hindustan Unilever",
    exchange: "NSE",
    sector: "FMCG",
    price: 2564.3,
    change: 15.8,
    changePercent: 0.62,
    volume: 2340000,
    marketCap: 602100,
    high52: 2769.65,
    low52: 2172.05,
    pe: 58.7,
    open: 2550.0,
    high: 2570.0,
    low: 2545.0,
    prevClose: 2548.5,
  },
  {
    symbol: "SBIN",
    name: "State Bank of India",
    exchange: "NSE",
    sector: "Banking",
    price: 756.9,
    change: 12.45,
    changePercent: 1.67,
    volume: 15600000,
    marketCap: 675200,
    high52: 912.1,
    low52: 555.55,
    pe: 10.4,
    open: 745.0,
    high: 760.0,
    low: 742.0,
    prevClose: 744.45,
  },
  {
    symbol: "BHARTIARTL",
    name: "Bharti Airtel",
    exchange: "NSE",
    sector: "Telecom",
    price: 1445.6,
    change: 38.9,
    changePercent: 2.76,
    volume: 4560000,
    marketCap: 862400,
    high52: 1618.0,
    low52: 890.2,
    pe: 78.3,
    open: 1410.0,
    high: 1452.0,
    low: 1405.0,
    prevClose: 1406.7,
  },
  {
    symbol: "WIPRO",
    name: "Wipro Ltd",
    exchange: "NSE",
    sector: "IT",
    price: 542.3,
    change: -6.15,
    changePercent: -1.12,
    volume: 5890000,
    marketCap: 282600,
    high52: 578.0,
    low52: 385.0,
    pe: 24.6,
    open: 548.0,
    high: 550.0,
    low: 540.0,
    prevClose: 548.45,
  },
  {
    symbol: "TATAMOTORS",
    name: "Tata Motors Ltd",
    exchange: "NSE",
    sector: "Automobile",
    price: 892.45,
    change: 25.3,
    changePercent: 2.92,
    volume: 11200000,
    marketCap: 329700,
    high52: 1008.85,
    low52: 605.0,
    pe: 9.8,
    open: 870.0,
    high: 898.0,
    low: 865.0,
    prevClose: 867.15,
  },
  {
    symbol: "ADANIENT",
    name: "Adani Enterprises",
    exchange: "NSE",
    sector: "Conglomerate",
    price: 2876.5,
    change: 62.8,
    changePercent: 2.23,
    volume: 3450000,
    marketCap: 328400,
    high52: 3744.0,
    low52: 2025.0,
    pe: 68.2,
    open: 2820.0,
    high: 2890.0,
    low: 2810.0,
    prevClose: 2813.7,
  },
  {
    symbol: "MARUTI",
    name: "Maruti Suzuki India",
    exchange: "NSE",
    sector: "Automobile",
    price: 11245.6,
    change: -145.3,
    changePercent: -1.28,
    volume: 980000,
    marketCap: 353200,
    high52: 13680.0,
    low52: 9735.0,
    pe: 32.5,
    open: 11380.0,
    high: 11400.0,
    low: 11200.0,
    prevClose: 11390.9,
  },
  {
    symbol: "SUNPHARMA",
    name: "Sun Pharmaceutical",
    exchange: "NSE",
    sector: "Pharma",
    price: 1534.2,
    change: 18.9,
    changePercent: 1.25,
    volume: 2870000,
    marketCap: 368100,
    high52: 1768.0,
    low52: 1108.0,
    pe: 36.4,
    open: 1518.0,
    high: 1540.0,
    low: 1510.0,
    prevClose: 1515.3,
  },
  {
    symbol: "AXISBANK",
    name: "Axis Bank Ltd",
    exchange: "NSE",
    sector: "Banking",
    price: 1092.75,
    change: 14.5,
    changePercent: 1.34,
    volume: 6340000,
    marketCap: 337500,
    high52: 1262.0,
    low52: 880.0,
    pe: 14.2,
    open: 1080.0,
    high: 1098.0,
    low: 1075.0,
    prevClose: 1078.25,
  },
  {
    symbol: "LTIM",
    name: "LTIMindtree Ltd",
    exchange: "NSE",
    sector: "IT",
    price: 5892.4,
    change: -78.6,
    changePercent: -1.32,
    volume: 870000,
    marketCap: 174600,
    high52: 6492.0,
    low52: 4515.0,
    pe: 35.8,
    open: 5960.0,
    high: 5970.0,
    low: 5875.0,
    prevClose: 5971.0,
  },
];

export function getStockBySymbol(symbol: string): Stock | undefined {
  return trendingStocks.find(
    (s) => s.symbol.toLowerCase() === symbol.toLowerCase()
  );
}

// Generate realistic candlestick data
export function generateCandleData(
  basePrice: number,
  days: number = 90
): CandleData[] {
  const data: CandleData[] = [];
  let price = basePrice * 0.85;

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    const volatility = 0.025;
    const trend = 0.001;
    const change = (Math.random() - 0.48 + trend) * volatility * price;
    const open = price;
    const close = price + change;
    const highSpread = Math.abs(change) * (0.5 + Math.random());
    const lowSpread = Math.abs(change) * (0.5 + Math.random());
    const high = Math.max(open, close) + highSpread;
    const low = Math.min(open, close) - lowSpread;
    const volume = Math.floor(
      (3000000 + Math.random() * 12000000) * (1 + Math.abs(change / price) * 5)
    );

    data.push({
      date: date.toISOString().split("T")[0],
      open: Number.parseFloat(open.toFixed(2)),
      high: Number.parseFloat(high.toFixed(2)),
      low: Number.parseFloat(low.toFixed(2)),
      close: Number.parseFloat(close.toFixed(2)),
      volume,
    });

    price = close;
  }

  return data;
}

// Calculate SMA
export function calculateSMA(data: CandleData[], period: number): (number | null)[] {
  return data.map((_, i) => {
    if (i < period - 1) return null;
    const slice = data.slice(i - period + 1, i + 1);
    const avg = slice.reduce((sum, d) => sum + d.close, 0) / period;
    return Number.parseFloat(avg.toFixed(2));
  });
}

// Calculate EMA
export function calculateEMA(data: CandleData[], period: number): (number | null)[] {
  const multiplier = 2 / (period + 1);
  const result: (number | null)[] = [];

  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(null);
    } else if (i === period - 1) {
      const sma = data.slice(0, period).reduce((sum, d) => sum + d.close, 0) / period;
      result.push(Number.parseFloat(sma.toFixed(2)));
    } else {
      const prev = result[i - 1] as number;
      const ema = (data[i].close - prev) * multiplier + prev;
      result.push(Number.parseFloat(ema.toFixed(2)));
    }
  }

  return result;
}

// Calculate RSI
export function calculateRSI(data: CandleData[], period: number = 14): (number | null)[] {
  const result: (number | null)[] = [];
  const gains: number[] = [];
  const losses: number[] = [];

  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      result.push(null);
      continue;
    }

    const change = data[i].close - data[i - 1].close;
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? -change : 0);

    if (i < period) {
      result.push(null);
    } else if (i === period) {
      const avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
      const avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;
      const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      result.push(Number.parseFloat((100 - 100 / (1 + rs)).toFixed(2)));
    } else {
      const prevRsi = result[i - 1] as number;
      const prevAvgGain = gains.slice(-period - 1, -1).reduce((a, b) => a + b, 0) / period;
      const prevAvgLoss = losses.slice(-period - 1, -1).reduce((a, b) => a + b, 0) / period;
      const currentGain = gains[gains.length - 1];
      const currentLoss = losses[losses.length - 1];
      const avgGain = (prevAvgGain * (period - 1) + currentGain) / period;
      const avgLoss = (prevAvgLoss * (period - 1) + currentLoss) / period;
      const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      result.push(Number.parseFloat((100 - 100 / (1 + rs)).toFixed(2)));
    }
  }

  return result;
}

// Calculate MACD
export function calculateMACD(data: CandleData[]): {
  macd: (number | null)[];
  signal: (number | null)[];
  histogram: (number | null)[];
} {
  const ema12 = calculateEMA(data, 12);
  const ema26 = calculateEMA(data, 26);

  const macd: (number | null)[] = data.map((_, i) => {
    if (ema12[i] === null || ema26[i] === null) return null;
    return Number.parseFloat(((ema12[i] as number) - (ema26[i] as number)).toFixed(2));
  });

  // Signal line (9-period EMA of MACD)
  const macdValues = macd.filter((v) => v !== null) as number[];
  const signalPeriod = 9;
  const signalMultiplier = 2 / (signalPeriod + 1);
  const signal: (number | null)[] = [];
  let macdCount = 0;

  for (let i = 0; i < macd.length; i++) {
    if (macd[i] === null) {
      signal.push(null);
    } else {
      macdCount++;
      if (macdCount < signalPeriod) {
        signal.push(null);
      } else if (macdCount === signalPeriod) {
        const sma = macdValues.slice(0, signalPeriod).reduce((a, b) => a + b, 0) / signalPeriod;
        signal.push(Number.parseFloat(sma.toFixed(2)));
      } else {
        const prev = signal.filter((v) => v !== null).pop() as number;
        const ema = ((macd[i] as number) - prev) * signalMultiplier + prev;
        signal.push(Number.parseFloat(ema.toFixed(2)));
      }
    }
  }

  const histogram: (number | null)[] = data.map((_, i) => {
    if (macd[i] === null || signal[i] === null) return null;
    return Number.parseFloat(((macd[i] as number) - (signal[i] as number)).toFixed(2));
  });

  return { macd, signal, histogram };
}

// Calculate Bollinger Bands
export function calculateBollingerBands(
  data: CandleData[],
  period: number = 20,
  stdDev: number = 2
): { upper: (number | null)[]; middle: (number | null)[]; lower: (number | null)[] } {
  const sma = calculateSMA(data, period);

  const upper: (number | null)[] = [];
  const lower: (number | null)[] = [];

  for (let i = 0; i < data.length; i++) {
    if (sma[i] === null) {
      upper.push(null);
      lower.push(null);
    } else {
      const slice = data.slice(i - period + 1, i + 1);
      const mean = sma[i] as number;
      const variance = slice.reduce((sum, d) => sum + (d.close - mean) ** 2, 0) / period;
      const sd = Math.sqrt(variance);
      upper.push(Number.parseFloat((mean + stdDev * sd).toFixed(2)));
      lower.push(Number.parseFloat((mean - stdDev * sd).toFixed(2)));
    }
  }

  return { upper, middle: sma, lower };
}

export const sectors = [
  "All",
  "Banking",
  "IT",
  "Oil & Gas",
  "FMCG",
  "Pharma",
  "Automobile",
  "Telecom",
  "Conglomerate",
];

export function formatNumber(num: number): string {
  if (num >= 10000000) return `${(num / 10000000).toFixed(2)} Cr`;
  if (num >= 100000) return `${(num / 100000).toFixed(2)} L`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}
