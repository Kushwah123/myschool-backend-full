import { View, Text, FlatList, StyleSheet } from 'react-native';

const alerts = [
  { title: 'New homework uploaded', description: 'Chapter 5 homework is now available for Class 8A.' },
  { title: 'Meeting reminder', description: 'Parent-teacher meeting scheduled for Friday at 3 PM.' },
  { title: 'Attendance alert', description: 'Two students are missing attendance for Wednesday.' }
];

export default function NotificationsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.headerCard}>
        <Text style={styles.title}>Notifications</Text>
        <Text style={styles.subtitle}>Stay updated with class announcements.</Text>
      </View>

      <FlatList
        data={alerts}
        keyExtractor={(item) => item.title}
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 24 }}
        renderItem={({ item }) => (
          <View style={styles.notificationCard}>
            <Text style={styles.notificationTitle}>{item.title}</Text>
            <Text style={styles.notificationDescription}>{item.description}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080f31',
    padding: 20
  },
  headerCard: {
    marginBottom: 18,
    padding: 24,
    borderRadius: 28,
    backgroundColor: '#111c4b'
  },
  title: {
    color: '#eef2ff',
    fontSize: 22,
    fontWeight: '900'
  },
  subtitle: {
    marginTop: 8,
    color: '#98a8f5',
    fontSize: 14
  },
  notificationCard: {
    backgroundColor: '#111b47',
    borderRadius: 22,
    padding: 20,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#1d2e74'
  },
  notificationTitle: {
    color: '#f7fbff',
    fontSize: 16,
    fontWeight: '800'
  },
  notificationDescription: {
    marginTop: 8,
    color: '#b1c1ff',
    lineHeight: 20
  }
});
