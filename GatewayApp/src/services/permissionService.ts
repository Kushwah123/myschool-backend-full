import { Alert, Platform } from 'react-native';
import { PermissionsAndroid } from 'react-native';

// Runtime permission handling (Android only) for direct CALL.
// Keep it minimal for now: CALL_PHONE.

export const REQUIRED_PERMISSIONS = ['android.permission.CALL_PHONE'];

const ANDROID_PERMISSIONS = [
  PermissionsAndroid.PERMISSIONS.CALL_PHONE,
];

export const checkPermissions = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') return true;

  try {
    const result = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.CALL_PHONE
    );
    return result;
  } catch (e) {
    console.warn('[PermissionService] checkPermissions error:', e);
    return false;
  }
};

export const requestPermissions = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') return true;

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CALL_PHONE,
      {
        title: 'Phone permission required',
        message: 'Required to automatically place calls from this device.',
        buttonPositive: 'Allow',
        buttonNegative: 'Deny',
      }
    );

    const ok = granted === PermissionsAndroid.RESULTS.GRANTED;
    if (!ok) {
      Alert.alert('Permissions required', 'CALL_PHONE permission is required for automatic calling.');
    }

    return ok;
  } catch (e) {
    console.warn('[PermissionService] requestPermissions error:', e);
    return false;
  }
};

export const isDevice = (): boolean => true;

