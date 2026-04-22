// src/pages/Parent/StudentDetails.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudentByParent } from '../../redux/slices/studentSlice';

const StudentDetails = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { students } = useSelector((state) => state.students);

  useEffect(() => {
    if (user?._id) dispatch(fetchStudentByParent(user._id));
  }, [dispatch, user]);

  const child = Array.isArray(students) ? students[0] : students;

  return (
    <div className="container mt-4">
      <h3>Student Details</h3>
      <table className="table">
        <tbody>
          <tr><th>Name</th><td>{child?.fullName || '-'}</td></tr>
          <tr><th>Admission No</th><td>{child?.admissionNumber || '-'}</td></tr>
          <tr><th>Father's Name</th><td>{child?.fatherName || '-'}</td></tr>
          <tr><th>Mother's Name</th><td>{child?.motherName || '-'}</td></tr>
          <tr><th>Class</th><td>{child?.classId?.name || child?.class?.name || '-'}</td></tr>
          <tr><th>Roll No</th><td>{child?.rollNumber || '-'}</td></tr>
          <tr><th>DOB</th><td>{child?.dob ? new Date(child.dob).toLocaleDateString() : '-'}</td></tr>
          <tr><th>Gender</th><td>{child?.gender || '-'}</td></tr>
          <tr><th>Mobile</th><td>{child?.mobile || '-'}</td></tr>
          <tr><th>Address</th><td>{child?.address || '-'}</td></tr>
          <tr><th>Aadhaar</th><td>{child?.aadharNumber || '-'}</td></tr>
          <tr><th>Blood Group</th><td>{child?.bloodGroup || '-'}</td></tr>
          <tr><th>Category</th><td>{child?.category || '-'}</td></tr>
        </tbody>
      </table>
    </div>
  );
};

export default StudentDetails;