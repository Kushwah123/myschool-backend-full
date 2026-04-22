import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Teacher/Dashboard';
import Attendance from '../pages/Teacher/Attendance';
import AttendanceReport from '../pages/AttendanceReport';
import ComplaintForm from '../pages/Teacher/ComplaintForm';
import StudentDirectory from '../pages/Teacher/StudentDirectory';
import Marks from '../pages/Teacher/Marks';
import MyClasses from '../pages/Teacher/MyClasses';
import NotFound from '../pages/NotFound';
import TeacherHomework from '../components/TeacherHomework';
import EnquiryForm from '../pages/Teacher/EnquiryForm';
import TeacherLayout from '../layouts/TeacherLayout';

const TeacherRoutes = () => (
  <Routes>
    <Route path='/' element={<TeacherLayout/>}>
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="attendance" element={<Attendance />} />
    <Route path="attendance-report" element={<AttendanceReport />} />
    <Route path="complaints" element={<ComplaintForm />} />
    <Route path="students" element={<StudentDirectory />} />
    <Route path="my-classes" element={<MyClasses />} />
    <Route path="marks" element={<Marks />} />
    <Route path="homework" element={<TeacherHomework />} />
    <Route path="enquiry" element={<EnquiryForm/>} />
    <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
);

export default TeacherRoutes;
