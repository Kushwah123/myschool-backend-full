import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudents } from '../../redux/slices/studentSlice';
import { fetchTeachers } from '../../redux/slices/teacherSlice';
import { fetchParents } from '../../redux/slices/parentSlice';
import { fetchClasses } from '../../redux/slices/classSlice';
import { Card, Row, Col, Container } from 'react-bootstrap';
import {
  FaChalkboardTeacher,
  FaUsers,
  FaUserGraduate,
  FaSchool
} from 'react-icons/fa';
import RoleLayout from '../../components/RoleLayout';
import Sidebar from './Sidebar'; // Admin Sidebar
import Header from '../../components/Header'; // Common header
import AdminLayout from './AdminLayout';

const Dashboard = () => {
  const dispatch = useDispatch();

  const { students } = useSelector((state) => state.students);
  const { teachers } = useSelector((state) => state.teachers);
  const { parents } = useSelector((state) => state.parents);
  const { classes } = useSelector((state) => state.class);

  useEffect(() => {
    dispatch(fetchStudents());
    dispatch(fetchTeachers());
    dispatch(fetchParents());
    dispatch(fetchClasses());
  }, [dispatch]);

  return (
    
      <Container fluid className="py-4 px-4">
        <h2 className="mb-4 text-dark fw-bold">📊 Admin Dashboard</h2>
        <Row className="g-4">
          <Col md={6} lg={3}>
            <Card className="shadow-sm border-0">
              <Card.Body className="d-flex align-items-center">
                <FaUserGraduate size={40} className="text-primary me-3" />
                <div>
                  <Card.Title className="mb-0">Total Students</Card.Title>
                  <h4 className="fw-bold mb-0 text-success">{students?.length || 0}</h4>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={3}>
            <Card className="shadow-sm border-0">
              <Card.Body className="d-flex align-items-center">
                <FaChalkboardTeacher size={40} className="text-warning me-3" />
                <div>
                  <Card.Title className="mb-0">Total Teachers</Card.Title>
                  <h4 className="fw-bold mb-0 text-success">{teachers?.length || 0}</h4>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={3}>
            <Card className="shadow-sm border-0">
              <Card.Body className="d-flex align-items-center">
                <FaUsers size={40} className="text-info me-3" />
                <div>
                  <Card.Title className="mb-0">Total Parents</Card.Title>
                  <h4 className="fw-bold mb-0 text-success">{parents?.length || 0}</h4>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={3}>
            <Card className="shadow-sm border-0">
              <Card.Body className="d-flex align-items-center">
                <FaSchool size={40} className="text-danger me-3" />
                <div>
                  <Card.Title className="mb-0">Total Classes</Card.Title>
                  <h4 className="fw-bold mb-0 text-success">{classes?.length || 0}</h4>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    
  );
};

export default Dashboard;
