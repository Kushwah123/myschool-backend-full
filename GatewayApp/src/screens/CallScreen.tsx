/**
 * Call Screen - Shows incoming call
 */
import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  Alert,
} from 'react-native';
import { useGatewayStore } from '../store/gatewayStore';
import { getCurrentCallData, endCall } from '../services/callService';

export const CallScreen: React.FC = () => {
  const { currentCallId, currentCallStatus, callStartTime } = useGatewayStore();
  const [duration, setDuration] = useState(0);
  const callData = getCurrentCallData();

  useEffect(() => {
    if (!callStartTime || currentCallStatus !== 'connected') return;

    const interval = setInterval(() => {
      setDuration(Math.floor((Date.now() - callStartTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [callStartTime, currentCallStatus]);

  useEffect(() => {
    if (currentCallStatus === 'calling') {
      // Vibrate for incoming call
      Vibration.vibrate([500, 500, 500]);
    }
  }, [currentCallStatus]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  if (!currentCallId) {
    return (
      <View style={styles.container}>
        <Text style={styles.noCallText}>No active calls</Text>
      </View>
    );
  }

  const statusColor =
    currentCallStatus === 'calling'
      ? '#FF9800'
      : currentCallStatus === 'connected'
      ? '#4CAF50'
      : '#FF5252';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>School SIM Gateway</Text>
        <Text style={styles.status}>Call {currentCallStatus.toUpperCase()}</Text>
      </View>

      <View style={[styles.callCard, { borderTopColor: statusColor }]}>
        <Text style={styles.label}>Teacher</Text>
        <Text style={styles.value}>{callData?.teacherName || 'Unknown'}</Text>

        <Text style={[styles.label, { marginTop: 16 }]}>Student</Text>
        <Text style={styles.value}>{callData?.studentName || 'Unknown'}</Text>

        <Text style={[styles.label, { marginTop: 16 }]}>Parent Number</Text>
        <Text style={styles.value}>{callData?.parentNumber || 'Unknown'}</Text>

        {currentCallStatus === 'connected' && (
          <View style={styles.durationContainer}>
            <Text style={styles.label}>Duration</Text>
            <Text style={styles.duration}>{formatDuration(duration)}</Text>
          </View>
        )}
      </View>

      <View style={styles.actionsContainer}>
        {currentCallStatus === 'connected' && (
          <TouchableOpacity
            style={[styles.actionButton, styles.endButton]}
            onPress={() => {
              endCall();
              Alert.alert('Call Ended', 'The call has been disconnected');
            }}
          >
            <Text style={styles.actionButtonText}>End Call</Text>
          </TouchableOpacity>
        )}

        {currentCallStatus === 'calling' && (
          <>
            <TouchableOpacity
              style={[styles.actionButton, styles.acceptButton]}
              onPress={() => {
                // In real scenario, this would be handled by native phone app
                useGatewayStore.setState({
                  currentCallStatus: 'connected',
                });
              }}
            >
              <Text style={styles.actionButtonText}>Accept</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.rejectButton]}
              onPress={() => {
                endCall();
              }}
            >
              <Text style={styles.actionButtonText}>Reject</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  status: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  callCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderTopWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 4,
  },
  durationContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'center',
  },
  duration: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 8,
    fontFamily: 'monospace',
  },
  noCallText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 40,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  actionButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: '40%',
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#FF5252',
  },
  endButton: {
    backgroundColor: '#FF5252',
    minWidth: '80%',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
