import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { colors } from '../utils/colors';
import TransactionCard from '../components/TransactionCard';
import PortfolioService from '../services/PortfolioService';

const TransactionsScreen = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadTransactions();
    });
    return unsubscribe;
  }, [navigation]);

  const loadTransactions = () => {
    const txns = PortfolioService.getTransactions();
    setTransactions(txns);
  };

  return (
    <View style={styles.container}>
      {transactions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Transactions Yet</Text>
          <Text style={styles.emptyText}>
            Your trading history will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TransactionCard transaction={item} />}
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

export default TransactionsScreen;
