import { NativeModules, Platform } from 'react-native';

const LINKING_NATIVE_MODULE = 'DirectCallModule';

type DirectCallModule = {
  placeCall: (phoneNumber: string) => Promise<boolean>;
};

export const placeCallDirect = async (phoneNumber: string): Promise<boolean> => {
  if (Platform.OS !== 'android') {
    return false;
  }

  const mod = NativeModules[LINKING_NATIVE_MODULE] as DirectCallModule | undefined;
  if (!mod?.placeCall) {
    return false;
  }

  return await mod.placeCall(phoneNumber);
};

