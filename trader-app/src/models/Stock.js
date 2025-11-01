export class Stock {
  constructor(symbol, name, price, change, changePercent, volume, high, low, open) {
    this.symbol = symbol;
    this.name = name;
    this.price = price;
    this.change = change;
    this.changePercent = changePercent;
    this.volume = volume;
    this.high = high;
    this.low = low;
    this.open = open;
  }
}

export class Portfolio {
  constructor(stocks = [], cash = 10000) {
    this.stocks = stocks;
    this.cash = cash;
  }

  getTotalValue() {
    const stockValue = this.stocks.reduce((sum, item) => {
      return sum + (item.stock.price * item.quantity);
    }, 0);
    return stockValue + this.cash;
  }

  getStockValue() {
    return this.stocks.reduce((sum, item) => {
      return sum + (item.stock.price * item.quantity);
    }, 0);
  }
}

export class Transaction {
  constructor(id, type, stock, quantity, price, date) {
    this.id = id;
    this.type = type; // 'buy' or 'sell'
    this.stock = stock;
    this.quantity = quantity;
    this.price = price;
    this.date = date;
  }
}

export class PortfolioItem {
  constructor(stock, quantity, avgPrice) {
    this.stock = stock;
    this.quantity = quantity;
    this.avgPrice = avgPrice;
  }

  getCurrentValue() {
    return this.stock.price * this.quantity;
  }

  getProfitLoss() {
    return (this.stock.price - this.avgPrice) * this.quantity;
  }

  getProfitLossPercent() {
    return ((this.stock.price - this.avgPrice) / this.avgPrice) * 100;
  }
}
