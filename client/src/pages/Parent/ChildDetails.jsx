// src/parent/ChildDetails.jsx
import React from 'react';
import { Card, Row, Col, Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const ChildDetails = () => {
  const { user } = useSelector((state) => state.auth);

  const child = user?.children?.[0]; // Assuming single child for now

  return (
    <Container className="my-4">
      <Card className="p-4 shadow">
        <h4>👧 Child Details</h4>
        <Row className="mt-3">
          <Col md={6}><strong>Name:</strong> {child?.fullName || '-'}</Col>
          <Col md={6}><strong>Admission No:</strong> {child?.admissionNumber || '-'}</Col>
        </Row>
        <Row className="mt-2">
          <Col md={6}><strong>Class:</strong> {child?.classId?.name || '-'}</Col>
          <Col md={6}><strong>Roll No:</strong> {child?.rollNumber || '-'}</Col>
        </Row>
        <Row className="mt-2">
          <Col md={6}><strong>DOB:</strong> {child?.dob ? new Date(child.dob).toLocaleDateString() : '-'}</Col>
          <Col md={6}><strong>Gender:</strong> {child?.gender || '-'}</Col>
        </Row>
        <Row className="mt-2">
          <Col md={6}><strong>Father's Name:</strong> {child?.fatherName || '-'}</Col>
          <Col md={6}><strong>Mother's Name:</strong> {child?.motherName || '-'}</Col>
        </Row>
        <Row className="mt-2">
          <Col md={6}><strong>Mobile:</strong> {child?.mobile || '-'}</Col>
          <Col md={6}><strong>Address:</strong> {child?.address || '-'}</Col>
        </Row>
        <Row className="mt-2">
          <Col md={6}><strong>Blood Group:</strong> {child?.bloodGroup || '-'}</Col>
          <Col md={6}><strong>Category:</strong> {child?.category || '-'}</Col>
        </Row>
        <Row className="mt-2">
          <Col md={6}><strong>Transport Mode:</strong> {child?.transportMode || '-'}</Col>
          <Col md={6}><strong>Aadhaar:</strong> {child?.aadharNumber || '-'}</Col>
        </Row>
      </Card>
    </Container>
  );
};

export default ChildDetails;
