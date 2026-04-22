import React from 'react';
import AdminLayout from '../layouts/AdminLayout';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Admin/Dashboard';
import AddStudent from '../pages/Admin/AddStudent';
import AllStudents from '../pages/Admin/AllStudents';
import AddTeacher from '../pages/Admin/AddTeacher';
import AllTeachers from '../pages/Admin/AllTeachers';
import EditTeacher from '../pages/Admin/EditTeacher';
import CreateClass from '../pages/Admin/CreateClass';
import AssignSubject from '../pages/Admin/AssignSubject';
import AssignClassTeacher from '../pages/Admin/AssignClassTeacher';
import AddChapter from '../pages/Admin/AddChapter';
import FeeStructure from '../pages/Admin/FeeStructure';
import AssignFee from '../pages/Admin/AssignFee';
import Reports from '../pages/Admin/Reports';
import AttendanceReport from '../pages/AttendanceReport';
import Complaints from '../pages/Admin/Complaints';
import AllParents from "../pages/Admin/AllParents";
import AddParent from "../pages/Admin/AddParent";
import StaffRegistration from '../pages/Admin/StaffRegistration';
import VillageManager from '../components/VillageManager';
import FeeHistory from '../pages/Accountant/FeeHistory';
import FeeCollection from '../pages/Accountant/FeeCollection';
import Subject from '../pages/Admin/Subject';
import ImportStudent from '../pages/Admin/ImportStudent';
import QRLogin from '../pages/Admin/QRLogin';
import QRAuth from '../pages/Admin/QRAuth';
import WhatsAppSettings from '../pages/Admin/WhatsAppSettings';
import WhatsAppDebug from '../pages/Admin/WhatsAppDebug';
import QRCodeTest from '../pages/Admin/QRCodeTest';
import SimpleQRTest from '../pages/Admin/SimpleQRTest';
import StudentDirectory from '../pages/Admin/StudentDirectory';
import AdminHomework from '../components/AdminHomework';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/homework" element={<AdminHomework />} />
      <Route path="/add-student" element={<AddStudent />} />
      <Route path="/all-students" element={<AllStudents />} />
      <Route path="/student-directory" element={<StudentDirectory />} />
      <Route path="/add-teacher" element={<AddTeacher />} />
      <Route path="/all-teachers" element={<AllTeachers />} />
      <Route path="/edit-teacher/:id" element={<EditTeacher />} />
      <Route path="/create-class" element={<CreateClass />} />
      <Route path="/assign-class-teacher" element={<AssignClassTeacher />} />
      <Route path="/assign-subject" element={<AssignSubject />} />
      <Route path="/subject" element={<Subject />} />
      <Route path="/add-chapter" element={<AddChapter />} />
      <Route path="/fee-structure" element={<FeeStructure />} />
      <Route path="/assign-fee" element={<AssignFee />} />
      <Route path="/add-parent" element={<AddParent />} />
      <Route path="/edit-parent/:id" element={<AddParent />} />
      <Route path="/all-parents" element={<AllParents />} />
      <Route path="/staff-registration" element={<StaffRegistration />} />
      <Route path='/villages' element={<VillageManager/>}/>
      <Route path='/fee-History' element={<FeeHistory />} />
      <Route path="/collect-fee" element={<FeeCollection />}  />
      <Route path='/subject' element={<Subject />} />
      <Route path='/import-students' element={<ImportStudent />} />
      <Route path='/qr-login' element={<QRLogin />} />
      <Route path='/qr-auth' element={<QRAuth />} />
      <Route path='/whatsapp-settings' element={<WhatsAppSettings />} />
      <Route path='/whatsapp-debug' element={<WhatsAppDebug />} />
      <Route path='/qr-code-test' element={<QRCodeTest />} />
      <Route path='/simple-qr-test' element={<SimpleQRTest />} />
      <Route path='/attendance-report' element={<AttendanceReport />} />
      <Route path='/complaints' element={<Complaints />} />
      {/* <Route path="reports" element={<Reports />} /> */}
      </Route>

    </Routes>
  );
};

export default AdminRoutes;
