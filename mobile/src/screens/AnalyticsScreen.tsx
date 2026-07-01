import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { useAuth } from '../store/AuthContext';
import { useExpenses } from '../store/ExpenseContext';
import SummaryCard from '../components/SummaryCard';

export default function AnalyticsScreen() {
  const { formatCurrency } = useAuth();
  const { dashboard, fetchDashboard, fetchSummary, fetchPatterns } = useExpenses();
  const [summary, setSummary] = useState<string>('');
  const [patterns, setPatterns] = useState<string[]>([]);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingPatterns, setLoadingPatterns] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, []);

  async function handleGenerateSummary() {
    setLoadingSummary(true);
    try {
      const result = await fetchSummary();
      setSummary(result);
    } finally {
      setLoadingSummary(false);
    }
  }

  async function handleDetectPatterns() {
    setLoadingPatterns(true);
    try {
      const result = await fetchPatterns();
      setPatterns(result);
    } finally {
      setLoadingPatterns(false);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Analytics</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <SummaryCard
          title="This Month"
          value={formatCurrency(dashboard?.totalThisMonth || 0)}
          color="#5E244E"
        />
        <SummaryCard
          title="Avg Transaction"
          value={formatCurrency(dashboard?.avgTransaction || 0)}
          color="#E68457"
        />
      </View>

      {/* Category Breakdown */}
      {dashboard?.categoryBreakdown && dashboard.categoryBreakdown.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Spending by Category</Text>
          {dashboard.categoryBreakdown.map((cat, i) => (
            <View key={i} style={styles.categoryRow}>
              <View style={styles.categoryLeft}>
                <View style={[styles.dot, { backgroundColor: cat.category_color }]} />
                <Text style={styles.categoryName}>{cat.category_name || 'Uncategorized'}</Text>
              </View>
              <Text style={styles.categoryAmount}>{formatCurrency(cat.total)}</Text>
            </View>
          ))}
        </View>
      )}

      {/* AI Summary */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>AI Summary</Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleGenerateSummary}
            disabled={loadingSummary}
          >
            {loadingSummary ? (
              <ActivityIndicator size="small" color="#5E244E" />
            ) : (
              <Text style={styles.actionButtonText}>Generate</Text>
            )}
          </TouchableOpacity>
        </View>
        {summary ? (
          <Text style={styles.summaryText}>{summary}</Text>
        ) : (
          <Text style={styles.placeholder}>Tap Generate for AI-powered insights</Text>
        )}
      </View>

      {/* Patterns */}
      <View style={[styles.card, { marginBottom: 40 }]}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Spending Patterns</Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleDetectPatterns}
            disabled={loadingPatterns}
          >
            {loadingPatterns ? (
              <ActivityIndicator size="small" color="#5E244E" />
            ) : (
              <Text style={styles.actionButtonText}>Detect</Text>
            )}
          </TouchableOpacity>
        </View>
        {patterns.length > 0 ? (
          patterns.map((p, i) => (
            <Text key={i} style={styles.patternItem}>{'\u2022'} {p}</Text>
          ))
        ) : (
          <Text style={styles.placeholder}>Tap Detect to analyze spending habits</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5E244E',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  actionButton: {
    backgroundColor: '#FCF5FA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#5E244E',
    fontSize: 13,
    fontWeight: '600',
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  categoryName: {
    fontSize: 14,
    color: '#4B5563',
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  summaryText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
  },
  placeholder: {
    fontSize: 14,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  patternItem: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: 4,
  },
});
