/**
 * Status Card Component
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatusCardProps {
  status: string;
  isConnected: boolean;
}

export const StatusCard: React.FC<StatusCardProps> = ({ status, isConnected }) => {
  const backgroundColor = isConnected ? '#4CAF50' : '#FF5252';
  const textColor = '#ffffff';

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.label, { color: textColor }]}>Status</Text>
      <Text style={[styles.status, { color: textColor }]}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.9,
  },
  status: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
});
