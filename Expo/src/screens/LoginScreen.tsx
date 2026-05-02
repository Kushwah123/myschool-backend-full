import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';

type LoginScreenProps = {
  onLogin: () => void;
};

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Teacher Panel</Text>
        <Text style={styles.subtitle}>Secure access for your classroom dashboard</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Username / Mobile</Text>
        <TextInput
          style={styles.input}
          value={identifier}
          onChangeText={setIdentifier}
          placeholder="Enter username or mobile"
          placeholderTextColor="#8d9de0"
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={[styles.sectionLabel, { marginTop: 20 }]}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter password"
          placeholderTextColor="#8d9de0"
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={onLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Designed for fast teacher workflows with clean mobile UX.</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07102f',
    padding: 24,
    justifyContent: 'space-between'
  },
  headerContainer: {
    marginTop: 60
  },
  title: {
    color: '#f2f7ff',
    fontSize: 34,
    fontWeight: '900'
  },
  subtitle: {
    color: '#9fb2ff',
    marginTop: 12,
    fontSize: 16,
    lineHeight: 24
  },
  card: {
    backgroundColor: '#101a42',
    borderRadius: 28,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 30,
    elevation: 12
  },
  sectionLabel: {
    color: '#b6c1ff',
    fontSize: 14,
    marginBottom: 10,
    letterSpacing: 0.4
  },
  input: {
    borderWidth: 1,
    borderColor: '#1d2f6c',
    borderRadius: 16,
    padding: 16,
    color: '#eef2ff',
    backgroundColor: '#0b1640'
  },
  button: {
    marginTop: 28,
    backgroundColor: '#5f7bff',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center'
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 16
  },
  footer: {
    marginBottom: 36
  },
  footerText: {
    color: '#7c8ff3',
    textAlign: 'center',
    lineHeight: 22
  }
});
