import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import ParentDashboard from '../pages/Parent/Dashboard';
import StudentDetails from '../pages/Parent/StudentDetails';
import FeeHistory from '../pages/Parent/FeeHistory';
import ParentLayout  from '../layouts/ParentLayout';

const ParentRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<ParentLayout/>}>
      <Route path="/dashboard" element={<ParentDashboard />}/>
      <Route path="/parent-child" element={<StudentDetails />} />
      <Route   path="/parent-fees" element={<FeeHistory />}  />
      </Route>
    </Routes>
  );
};

export default ParentRoutes;
