// src/pages/Admin/AllTeachers.jsx

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeachers } from '../../redux/slices/teacherSlice';
import { Table, Form, Button, Spinner } from 'react-bootstrap';
import { useReactToPrint } from 'react-to-print';
import * as XLSX from 'xlsx';

const AllTeachers = () => {
  const dispatch = useDispatch();
  const { teachers, loading } = useSelector((state) => state.teachers);

  const [search, setSearch] = useState('');
  const componentRef = React.useRef();

  useEffect(() => {
    dispatch(fetchTeachers());
  }, [dispatch]);

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      teacher.email?.toLowerCase().includes(search.toLowerCase()) ||
      teacher.mobile?.includes(search)
  );

  const handlePrint = useReactToPrint({ content: () => componentRef.current });

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredTeachers.map((t) => ({
        Name: t.fullName,
        Email: t.email,
        Mobile: t.mobile,
        Gender: t.gender,
        Qualification: t.qualification,
        Experience: t.experience,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, worksheet, 'Teachers');
    XLSX.writeFile(wb, 'AllTeachers.xlsx');
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3">👨‍🏫 All Teachers</h3>
      <div className="d-flex gap-3 mb-3">
        <Form.Control
          type="text"
          placeholder="Search by name, email or mobile"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="success" onClick={handlePrint}>Export PDF</Button>
        <Button variant="primary" onClick={exportToExcel}>Export Excel</Button>
      </div>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <div ref={componentRef}>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Gender</th>
                <th>Qualification</th>
                <th>Experience</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.map((teacher, index) => (
                <tr key={teacher._id}>
                  <td>{index + 1}</td>
                  <td>{teacher.fullName}</td>
                  <td>{teacher.email}</td>
                  <td>{teacher.mobile}</td>
                  <td>{teacher.gender}</td>
                  <td>{teacher.qualification}</td>
                  <td>{teacher.experience} yrs</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AllTeachers;
