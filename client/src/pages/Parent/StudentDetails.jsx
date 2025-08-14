// src/pages/Parent/StudentDetails.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudentByParent } from '../../redux/slices/studentSlice';

const StudentDetails = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { students } = useSelector((state) => state.students);

  useEffect(() => {
    dispatch(fetchStudentByParent(user._id));
  }, [dispatch, user]);

  return (
    <div className="container mt-4">
      <h3>Student Details</h3>
      <table className="table">
        <tbody>
          <tr><th>Name</th><td>{students.fullName}</td></tr>
          <tr><th>Class</th><td>{students.class?.name}</td></tr>
          <tr><th>Section</th><td>{students.section}</td></tr>
          <tr><th>Roll No</th><td>{students.rollNumber}</td></tr>
          <tr><th>Transport</th><td>{students.transport}</td></tr>
        </tbody>
      </table>
    </div>
  );
};

export default StudentDetails;