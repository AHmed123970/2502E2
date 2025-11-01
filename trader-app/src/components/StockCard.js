import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../utils/colors';
import { formatCurrency, formatPercent } from '../utils/formatters';

const StockCard = ({ stock, onPress }) => {
  const isPositive = stock.change >= 0;
  const changeColor = isPositive ? colors.success : colors.error;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.leftSection}>
        <Text style={styles.symbol}>{stock.symbol}</Text>
        <Text style={styles.name} numberOfLines={1}>{stock.name}</Text>
      </View>
      
      <View style={styles.rightSection}>
        <Text style={styles.price}>{formatCurrency(stock.price)}</Text>
        <View style={[styles.changeContainer, { backgroundColor: changeColor + '20' }]}>
          <Text style={[styles.change, { color: changeColor }]}>
            {formatPercent(stock.changePercent)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  leftSection: {
    flex: 1,
  },
  symbol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  name: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  changeContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  change: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default StockCard;
