import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { colors } from '../utils/colors';
import { formatCurrency, formatPercent, formatVolume } from '../utils/formatters';
import MarketDataService from '../services/MarketDataService';
import PortfolioService from '../services/PortfolioService';

const screenWidth = Dimensions.get('window').width;

const StockDetailScreen = ({ route, navigation }) => {
  const { stock } = route.params;
  const [historicalData, setHistoricalData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [tradeType, setTradeType] = useState('buy');
  const [quantity, setQuantity] = useState('1');
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    navigation.setOptions({ title: stock.symbol });
    loadHistoricalData();
    setIsInWatchlist(MarketDataService.isInWatchlist(stock.symbol));
  }, [stock]);

  const loadHistoricalData = () => {
    const data = MarketDataService.getHistoricalData(stock.symbol);
    setHistoricalData(data);
  };

  const toggleWatchlist = () => {
    if (isInWatchlist) {
      MarketDataService.removeFromWatchlist(stock.symbol);
      setIsInWatchlist(false);
      Alert.alert('Removed', `${stock.symbol} removed from watchlist`);
    } else {
      MarketDataService.addToWatchlist(stock.symbol);
      setIsInWatchlist(true);
      Alert.alert('Added', `${stock.symbol} added to watchlist`);
    }
  };

  const handleTrade = () => {
    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) {
      Alert.alert('Error', 'Please enter a valid quantity');
      return;
    }

    try {
      if (tradeType === 'buy') {
        PortfolioService.buyStock(stock, qty);
        Alert.alert('Success', `Bought ${qty} shares of ${stock.symbol}`);
      } else {
        PortfolioService.sellStock(stock, qty);
        Alert.alert('Success', `Sold ${qty} shares of ${stock.symbol}`);
      }
      setModalVisible(false);
      setQuantity('1');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const openTradeModal = (type) => {
    setTradeType(type);
    setModalVisible(true);
  };

  const isPositive = stock.change >= 0;
  const changeColor = isPositive ? colors.success : colors.error;
  const ownedQuantity = PortfolioService.getStockQuantity(stock.symbol);

  const chartData = {
    labels: historicalData.filter((_, i) => i % 5 === 0).map(d => d.date.split('-')[2]),
    datasets: [{
      data: historicalData.map(d => d.price),
      color: (opacity = 1) => isPositive ? colors.chartGreen : colors.chartRed,
      strokeWidth: 2,
    }],
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.priceSection}>
            <Text style={styles.price}>{formatCurrency(stock.price)}</Text>
            <View style={[styles.changeBadge, { backgroundColor: changeColor + '20' }]}>
              <Text style={[styles.change, { color: changeColor }]}>
                {formatPercent(stock.changePercent)} ({isPositive ? '+' : ''}{formatCurrency(stock.change)})
              </Text>
            </View>
          </View>

          {ownedQuantity > 0 && (
            <View style={styles.ownedBadge}>
              <Text style={styles.ownedText}>You own {ownedQuantity} shares</Text>
            </View>
          )}
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>30 Day Price Chart</Text>
          {historicalData.length > 0 && (
            <LineChart
              data={chartData}
              width={screenWidth - 32}
              height={220}
              chartConfig={{
                backgroundColor: colors.surface,
                backgroundGradientFrom: colors.surface,
                backgroundGradientTo: colors.surface,
                decimalPlaces: 2,
                color: (opacity = 1) => isPositive ? colors.chartGreen : colors.chartRed,
                labelColor: (opacity = 1) => colors.textSecondary,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '0',
                },
              }}
              bezier
              style={styles.chart}
            />
          )}
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Open</Text>
            <Text style={styles.statValue}>{formatCurrency(stock.open)}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>High</Text>
            <Text style={styles.statValue}>{formatCurrency(stock.high)}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Low</Text>
            <Text style={styles.statValue}>{formatCurrency(stock.low)}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Volume</Text>
            <Text style={styles.statValue}>{formatVolume(stock.volume)}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.watchlistButton} onPress={toggleWatchlist}>
          <Text style={styles.watchlistButtonText}>
            {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.tradeButton, styles.buyButton]}
          onPress={() => openTradeModal('buy')}
        >
          <Text style={styles.tradeButtonText}>Buy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tradeButton, styles.sellButton]}
          onPress={() => openTradeModal('sell')}
        >
          <Text style={styles.tradeButtonText}>Sell</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {tradeType === 'buy' ? 'Buy' : 'Sell'} {stock.symbol}
            </Text>
            
            <Text style={styles.modalPrice}>Price: {formatCurrency(stock.price)}</Text>
            
            <Text style={styles.inputLabel}>Quantity</Text>
            <TextInput
              style={styles.input}
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
              placeholder="Enter quantity"
            />
            
            <Text style={styles.totalText}>
              Total: {formatCurrency(stock.price * (parseInt(quantity) || 0))}
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, tradeType === 'buy' ? styles.confirmBuyButton : styles.confirmSellButton]}
                onPress={handleTrade}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.surface,
    padding: 20,
    marginBottom: 16,
  },
  priceSection: {
    marginBottom: 12,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  changeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  change: {
    fontSize: 16,
    fontWeight: '600',
  },
  ownedBadge: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  ownedText: {
    color: colors.primary,
    fontWeight: '600',
  },
  chartContainer: {
    backgroundColor: colors.surface,
    padding: 16,
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  statsContainer: {
    backgroundColor: colors.surface,
    padding: 20,
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  statLabel: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  watchlistButton: {
    backgroundColor: colors.surface,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
  },
  watchlistButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  tradeButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  buyButton: {
    backgroundColor: colors.success,
  },
  sellButton: {
    backgroundColor: colors.error,
  },
  tradeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalPrice: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 24,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  cancelButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  confirmBuyButton: {
    backgroundColor: colors.success,
  },
  confirmSellButton: {
    backgroundColor: colors.error,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default StockDetailScreen;
