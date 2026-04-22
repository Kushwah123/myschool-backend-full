import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../../axiosInstance';
import { fetchStudentsByClass } from '../../redux/slices/studentSlice';
import { Container, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';

const Marks = () => {
  const dispatch = useDispatch();
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [marksRows, setMarksRows] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [chapterMaxMarks, setChapterMaxMarks] = useState(0);
  const [totalMarks, setTotalMarks] = useState('');
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  const { classStudents: students } = useSelector((state) => state.students);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classRes, subjectRes] = await Promise.all([
          axios.get('/classes'),
          axios.get('/subjects')
        ]);
        setClasses(classRes.data || []);
        setSubjects(subjectRes.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedClass) return;
    dispatch(fetchStudentsByClass(selectedClass));
  }, [dispatch, selectedClass]);

  useEffect(() => {
    const fetchChapters = async () => {
      if (!selectedSubject) {
        setChapters([]);
        setSelectedChapter('');
        setChapterMaxMarks(0);
        return;
      }
      try {
        const res = await axios.get(`/chapters/${selectedSubject}`);
        setChapters(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchChapters();
  }, [selectedSubject]);

  useEffect(() => {
    const initializeMarks = async () => {
      if (!selectedClass || !selectedSubject || !selectedChapter) {
        setMarksRows([]);
        return;
      }

      const chapter = chapters.find((ch) => ch._id === selectedChapter);
      setChapterMaxMarks(chapter?.maxMarks || 0);
      setTotalMarks(chapter?.maxMarks || '');

      try {
        const res = await axios.get(`/marks/class/${selectedClass}`);
        const existing = (res.data || []).filter((record) => {
          const recordSubject = record.subjectId?._id || record.subjectId;
          const recordChapter = record.chapterId?._id || record.chapterId;
          return recordSubject === selectedSubject && recordChapter === selectedChapter;
        });

        const existingByStudent = new Map();
        existing.forEach((record) => {
          existingByStudent.set(record.studentId?._id || record.studentId, record);
        });

        setMarksRows(
          students.map((student) => {
            const record = existingByStudent.get(student._id);
            return {
              studentId: student._id,
              studentName: student.fullName,
              rollNumber: student.rollNumber,
              marksId: record?._id || null,
              marksObtained: record?.marksObtained ?? ''
            };
          })
        );
      } catch (err) {
        console.error(err);
      }
    };

    initializeMarks();
  }, [selectedClass, selectedSubject, selectedChapter, chapters, students]);

  const selectedSubjectsForClass = useMemo(
    () => subjects.filter((subject) => (subject.classId?._id || subject.classId) === selectedClass),
    [selectedClass, subjects]
  );

  const handleMarkChange = (studentId, value) => {
    setMarksRows((prev) =>
      prev.map((row) =>
        row.studentId === studentId ? { ...row, marksObtained: value } : row
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClass || !selectedSubject || !selectedChapter) {
      setStatus({ loading: false, error: 'Select class, subject and chapter first.', success: '' });
      return;
    }

    setStatus({ loading: true, error: '', success: '' });

    try {
      for (const row of marksRows) {
        if (row.marksObtained === '') continue;
        const payload = {
          studentId: row.studentId,
          classId: selectedClass,
          subjectId: selectedSubject,
          chapterId: selectedChapter,
          marksObtained: Number(row.marksObtained),
          totalMarks: Number(totalMarks || chapterMaxMarks)
        };

        if (row.marksId) {
          await axios.put(`/marks/${row.marksId}`, { marksObtained: payload.marksObtained, totalMarks: payload.totalMarks });
        } else {
          await axios.post('/marks', payload);
        }
      }

      setStatus({ loading: false, error: '', success: 'Marks saved successfully.' });
    } catch (err) {
      setStatus({ loading: false, error: err.response?.data?.message || 'Failed to save marks.', success: '' });
    }
  };

  return (
    <Container className="mt-4">
      <h3>Chapter-wise Marks Entry</h3>
      <Card className="p-4 shadow-sm mb-4">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Class</Form.Label>
            <Form.Select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} required>
              <option value="">Select class</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>{`${cls.name} ${cls.section || ''}`}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Subject</Form.Label>
            <Form.Select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} required>
              <option value="">Select subject</option>
              {selectedSubjectsForClass.map((subject) => (
                <option key={subject._id} value={subject._id}>{subject.name}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Chapter</Form.Label>
            <Form.Select value={selectedChapter} onChange={(e) => setSelectedChapter(e.target.value)} required>
              <option value="">Select chapter</option>
              {chapters.map((chapter) => (
                <option key={chapter._id} value={chapter._id}>{chapter.name}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Total Marks</Form.Label>
            <Form.Control
              type="number"
              value={totalMarks}
              onChange={(e) => setTotalMarks(e.target.value)}
              min="1"
              required
            />
          </Form.Group>

          {status.error && <Alert variant="danger">{status.error}</Alert>}
          {status.success && <Alert variant="success">{status.success}</Alert>}

          {marksRows.length > 0 ? (
            <div className="table-responsive mb-3">
              <table className="table table-bordered">
                <thead className="table-light">
                  <tr>
                    <th>Student</th>
                    <th>Roll No.</th>
                    <th>Marks Obtained</th>
                  </tr>
                </thead>
                <tbody>
                  {marksRows.map((row) => (
                    <tr key={row.studentId}>
                      <td>{row.studentName}</td>
                      <td>{row.rollNumber}</td>
                      <td>
                        <Form.Control
                          type="number"
                          min="0"
                          max={chapterMaxMarks || undefined}
                          value={row.marksObtained}
                          onChange={(e) => handleMarkChange(row.studentId, e.target.value)}
                          required
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            selectedClass && selectedSubject && selectedChapter && (
              <Alert variant="info">No students found for this class.</Alert>
            )
          )}

          <Button type="submit" disabled={status.loading}> 
            {status.loading ? <Spinner animation="border" size="sm" /> : 'Save Marks'}
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default Marks;
