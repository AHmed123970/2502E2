import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../utils/colors';
import { formatCurrency, formatPercent } from '../utils/formatters';

const PortfolioCard = ({ item, onPress }) => {
  const profitLoss = item.getProfitLoss();
  const profitLossPercent = item.getProfitLossPercent();
  const isPositive = profitLoss >= 0;
  const changeColor = isPositive ? colors.success : colors.error;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <Text style={styles.symbol}>{item.stock.symbol}</Text>
          <Text style={styles.name} numberOfLines={1}>{item.stock.name}</Text>
        </View>
        
        <View style={styles.rightSection}>
          <Text style={styles.value}>{formatCurrency(item.getCurrentValue())}</Text>
          <Text style={[styles.profitLoss, { color: changeColor }]}>
            {isPositive ? '+' : ''}{formatCurrency(profitLoss)}
          </Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.quantity}>{item.quantity} shares @ {formatCurrency(item.avgPrice)}</Text>
        <View style={[styles.percentBadge, { backgroundColor: changeColor + '20' }]}>
          <Text style={[styles.percent, { color: changeColor }]}>
            {formatPercent(profitLossPercent)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
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
  value: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  profitLoss: {
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantity: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  percentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  percent: {
    fontSize: 13,
    fontWeight: '600',
  },
});

export default PortfolioCard;
