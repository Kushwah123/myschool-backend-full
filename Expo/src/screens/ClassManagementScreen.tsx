import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Title, Paragraph, Button, FAB, List, Dialog, Portal, TextInput } from 'react-native-paper';

interface Class {
  id: string;
  name: string;
  subject: string;
  students: number;
}

const ClassManagementScreen: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([
    { id: '1', name: 'Class 10A', subject: 'Mathematics', students: 25 },
    { id: '2', name: 'Class 9B', subject: 'Science', students: 22 },
    { id: '3', name: 'Class 11C', subject: 'English', students: 28 },
  ]);

  const [visible, setVisible] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newSubject, setNewSubject] = useState('');

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const addClass = () => {
    if (newClassName && newSubject) {
      const newClass: Class = {
        id: Date.now().toString(),
        name: newClassName,
        subject: newSubject,
        students: 0,
      };
      setClasses([...classes, newClass]);
      setNewClassName('');
      setNewSubject('');
      hideDialog();
    }
  };

  const renderClass = ({ item }: { item: Class }) => (
    <Card style={styles.classCard}>
      <Card.Content>
        <Title>{item.name}</Title>
        <Paragraph>Subject: {item.subject}</Paragraph>
        <Paragraph>Students: {item.students}</Paragraph>
        <View style={styles.buttonRow}>
          <Button mode="outlined" onPress={() => {}} style={styles.smallButton}>
            Edit
          </Button>
          <Button mode="outlined" onPress={() => {}} style={styles.smallButton}>
            View Students
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Class Management</Title>

      <FlatList
        data={classes}
        renderItem={renderClass}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />

      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Add New Class</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Class Name"
              value={newClassName}
              onChangeText={setNewClassName}
              mode="outlined"
              style={styles.input}
            />
            <TextInput
              label="Subject"
              value={newSubject}
              onChangeText={setNewSubject}
              mode="outlined"
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancel</Button>
            <Button onPress={addClass}>Add</Button>
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
  classCard: {
    marginBottom: 15,
    elevation: 4,
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

export default ClassManagementScreen;