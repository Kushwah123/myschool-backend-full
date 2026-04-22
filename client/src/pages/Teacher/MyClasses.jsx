import React, { useEffect, useState } from 'react';
import axios from '../../axiosInstance';
import { Container, Card, Row, Col, Spinner, Alert } from 'react-bootstrap';

const MyClasses = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyClasses = async () => {
      try {
        const res = await axios.get('/teachers/my-classes');
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load your classes');
      } finally {
        setLoading(false);
      }
    };

    fetchMyClasses();
  }, []);

  if (loading) return <Container className="mt-4"><Spinner animation="border" /></Container>;
  if (error) return <Container className="mt-4"><Alert variant="danger">{error}</Alert></Container>;

  return (
    <Container className="mt-4">
      <h3>My Classes and Subjects</h3>
      {data?.classes?.length ? (
        <Row className="g-3">
          {data.classes.map((item) => (
            <Col key={item.class._id} md={6}>
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>{item.class.name} {item.class.section || ''}</Card.Title>
                  <Card.Subtitle className="mb-3 text-muted">Class Teacher: {item.class.classTeacher?.name || 'Not assigned'}</Card.Subtitle>
                  <h6>Subjects</h6>
                  {item.subjects.length ? (
                    <ul className="ps-3">
                      {item.subjects.map((subject) => (
                        <li key={subject._id}>{subject.name}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted">No subjects assigned.</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Alert variant="info">No assigned classes found.</Alert>
      )}
    </Container>
  );
};

export default MyClasses;
