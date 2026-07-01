import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CategoryBadgeProps {
  name: string;
  icon: string;
  color: string;
}

export default function CategoryBadge({ name, icon, color }: CategoryBadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: color + '20' }]}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.text, { color }]}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    gap: 4,
  },
  icon: {
    fontSize: 12,
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
  },
});
