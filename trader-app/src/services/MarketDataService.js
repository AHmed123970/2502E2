import { Stock } from '../models/Stock';

class MarketDataService {
  constructor() {
    this.stocks = this.generateMockStocks();
    this.watchlist = [];
  }

  generateMockStocks() {
    const stockData = [
      { symbol: 'AAPL', name: 'Apple Inc.' },
      { symbol: 'GOOGL', name: 'Alphabet Inc.' },
      { symbol: 'MSFT', name: 'Microsoft Corp.' },
      { symbol: 'AMZN', name: 'Amazon.com Inc.' },
      { symbol: 'TSLA', name: 'Tesla Inc.' },
      { symbol: 'META', name: 'Meta Platforms Inc.' },
      { symbol: 'NVDA', name: 'NVIDIA Corp.' },
      { symbol: 'NFLX', name: 'Netflix Inc.' },
      { symbol: 'AMD', name: 'Advanced Micro Devices' },
      { symbol: 'INTC', name: 'Intel Corp.' },
      { symbol: 'PYPL', name: 'PayPal Holdings' },
      { symbol: 'DIS', name: 'Walt Disney Co.' },
      { symbol: 'BA', name: 'Boeing Co.' },
      { symbol: 'JPM', name: 'JPMorgan Chase' },
      { symbol: 'V', name: 'Visa Inc.' },
    ];

    return stockData.map(data => {
      const basePrice = Math.random() * 500 + 50;
      const change = (Math.random() - 0.5) * 20;
      const changePercent = (change / basePrice) * 100;
      const open = basePrice - (Math.random() - 0.5) * 10;
      const high = basePrice + Math.random() * 15;
      const low = basePrice - Math.random() * 15;
      const volume = Math.floor(Math.random() * 10000000) + 1000000;

      return new Stock(
        data.symbol,
        data.name,
        parseFloat(basePrice.toFixed(2)),
        parseFloat(change.toFixed(2)),
        parseFloat(changePercent.toFixed(2)),
        volume,
        parseFloat(high.toFixed(2)),
        parseFloat(low.toFixed(2)),
        parseFloat(open.toFixed(2))
      );
    });
  }

  getAllStocks() {
    return this.stocks;
  }

  getStockBySymbol(symbol) {
    return this.stocks.find(stock => stock.symbol === symbol);
  }

  searchStocks(query) {
    const lowerQuery = query.toLowerCase();
    return this.stocks.filter(stock => 
      stock.symbol.toLowerCase().includes(lowerQuery) ||
      stock.name.toLowerCase().includes(lowerQuery)
    );
  }

  updateStockPrices() {
    this.stocks = this.stocks.map(stock => {
      const priceChange = (Math.random() - 0.5) * 5;
      const newPrice = Math.max(stock.price + priceChange, 1);
      const change = newPrice - stock.open;
      const changePercent = (change / stock.open) * 100;

      return new Stock(
        stock.symbol,
        stock.name,
        parseFloat(newPrice.toFixed(2)),
        parseFloat(change.toFixed(2)),
        parseFloat(changePercent.toFixed(2)),
        stock.volume,
        Math.max(stock.high, newPrice),
        Math.min(stock.low, newPrice),
        stock.open
      );
    });
  }

  getHistoricalData(symbol, days = 30) {
    const stock = this.getStockBySymbol(symbol);
    if (!stock) return [];

    const data = [];
    let currentPrice = stock.price;

    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const variation = (Math.random() - 0.5) * 10;
      currentPrice = Math.max(currentPrice + variation, 1);
      
      data.push({
        date: date.toISOString().split('T')[0],
        price: parseFloat(currentPrice.toFixed(2))
      });
    }

    return data;
  }

  addToWatchlist(symbol) {
    if (!this.watchlist.includes(symbol)) {
      this.watchlist.push(symbol);
    }
  }

  removeFromWatchlist(symbol) {
    this.watchlist = this.watchlist.filter(s => s !== symbol);
  }

  getWatchlist() {
    return this.watchlist.map(symbol => this.getStockBySymbol(symbol)).filter(Boolean);
  }

  isInWatchlist(symbol) {
    return this.watchlist.includes(symbol);
  }
}

export default new MarketDataService();
