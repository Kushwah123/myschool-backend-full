/**
 * Home Screen - Main dashboard
 */
import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useGatewayStore } from '../store/gatewayStore';
import { connectToBackend, disconnectFromBackend } from '../services/socketService';
import { loadSettings, saveSettings } from '../services/storageService';
import { requestPermissions, checkPermissions } from '../services/permissionService';
import { StatusCard } from '../components/StatusCard';
import { Button } from '../components/Button';
import { SettingsInput } from '../components/SettingsInput';
import { ToggleSwitch } from '../components/ToggleSwitch';

export const HomeScreen: React.FC = () => {
  const {
    isConnected,
    connectionStatus,
    deviceId,
    backendUrl,
    deviceName,
    simNumber,
    updateSettings,
  } = useGatewayStore();

  const [localBackendUrl, setLocalBackendUrl] = useState(backendUrl);
  const [localDeviceId, setLocalDeviceId] = useState(deviceId);
  const [localDeviceName, setLocalDeviceName] = useState(deviceName);
  const [localSimNumber, setLocalSimNumber] = useState(simNumber);
  const [autoStart, setAutoStart] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  // Load settings on mount
  useEffect(() => {
    loadSettings().then((settings) => {
      setLocalBackendUrl(settings.backendUrl);
      setLocalDeviceId(settings.deviceId);
      setLocalDeviceName(settings.deviceName);
      setLocalSimNumber(settings.simNumber);
      setAutoStart(settings.autoStart);
      updateSettings(settings);
      setInitializing(false);

      // Auto-start if enabled
      if (settings.autoStart && !isConnected) {
        handleStartService(settings);
      }
    });
  }, []);

  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      await saveSettings({
        backendUrl: localBackendUrl,
        deviceId: localDeviceId,
        deviceName: localDeviceName,
        simNumber: localSimNumber,
        autoStart,
      });

      updateSettings({
        backendUrl: localBackendUrl,
        deviceId: localDeviceId,
        deviceName: localDeviceName,
        simNumber: localSimNumber,
      });

      Alert.alert('Success', 'Settings saved successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleStartService = async (settings?: any) => {
    try {
      setLoading(true);

      // Check permissions
      const hasPermission = await checkPermissions();
      if (!hasPermission) {
        const granted = await requestPermissions();
        if (!granted) {
          Alert.alert('Permissions', 'Call permissions are required');
          return;
        }
      }

      // Connect
      const url = settings?.backendUrl || localBackendUrl;
      const id = settings?.deviceId || localDeviceId;
      const name = settings?.deviceName || localDeviceName;
      const sim = settings?.simNumber || localSimNumber;

      await connectToBackend(url, id, name, sim);
      Alert.alert('Success', 'Gateway service started');
    } catch (error) {
      Alert.alert('Error', 'Failed to start service');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStopService = async () => {
    try {
      disconnectFromBackend();
      useGatewayStore.setState({ isConnected: false, connectionStatus: 'Disconnected' });
      Alert.alert('Success', 'Gateway service stopped');
    } catch (error) {
      Alert.alert('Error', 'Failed to stop service');
    }
  };

  if (initializing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>School SIM Gateway</Text>
        <Text style={styles.subtitle}>Manage your gateway device</Text>
      </View>

      <StatusCard status={connectionStatus} isConnected={isConnected} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Configuration</Text>

        <SettingsInput
          label="Backend URL"
          value={localBackendUrl}
          onChangeText={setLocalBackendUrl}
          placeholder="http://192.168.1.100:5000"
          keyboardType="url"
        />

        <SettingsInput
          label="Device ID"
          value={localDeviceId}
          onChangeText={setLocalDeviceId}
          placeholder="SCHOOL-GATEWAY-01"
        />

        <SettingsInput
          label="Device Name"
          value={localDeviceName}
          onChangeText={setLocalDeviceName}
          placeholder="Reception Phone"
        />

        <SettingsInput
          label="School SIM Number"
          value={localSimNumber}
          onChangeText={setLocalSimNumber}
          placeholder="+91XXXXXXXXXX"
          keyboardType="phone-pad"
        />

        <ToggleSwitch
          label="Auto-start Service"
          value={autoStart}
          onValueChange={setAutoStart}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions</Text>

        <Button
          title="Save Settings"
          onPress={handleSaveSettings}
          variant="primary"
          loading={loading}
        />

        {!isConnected ? (
          <Button
            title="Start Gateway Service"
            onPress={() => handleStartService()}
            variant="success"
            loading={loading}
          />
        ) : (
          <Button
            title="Stop Gateway Service"
            onPress={handleStopService}
            variant="danger"
            loading={loading}
          />
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>v1.0.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  footer: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
});
