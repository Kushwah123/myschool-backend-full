import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Title, Paragraph, Button, FAB, List, Dialog, Portal, TextInput, Avatar } from 'react-native-paper';

interface Student {
  id: string;
  name: string;
  grade: string;
  attendance: number;
}

const StudentManagementScreen: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([
    { id: '1', name: 'Alice Johnson', grade: '10A', attendance: 95 },
    { id: '2', name: 'Bob Smith', grade: '9B', attendance: 88 },
    { id: '3', name: 'Charlie Brown', grade: '11C', attendance: 92 },
  ]);

  const [visible, setVisible] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newGrade, setNewGrade] = useState('');

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const addStudent = () => {
    if (newStudentName && newGrade) {
      const newStudent: Student = {
        id: Date.now().toString(),
        name: newStudentName,
        grade: newGrade,
        attendance: 100,
      };
      setStudents([...students, newStudent]);
      setNewStudentName('');
      setNewGrade('');
      hideDialog();
    }
  };

  const renderStudent = ({ item }: { item: Student }) => (
    <Card style={styles.studentCard}>
      <Card.Content>
        <View style={styles.studentHeader}>
          <Avatar.Text size={40} label={item.name.split(' ').map(n => n[0]).join('')} />
          <View style={styles.studentInfo}>
            <Title style={styles.studentName}>{item.name}</Title>
            <Paragraph>Grade: {item.grade}</Paragraph>
            <Paragraph>Attendance: {item.attendance}%</Paragraph>
          </View>
        </View>
        <View style={styles.buttonRow}>
          <Button mode="outlined" onPress={() => {}} style={styles.smallButton}>
            View Details
          </Button>
          <Button mode="outlined" onPress={() => {}} style={styles.smallButton}>
            Mark Attendance
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Student Management</Title>

      <FlatList
        data={students}
        renderItem={renderStudent}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />

      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Add New Student</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Student Name"
              value={newStudentName}
              onChangeText={setNewStudentName}
              mode="outlined"
              style={styles.input}
            />
            <TextInput
              label="Grade"
              value={newGrade}
              onChangeText={setNewGrade}
              mode="outlined"
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancel</Button>
            <Button onPress={addStudent}>Add</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={showDialog}
      />
    </View>
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
  listContainer: {
    paddingBottom: 80,
  },
  studentCard: {
    marginBottom: 15,
    elevation: 4,
  },
  studentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  studentInfo: {
    marginLeft: 15,
    flex: 1,
  },
  studentName: {
    fontSize: 18,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  smallButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  input: {
    marginBottom: 10,
  },
});

export default StudentManagementScreen;