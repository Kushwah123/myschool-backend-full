

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

// 🔐 Protected Route Component
import ProtectedRoute from './components/ProtectedRoute';

// 🧑‍🏫 Role-Specific Route Groups
import AdminRoutes from './routes/AdminRoutes';
import TeacherRoutes from './routes/TeacherRoutes';
import StudentRoutes from './routes/StudentRoutes';
import ParentRoutes from './routes/ParentRoutes';
import AccountantRoutes from './routes/AccountantRoutes';

// 🌐 Common Pages
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';
import ParentLogin from './pages/Parent/ParentLogin';

const App = () => {
  const { token, user } = useSelector((state) => state.auth);

  return (
    <Router>
      <Routes>
        {/* 🟢 Login Route */}
        <Route path="/" element={<Login />} />
        <Route path='/parent-login' element={<ParentLogin/>} />

        {/* 🔐 Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin/*" element={<AdminRoutes />} />
        </Route>

        {/* 🔐 Teacher Routes */}
        <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
          <Route path="/teacher/*" element={<TeacherRoutes />} />
        </Route>

        {/* 🔐 Student Routes */}
        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
          <Route path="/student/*" element={<StudentRoutes />} />
        </Route>

        {/* 🔐 Parent Routes */}
        <Route element={<ProtectedRoute allowedRoles={['parent']} />}>
          <Route path="/parent/*" element={<ParentRoutes />} />
        </Route>

        {/* 🔐 Accountant Routes */}
        <Route element={<ProtectedRoute allowedRoles={['accountant']} />}>
          <Route path="/accountant/*" element={<AccountantRoutes />} />
        </Route>

        {/* ❌ Unauthorized Access */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* 🔴 Catch All */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
