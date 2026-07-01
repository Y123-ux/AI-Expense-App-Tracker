import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SummaryCardProps {
  title: string;
  value: string;
  color: string;
}

export default function SummaryCard({ title, value, color }: SummaryCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={[styles.value, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  title: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
