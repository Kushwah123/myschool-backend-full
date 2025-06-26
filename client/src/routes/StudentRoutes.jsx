import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import StudentDashboard from '../pages/Student/Dashboard';
import Result from '../pages/Student/Result';
import Homework from '../pages/Student/Homework';

const StudentRoutes = () => {
  return (
    <Routes>
      <Route
        path="/student"
        element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>}
      />
      <Route
        path="/student/result"
        element={<ProtectedRoute role="student"><Result /></ProtectedRoute>}
      />
      <Route
        path="/student/homework"
        element={<ProtectedRoute role="student"><Homework /></ProtectedRoute>}
      />
    </Routes>
  );
};

export default StudentRoutes;
