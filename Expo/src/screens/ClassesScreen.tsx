import { View, Text, FlatList, StyleSheet } from 'react-native';

const classes = [
  { name: 'Class 8A', subject: 'Maths', time: '9:00 - 10:00' },
  { name: 'Class 9B', subject: 'Science', time: '10:30 - 11:30' },
  { name: 'Class 7C', subject: 'English', time: '12:00 - 13:00' }
];

export default function ClassesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Classes</Text>
      <Text style={styles.subtitle}>Manage sessions, topics, and class notes.</Text>

      <FlatList
        data={classes}
        keyExtractor={(item) => item.name}
        contentContainerStyle={{ paddingTop: 18, paddingBottom: 30 }}
        renderItem={({ item }) => (
          <View style={styles.classCard}>
            <Text style={styles.className}>{item.name}</Text>
            <Text style={styles.classSubtitle}>{item.subject}</Text>
            <Text style={styles.classTime}>{item.time}</Text>
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
  title: {
    color: '#eef2ff',
    fontSize: 24,
    fontWeight: '900'
  },
  subtitle: {
    color: '#98a8f5',
    marginTop: 6,
    fontSize: 14
  },
  classCard: {
    borderRadius: 24,
    backgroundColor: '#111b47',
    padding: 22,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1f2f6b'
  },
  className: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800'
  },
  classSubtitle: {
    color: '#a5b0ff',
    marginTop: 8
  },
  classTime: {
    marginTop: 14,
    color: '#cfd9ff',
    fontWeight: '700'
  }
});
