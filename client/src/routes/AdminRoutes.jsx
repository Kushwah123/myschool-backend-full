import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Admin/Dashboard';
import AddStudent from '../pages/Admin/AddStudent';
import AllStudents from '../pages/Admin/AllStudents';
import AddTeacher from '../pages/Admin/AddTeacher';
import AllTeachers from '../pages/Admin/AllTeachers';
import CreateClass from '../pages/Admin/CreateClass';
import AssignSubject from '../pages/Admin/AssignSubject';
import FeeStructure from '../pages/Admin/FeeStructure';
import AssignFee from '../pages/Admin/AssignFee';
import Reports from '../pages/Admin/Reports';
import AllParents from "../pages/Admin/AllParents";
import AddParent from "../pages/Admin/AddParent";
import StaffRegistration from '../pages/Admin/StaffRegistration';


const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/add-student" element={<AddStudent />} />
      <Route path="/all-students" element={<AllStudents />} />
      <Route path="/add-teacher" element={<AddTeacher />} />
      <Route path="/all-teachers" element={<AllTeachers />} />
      <Route path="/create-class" element={<CreateClass />} />
      <Route path="/assign-subject" element={<AssignSubject />} />
      <Route path="/fee-structure" element={<FeeStructure />} />
      <Route path="/assign-fee" element={<AssignFee />} />
      <Route path="/add-parent" element={<AddParent />} />
<Route path="/edit-parent/:id" element={<AddParent />} />
<Route path="/all-parents" element={<AllParents />} />
<Route path="/staff-registration" element={<StaffRegistration />} />
      {/* <Route path="/reports" element={<Reports />} /> */}
    </Routes>
  );
};

export default AdminRoutes;
