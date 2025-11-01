import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../utils/colors';
import { formatCurrency, formatDateTime } from '../utils/formatters';

const TransactionCard = ({ transaction }) => {
  const isBuy = transaction.type === 'buy';
  const typeColor = isBuy ? colors.success : colors.error;
  const totalValue = transaction.price * transaction.quantity;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <Text style={styles.symbol}>{transaction.stock.symbol}</Text>
          <Text style={styles.date}>{formatDateTime(transaction.date)}</Text>
        </View>
        
        <View style={[styles.typeBadge, { backgroundColor: typeColor + '20' }]}>
          <Text style={[styles.typeText, { color: typeColor }]}>
            {isBuy ? 'BUY' : 'SELL'}
          </Text>
        </View>
      </View>
      
      <View style={styles.details}>
        <Text style={styles.detailText}>
          {transaction.quantity} shares @ {formatCurrency(transaction.price)}
        </Text>
        <Text style={styles.total}>{formatCurrency(totalValue)}</Text>
      </View>
    </View>
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
    alignItems: 'center',
    marginBottom: 8,
  },
  leftSection: {
    flex: 1,
  },
  symbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  typeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  total: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
});

export default TransactionCard;
