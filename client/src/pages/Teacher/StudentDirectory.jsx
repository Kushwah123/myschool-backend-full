import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClasses } from '../../redux/slices/classSlice';
import { fetchStudents } from '../../redux/slices/studentSlice';
import { FaWhatsapp } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const StudentDirectory = () => {
  const dispatch = useDispatch();
  const { classes } = useSelector((state) => state.class);
  const { students } = useSelector((state) => state.students);
  const [selectedClass, setSelectedClass] = useState('');
  const [searchText, setSearchText] = useState('');
  const [filterAddress, setFilterAddress] = useState('');

  useEffect(() => {
    dispatch(fetchClasses());
    dispatch(fetchStudents());
  }, [dispatch]);

  const studentsToDisplay = selectedClass
    ? students.filter((student) => {
        const classId = student.classId?._id || student.classId;
        return classId === selectedClass;
      })
    : students;

  const openWhatsApp = (number, studentName) => {
    if (!number) return alert('No WhatsApp number available');
    const message = `Hello ${studentName}, your teacher would like to connect with you regarding attendance and updates.`;
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const filteredStudents = studentsToDisplay.filter((student) => {
    const query = searchText.trim().toLowerCase();
    const studentName = student.fullName?.toLowerCase() || '';
    const fatherName = student.fatherName?.toLowerCase() || '';
    const motherName = student.motherName?.toLowerCase() || '';
    const mobile = student.mobile?.toLowerCase() || '';
    const address = student.address?.toLowerCase() || '';

    const matchesSearch =
      !query ||
      studentName.includes(query) ||
      fatherName.includes(query) ||
      motherName.includes(query) ||
      mobile.includes(query) ||
      address.includes(query);

    const matchesAddress = !filterAddress || address === filterAddress.toLowerCase();

    return matchesSearch && matchesAddress;
  });

  return (
    <div className="container mt-4">
      <div className="card shadow-sm p-4">
        <h3 className="mb-4">Student Directory</h3>

        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <label className="form-label">Filter by Class</label>
            <select
              className="form-select"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="">-- Select Class --</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">Search by student or parent name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Search by student, father or mother"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Filter by Address</label>
            <select
              className="form-select"
              value={filterAddress}
              onChange={(e) => setFilterAddress(e.target.value)}
            >
              <option value="">-- All Addresses --</option>
              {[...new Set(studentsToDisplay.map((student) => student.address).filter(Boolean))].map((address) => (
                <option key={address} value={address}>
                  {address}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredStudents.length === 0 && (
          <p className="text-muted">No students match your search/filter criteria.</p>
        )}

        {filteredStudents.length > 0 && (
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Father</th>
                  <th>Mother</th>
                  <th>Address</th>
                  <th>Mobile</th>
                  <th>WhatsApp</th>
                  <th>Complaint</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student._id}>
                    <td>{student.fullName}</td>
                    <td>{student.fatherName || '-'}</td>
                    <td>{student.motherName || '-'}</td>
                    <td>{student.address || '-'}</td>
                    <td>{student.mobile || 'N/A'}</td>
                    <td>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => openWhatsApp(student.mobile, student.fullName)}
                      >
                        <FaWhatsapp className="me-1" /> Chat
                      </button>
                    </td>
                    <td>
                      <Link
                        to={`/teacher/complaints?studentId=${student._id}&classId=${selectedClass}`}
                        className="btn btn-warning btn-sm"
                      >
                        Raise Complaint
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDirectory;
