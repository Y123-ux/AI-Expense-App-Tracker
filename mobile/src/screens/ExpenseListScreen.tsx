import React, { useEffect } from 'react';
import {
  View, Text, FlatList, StyleSheet, Alert, TouchableOpacity,
} from 'react-native';
import { useExpenses } from '../store/ExpenseContext';
import ExpenseCard from '../components/ExpenseCard';

export default function ExpenseListScreen() {
  const { expenses, loading, fetchExpenses, deleteExpense } = useExpenses();

  useEffect(() => {
    fetchExpenses();
  }, []);

  function handleDelete(id: string) {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteExpense(id),
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>All Expenses</Text>
        <Text style={styles.count}>{expenses.length} items</Text>
      </View>

      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onLongPress={() => handleDelete(item.id)}>
            <ExpenseCard expense={item} />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={fetchExpenses}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No expenses found. Add some or scan a receipt!
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  count: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  list: {
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#9CA3AF',
    padding: 40,
    fontSize: 14,
  },
});
