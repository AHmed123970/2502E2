import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients } from '../utils/colors';
import { formatCurrency } from '../utils/formatters';
import StockCard from '../components/StockCard';
import MarketDataService from '../services/MarketDataService';
import PortfolioService from '../services/PortfolioService';

const HomeScreen = ({ navigation }) => {
  const [stocks, setStocks] = useState([]);
  const [portfolio, setPortfolio] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      updatePrices();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    const allStocks = MarketDataService.getAllStocks();
    setStocks(allStocks);
    setPortfolio(PortfolioService.getPortfolio());
    PortfolioService.updateStockPrices(allStocks);
  };

  const updatePrices = () => {
    MarketDataService.updateStockPrices();
    loadData();
  };

  const onRefresh = () => {
    setRefreshing(true);
    updatePrices();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const totalValue = portfolio ? portfolio.getTotalValue() : 0;
  const stockValue = portfolio ? portfolio.getStockValue() : 0;
  const cashValue = portfolio ? portfolio.cash : 0;

  return (
    <View style={styles.container}>
      <LinearGradient colors={gradients.primary} style={styles.header}>
        <Text style={styles.headerTitle}>Portfolio Value</Text>
        <Text style={styles.portfolioValue}>{formatCurrency(totalValue)}</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Stocks</Text>
            <Text style={styles.statValue}>{formatCurrency(stockValue)}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Cash</Text>
            <Text style={styles.statValue}>{formatCurrency(cashValue)}</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Market Overview</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Watchlist')}>
          <Text style={styles.seeAllText}>Watchlist</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={stocks}
        keyExtractor={(item) => item.symbol}
        renderItem={({ item }) => (
          <StockCard
            stock={item}
            onPress={() => navigation.navigate('StockDetail', { stock: item })}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  portfolioValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 16,
  },
});

export default HomeScreen;
