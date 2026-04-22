import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import ClassManagementScreen from './src/screens/ClassManagementScreen';
import StudentManagementScreen from './src/screens/StudentManagementScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Teacher Dashboard' }} />
          <Stack.Screen name="ClassManagement" component={ClassManagementScreen} options={{ title: 'Class Management' }} />
          <Stack.Screen name="StudentManagement" component={StudentManagementScreen} options={{ title: 'Student Management' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}