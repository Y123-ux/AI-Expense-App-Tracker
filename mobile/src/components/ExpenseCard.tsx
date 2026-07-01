import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../store/AuthContext';

interface ExpenseCardProps {
  expense: {
    id: string;
    amount: number;
    merchant: string | null;
    date: string;
    category_name: string | null;
    category_icon: string | null;
    category_color: string | null;
  };
}

export default function ExpenseCard({ expense }: ExpenseCardProps) {
  const { formatCurrency } = useAuth();

  return (
    <View style={styles.card}>
      <View style={[styles.iconContainer, {
        backgroundColor: (expense.category_color || '#6B7280') + '20',
      }]}>
        <Text style={styles.icon}>{expense.category_icon || '📦'}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.merchant}>{expense.merchant || 'Unknown'}</Text>
        <Text style={styles.meta}>
          {expense.category_name || 'Uncategorized'} · {expense.date}
        </Text>
      </View>

      <Text style={styles.amount}>{formatCurrency(expense.amount)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 8,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 18,
  },
  info: {
    flex: 1,
  },
  merchant: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  meta: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
});
