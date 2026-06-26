/**
 * App.tsx - Main application entry point
 */
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useGatewayStore } from './src/store/gatewayStore';
import { HomeScreen } from './src/screens/HomeScreen';
import { CallScreen } from './src/screens/CallScreen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync().catch(() => {});

const Stack = createStackNavigator();

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const currentCallId = useGatewayStore((state) => state.currentCallId);

  useEffect(() => {
    async function prepare() {
      try {
        // Add any initialization logic here
        // For now, just wait a moment for the store to initialize
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!isReady) {
    return (
      <View style={styles.splashContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            animationEnabled: false,
          }}
        />
        {currentCallId && (
          <Stack.Screen
            name="Call"
            component={CallScreen}
            options={{
              animationEnabled: true,
              presentation: 'modal',
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
