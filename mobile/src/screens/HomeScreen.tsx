import React, { useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, RefreshControl, TouchableOpacity,
} from 'react-native';
import { useAuth } from '../store/AuthContext';
import { useExpenses } from '../store/ExpenseContext';
import ExpenseCard from '../components/ExpenseCard';
import SummaryCard from '../components/SummaryCard';

export default function HomeScreen() {
  const { user, formatCurrency, logout } = useAuth();
  const { expenses, dashboard, loading, fetchExpenses, fetchDashboard } = useExpenses();

  useEffect(() => {
    fetchExpenses();
    fetchDashboard();
  }, []);

  function onRefresh() {
    fetchExpenses();
    fetchDashboard();
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.name || 'User'}</Text>
          <Text style={styles.subtitle}>Here's your spending overview</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Summary Cards */}
      <View style={styles.statsRow}>
        <SummaryCard
          title="This Month"
          value={formatCurrency(dashboard?.totalThisMonth || 0)}
          color="#5E244E"
        />
        <SummaryCard
          title="Transactions"
          value={`${dashboard?.transactionCount || 0}`}
          color="#E68457"
        />
      </View>

      {/* Recent Expenses */}
      <Text style={styles.sectionTitle}>Recent Expenses</Text>
      {expenses.slice(0, 10).map((expense) => (
        <ExpenseCard key={expense.id} expense={expense} />
      ))}
      {expenses.length === 0 && (
        <Text style={styles.emptyText}>No expenses yet. Scan a receipt to start!</Text>
      )}
    </ScrollView>
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
    alignItems: 'flex-start',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5E244E',
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  logoutButton: {
    marginTop: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#FDF2F4',
  },
  logoutText: {
    color: '#AA1C41',
    fontSize: 13,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  emptyText: {
    textAlign: 'center',
    color: '#9CA3AF',
    padding: 40,
    fontSize: 14,
  },
});
