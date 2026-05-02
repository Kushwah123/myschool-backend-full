import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import AttendanceScreen from './src/screens/AttendanceScreen';
import ClassesScreen from './src/screens/ClassesScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';

const Tab = createBottomTabNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#080e2f',
    card: '#101a46',
    text: '#eef2ff',
    border: '#1d2d63',
    primary: '#7c98ff'
  }
};

type Teacher = {
  name: string;
  subject: string;
};

export default function App() {
  const [teacher, setTeacher] = useState<Teacher | null>(null);

  const handleLogin = () => {
    setTeacher({ name: 'Anita Sharma', subject: 'Mathematics' });
  };

  if (!teacher) {
    return (
      <SafeAreaProvider>
        <LoginScreen onLogin={handleLogin} />
        <StatusBar style="light" />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={theme}>
        <Tab.Navigator
          screenOptions={({ route }) => ({ 
            headerShown: false,
            tabBarStyle: styles.tabBar,
            tabBarActiveTintColor: '#c0d3ff',
            tabBarInactiveTintColor: '#8a9ef0',
            tabBarLabelStyle: { fontSize: 12, fontWeight: '700' },
            tabBarIcon: ({ color, size }) => {
              let iconName = 'dashboard';
              if (route.name === 'Attendance') iconName = 'event-available';
              if (route.name === 'Classes') iconName = 'class';
              if (route.name === 'Notifications') iconName = 'notifications';
              return <MaterialIcons name={iconName as any} size={size} color={color} />;
            }
          })}
        >
          <Tab.Screen name="Dashboard">
            {() => <DashboardScreen teacher={teacher} />}
          </Tab.Screen>
          <Tab.Screen name="Attendance" component={AttendanceScreen} />
          <Tab.Screen name="Classes" component={ClassesScreen} />
          <Tab.Screen name="Notifications" component={NotificationsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#0f173f',
    borderTopColor: '#192552',
    height: 72,
    paddingBottom: 8,
    paddingTop: 8
  }
});
