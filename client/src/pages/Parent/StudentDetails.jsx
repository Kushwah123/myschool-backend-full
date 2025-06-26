// src/pages/Parent/StudentDetails.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudentByParent } from '../../redux/slices/studentSlice';

const StudentDetails = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { student } = useSelector((state) => state.student);

  useEffect(() => {
    dispatch(fetchStudentByParent(user._id));
  }, [dispatch, user]);

  return (
    <div className="container mt-4">
      <h3>Student Details</h3>
      <table className="table">
        <tbody>
          <tr><th>Name</th><td>{student.fullName}</td></tr>
          <tr><th>Class</th><td>{student.class?.name}</td></tr>
          <tr><th>Section</th><td>{student.section}</td></tr>
          <tr><th>Roll No</th><td>{student.rollNumber}</td></tr>
          <tr><th>Transport</th><td>{student.transport}</td></tr>
        </tbody>
      </table>
    </div>
  );
};

export default StudentDetails;