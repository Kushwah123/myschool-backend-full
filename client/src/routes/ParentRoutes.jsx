import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import ParentDashboard from '../pages/Parent/Dashboard';
import StudentDetails from '../pages/Parent/StudentDetails';
import FeeHistory from '../pages/Parent/FeeHistory';

const ParentRoutes = () => {
  return (
    <Routes>
      <Route
        path="/parent"
        element={<ProtectedRoute role="parent"><ParentDashboard /></ProtectedRoute>}
      />
      <Route
        path="/parent/student-details"
        element={<ProtectedRoute role="parent"><StudentDetails /></ProtectedRoute>}
      />
      <Route
        path="/parent/fee-history"
        element={<ProtectedRoute role="parent"><FeeHistory /></ProtectedRoute>}
      />
    </Routes>
  );
};

export default ParentRoutes;
