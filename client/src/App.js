// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import Login from "./pages/auth/Login";
// import Signup from "./pages/auth/Signup";
// import AdminDashboard from "./pages/admin/AdminDashboard";
// import TeacherDashboard from "./pages/teacher/TeacherDashboard";
// import StudentDashboard from "./pages/student/StudentDashboard";
// import ParentDashboard from "./pages/parent/ParentDashboard";
// import AccountantDashboard from "./pages/accountant/AccountantDashboard";
// import ProtectedRoute from "./components/common/ProtectedRoute";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import EditStudent from "./pages/admin/EditStudent";



// function App() {
//   return (
    
//     <Router>
//       <ToastContainer position="top-right" />
//       <Routes>
//         <Route path="/" element={<Navigate to="/login" />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
       
// <Route path="/admin" element={
//   <ProtectedRoute>
//     <AdminDashboard />
//   </ProtectedRoute>
// } />

// <Route path="/teacher" element={
//   <ProtectedRoute>
//     <TeacherDashboard />
//   </ProtectedRoute>
// } />

// <Route path="/student" element={
//   <ProtectedRoute>
//     <StudentDashboard />
//   </ProtectedRoute>
// } />

// <Route path="/parent" element={
//   <ProtectedRoute>
//     <ParentDashboard />
//   </ProtectedRoute>
// } />

// <Route path="/accountant" element={
//   <ProtectedRoute>
//     <AccountantDashboard />
//   </ProtectedRoute>
// } />
//         <Route path="/admin/*" element={<AdminRoutes />} /> 
//       </Routes>
//     </Router>
//   );
// }

// export default App;

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

const App = () => {
  const { token, user } = useSelector((state) => state.auth);

  return (
    <Router>
      <Routes>
        {/* 🟢 Login Route */}
        <Route path="/" element={<Login />} />

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
