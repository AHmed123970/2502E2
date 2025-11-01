import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients } from '../utils/colors';
import { formatCurrency } from '../utils/formatters';
import PortfolioCard from '../components/PortfolioCard';
import PortfolioService from '../services/PortfolioService';
import MarketDataService from '../services/MarketDataService';

const PortfolioScreen = ({ navigation }) => {
  const [portfolio, setPortfolio] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadPortfolio();
    });
    return unsubscribe;
  }, [navigation]);

  const loadPortfolio = () => {
    const allStocks = MarketDataService.getAllStocks();
    PortfolioService.updateStockPrices(allStocks);
    setPortfolio(PortfolioService.getPortfolio());
  };

  const onRefresh = () => {
    setRefreshing(true);
    MarketDataService.updateStockPrices();
    loadPortfolio();
    setTimeout(() => setRefreshing(false), 1000);
  };

  if (!portfolio) {
    return null;
  }

  const totalValue = portfolio.getTotalValue();
  const stockValue = portfolio.getStockValue();
  const totalProfitLoss = portfolio.stocks.reduce((sum, item) => sum + item.getProfitLoss(), 0);
  const isPositive = totalProfitLoss >= 0;

  return (
    <View style={styles.container}>
      <LinearGradient colors={gradients.primary} style={styles.header}>
        <Text style={styles.headerTitle}>Total Value</Text>
        <Text style={styles.totalValue}>{formatCurrency(totalValue)}</Text>
        
        <View style={styles.profitLossContainer}>
          <Text style={styles.profitLossLabel}>Total P/L</Text>
          <Text style={[styles.profitLoss, { color: isPositive ? colors.successLight : colors.errorLight }]}>
            {isPositive ? '+' : ''}{formatCurrency(totalProfitLoss)}
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Stocks</Text>
            <Text style={styles.statValue}>{formatCurrency(stockValue)}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Cash</Text>
            <Text style={styles.statValue}>{formatCurrency(portfolio.cash)}</Text>
          </View>
        </View>
      </LinearGradient>

      {portfolio.stocks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Holdings Yet</Text>
          <Text style={styles.emptyText}>Start trading to build your portfolio</Text>
          <TouchableOpacity
            style={styles.exploreButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.exploreButtonText}>Explore Stocks</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={portfolio.stocks}
          keyExtractor={(item) => item.stock.symbol}
          renderItem={({ item }) => (
            <PortfolioCard
              item={item}
              onPress={() => navigation.navigate('StockDetail', { stock: item.stock })}
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContent}
        />
      )}
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
  totalValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  profitLossContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profitLossLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginRight: 8,
  },
  profitLoss: {
    fontSize: 18,
    fontWeight: 'bold',
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
  listContent: {
    paddingVertical: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  exploreButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PortfolioScreen;
