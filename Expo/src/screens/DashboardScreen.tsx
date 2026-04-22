import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button, List } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  ClassManagement: undefined;
  StudentManagement: undefined;
};

type DashboardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Dashboard'>;

interface Props {
  navigation: DashboardScreenNavigationProp;
}

const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>Teacher Dashboard</Title>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Today's Schedule</Title>
          <Paragraph>Math Class - 9:00 AM</Paragraph>
          <Paragraph>Science Class - 11:00 AM</Paragraph>
          <Paragraph>English Class - 2:00 PM</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Quick Actions</Title>
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('ClassManagement')}
              style={styles.button}
            >
              Manage Classes
            </Button>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('StudentManagement')}
              style={styles.button}
            >
              Manage Students
            </Button>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Recent Activities</Title>
          <List.Item
            title="Grade submitted for Math Quiz"
            description="Class 10A - 2 hours ago"
            left={props => <List.Icon {...props} icon="check-circle" />}
          />
          <List.Item
            title="Attendance marked"
            description="Science Class - Yesterday"
            left={props => <List.Icon {...props} icon="account-check" />}
          />
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 24,
  },
  card: {
    marginBottom: 20,
    elevation: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default DashboardScreen;