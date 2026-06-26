/**
 * Storage Service - Handle persistent storage
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  BACKEND_URL: '@gateway_backend_url',
  DEVICE_ID: '@gateway_device_id',
  DEVICE_NAME: '@gateway_device_name',
  SIM_NUMBER: '@gateway_sim_number',
  AUTO_START: '@gateway_auto_start',
};

export const saveSettings = async (settings: {
  backendUrl: string;
  deviceId: string;
  deviceName: string;
  simNumber: string;
  autoStart: boolean;
}) => {
  try {
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.BACKEND_URL, settings.backendUrl),
      AsyncStorage.setItem(STORAGE_KEYS.DEVICE_ID, settings.deviceId),
      AsyncStorage.setItem(STORAGE_KEYS.DEVICE_NAME, settings.deviceName),
      AsyncStorage.setItem(STORAGE_KEYS.SIM_NUMBER, settings.simNumber),
      AsyncStorage.setItem(STORAGE_KEYS.AUTO_START, String(settings.autoStart)),
    ]);
    console.log('[StorageService] Settings saved');
  } catch (error) {
    console.error('[StorageService] Save error:', error);
    throw error;
  }
};

export const loadSettings = async () => {
  try {
    const [backendUrl, deviceId, deviceName, simNumber, autoStart] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEYS.BACKEND_URL),
      AsyncStorage.getItem(STORAGE_KEYS.DEVICE_ID),
      AsyncStorage.getItem(STORAGE_KEYS.DEVICE_NAME),
      AsyncStorage.getItem(STORAGE_KEYS.SIM_NUMBER),
      AsyncStorage.getItem(STORAGE_KEYS.AUTO_START),
    ]);
    
    return {
      backendUrl: backendUrl || 'http://192.168.1.100:5000',
      deviceId: deviceId || 'SCHOOL-GATEWAY-01',
      deviceName: deviceName || 'Reception Phone',
      simNumber: simNumber || '+91XXXXXXXXXX',
      autoStart: autoStart === 'true',
    };
  } catch (error) {
    console.error('[StorageService] Load error:', error);
    return {
      backendUrl: 'http://192.168.1.100:5000',
      deviceId: 'SCHOOL-GATEWAY-01',
      deviceName: 'Reception Phone',
      simNumber: '+91XXXXXXXXXX',
      autoStart: false,
    };
  }
};
