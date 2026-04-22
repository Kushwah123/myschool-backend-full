// src/pages/Student/Result.jsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from '../../axiosInstance';
import { Container, Card, Table, Spinner, Alert } from 'react-bootstrap';

const Result = () => {
  const { user } = useSelector((state) => state.auth);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      if (!user?._id) return;
      try {
        const res = await axios.get(`/marks/report/${user._id}`);
        setReport(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load report card.');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [user]);

  if (loading) return <Container className="mt-4"><Spinner animation="border" /></Container>;
  if (error) return <Container className="mt-4"><Alert variant="danger">{error}</Alert></Container>;

  return (
    <Container className="mt-4">
      <h3>Report Card</h3>
      <Card className="mb-4 p-3 shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <p className="mb-1"><strong>Student ID:</strong> {report.studentId}</p>
            <p className="mb-0"><strong>Overall Percentage:</strong> {report.overallPercentage}%</p>
          </div>
          <div>
            <p className="mb-1"><strong>Total Obtained:</strong> {report.overallTotalObtained}</p>
            <p className="mb-0"><strong>Total Marks:</strong> {report.overallTotalMarks}</p>
          </div>
        </div>
      </Card>

      {report.subjects.map((subject) => (
        <Card key={subject.subjectId} className="mb-4 shadow-sm">
          <Card.Body>
            <Card.Title>{subject.subjectName}</Card.Title>
            <p><strong>Subject Total:</strong> {subject.subjectTotalObtained} / {subject.subjectTotalMarks}</p>
            <p><strong>Subject Percentage:</strong> {subject.subjectPercentage}%</p>
            <div className="table-responsive">
              <Table bordered>
                <thead>
                  <tr>
                    <th>Chapter</th>
                    <th>Marks Obtained</th>
                    <th>Total Marks</th>
                    <th>Percentage</th>
                    <th>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {subject.chapters.map((chapter) => (
                    <tr key={chapter.chapterId}>
                      <td>{chapter.chapterName}</td>
                      <td>{chapter.marksObtained}</td>
                      <td>{chapter.totalMarks}</td>
                      <td>{chapter.percentage?.toFixed(2)}%</td>
                      <td>{chapter.grade}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default Result;
