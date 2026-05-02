import { View, Text, FlatList, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type DashboardScreenProps = {
  teacher: { name: string; subject: string };
};

const stats = [
  { title: 'Today's Classes', value: '5', icon: 'class' },
  { title: 'Attendance %', value: '94%', icon: 'accessibility' },
  { title: 'Pending Tasks', value: '3', icon: 'pending-actions' },
  { title: 'Messages', value: '12', icon: 'message' }
];

const schedule = [
  { time: '09:00 AM', subject: 'Algebra Revision', room: 'Room 204' },
  { time: '11:00 AM', subject: 'Geometry Practice', room: 'Room 206' },
  { time: '01:20 PM', subject: 'Parent Meeting', room: 'Staff Room' }
];

export default function DashboardScreen({ teacher }: DashboardScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.headerCard}>
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.teacherName}>{teacher.name}</Text>
          <Text style={styles.teacherSubject}>{teacher.subject} Teacher</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Teacher</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Quick Stats</Text>
        <Text style={styles.sectionNote}>Live classroom overview</Text>
      </View>

      <FlatList
        data={stats}
        keyExtractor={item => item.title}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.statsList}
        contentContainerStyle={{ paddingRight: 16 }}
        renderItem={({ item }) => (
          <View style={styles.statCard}>
            <MaterialIcons name={item.icon as any} size={26} color="#c3d0ff" />
            <Text style={styles.statValue}>{item.value}</Text>
            <Text style={styles.statLabel}>{item.title}</Text>
          </View>
        )}
      />

      <Text style={styles.sectionTitle}>Upcoming Schedule</Text>
      {schedule.map((item) => (
        <TouchableOpacity key={item.time} style={styles.scheduleItem} activeOpacity={0.8}>
          <View style={styles.scheduleTimeBox}>
            <Text style={styles.scheduleTime}>{item.time}</Text>
          </View>
          <View style={styles.scheduleDetails}>
            <Text style={styles.scheduleSubject}>{item.subject}</Text>
            <Text style={styles.scheduleRoom}>{item.room}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080f31',
    padding: 20
  },
  headerCard: {
    borderRadius: 28,
    padding: 24,
    backgroundColor: '#111b49',
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  welcomeText: {
    color: '#9db0ff',
    fontSize: 14
  },
  teacherName: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '900',
    marginTop: 6
  },
  teacherSubject: {
    color: '#9db0ff',
    fontSize: 15,
    marginTop: 6
  },
  badge: {
    backgroundColor: '#1d2f84',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20
  },
  badgeText: {
    color: '#d1dbff',
    fontWeight: '700'
  },
  sectionHeader: {
    marginBottom: 14
  },
  sectionTitle: {
    color: '#eef2ff',
    fontSize: 20,
    fontWeight: '800'
  },
  sectionNote: {
    color: '#97a8ff',
    fontSize: 13,
    marginTop: 4
  },
  statsList: {
    marginBottom: 24
  },
  statCard: {
    width: width * 0.55,
    marginRight: 16,
    borderRadius: 24,
    backgroundColor: '#121f5d',
    padding: 20,
    justifyContent: 'space-between',
    minHeight: 160
  },
  statValue: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '900',
    marginTop: 16
  },
  statLabel: {
    color: '#a2b1ff',
    marginTop: 10,
    fontSize: 14
  },
  scheduleItem: {
    backgroundColor: '#111b47',
    borderRadius: 24,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16
  },
  scheduleTimeBox: {
    width: 90,
    borderRadius: 18,
    backgroundColor: '#172856',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginRight: 16
  },
  scheduleTime: {
    color: '#c3d0ff',
    fontWeight: '800'
  },
  scheduleDetails: {
    flex: 1
  },
  scheduleSubject: {
    color: '#f7fbff',
    fontSize: 16,
    fontWeight: '800'
  },
  scheduleRoom: {
    color: '#98adff',
    marginTop: 6
  }
});
