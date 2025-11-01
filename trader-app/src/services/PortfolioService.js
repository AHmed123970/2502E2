import { Portfolio, PortfolioItem, Transaction } from '../models/Stock';
import AsyncStorage from '@react-native-async-storage/async-storage';

class PortfolioService {
  constructor() {
    this.portfolio = new Portfolio();
    this.transactions = [];
    this.loadPortfolio();
  }

  async loadPortfolio() {
    try {
      const portfolioData = await AsyncStorage.getItem('portfolio');
      const transactionsData = await AsyncStorage.getItem('transactions');
      
      if (portfolioData) {
        const data = JSON.parse(portfolioData);
        this.portfolio = new Portfolio(data.stocks, data.cash);
      }
      
      if (transactionsData) {
        this.transactions = JSON.parse(transactionsData);
      }
    } catch (error) {
      console.error('Error loading portfolio:', error);
    }
  }

  async savePortfolio() {
    try {
      await AsyncStorage.setItem('portfolio', JSON.stringify({
        stocks: this.portfolio.stocks,
        cash: this.portfolio.cash
      }));
      await AsyncStorage.setItem('transactions', JSON.stringify(this.transactions));
    } catch (error) {
      console.error('Error saving portfolio:', error);
    }
  }

  getPortfolio() {
    return this.portfolio;
  }

  buyStock(stock, quantity) {
    const totalCost = stock.price * quantity;
    
    if (totalCost > this.portfolio.cash) {
      throw new Error('Insufficient funds');
    }

    const existingItem = this.portfolio.stocks.find(
      item => item.stock.symbol === stock.symbol
    );

    if (existingItem) {
      const totalQuantity = existingItem.quantity + quantity;
      const totalValue = (existingItem.avgPrice * existingItem.quantity) + totalCost;
      existingItem.avgPrice = totalValue / totalQuantity;
      existingItem.quantity = totalQuantity;
      existingItem.stock = stock;
    } else {
      this.portfolio.stocks.push(new PortfolioItem(stock, quantity, stock.price));
    }

    this.portfolio.cash -= totalCost;

    const transaction = new Transaction(
      Date.now().toString(),
      'buy',
      stock,
      quantity,
      stock.price,
      new Date()
    );
    this.transactions.unshift(transaction);

    this.savePortfolio();
    return transaction;
  }

  sellStock(stock, quantity) {
    const existingItem = this.portfolio.stocks.find(
      item => item.stock.symbol === stock.symbol
    );

    if (!existingItem) {
      throw new Error('Stock not found in portfolio');
    }

    if (existingItem.quantity < quantity) {
      throw new Error('Insufficient shares');
    }

    const totalValue = stock.price * quantity;
    existingItem.quantity -= quantity;
    existingItem.stock = stock;

    if (existingItem.quantity === 0) {
      this.portfolio.stocks = this.portfolio.stocks.filter(
        item => item.stock.symbol !== stock.symbol
      );
    }

    this.portfolio.cash += totalValue;

    const transaction = new Transaction(
      Date.now().toString(),
      'sell',
      stock,
      quantity,
      stock.price,
      new Date()
    );
    this.transactions.unshift(transaction);

    this.savePortfolio();
    return transaction;
  }

  getTransactions(limit = 50) {
    return this.transactions.slice(0, limit);
  }

  getStockQuantity(symbol) {
    const item = this.portfolio.stocks.find(
      item => item.stock.symbol === symbol
    );
    return item ? item.quantity : 0;
  }

  updateStockPrices(stocks) {
    this.portfolio.stocks.forEach(item => {
      const updatedStock = stocks.find(s => s.symbol === item.stock.symbol);
      if (updatedStock) {
        item.stock = updatedStock;
      }
    });
  }

  resetPortfolio() {
    this.portfolio = new Portfolio();
    this.transactions = [];
    this.savePortfolio();
  }
}

export default new PortfolioService();
