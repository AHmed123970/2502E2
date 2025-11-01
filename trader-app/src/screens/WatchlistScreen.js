import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { colors } from '../utils/colors';
import StockCard from '../components/StockCard';
import MarketDataService from '../services/MarketDataService';

const WatchlistScreen = ({ navigation }) => {
  const [watchlist, setWatchlist] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadWatchlist();
    });
    return unsubscribe;
  }, [navigation]);

  const loadWatchlist = () => {
    const stocks = MarketDataService.getWatchlist();
    setWatchlist(stocks);
  };

  const onRefresh = () => {
    setRefreshing(true);
    MarketDataService.updateStockPrices();
    loadWatchlist();
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <View style={styles.container}>
      {watchlist.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Stocks in Watchlist</Text>
          <Text style={styles.emptyText}>
            Add stocks to your watchlist to track them easily
          </Text>
        </View>
      ) : (
        <FlatList
          data={watchlist}
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
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  },
});

export default WatchlistScreen;
