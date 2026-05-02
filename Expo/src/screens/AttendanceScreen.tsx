import { View, Text, FlatList, StyleSheet } from 'react-native';

const attendanceData = [
  { day: 'Monday', status: 'Completed', percent: '96%' },
  { day: 'Tuesday', status: 'Completed', percent: '92%' },
  { day: 'Wednesday', status: 'Pending', percent: '—' },
  { day: 'Thursday', status: 'Completed', percent: '98%' },
  { day: 'Friday', status: 'Completed', percent: '94%' }
];

export default function AttendanceScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.headerCard}>
        <Text style={styles.title}>Attendance Tracker</Text>
        <Text style={styles.subtitle}>Review class attendance and mark follow-ups.</Text>
      </View>

      <FlatList
        data={attendanceData}
        keyExtractor={(item) => item.day}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 24 }}
        renderItem={({ item }) => (
          <View style={styles.attendanceCard}>
            <View>
              <Text style={styles.dayText}>{item.day}</Text>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
            <View style={styles.percentBadge}>
              <Text style={styles.percentText}>{item.percent}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#080f31'
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
  attendanceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#15215f',
    borderRadius: 20,
    marginBottom: 14
  },
  dayText: {
    color: '#f5f8ff',
    fontSize: 17,
    fontWeight: '800'
  },
  statusText: {
    marginTop: 6,
    color: '#b7c4ff'
  },
  percentBadge: {
    backgroundColor: '#0f1d57',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16
  },
  percentText: {
    color: '#daf0ff',
    fontWeight: '800'
  }
});
