// // src/pages/Admin/AllStudents.jsx
// import React, { useEffect, useRef, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchStudents } from '../../redux/slices/studentSlice';
// import { fetchClasses } from '../../redux/slices/classSlice';
// import { Table, Form, Button } from 'react-bootstrap';
// import { useReactToPrint } from 'react-to-print';
// import * as XLSX from 'xlsx';

// const AllStudents = () => {
//   const dispatch = useDispatch();
//   const { students } = useSelector((state) => state.students);
//   const { classes } = useSelector((state) => state.class);
//   console.log("students", students, "class", classes);
//   const [search, setSearch] = useState('');
//   const [filterClass, setFilterClass] = useState('');
//   const componentRef = useRef();

//   useEffect(() => {
//     dispatch(fetchStudents());
//     dispatch(fetchClasses());
//   }, [dispatch]);

//   const filteredStudents = students.filter(
//     (s) =>
//       (!filterClass || s.classId?._id === filterClass) &&
//       (s.fullName?.toLowerCase().includes(search.toLowerCase()) ||
//         s.rollNumber?.toString().includes(search))
//   );

//   const handlePrint = useReactToPrint({ content: () => componentRef.current });

//   const exportToExcel = () => {
//     const worksheet = XLSX.utils.json_to_sheet(filteredStudents.map(s => ({
//       Name: s.fullName,
//       Roll: s.rollNumber,
//       Class: s.classId?.name,
//       Section: s.classId?.section,
//       Aadhaar: s.aadhaarNo,
//       Mobile: s.mobile,
//     })));
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, worksheet, 'Students');
//     XLSX.writeFile(wb, 'AllStudents.xlsx');
//   };

//   return (
//     <div className="container mt-4">
//       <h3>All Students</h3>
//       <div className="d-flex gap-3 mb-3">
//         <Form.Select value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
//           <option value="">All Classes</option>
//           {classes.map((cls) => (
//             <option key={cls._id} value={cls._id}>{cls.name} {cls.section}</option>
//           ))}
//         </Form.Select>
//         <Form.Control
//           type="text"
//           placeholder="Search by name or roll"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//         <Button onClick={handlePrint}>Export PDF</Button>
//         <Button onClick={exportToExcel}>Export Excel</Button>
//       </div>

//       <div ref={componentRef}>
//         <Table striped bordered hover>
//           <thead>
//             <tr>
//               <th>Roll No</th>
//               <th>Name</th>
//               <th>Class</th>
//               <th>Section</th>
//               <th>Aadhaar</th>
//               <th>Mobile</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredStudents.map((s, idx) => (
//               <tr key={idx}>
//                 <td>{s.rollNumber}</td>
//                 <td>{s.fullName}</td>
//                 <td>{s.class}</td>
//                 <td>{s.section}</td>
//                 <td>{s.aadharNumber}</td>
//                 <td>{s.mobile}</td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       </div>
//     </div>
//   );
// };

// export default AllStudents;

import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudents } from '../../redux/slices/studentSlice';
import { fetchClasses } from '../../redux/slices/classSlice';
import { Table, Form, Button, Pagination, Card, Row, Col } from 'react-bootstrap';
import { useReactToPrint } from 'react-to-print';
import * as XLSX from 'xlsx';

const AllStudents = () => {
  const dispatch = useDispatch();
  const { students = [] } = useSelector((state) => state.students);
  const { classes = [] } = useSelector((state) => state.class);

  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const componentRef = useRef();

  useEffect(() => {
    dispatch(fetchStudents());
    dispatch(fetchClasses());
  }, [dispatch]);

  const filteredStudents = students.filter(
    (s) =>
      (!filterClass || s.classId?._id === filterClass) &&
      (s.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        s.rollNumber?.toString().includes(search))
  );

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrint = useReactToPrint({ content: () => componentRef.current });

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredStudents.map(s => ({
      Name: s.fullName,
      Roll: s.rollNumber,
      Class: s.classId?.name,
      Section: s.classId?.section,
      Aadhaar: s.aadharNumber,
      Mobile: s.mobile,
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, worksheet, 'Students');
    XLSX.writeFile(wb, 'AllStudents.xlsx');
  };

  const handlePageChange = (number) => setCurrentPage(number);

  return (
    <div className="container mt-4">
      <Card className="shadow-lg border-0">
        <Card.Body>
          <h3 className="mb-4 text-primary text-center">📋 All Students</h3>

          <Row className="align-items-center mb-3">
            <Col md={3}>
              <Form.Select value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
                <option value="">📚 All Classes</option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name} - {cls.section}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Control
                type="text"
                placeholder="🔍 Search by name or roll"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Col>
            <Col md={3}>
              <Button variant="success" onClick={handlePrint}>
                📄 Export PDF
              </Button>
            </Col>
            <Col md={3}>
              <Button variant="warning" onClick={exportToExcel}>
                📊 Export Excel
              </Button>
            </Col>
          </Row>

          <div ref={componentRef}>
            <Table striped bordered hover responsive className="text-center">
              <thead className="table-dark">
                <tr>
                  <th>Roll No</th>
                  <th>Name</th>
                  <th>Class</th>
                  <th>Section</th>
                  <th>Aadhaar</th>
                  <th>Mobile</th>
                </tr>
              </thead>
              <tbody>
                {paginatedStudents.map((s, idx) => (
                  <tr key={idx}>
                    <td>{s.rollNumber}</td>
                    <td>{s.fullName}</td>
                    <td>{s.class}</td>
                    <td>{s.section}</td>
                    <td>{s.aadharNumber}</td>
                    <td>{s.mobile}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          <div className="d-flex justify-content-center mt-3">
            <Pagination>
              {Array.from({ length: totalPages }, (_, i) => (
                <Pagination.Item
                  key={i + 1}
                  active={i + 1 === currentPage}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AllStudents;
