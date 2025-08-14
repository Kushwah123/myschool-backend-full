import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Teacher/Dashboard';
import Attendance from '../pages/Teacher/Attendance';
import Marks from '../pages/Teacher/Marks';
import NotFound from '../pages/NotFound';
// import Homework from '../pages/Teacher/Homework';
import EnquiryForm from '../pages/Teacher/EnquiryForm';
import TeacherLayout from '../layouts/TeacherLayout';

const TeacherRoutes = () => (
  <Routes>
    <Route path='/' element={<TeacherLayout/>}>
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="attendance" element={<Attendance />} />
    <Route path="marks" element={<Marks />} />
    <Route path="enquiry" element={<EnquiryForm/>} />

    {/* <Route path="homework" element={<Homework />} /> */}
    <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
);

export default TeacherRoutes;
