import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, Link } from 'react-router-dom';
import { fetchClasses } from '../../redux/slices/classSlice';
import { fetchStudentsByClass } from '../../redux/slices/studentSlice';
import axiosInstance from '../../axiosInstance';
import { Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';

const ComplaintForm = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const { classes = [] } = useSelector((state) => state.class);
  const { classStudents = [] } = useSelector((state) => state.students);
  const { user } = useSelector((state) => state.auth);

  const [selectedClass, setSelectedClass] = useState(query.get('classId') || '');
  const [selectedStudent, setSelectedStudent] = useState(query.get('studentId') || '');
  const [subject, setSubject] = useState('');
  const [subjectTemplate, setSubjectTemplate] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  const subjectTemplates = [
    'Behavior issue',
    'Attendance concern',
    'Homework not submitted',
    'Late arrival',
    'Academic performance',
    'Uniform violation',
    'Other',
  ];

  const templateDescriptions = {
    'Behavior issue': 'स्टूडेंट की क्लास में अनुशासनहीनता और गलत व्यवहार का मामला। स्टूडेंट टीचर की बात नहीं मानता, साथियों से लड़ता-झगड़ता है और क्लास का माहौल बिगाड़ता है।',
    'Attendance concern': 'स्टूडेंट की नियमित उपस्थिति में कमी है। बिना सूचना के स्कूल नहीं आता है और अभिभावकों को भी सूचित नहीं करता।',
    'Homework not submitted': 'स्टूडेंट समय पर होमवर्क जमा नहीं करता। बार-बार होमवर्क भूल जाता है या जानबूझकर नहीं करता।',
    'Late arrival': 'स्टूडेंट स्कूल में देरी से आता है। क्लास शुरू होने के बाद आता है और अन्य स्टूडेंट्स की पढ़ाई बाधित करता है।',
    'Academic performance': 'स्टूडेंट की अकादमिक प्रदर्शन में गिरावट आ रही है। परीक्षाओं में कम अंक प्राप्त कर रहा है और पढ़ाई में रुचि नहीं दिखा रहा।',
    'Uniform violation': 'स्टूडेंट स्कूल के यूनिफॉर्म के नियमों का पालन नहीं कर रहा। गलत कपड़े पहनकर स्कूल आता है।',
    'Other': ''
  };

  useEffect(() => {
    dispatch(fetchClasses());
  }, [dispatch]);

  useEffect(() => {
    if (selectedClass) {
      dispatch(fetchStudentsByClass(selectedClass));
    }
  }, [selectedClass, dispatch]);

  useEffect(() => {
    if (!selectedClass && classes.length > 0) {
      setSelectedClass(classes[0]._id);
    }
  }, [classes, selectedClass]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setError('');

    if (!selectedClass || !selectedStudent || !subject.trim() || !description.trim()) {
      setError('Please select class, student and add both subject and description.');
      return;
    }

    if (!user?._id) {
      setError('Teacher identity not found. Please login again.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        studentId: selectedStudent,
        subject: subject.trim(),
        description: description.trim(),
      };

      const response = await axiosInstance.post('/complaints', payload);
      setSuccessMessage('Complaint created successfully and WhatsApp notification was triggered.');
      setSubject('');
      setDescription('');
      setError('');
      if (response.data?.complaint) {
        setSelectedStudent(response.data.complaint.studentId || selectedStudent);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to create complaint.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid mt-4">
      <Row className="align-items-center mb-4">
        <Col>
          <h3>📝 Raise Student Complaint</h3>
          <p className="text-muted mb-0">Create a complaint and send it by WhatsApp to the student or fallback to the parent.</p>
        </Col>
        <Col className="text-end">
          <Link to="/teacher/dashboard" className="btn btn-outline-secondary">
            Back to dashboard
          </Link>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {successMessage && <Alert variant="success">{successMessage}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Class</Form.Label>
                  <Form.Select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                  >
                    <option value="">-- Select class --</option>
                    {classes.map((cls) => (
                      <option key={cls._id} value={cls._id}>
                        {cls.name || cls.className || 'Unnamed Class'}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label>Student</Form.Label>
                  <Form.Select
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                  >
                    <option value="">-- Select student --</option>
                    {classStudents.map((student) => (
                      <option key={student._id} value={student._id}>
                        {student.fullName}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label>Subject</Form.Label>
                  <Form.Select
                    value={subjectTemplate}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSubjectTemplate(value);
                      setSubject(value === 'Other' ? '' : value);
                      // Auto-fill description based on template
                      if (value !== 'Other') {
                        setDescription(templateDescriptions[value] || '');
                      } else {
                        setDescription('');
                      }
                    }}
                    required
                  >
                    <option value="">-- Select subject template --</option>
                    {subjectTemplates.map((template) => (
                      <option key={template} value={template}>
                        {template}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                {subjectTemplate === 'Other' && (
                  <Form.Group className="mt-3">
                    <Form.Control
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Enter custom complaint subject"
                      required
                    />
                  </Form.Group>
                )}
              </Col>
            </Row>

            <Row className="mt-3">
              <Col>
                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={subjectTemplate && subjectTemplate !== 'Other' ? "आप टेम्प्लेट के अनुसार ऑटो-फिल की गई डिस्क्रिप्शन को एडिट कर सकते हैं या अपनी कस्टम डिटेल्स जोड़ सकते हैं" : "विवरण में समस्या का पूरा ब्यौरा लिखें"}
                    required
                  />
                  {subjectTemplate && subjectTemplate !== 'Other' && (
                    <Form.Text className="text-muted">
                      💡 यह डिस्क्रिप्शन टेम्प्लेट के आधार पर ऑटो-फिल हुई है। आप इसे अपनी आवश्यकता अनुसार एडिट कर सकते हैं।
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <div className="mt-4 d-flex justify-content-between align-items-center">
              <div className="text-muted">
                WhatsApp will be sent to the student mobile if available, otherwise parent mobile will be used.
              </div>
              <Button type="submit" variant="primary" disabled={loading || !selectedStudent}>
                {loading ? 'Sending...' : 'Create Complaint'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ComplaintForm;
